# API Proxy Layer Documentation

## Overview

This document describes the API proxy layer implementation that serves as an abstraction between the frontend and backend API, providing authentication, authorization, error handling, and retry logic.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ blogService  │  │ authService  │  │ futureService   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Client (Proxy)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Request Interceptors                       │    │
│  │  - Add Authorization headers                        │    │
│  │  - Add Request ID                                   │    │
│  │  - Logging (dev mode)                               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Response Interceptors                       │    │
│  │  - Handle 401 (redirect to login)                   │    │
│  │  - Handle 403 (forbidden)                           │    │
│  │  - Handle 429 (rate limit)                          │    │
│  │  - Handle 500+ (retry logic)                        │    │
│  │  - Network error handling                           │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Render)                        │
│              https://unsugar-io-api.onrender.com             │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Token Manager (`src/utils/tokenManager.ts`)

Manages secure storage and retrieval of authentication tokens.

**Features:**
- Store access and refresh tokens in localStorage
- Track token expiry
- Check authentication status
- Secure token cleanup

**API:**
```typescript
// Store tokens
setTokens({
  accessToken: 'xxx',
  refreshToken: 'yyy',
  expiresIn: 3600 // seconds
});

// Get tokens
const token = getAccessToken();
const refreshToken = getRefreshToken();

// Check status
const isExpired = isTokenExpired();
const isAuth = isAuthenticated();

// Clear tokens
clearTokens();
```

### 2. API Client (`src/lib/apiClient.ts`)

Axios-based HTTP client with request/response interceptors.

**Configuration:**
```typescript
Base URL: process.env.VITE_API_BASE_URL
Timeout: 30 seconds
Max Retries: 3 (for 500+ errors)
Retry Strategy: Exponential backoff (1s, 2s, 4s)
```

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Adds unique request ID for tracing
- Logs requests in development mode

**Response Interceptor:**
- **401 Unauthorized**: Clears tokens, prepares for login redirect
- **403 Forbidden**: Throws permission error
- **404 Not Found**: Throws not found error
- **429 Rate Limit**: Throws rate limit error
- **500+ Server Errors**: Implements retry logic with exponential backoff
- **Network Errors**: Handles timeouts and connection issues

**Usage:**
```typescript
import apiClient from '@/lib/apiClient';

// GET request
const data = await apiClient.get('/api/v1/blogs');

// POST request
const result = await apiClient.post('/api/v1/blogs', {
  title: 'New Blog'
});

// With params
const blogs = await apiClient.get('/api/v1/blogs', {
  params: { tag: 'JavaScript', page: 1 }
});
```

### 3. Auth Service (`src/services/authService.ts`)

Handles all authentication-related operations.

**Methods:**

```typescript
// Login
const { user, accessToken } = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// Register
const { user, accessToken } = await authService.register({
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe'
});

// Logout
await authService.logout();

// Refresh token
await authService.refreshAccessToken();

// Get current user
const user = await authService.getCurrentUser();

// Update profile
const updatedUser = await authService.updateProfile({
  name: 'Jane Doe'
});

// Check auth status
const isAuth = authService.checkAuth();
```

### 4. Blog Service (`src/services/blogService.ts`)

Updated to use the new API client with all proxy benefits.

**Features:**
- Automatic authentication headers
- Error handling with custom ApiError
- Retry logic for failed requests
- Type-safe responses

**Usage:**
```typescript
import { blogService } from '@/services/blogService';

// Get all blogs with filters
const blogs = await blogService.getAllBlogs({
  tag: 'JavaScript',
  search: 'arrow',
  page: 1,
  limit: 10,
  sort: 'publishedDate',
  order: 'desc'
});

// Get single blog
const blog = await blogService.getBlogById('123');
const blog2 = await blogService.getBlogBySlug('arrow-functions');

// Get tags
const tags = await blogService.getAllTags();
```

## Error Handling

### Custom ApiError Class

```typescript
class ApiError extends Error {
  statusCode?: number;
  code?: string;
  data?: unknown;
}
```

**Usage in Components:**
```typescript
try {
  const blogs = await blogService.getAllBlogs();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Show rate limit message
        break;
      case 'NETWORK_ERROR':
        // Show network error
        break;
      default:
        // Show generic error
    }
  }
}
```

## Authentication Flow

### Login Flow
```
1. User submits credentials
2. authService.login() called
3. API client sends POST /auth/login
4. Backend validates and returns tokens
5. Tokens stored via tokenManager
6. User redirected to dashboard
```

