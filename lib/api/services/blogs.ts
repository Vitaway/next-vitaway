import { get } from '../client';
import { BlogsResponse, SingleBlogResponse, LaravelPaginatedResponse } from '../types';
import { Blogs } from '@/types/blogs';

/**
 * Blog Service
 * Handles all blog-related API calls
 */
export const blogService = {
    /**
     * Fetch all blogs with pagination
     */
    getAll: async (page: number = 1): Promise<LaravelPaginatedResponse<Blogs>> => {
        const response = await get<BlogsResponse>('/api/blogs', {
            params: { page },
        });
        return response.data;
    },

    /**
     * Fetch a single blog by slug
     */
    getBySlug: async (slug: string): Promise<Blogs> => {
        const response = await get<SingleBlogResponse>(`/api/blogs/${slug}`);
        return response.data;
    },

    /**
     * Fetch blogs by category with pagination
     */
    getByCategory: async (category: string, page: number = 1): Promise<LaravelPaginatedResponse<Blogs>> => {
        const response = await get<BlogsResponse>('/api/blogs', {
            params: { category, page },
        });
        return response.data;
    },

    /**
     * Search blogs by query with pagination
     */
    search: async (query: string, page: number = 1): Promise<LaravelPaginatedResponse<Blogs>> => {
        const response = await get<BlogsResponse>('/api/blogs', {
            params: { search: query, page },
        });
        return response.data;
    },
};
