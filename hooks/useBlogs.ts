import { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/lib/api';
import { Blogs } from '@/types/blogs';
import { APIError } from '@/lib/api/client';
import { LaravelPaginatedResponse } from '@/lib/api/types';

interface UseBlogsOptions {
    limit?: number;
    category?: string;
    autoFetch?: boolean;
    initialPage?: number;
}

interface UseBlogsReturn {
    blogs: Blogs[];
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
        from: number;
        to: number;
    };
    goToPage: (page: number) => Promise<void>;
    nextPage: () => Promise<void>;
    prevPage: () => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching blogs with pagination
 * @param options - Options for fetching blogs
 * @returns Blogs data, loading state, error, pagination info, and navigation functions
 */
export const useBlogs = (options: UseBlogsOptions = {}): UseBlogsReturn => {
    const { limit, category, autoFetch = true, initialPage = 1 } = options;
    
    const [blogs, setBlogs] = useState<Blogs[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [paginationData, setPaginationData] = useState<LaravelPaginatedResponse<Blogs> | null>(null);

    const fetchBlogs = useCallback(async (page: number = currentPage) => {
        try {
            setLoading(true);
            setError(null);

            let data: LaravelPaginatedResponse<Blogs>;

            if (category) {
                data = await blogService.getByCategory(category, page);
            } else {
                data = await blogService.getAll(page);
            }

            setPaginationData(data);

            let blogList = data.data;
            if (limit) {
                blogList = blogList.slice(0, limit);
            }

            setBlogs(blogList);
            setCurrentPage(data.current_page);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch blogs. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, [limit, category, currentPage]);

    const goToPage = useCallback(async (page: number) => {
        if (paginationData && page >= 1 && page <= paginationData.last_page) {
            await fetchBlogs(page);
        }
    }, [fetchBlogs, paginationData]);

    const nextPage = useCallback(async () => {
        if (paginationData?.next_page_url) {
            await goToPage(currentPage + 1);
        }
    }, [currentPage, goToPage, paginationData]);

    const prevPage = useCallback(async () => {
        if (paginationData?.prev_page_url) {
            await goToPage(currentPage - 1);
        }
    }, [currentPage, goToPage, paginationData]);

    useEffect(() => {
        if (autoFetch) {
            fetchBlogs(initialPage);
        }
    }, [autoFetch, initialPage]); // Don't include fetchBlogs to avoid infinite loop

    return {
        blogs,
        loading,
        error,
        pagination: {
            currentPage: paginationData?.current_page || 1,
            lastPage: paginationData?.last_page || 1,
            perPage: paginationData?.per_page || 15,
            total: paginationData?.total || 0,
            from: paginationData?.from || 0,
            to: paginationData?.to || 0,
        },
        goToPage,
        nextPage,
        prevPage,
        refetch: () => fetchBlogs(currentPage),
    };
};
