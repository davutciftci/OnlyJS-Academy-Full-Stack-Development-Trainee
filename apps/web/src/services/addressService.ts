import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type {
    ApiResponse,
    UserAddress,
    CreateAddressRequest,
    UpdateAddressRequest
} from '../types';

export const addressService = {
    async getMyAddresses(): Promise<UserAddress[]> {
        const response = await apiClient.get<ApiResponse<UserAddress[]>>(ENDPOINTS.ADDRESSES.MY);
        return response.data.data || [];
    },

    async getAddressById(id: number): Promise<UserAddress> {
        const response = await apiClient.get<ApiResponse<UserAddress>>(
            ENDPOINTS.ADDRESSES.BY_ID(id)
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Adres bulunamadı');
    },

    async createAddress(data: CreateAddressRequest): Promise<UserAddress> {
        const response = await apiClient.post<ApiResponse<UserAddress>>(
            ENDPOINTS.ADDRESSES.CREATE,
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Adres oluşturulamadı');
    },

    async updateAddress(id: number, data: UpdateAddressRequest): Promise<UserAddress> {
        const response = await apiClient.put<ApiResponse<UserAddress>>(
            ENDPOINTS.ADDRESSES.BY_ID(id),
            data
        );
        if (response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Adres güncellenemedi');
    },

    async deleteAddress(id: number): Promise<void> {
        await apiClient.delete(ENDPOINTS.ADDRESSES.BY_ID(id));
    },
};
