import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
    ApiResponse,
    CartResponse,
    CartItem,
    AddToCartRequest,
    UpdateCartItemRequest
} from '../types';

export const cartService = {
    async getCart(): Promise<CartResponse> {
        const response = await apiClient.get<ApiResponse<CartResponse>>(ENDPOINTS.CART.GET);
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sepet bilgisi alınamadı');
    },

    async addToCart(data: AddToCartRequest): Promise<CartItem> {
        const response = await apiClient.post<ApiResponse<CartItem>>(
            ENDPOINTS.CART.ITEMS,
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ürün sepete eklenemedi');
    },

    async updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<CartItem> {
        const response = await apiClient.put<ApiResponse<CartItem>>(
            ENDPOINTS.CART.ITEM_BY_ID(itemId),
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sepet güncellenemedi');
    },

    async removeFromCart(itemId: number): Promise<void> {
        await apiClient.delete(ENDPOINTS.CART.ITEM_BY_ID(itemId));
    },

    async clearCart(): Promise<void> {
        await apiClient.delete(ENDPOINTS.CART.CLEAR);
    },
};
