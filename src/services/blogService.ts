import apiClient, { ApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import type { Blog, BlogsResponse, BlogResponse } from '@/types/blog';
import { logger } from '@/utils/logger';

export const blogService = {
  /**
   * Fetch all blogs with optional filters
   */
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
      const response: BlogsResponse = await apiClient.get(API_ENDPOINTS.blogs, {
        params,
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error fetching blogs', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch blogs', undefined, 'FETCH_BLOGS_ERROR');
    }
  },

  /**
   * Fetch a single blog by ID
   */
  async getBlogById(id: string): Promise<Blog> {
    try {
      const response: BlogResponse = await apiClient.get(API_ENDPOINTS.blogById(id));
      return response.data;
    } catch (error) {
      logger.error('Error fetching blog by ID', error, { id });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Blog not found', 404, 'BLOG_NOT_FOUND');
    }
  },

  /**
   * Fetch a single blog by slug
   */
  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const response: BlogResponse = await apiClient.get(API_ENDPOINTS.blogBySlug(slug));
      return response.data;
    } catch (error) {
      logger.error('Error fetching blog by slug', error, { slug });
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Blog not found', 404, 'BLOG_NOT_FOUND');
    }
  },

  /**
   * Fetch all available tags
   */
  async getAllTags(): Promise<string[]> {
    try {
      const response: { success: boolean; data: string[] } = await apiClient.get(API_ENDPOINTS.allTags);
      return response.data;
    } catch (error) {
      logger.error('Error fetching tags', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch tags', undefined, 'FETCH_TAGS_ERROR');
    }
  },
};
