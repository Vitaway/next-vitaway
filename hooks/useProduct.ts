import { useState, useCallback } from 'react';
import { productService } from '@/lib/api';
import { Products } from '@/types/products';
import { APIError } from '@/lib/api/client';

interface UseProductReturn {
    product: Products | null;
    relatedProducts: Products[];
    loading: boolean;
    error: string | null;
    fetchProduct: (slug: string) => Promise<void>;
}

/**
 * Custom hook for fetching a single product by slug
 * @returns Product data, related products, loading state, error, and fetch function
 */
export const useProduct = (): UseProductReturn => {
    const [product, setProduct] = useState<Products | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async (slug: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await productService.getBySlug(slug);
            setProduct(data.product);
            setRelatedProducts(data.related_products);
        } catch (err) {
            const errorMessage = err instanceof APIError 
                ? err.message 
                : 'Failed to fetch product. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        product,
        relatedProducts,
        loading,
        error,
        fetchProduct,
    };
};