### Token Refresh Flow
```
1. User makes API request
2. Request interceptor checks token expiry
3. If expired, calls refreshAccessToken()
4. New token stored
5. Original request retried with new token
```

### Logout Flow
```
1. User clicks logout
2. authService.logout() called
3. Optional: POST /auth/logout to backend
4. Tokens cleared from localStorage
5. User redirected to home
```

## Security Best Practices

### ✅ Implemented

1. **Token Storage**: Uses localStorage (consider httpOnly cookies for production)
2. **Token Expiry**: Tracks and validates token expiration
3. **HTTPS Only**: All requests to backend use HTTPS
4. **Request IDs**: Unique IDs for request tracing
5. **Error Sanitization**: Hides sensitive errors in production
6. **Rate Limiting**: Handles 429 responses gracefully

### 🔄 Future Enhancements

1. **CSRF Protection**: Add CSRF tokens for state-changing requests
2. **Token Rotation**: Automatic token refresh before expiry
3. **Secure Storage**: Move to httpOnly cookies (requires backend support)
4. **Request Signing**: Sign requests for additional security
5. **IP Whitelisting**: Backend validation of request origins

## Usage Examples

### Example 1: Protected Route

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

function ProtectedPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authService.checkAuth()) {
      navigate('/login');
      return;
    }

    authService.getCurrentUser()
      .then(setUser)
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return <div>Welcome {user.name}!</div>;
}
```

### Example 2: Login Form

```typescript
import { useState } from 'react';
import { authService } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';

function LoginForm() {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await authService.login({
        email: formData.get('email'),
        password: formData.get('password')
      });
      window.location.href = '/dashboard';
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Example 3: API Call with Loading State

```typescript
import { useState, useEffect } from 'react';
import { blogService } from '@/services/blogService';
import { ApiError } from '@/lib/apiClient';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllBlogs({
          page: 1,
          limit: 10
        });
        setBlogs(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load blogs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  );
}
```

## Testing

### Unit Tests (Future)

```typescript
// __tests__/apiClient.test.ts
import apiClient from '@/lib/apiClient';
import { setTokens } from '@/utils/tokenManager';

describe('API Client', () => {
  it('adds auth header when token exists', async () => {
    setTokens({ accessToken: 'test-token' });
    // Mock axios and verify Authorization header
  });

  it('retries on 500 errors', async () => {
    // Mock 500 error
    // Verify retry logic
  });
});
```

## Migration Guide

### From Old Fetch-based Code

**Before:**
```typescript
const response = await fetch(`${API_BASE_URL}/blogs`);
const data = await response.json();
```

**After:**
```typescript
const data = await blogService.getAllBlogs();
```

**Benefits:**
- ✅ Automatic auth headers
- ✅ Error handling
- ✅ Retry logic
- ✅ Type safety
- ✅ Request/response logging

## Configuration

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:3001

# .env.production
VITE_API_BASE_URL=https://unsugar-io-api.onrender.com
```

### Customization

Modify `src/lib/apiClient.ts`:

```typescript
// Change timeout
const API_TIMEOUT = 60000; // 60 seconds

// Change max retries
const MAX_RETRIES = 5;

// Customize retry logic
// Modify responseErrorInterceptor function
```

## Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Token expired or invalid
**Solution**: Implement token refresh or redirect to login

### Issue: Network timeout

**Cause**: Slow backend or network
**Solution**: Increase API_TIMEOUT or check backend performance

### Issue: CORS errors

**Cause**: Backend not allowing frontend origin
**Solution**: Update backend CORS configuration

## Next Steps

1. **Add Context/Hooks**: Create React context for auth state
2. **Add Protected Routes**: HOC or route wrapper for auth
3. **Add Token Refresh**: Automatic token renewal
4. **Add Unit Tests**: Test interceptors and services
5. **Add E2E Tests**: Test full authentication flow
6. **Add Analytics**: Track API errors and performance

## Summary

✅ **Completed:**
- Axios-based API client with interceptors
- Token management utilities
- Authentication service (ready for backend)
- Blog service updated to use proxy
- Error handling with custom ApiError
- Retry logic for server errors
- Development logging

🔄 **Ready for:**
- Backend authentication endpoints
- Frontend auth UI (login/register)
- Protected routes
- Token refresh implementation
- Role-based authorization
