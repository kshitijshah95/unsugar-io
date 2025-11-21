import { API_ENDPOINTS } from '@/config/api';
import type { Blog, BlogsResponse, BlogResponse } from '@/types/blog';

export const blogService = {
  /**
   * Fetch all blogs with optional filters
   */
  async getAllBlogs(params?: {
    tag?: string;
    author?: string;
    search?: string;
  }): Promise<Blog[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.tag) queryParams.append('tag', params.tag);
      if (params?.author) queryParams.append('author', params.author);
      if (params?.search) queryParams.append('search', params.search);

      const url = queryParams.toString()
        ? `${API_ENDPOINTS.blogs}?${queryParams}`
        : API_ENDPOINTS.blogs;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const result: BlogsResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  /**
   * Fetch a single blog by ID
   */
  async getBlogById(id: string): Promise<Blog> {
    try {
      const response = await fetch(API_ENDPOINTS.blogById(id));
      if (!response.ok) {
        throw new Error('Blog not found');
      }

      const result: BlogResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  /**
   * Fetch a single blog by slug
   */
  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const response = await fetch(API_ENDPOINTS.blogBySlug(slug));
      if (!response.ok) {
        throw new Error('Blog not found');
      }

      const result: BlogResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  /**
   * Fetch all available tags
   */
  async getAllTags(): Promise<string[]> {
    try {
      const response = await fetch(API_ENDPOINTS.allTags);
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },
};
