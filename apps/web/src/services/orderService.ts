import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
    ApiResponse,
    Order,
    CreateOrderRequest,
    CancelOrderRequest,
    ProcessPaymentRequest,
    PaymentResponse
} from '../types';

export const orderService = {
    async getMyOrders(): Promise<Order[]> {
        const response = await apiClient.get<ApiResponse<Order[]>>(ENDPOINTS.ORDERS.MY);
        return response.data.data || [];
    },

    async getOrderById(id: number): Promise<Order> {
        const response = await apiClient.get<ApiResponse<Order>>(
            ENDPOINTS.ORDERS.BY_ID(id)
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sipariş bulunamadı');
    },

    async createOrder(data: CreateOrderRequest): Promise<Order> {
        const response = await apiClient.post<ApiResponse<Order>>(
            ENDPOINTS.ORDERS.CREATE,
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sipariş oluşturulamadı');
    },

    async cancelOrder(id: number, data: CancelOrderRequest): Promise<Order> {
        const response = await apiClient.post<ApiResponse<Order>>(
            ENDPOINTS.ORDERS.CANCEL(id),
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Sipariş iptal edilemedi');
    },

    async processPayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
        const response = await apiClient.post<ApiResponse<PaymentResponse>>(
            ENDPOINTS.PAYMENT.PROCESS,
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ödeme işlemi başarısız');
    },

    async getPaymentStatus(orderId: number): Promise<PaymentResponse> {
        const response = await apiClient.get<ApiResponse<PaymentResponse>>(
            ENDPOINTS.PAYMENT.STATUS(orderId)
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Ödeme durumu alınamadı');
    },
};
