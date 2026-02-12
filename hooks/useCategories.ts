import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api';
import { Category } from '@/lib/api/types';
import { APIError } from '@/lib/api/client';

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching product categories
 * @returns Categories data, loading state, error, and refetch function
 */
export const useCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await productService.getCategories();
            setCategories(data);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch categories. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
    };
};
