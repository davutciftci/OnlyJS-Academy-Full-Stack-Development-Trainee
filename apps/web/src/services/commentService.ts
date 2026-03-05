import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, ProductComment, CreateCommentRequest } from '../types';

export const commentService = {
    async getApprovedComments(limit: number = 20): Promise<ProductComment[]> {
        const response = await apiClient.get<ApiResponse<ProductComment[]>>(
            ENDPOINTS.COMMENTS.APPROVED,
            { params: { limit } }
        );
        return response.data.data || [];
    },

    async getProductComments(productId: number): Promise<ProductComment[]> {
        const response = await apiClient.get<ApiResponse<ProductComment[]>>(
            ENDPOINTS.COMMENTS.BY_PRODUCT(productId)
        );
        return response.data.data || [];
    },

    async getMyComments(): Promise<ProductComment[]> {
        const response = await apiClient.get<ApiResponse<ProductComment[]>>(
            ENDPOINTS.COMMENTS.MY_COMMENTS
        );
        return response.data.data || [];
    },

    async createComment(data: CreateCommentRequest): Promise<ProductComment> {
        const response = await apiClient.post<ApiResponse<ProductComment>>(
            ENDPOINTS.COMMENTS.CREATE,
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Yorum eklenemedi');
    },

    async updateComment(id: number, data: Partial<CreateCommentRequest>): Promise<ProductComment> {
        const response = await apiClient.put<ApiResponse<ProductComment>>(
            ENDPOINTS.COMMENTS.BY_ID(id),
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Yorum güncellenemedi');
    },

    async deleteComment(id: number): Promise<void> {
        await apiClient.delete(ENDPOINTS.COMMENTS.BY_ID(id));
    },
};
