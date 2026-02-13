import { Blogs } from '@/types/blogs';
import { Products } from '@/types/products';

/**
 * Generic API Response wrapper
 */
export interface APIResponse<T> {
    data: T;
    message?: string;
    status?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * Laravel Paginated Response (matches Laravel's pagination structure)
 */
export interface LaravelPaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

/**
 * Blog API Responses
 */
export type BlogsResponse = APIResponse<LaravelPaginatedResponse<Blogs>>;

export type SingleBlogResponse = APIResponse<Blogs>;

/**
 * Product API Responses
 */
export type ProductsResponse = APIResponse<Products[]>;

export type SingleProductResponse = APIResponse<{
    product: Products;
    related_products: Products[];
}>;

/**
 * Category Response
 */
export interface Category {
    id: string | number;
    name: string;
    slug?: string;
}

export type CategoriesResponse = APIResponse<Category[]>;

/**
 * Appointment Types
 */
export interface AppointmentPayload {
    name: string;
    email: string;
    phone: string;
    subject: string;
    reasons: string;
    message: string;
    type: string;
    appointment_date: string;
    appointment_time: string;
}

export type AppointmentResponse = APIResponse<{
    id: string;
    status: string;
}>;

/**
 * Contact Form Types
 */
export interface ContactPayload {
    fullname: string;
    email: string;
    message: string;
}

export type ContactResponse = APIResponse<{
    id: string;
    status: string;
}>;

/**
 * Request State for hooks
 */
export interface RequestState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
