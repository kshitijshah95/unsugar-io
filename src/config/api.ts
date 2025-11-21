const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  blogs: `${API_BASE_URL}/api/blogs`,
  blogById: (id: string) => `${API_BASE_URL}/api/blogs/${id}`,
  blogBySlug: (slug: string) => `${API_BASE_URL}/api/blogs/slug/${slug}`,
  allTags: `${API_BASE_URL}/api/blogs/tags/all`,
};

export default API_BASE_URL;
