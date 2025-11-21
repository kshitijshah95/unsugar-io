/**
 * Authentication Service
 * Handles user authentication, login, logout, and token refresh
 */

import apiClient, { ApiError } from '@/lib/apiClient';
import { setTokens, clearTokens, getRefreshToken, isAuthenticated } from '@/utils/tokenManager';
import type { TokenData } from '@/utils/tokenManager';
import { logger } from '@/utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens
    setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Login failed', undefined, 'LOGIN_ERROR');
  }
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store tokens
    setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Registration failed', undefined, 'REGISTER_ERROR');
  }
};

/**
 * Logout user and clear tokens
 */
export const logout = async (): Promise<void> => {
  try {
    // Optional: Call backend logout endpoint
    await apiClient.post('/auth/logout');
  } catch (error) {
    logger.error('Logout error', error);
  } finally {
    // Always clear tokens
    clearTokens();
    
    // Optional: Redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<TokenData> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
  }

  try {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    const tokenData: TokenData = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    };

    setTokens(tokenData);
    return tokenData;
  } catch (error) {
    clearTokens();
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Token refresh failed', 401, 'REFRESH_ERROR');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to get user profile', undefined, 'PROFILE_ERROR');
  }
};

/**
 * Check if user is currently authenticated
 */
export const checkAuth = (): boolean => {
  return isAuthenticated();
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.patch<{ user: User }>('/auth/profile', data);
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to update profile', undefined, 'UPDATE_PROFILE_ERROR');
  }
};

export const authService = {
  login,
  register,
  logout,
  refreshAccessToken,
  getCurrentUser,
  checkAuth,
  updateProfile,
};

export default authService;
