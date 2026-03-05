import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
    ApiResponse,
    PaginatedResponse,
    Product,
    ProductSearchParams,
    ProductPaginationParams
} from '../types';

export const productService = {
    async getProducts(params?: { categoryId?: number; activeOnly?: boolean }): Promise<Product[]> {
        const response = await apiClient.get<ApiResponse<Product[]>>(
            ENDPOINTS.PRODUCTS.LIST,
            { params }
        );
        return response.data.data || [];
    },

    async getProductById(id: number): Promise<Product> {
        const response = await apiClient.get<ApiResponse<Product>>(
            ENDPOINTS.PRODUCTS.BY_ID(id)
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ürün bulunamadı');
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get<ApiResponse<Product>>(
            `/products/slug/${slug}`
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ürün bulunamadı');
    },

    async searchProducts(params: ProductSearchParams): Promise<Product[]> {
        const response = await apiClient.get<ApiResponse<Product[]>>(
            ENDPOINTS.PRODUCTS.SEARCH,
            { params }
        );
        return response.data.data || [];
    },

    async getPaginatedProducts(params: ProductPaginationParams): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get<PaginatedResponse<Product>>(
            ENDPOINTS.PRODUCTS.PAGINATED,
            { params }
        );
        return response.data;
    },
};
