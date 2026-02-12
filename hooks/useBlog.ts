import { useState, useCallback } from 'react';
import { blogService } from '@/lib/api';
import { Blogs } from '@/types/blogs';
import { APIError } from '@/lib/api/client';

interface UseBlogReturn {
    blog: Blogs | null;
    loading: boolean;
    error: string | null;
    fetchBlog: (slug: string) => Promise<void>;
}

/**
 * Custom hook for fetching a single blog by slug
 * @returns Blog data, loading state, error, and fetch function
 */
export const useBlog = (): UseBlogReturn => {
    const [blog, setBlog] = useState<Blogs | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBlog = useCallback(async (slug: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await blogService.getBySlug(slug);
            setBlog(data);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch blog. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching blog:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        blog,
        loading,
        error,
        fetchBlog,
    };
};
