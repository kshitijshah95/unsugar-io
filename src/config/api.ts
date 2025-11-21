// API Configuration
// Note: apiClient already has baseURL configured, so endpoints are relative paths
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  blogs: '/api/v1/blogs',
  blogById: (id: string) => `/api/v1/blogs/${id}`,
  blogBySlug: (slug: string) => `/api/v1/blogs/slug/${slug}`,
  allTags: '/api/v1/blogs/tags/all',
};

export default API_BASE_URL;
