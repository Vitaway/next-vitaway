import { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/lib/api';
import { Blogs } from '@/types/blogs';
import { APIError } from '@/lib/api/client';

interface UseBlogsOptions {
    limit?: number;
    category?: string;
    autoFetch?: boolean;
}

interface UseBlogsReturn {
    blogs: Blogs[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching blogs
 * @param options - Options for fetching blogs
 * @returns Blogs data, loading state, error, and refetch function
 */
export const useBlogs = (options: UseBlogsOptions = {}): UseBlogsReturn => {
    const { limit, category, autoFetch = true } = options;
    
    const [blogs, setBlogs] = useState<Blogs[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let data: Blogs[];

            if (category) {
                data = await blogService.getByCategory(category);
            } else {
                data = await blogService.getAll();

                console.log('Fetched blogs:', data);
            }

            if (limit) {
                data = data.slice(0, limit);
            }

            setBlogs(data);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch blogs. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, [limit, category]);

    useEffect(() => {
        if (autoFetch) {
            fetchBlogs();
        }
    }, [autoFetch, fetchBlogs]);

    return {
        blogs,
        loading,
        error,
        refetch: fetchBlogs,
    };
};
