import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

/**
 * API Error class for better error handling
 */
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * Create a configured axios instance with interceptors
 */
const createAPIClient = (): AxiosInstance => {
    const baseURL = process.env.NEXT_PUBLIC_ENVENTORY_API_URL;

    if (!baseURL) {
        throw new Error('NEXT_PUBLIC_ENVENTORY_API_URL is not defined. Please check your .env file and restart the dev server.');
    }

    const client = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        timeout: 30000, // 30 seconds
    });

    // Request interceptor for adding auth tokens or logging
    client.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor for error handling
    client.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response) {
                // Server responded with error
                const errorMessage = 
                    (error.response.data as { message?: string })?.message || 
                    'An error occurred while processing your request';
                
                throw new APIError(
                    errorMessage,
                    error.response.status,
                    error.response.data
                );
            } else if (error.request) {
                // Request made but no response
                throw new APIError(
                    'No response from server. Please check your internet connection.',
                    0
                );
            } else {
                // Error setting up request
                throw new APIError(error.message);
            }
        }
    );

    return client;
};

// Lazy initialization of API client
let apiClientInstance: AxiosInstance | null = null;

const getAPIClient = (): AxiosInstance => {
    if (!apiClientInstance) {
        apiClientInstance = createAPIClient();
    }
    return apiClientInstance;
};

// Export getter instead of direct instance
export const apiClient = new Proxy({} as AxiosInstance, {
    get(target, prop) {
        const client = getAPIClient();
        const value = client[prop as keyof AxiosInstance];
        return typeof value === 'function' ? value.bind(client) : value;
    }
});

/**
 * Generic GET request
 */
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const client = getAPIClient();
    const response = await client.get<T>(url, config);
    return response.data;
};

/**
 * Generic POST request
 */
export const post = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const client = getAPIClient();
    const response = await client.post<T>(url, data, config);
    return response.data;
};

/**
 * Generic PUT request
 */
export const put = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const client = getAPIClient();
    const response = await client.put<T>(url, data, config);
    return response.data;
};

/**
 * Generic PATCH request
 */
export const patch = async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
): Promise<T> => {
    const client = getAPIClient();
    const response = await client.patch<T>(url, data, config);
    return response.data;
};

/**
 * Generic DELETE request
 */
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const client = getAPIClient();
    const response = await client.delete<T>(url, config);
    return response.data;
};
