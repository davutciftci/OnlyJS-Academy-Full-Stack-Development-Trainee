import { apiClient } from '../api/client';

export const reviewService = {
    createReview: async (data: {
        productId: number;
        orderId: number;
        orderItemId: number;
        rating: number;
        comment: string;
    }) => {
        const response = await apiClient.post('/reviews', data);
        return response.data;
    },

    getProductReviews: async (productId: number) => {
        const response = await apiClient.get(`/reviews/product/${productId}`);
        return response.data.data;
    },

    getAllReviews: async (limit: number = 10) => {
        const response = await apiClient.get(`/reviews/all?limit=${limit}`);
        return response.data.data;
    },
    getReviewableOrders: async () => {
        const response = await apiClient.get('/reviews/my/reviewable');
        return response.data.data;
    },
};
