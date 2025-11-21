# ⚛️ Frontend Documentation

> React + TypeScript implementation for Unsugar.io

---

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [API Proxy Layer](#api-proxy-layer)
- [Authentication](#authentication)
- [Services](#services)
- [Configuration](#configuration)
- [Utilities](#utilities)

---

## Overview

### Technology Stack
- **React** 18.3.1 - UI library
- **TypeScript** 5.5.3 - Type safety
- **Vite** 5.4.2 - Build tool
- **Axios** 1.7.7 - HTTP client
- **React Router** 6.x - Routing

### Key Features
✅ API Proxy Layer with interceptors  
✅ Token management (access + refresh)  
✅ Authentication service (SSO ready)  
✅ Environment-aware logging  
✅ Error handling with retry logic  
✅ Type-safe API calls  

---

## Project Structure

```
unsugar-io/
├── src/
│   ├── components/          # UI Components
│   │   ├── common/         # Shared components
│   │   └── NavBar.tsx      # Navigation
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── BlogList.tsx
│   │   └── BlogPage.tsx
│   ├── services/           # API Services (Business Logic)
│   │   ├── authService.ts  # Authentication
│   │   └── blogService.ts  # Blog operations
│   ├── lib/                # Core libraries
│   │   └── apiClient.ts    # Axios instance + interceptors
│   ├── utils/              # Utilities
│   │   ├── tokenManager.ts # Token storage/retrieval
│   │   └── logger.ts       # Environment-aware logging
│   ├── config/             # Configuration
│   │   └── api.ts          # API endpoints
│   ├── types/              # TypeScript types
│   │   └── blog.ts
│   ├── styles/             # CSS files
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .env                    # Environment variables (local)
├── .env.production         # Production env vars
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## API Proxy Layer

### Core Concept: Centralized HTTP Client

**Problem:** Each component making direct API calls leads to:
- Duplicated auth header logic
- Inconsistent error handling
- No retry mechanism
- Hard to add features (logging, caching, etc.)

**Solution:** Single axios instance with interceptors

### Implementation

**File:** `src/lib/apiClient.ts`

```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});
```

### Request Interceptor

**Purpose:** Add auth headers automatically

```typescript
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get token from storage
    const token = getAccessToken();
    
    // 2. Inject token if valid
    if (token && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Add request ID for tracing
    config.headers['X-Request-ID'] = generateId();
    
    // 4. Log request (dev only)
    logger.apiRequest(config.method, config.url);
    
    return config;
  }
);
```

**Benefits:**
- ✅ Zero boilerplate in services
- ✅ Consistent auth across all requests
- ✅ Request tracing
- ✅ Development logging

### Response Interceptor

**Purpose:** Handle errors & implement retry logic

```typescript
apiClient.interceptors.response.use(
  (response) => {
    // Success: log and return data
    logger.apiResponse(response.status);
    return response.data;
  },
  async (error) => {
    // Error handling by status code
    
    switch (error.response?.status) {
      case 401:
        // Unauthorized: clear tokens, redirect to login
        clearTokens();
        if (apiClientConfig.onUnauthorized) {
          apiClientConfig.onUnauthorized();
        }
        break;
        
      case 403:
        // Forbidden: insufficient permissions
        if (apiClientConfig.onForbidden) {
          apiClientConfig.onForbidden();
        }
        break;
        
      case 429:
        // Rate limit: notify UI
        const retryAfter = error.response.headers['retry-after'];
        if (apiClientConfig.onRateLimit) {
          apiClientConfig.onRateLimit(retryAfter);
        }
        break;
        
      case 500:
      case 502:
      case 503:
        // Server errors: retry with exponential backoff
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000;
          await sleep(delay);
          return apiClient(originalRequest);
        }
        break;
    }
    
    throw new ApiError(error.message, error.response?.status);
  }
);
```

**Benefits:**
- ✅ Centralized error handling
- ✅ Automatic retry for transient failures
- ✅ Consistent error types (ApiError)
- ✅ Configurable callbacks

### Configuration

```typescript
// Configure callbacks (optional)
configureApiClient({
  onUnauthorized: () => {
    window.location.href = '/login';
  },
  onForbidden: () => {
    window.location.href = '/forbidden';
  },
  onRateLimit: (retryAfter) => {
    alert(`Rate limited. Retry in ${retryAfter}s`);
  }
});
```

---

## Authentication

### Token Manager

**File:** `src/utils/tokenManager.ts`

**Purpose:** Centralized token storage & retrieval

```typescript
// Store tokens
setTokens({
  accessToken: 'xxx',
  refreshToken: 'yyy',
  expiresIn: 900  // 15 minutes
});

// Get token
const token = getAccessToken();

// Check if authenticated
const isAuth = isAuthenticated();

// Clear tokens (logout)
clearTokens();
```

**Implementation:**

```typescript
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const setTokens = (data: TokenData): void => {
  const expiryTime = Date.now() + (data.expiresIn * 1000);
  
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
};

export const isTokenExpired = (): boolean => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  
  return Date.now() >= parseInt(expiry, 10);
};
```

**Security Note:**  
⚠️ Currently using `localStorage`. Plan to migrate to `httpOnly` cookies for better XSS protection.

### Auth Service

**File:** `src/services/authService.ts`

**Purpose:** Authentication operations

```typescript
// Login with email/password
const { user, accessToken, refreshToken } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register new user
const { user, accessToken } = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
});

