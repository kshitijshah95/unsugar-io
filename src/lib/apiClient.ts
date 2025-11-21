/**
 * API Client with Request/Response Interceptors
 * Serves as a proxy layer between frontend and backend
 * Handles authentication, error handling, and retry logic
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, clearTokens, isTokenExpired } from '@/utils/tokenManager';
import { logger } from '@/utils/logger';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

/**
 * API Client Configuration
 * Allows customization of error handling callbacks
 */
export interface ApiClientConfig {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onRateLimit?: (retryAfter?: number) => void;
}

// Default configuration
let apiClientConfig: ApiClientConfig = {
  onUnauthorized: () => {
    // Default: redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
  onForbidden: () => {
    // Default: redirect to forbidden page
    if (typeof window !== 'undefined') {
      window.location.href = '/forbidden';
    }
  },
  onRateLimit: (retryAfter?: number) => {
    // Default: dispatch custom event for UI to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api:rateLimit', {
        detail: { retryAfter }
      }));
    }
  }
};

/**
 * Configure API client callbacks
 * Call this early in your app initialization
 */
export const configureApiClient = (config: Partial<ApiClientConfig>): void => {
  apiClientConfig = { ...apiClientConfig, ...config };
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  data?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.data = data;
  }
}

/**
 * Create axios instance with default config
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

/**
 * Request Interceptor
 * Adds authentication token and other headers to requests
 */
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add authentication token if available
  const token = getAccessToken();
  
  if (token && !isTokenExpired()) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add request timestamp for logging
  config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Log request in development
  logger.apiRequest(
    config.method?.toUpperCase() || 'GET',
    config.url || '',
    { params: config.params, data: config.data }
  );

  return config;
};

/**
 * Request Error Interceptor
 */
const requestErrorInterceptor = (error: AxiosError): Promise<never> => {
  logger.error('API Request Error', error);
  return Promise.reject(error);
};

/**
 * Response Interceptor
 * Handles successful responses
 */
const responseInterceptor = (response: any) => {
  // Log response in development
  logger.apiResponse(
    response.config.method?.toUpperCase() || 'GET',
    response.config.url || '',
    response.status,
    response.data
  );

  return response.data;
};

/**
 * Response Error Interceptor
 * Handles errors and implements retry logic
 */
const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

  // Log error in development
  logger.apiError(
    error.config?.method?.toUpperCase() || 'UNKNOWN',
    error.config?.url || 'UNKNOWN',
    error,
    {
      status: error.response?.status,
      data: error.response?.data,
    }
  );

  // Handle 401 Unauthorized - Token expired or invalid
  if (error.response?.status === 401) {
    const isAuthRoute = error.config?.url?.includes('/auth/login') || 
                        error.config?.url?.includes('/auth/register') ||
                        error.config?.url?.includes('/auth/refresh');
    
    // Only clear tokens and redirect if NOT on an auth route
    // (Allow login/register to show their own error messages)
    if (!isAuthRoute) {
      clearTokens();
      
      // Redirect to login page
      if (typeof window !== 'undefined' && apiClientConfig.onUnauthorized) {
        apiClientConfig.onUnauthorized();
      }
    }

    // Extract error message from response
    const errorMessage = (error.response?.data as any)?.message || 
                        (error.response?.data as any)?.error || 
                        'Authentication failed';

    throw new ApiError(
      errorMessage,
      401,
      'UNAUTHORIZED',
      error.response.data
    );
  }

  // Handle 400 Bad Request - Validation errors
  if (error.response?.status === 400) {
    const errorMessage = (error.response?.data as any)?.message || 
                        (error.response?.data as any)?.error || 
                        'Validation failed';
    
    throw new ApiError(
      errorMessage,
      400,
      'VALIDATION_ERROR',
      error.response.data
    );
  }

  // Handle 403 Forbidden - Insufficient permissions
  if (error.response?.status === 403) {
    if (typeof window !== 'undefined' && apiClientConfig.onForbidden) {
      apiClientConfig.onForbidden();
    }
    
    throw new ApiError(
      'Access forbidden',
      403,
      'FORBIDDEN',
      error.response.data
    );
  }

  // Handle 404 Not Found
  if (error.response?.status === 404) {
    throw new ApiError(
      'Resource not found',
      404,
      'NOT_FOUND',
      error.response.data
    );
  }

  // Handle 429 Rate Limit
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers?.['retry-after'];
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
    
    if (typeof window !== 'undefined' && apiClientConfig.onRateLimit) {
      apiClientConfig.onRateLimit(retryAfterSeconds);
    }
    
    throw new ApiError(
      'Too many requests. Please try again later.',
      429,
      'RATE_LIMIT_EXCEEDED',
      error.response.data
    );
  }

  // Handle 500+ Server Errors with Retry Logic
  if (error.response?.status && error.response.status >= 500) {
    const retryCount = originalRequest._retryCount || 0;

    if (retryCount < MAX_RETRIES && originalRequest) {
      originalRequest._retryCount = retryCount + 1;
      originalRequest._retry = true;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, retryCount) * 1000;
      
      logger.warn(`API Retry: Attempt ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    throw new ApiError(
      'Server error. Please try again later.',
      error.response.status,
      'SERVER_ERROR',
      error.response.data
    );
  }

  // Handle Network Errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    throw new ApiError(
      'Request timeout. Please check your connection.',
      undefined,
      'TIMEOUT'
    );
  }

  if (!error.response) {
    throw new ApiError(
      'Network error. Please check your connection.',
      undefined,
      'NETWORK_ERROR'
    );
  }

  // Generic error
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.response?.status,
    'UNKNOWN_ERROR',
    error.response?.data
  );
};

/**
 * Create and configure API client
 */
const apiClient: AxiosInstance = createAxiosInstance();

// Add request interceptors
apiClient.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

// Add response interceptors
apiClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default apiClient;
