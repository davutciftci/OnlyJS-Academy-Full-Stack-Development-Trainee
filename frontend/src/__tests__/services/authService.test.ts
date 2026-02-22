import { authService } from '../../services/authService';
import { apiClient, setAuthToken } from '../../api/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ENDPOINTS } from '../../api/endpoints';
import type { User, ApiResponse, RegisterRequest } from '../../types';

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('login başarılı olduğunda token ve kullanıcı döner', async () => {
        const mockResponse: ApiResponse<{ token: string; user: Partial<User> }> = {
            status: 'success',
            data: {
                token: 'fake-token',
                user: { id: 1, firstName: 'Test' }
            },
            message: 'Başarılı'
        };
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

        const result = await authService.login({ email: 'test@test.com', password: 'password' });

        expect(apiClient.post).toHaveBeenCalledWith(ENDPOINTS.AUTH.LOGIN, { email: 'test@test.com', password: 'password' });
        expect(result.token).toBe('fake-token');
        expect(result.user.firstName).toBe('Test');
    });

    it('login başarısız olduğunda hata fırlatır', async () => {
        const mockError = {
            response: {
                data: {
                    message: 'Hatalı şifre'
                }
            }
        };
        vi.mocked(apiClient.post).mockRejectedValue(mockError);

        await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
            .rejects.toThrow('Hatalı şifre');
    });

    it('login sırasında result.data.token yoksa hata fırlatmalıdır', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { status: 'success', data: {} } });
        await expect(authService.login({ email: 't@t.com', password: 'p' })).rejects.toThrow('Giriş başarısız');
    });

    it('login sırasında axios hatası mesaja sahip değilse fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({ response: { data: {} } });
        await expect(authService.login({ email: 't@t.com', password: 'p' })).rejects.toThrow('Giriş başarısız');
    });

    it('login sırasında axios hatası değilse orijinal hatayı fırlatmalıdır', async () => {
        const genericError = new Error('Network fail');
        vi.mocked(apiClient.post).mockRejectedValue(genericError);
        await expect(authService.login({ email: 't@t.com', password: 'p' })).rejects.toThrow('Network fail');
    });

    it('register başarılı olduğunda kullanıcı ve token döner', async () => {
        const mockResponse: ApiResponse<{ token: string; user: Partial<User> }> = {
            status: 'success',
            data: {
                token: 'reg-token',
                user: { id: 2, firstName: 'Yeni' }
            }
        };
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

        const result = await authService.register({
            firstName: 'Yeni',
            lastName: 'User',
            email: 'yeni@test.com',
            password: 'password',
            birth_date: '1990-01-01'
        });

        expect(apiClient.post).toHaveBeenCalledWith(ENDPOINTS.AUTH.REGISTER, expect.any(Object));
        expect(result.token).toBe('reg-token');
    });

    it('register başarısız (status success değilse) hata fırlatmalıdır', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { status: 'error', message: 'Kayıt engellendi' } });
        await expect(authService.register({} as RegisterRequest)).rejects.toThrow('Kayıt engellendi');
    });

    it('register axios hatası boş mesaj ise fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({ response: { data: {} } });
        await expect(authService.register({} as RegisterRequest)).rejects.toThrow('Kayıt başarısız');
    });

    it('verifyEmail başarılı olduğunda AuthResponse döner', async () => {
        const mockResponse: ApiResponse<{ token: string; user: Partial<User> }> = {
            status: 'success',
            data: {
                token: 'verify-token',
                user: { id: 1, firstName: 'Onaylı' }
            }
        };
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

        const result = await authService.verifyEmail('test@test.com', '123456');

        expect(apiClient.post).toHaveBeenCalledWith('/user/verify-email', { email: 'test@test.com', code: '123456' });
        expect(result.token).toBe('verify-token');
    });

    it('verifyEmail token gelmezse hata fırlatmalıdır', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { status: 'success', data: {} } });
        await expect(authService.verifyEmail('a@b.com', '111')).rejects.toThrow('Doğrulama başarısız');
    });

    it('verifyEmail axios hatası boş mesaj ise fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({ response: { data: {} } });
        await expect(authService.verifyEmail('a@b.com', '111')).rejects.toThrow('Doğrulama başarısız');
    });

    it('resendCode başarılı olduğunda hata fırlatmaz', async () => {
        const mockResponse = { status: 'success' };
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

        await expect(authService.resendCode('test@test.com')).resolves.not.toThrow();
        expect(apiClient.post).toHaveBeenCalledWith('/user/resend-verification', { email: 'test@test.com' });
    });

    it('resendCode status success değilse hata fırlatmalıdır', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { status: 'error', message: 'Limit doldu' } });
        await expect(authService.resendCode('a@b.com')).rejects.toThrow('Limit doldu');
    });

    it('resendCode axios hatası boş mesaj ise fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({ response: { data: {} } });
        await expect(authService.resendCode('a@b.com')).rejects.toThrow('Kod gönderilemedi');
    });

    it('getCurrentUser kullanıcı bilgilerini döndürür', async () => {
        const mockResponse: ApiResponse<Partial<User>> = {
            status: 'success',
            data: { id: 1, firstName: 'Ahmet' }
        };
        vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

        const result = await authService.getCurrentUser();

        expect(apiClient.get).toHaveBeenCalledWith(ENDPOINTS.AUTH.ME);
        expect(result.firstName).toBe('Ahmet');
    });

    it('getCurrentUser hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.get).mockRejectedValue({
            response: { data: { message: 'Yetkisiz erişim' } }
        });

        await expect(authService.getCurrentUser()).rejects.toThrow('Yetkisiz erişim');
    });

    it('getCurrentUser data yoksa hata fırlatmalıdır', async () => {
        vi.mocked(apiClient.get).mockResolvedValue({ data: { status: 'success' } });
        await expect(authService.getCurrentUser()).rejects.toThrow('Kullanıcı bilgisi alınamadı');
    });

    it('getCurrentUser axios hatası mesajsız ise fallback kullanmalıdır', async () => {
        vi.mocked(apiClient.get).mockRejectedValue({ response: { data: {} } });
        await expect(authService.getCurrentUser()).rejects.toThrow('Kullanıcı bilgisi alınamadı');
    });

    it('register hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({
            response: { data: { message: 'Email zaten kayıtlı' } }
        });

        await expect(authService.register({} as RegisterRequest)).rejects.toThrow('Email zaten kayıtlı');
    });

    it('verifyEmail hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({
            response: { data: { message: 'Geçersiz kod' } }
        });

        await expect(authService.verifyEmail('a@b.com', '000')).rejects.toThrow('Geçersiz kod');
    });

    it('resendCode hata durumunda hata fırlatır', async () => {
        vi.mocked(apiClient.post).mockRejectedValue({
            response: { data: { message: 'Çok fazla istek' } }
        });

        await expect(authService.resendCode('a@b.com')).rejects.toThrow('Çok fazla istek');
    });

    it('logout tokenı temizler', () => {
        authService.logout();
        expect(setAuthToken).toHaveBeenCalledWith(null);
    });
});
