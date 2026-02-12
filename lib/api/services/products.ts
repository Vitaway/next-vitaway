import { get } from '../client';
import { ProductsResponse, SingleProductResponse, CategoriesResponse } from '../types';
import { Products } from '@/types/products';
import { Category } from '../types';

/**
 * Product Service
 * Handles all product-related API calls
 */
export const productService = {
    /**
     * Fetch all products
     */
    getAll: async (params?: { category?: string }): Promise<Products[]> => {
        const response = await get<ProductsResponse>('/api/products', {
            params,
        });
        return response.data;
    },

    /**
     * Fetch a single product by slug
     */
    getBySlug: async (slug: string): Promise<{ product: Products; related_products: Products[] }> => {
        const response = await get<SingleProductResponse>(`/api/products/${slug}`);
        return response.data;
    },

    /**
     * Fetch products by category
     */
    getByCategory: async (category: string): Promise<Products[]> => {
        const response = await get<ProductsResponse>('/api/products', {
            params: { category },
        });
        return response.data;
    },

    /**
     * Fetch all product categories
     */
    getCategories: async (): Promise<Category[]> => {
        const response = await get<CategoriesResponse>('/api/products/categories/list');
        return response.data;
    },

    /**
     * Search products
     */
    search: async (query: string): Promise<Products[]> => {
        const response = await get<ProductsResponse>('/api/products', {
            params: { search: query },
        });
        return response.data;
    },
};
