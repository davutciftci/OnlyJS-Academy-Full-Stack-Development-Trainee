import { apiClient } from '../api/client';
import type { ApiResponse, Product, Category, Order } from '../types';

export interface CreateProductRequest {
    name: string;
    slug: string;
    description?: string;
    basePrice?: number;
    stockCount: number;
    categoryId: number;
    isActive?: boolean;
    features?: string[];
    nutritionInfo?: string[];
    usage?: string[];
    expirationDate?: string;
    taxRate?: number;
    servingSize?: string;
    ingredients?: string;
    nutritionValues?: any;
    aminoAcids?: any;
    variants?: Array<{
        name: string;
        sku: string;
        price: number;
        stockCount: number;
        discount?: number;
        aroma?: string;
        size?: string;
        servings?: string;
    }>;
    photos?: Array<{
        url: string;
        altText?: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }>;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> { }

export const adminService = {
    async createProduct(data: CreateProductRequest): Promise<Product> {
        const response = await apiClient.post<ApiResponse<Product>>('/products', data);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ürün oluşturulamadı');
    },

    async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
        const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ürün güncellenemedi');
    },

    async deleteProduct(id: number): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    },

    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
        return response.data.data || [];
    },

    async createCategory(data: CreateCategoryRequest): Promise<Category> {
        const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Kategori oluşturulamadı');
    },

    async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
        const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Kategori güncellenemedi');
    },

    async deleteCategory(id: number): Promise<void> {
        await apiClient.delete(`/categories/${id}`);
    },

    async getOrders(): Promise<Order[]> {
        const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
        return response.data.data || [];
    },

    async getOrderById(id: number): Promise<Order> {
        const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sipariş bulunamadı');
    },

    async updateOrderStatus(id: number, status: string): Promise<Order> {
        const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sipariş durumu güncellenemedi');
    },
};