// Refresh token
await authService.refreshAccessToken();

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

**Implementation:**

```typescript
export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/api/v1/auth/login', credentials);
  
  // Store tokens
  setTokens({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresIn: response.expiresIn
  });
  
  return response;
};
```

---

## Services

### Blog Service

**File:** `src/services/blogService.ts`

**Purpose:** Blog-related API calls

```typescript
export const blogService = {
  // Get all blogs with filters
  async getAllBlogs(params?: {
    tag?: string;
    author?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<Blog[]> {
    try {
      const response: BlogsResponse = await apiClient.get(
        API_ENDPOINTS.blogs,
        { params }
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching blogs', error);
      throw error;
    }
  },
  
  // Get single blog by ID
  async getBlogById(id: string): Promise<Blog> {
    const response: BlogResponse = await apiClient.get(
      API_ENDPOINTS.blogById(id)
    );
    return response.data;
  },
  
  // Get blog by slug
  async getBlogBySlug(slug: string): Promise<Blog> {
    const response: BlogResponse = await apiClient.get(
      API_ENDPOINTS.blogBySlug(slug)
    );
    return response.data;
  },
  
  // Get all tags
  async getAllTags(): Promise<string[]> {
    const response = await apiClient.get(API_ENDPOINTS.allTags);
    return response.data;
  }
};
```

**Key Features:**
- ✅ Type-safe responses
- ✅ Error handling with logger
- ✅ Auto-auth via interceptor
- ✅ Flexible filtering

---

## Configuration

### API Endpoints

**File:** `src/config/api.ts`

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Blogs
  blogs: '/api/v1/blogs',
  blogById: (id: string) => `/api/v1/blogs/${id}`,
  blogBySlug: (slug: string) => `/api/v1/blogs/slug/${slug}`,
  allTags: '/api/v1/blogs/tags/all',
  
  // Auth (future)
  login: '/api/v1/auth/login',
  register: '/api/v1/auth/register',
  refresh: '/api/v1/auth/refresh',
  me: '/api/v1/auth/me'
};
```

### Environment Variables

**.env (Development)**
```env
VITE_API_BASE_URL=http://localhost:3001
```

**.env.production**
```env
VITE_API_BASE_URL=https://unsugar-io-api.onrender.com
```

**Why `VITE_` prefix?**  
Vite only exposes env vars with `VITE_` prefix to the client for security.

---

## Utilities

### Logger

**File:** `src/utils/logger.ts`

**Purpose:** Environment-aware logging

```typescript
class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  error(message: string, error?: unknown, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(`❌ ${message}`, error, context);
    } else {
      // TODO: Send to error tracking service (Sentry)
      console.error(message);
    }
  }
  
  apiRequest(method: string, url: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.log(`🌐 [API Request] ${method} ${url}`, data);
    }
  }
}

export const logger = new Logger();
```

**Benefits:**
- ✅ No logs in production
- ✅ Ready for Sentry integration
- ✅ Structured logging
- ✅ API request tracing

---

## Error Handling

### ApiError Class

```typescript
export class ApiError extends Error {
  statusCode?: number;
  code?: string;
  data?: unknown;
  
  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}
```

### Usage in Components

```typescript
try {
  const blogs = await blogService.getAllBlogs();
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        navigate('/login');
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Show message
        toast.error('Too many requests. Please wait.');
        break;
      case 'NETWORK_ERROR':
        // Show offline UI
        setIsOffline(true);
        break;
      default:
        toast.error(error.message);
    }
  }
}
```

---

## Best Practices

### 1. Use Services, Not Direct API Calls

**❌ Bad:**
```typescript
// In component
const response = await fetch('/api/v1/blogs');
const data = await response.json();
```

**✅ Good:**
```typescript
// In component
const blogs = await blogService.getAllBlogs();
```

### 2. Handle Errors at Component Level

```typescript
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  blogService.getAllBlogs()
    .then(setBlogs)
    .catch(err => {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    });
}, []);
```

### 3. Use Logger Instead of Console

**❌ Bad:**
```typescript
console.log('Fetching blogs...');
console.error('Error:', error);
```

**✅ Good:**
```typescript
logger.info('Fetching blogs...');
logger.error('Failed to fetch blogs', error);
```

### 4. Type Everything

```typescript
// Define types
interface Blog {
  id: string;
  title: string;
  content: string;
  // ...
}

// Use types
const blogs: Blog[] = await blogService.getAllBlogs();
```

---

## Development Workflow

### 1. Start Dev Server

```bash
cd unsugar-io
npm run dev
```

Runs on `http://localhost:5173`

### 2. Build for Production

```bash
npm run build
```

Output: `dist/` folder

### 3. Preview Production Build

```bash
npm run preview
```

### 4. Lint Code

```bash
npm run lint
```

---

## Deployment (Netlify)

### Auto-Deploy

Push to `main` branch → Netlify auto-deploys

### Build Settings

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

Set in Netlify dashboard:
- `VITE_API_BASE_URL=https://unsugar-io-api.onrender.com`

---

## Next: [Backend Documentation →](./03-BACKEND_DOCUMENTATION.md)
