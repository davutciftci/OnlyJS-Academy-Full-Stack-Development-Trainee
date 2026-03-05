import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, Category } from '../types';

export const categoryService = {
    async getCategories(activeOnly?: boolean): Promise<Category[]> {
        const response = await apiClient.get<ApiResponse<Category[]>>(
            ENDPOINTS.CATEGORIES.LIST,
            { params: { activeOnly } }
        );
        return response.data.data || [];
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<ApiResponse<Category>>(
            ENDPOINTS.CATEGORIES.BY_ID(id)
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Kategori bulunamadı');
    },
};
