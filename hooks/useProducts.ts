import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api';
import { Products } from '@/types/products';
import { APIError } from '@/lib/api/client';

interface UseProductsOptions {
    category?: string;
    autoFetch?: boolean;
}

interface UseProductsReturn {
    products: Products[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching products
 * @param options - Options for fetching products
 * @returns Products data, loading state, error, and refetch function
 */
export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
    const { category, autoFetch = true } = options;
    
    const [products, setProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = category ? { category } : undefined;
            const data = await productService.getAll(params);

            setProducts(data);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch products. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        if (autoFetch) {
            fetchProducts();
        }
    }, [autoFetch, fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
};
