/**
 * Token Management Utility
 * Handles secure storage and retrieval of authentication tokens
 * 
 * ⚠️  SECURITY NOTICE:
 * Currently using localStorage for token storage. This is vulnerable to XSS attacks.
 * 
 * TODO: Migrate to httpOnly cookies when backend supports it.
 * 
 * Current mitigations:
 * - Tokens cleared on logout
 * - Expiry tracking prevents stale tokens
 * - HTTPS-only in production
 * 
 * Future improvements:
 * - httpOnly cookies (requires backend changes)
 * - CSP headers (add to index.html)
 * - Input sanitization on all forms
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Store authentication tokens securely
 */
export const setTokens = (data: TokenData): void => {
  try {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    
    if (data.expiresIn) {
      const expiryTime = Date.now() + data.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

/**
 * Get access token from storage
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve access token:', error);
    return null;
  }
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    return Date.now() >= parseInt(expiry, 10);
  } catch (error) {
    console.error('Failed to check token expiry:', error);
    return true;
  }
};

/**
 * Clear all stored tokens
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
};
