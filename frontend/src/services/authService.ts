import { apiClient, setAuthToken } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface ApiErrorResponse {
    status: string;
    message: string;
    errors?: string[];
}

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
            const result = response.data;

            if (result.data?.token) {
                setAuthToken(result.data.token);
                return result.data;
            }

            throw new Error(result.message || 'Giriş başarısız');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ApiErrorResponse } };
                const errorMessage = axiosError.response?.data?.message || 'Giriş başarısız';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
            const result = response.data;

            if (result.status === 'success') {
                if (result.data?.token) {
                    setAuthToken(result.data.token);
                }
                return result.data;
            }

            throw new Error(result.message || 'Kayıt başarısız');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ApiErrorResponse } };
                const errorMessage = axiosError.response?.data?.message || 'Kayıt başarısız';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        try {
            const response = await apiClient.get(ENDPOINTS.AUTH.ME);
            const result = response.data;

            if (result.data) {
                return result.data;
            }

            throw new Error(result.message || 'Kullanıcı bilgisi alınamadı');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ApiErrorResponse } };
                const errorMessage = axiosError.response?.data?.message || 'Kullanıcı bilgisi alınamadı';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    async verifyEmail(email: string, code: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post('/user/verify-email', { email, code });
            const result = response.data;

            if (result.data?.token) {
                setAuthToken(result.data.token);
                return result.data;
            }

            throw new Error(result.message || 'Doğrulama başarısız');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ApiErrorResponse } };
                const errorMessage = axiosError.response?.data?.message || 'Doğrulama başarısız';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    async resendCode(email: string): Promise<void> {
        try {
            const response = await apiClient.post('/user/resend-verification', { email });
            const result = response.data;

            if (result.status !== 'success') {
                throw new Error(result.message || 'Kod gönderilemedi');
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: ApiErrorResponse } };
                const errorMessage = axiosError.response?.data?.message || 'Kod gönderilemedi';
                throw new Error(errorMessage);
            }
            throw error;
        }
    },

    logout(): void {
        setAuthToken(null);
    },
};
