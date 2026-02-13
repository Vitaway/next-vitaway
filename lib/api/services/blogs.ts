import { get } from '../client';
import { BlogsResponse, SingleBlogResponse } from '../types';
import { Blogs } from '@/types/blogs';

/**
 * Blog Service
 * Handles all blog-related API calls
 */
export const blogService = {
    /**
     * Fetch all blogs
     */
    getAll: async (): Promise<Blogs[]> => {
        const response = await get<BlogsResponse>('/api/blogs');
        // API returns: { data: { data: [...blogs] } }
        return Array.isArray(response.data?.data) ? response.data.data : [];
    },

    /**
     * Fetch a single blog by slug
     */
    getBySlug: async (slug: string): Promise<Blogs> => {
        const response = await get<SingleBlogResponse>(`/api/blogs/${slug}`);
        return response.data;
    },

    /**
     * Fetch blogs by category
     */
    getByCategory: async (category: string): Promise<Blogs[]> => {
        const response = await get<BlogsResponse>('/api/blogs', {
            params: { category },
        });
        return Array.isArray(response.data?.data) ? response.data.data : [];
    },

    /**
     * Search blogs by query
     */
    search: async (query: string): Promise<Blogs[]> => {
        const response = await get<BlogsResponse>('/api/blogs', {
            params: { search: query },
        });
        return Array.isArray(response.data?.data) ? response.data.data : [];
    },
};
