import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../../types';

// authService'i mock'layalım
vi.mock('../../services/authService', () => ({
    authService: {
        getCurrentUser: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        verifyEmail: vi.fn(),
        logout: vi.fn(),
    },
}));

// Test bileşeni: Context değerlerini ekrana yazdırır
const TestComponent = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    if (isLoading) return <div data-testid="loading">Yükleniyor...</div>;
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Giriş Yapıldı' : 'Giriş Yapılmadı'}</div>
            <div data-testid="user-name">{user ? `${user.firstName} ${user.lastName}` : 'Misafir'}</div>
            <button onClick={logout}>Çıkış Yap</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('Unauthorized'));
    });

    it('Yükleme durumunda (isLoading: true) iken beklemelidir', async () => {
        localStorage.setItem('authToken', 'fake-token');
        
        let resolveUser: (value: User) => void;
        const userPromise = new Promise<User>((resolve) => { resolveUser = resolve; });
        vi.mocked(authService.getCurrentUser).mockReturnValue(userPromise);
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        
        await act(async () => {
          resolveUser!({ id: 1, firstName: 'Test' } as User);
        });
    });

    it('Token yoksa direkt giriş yapılmamış görünmelidir', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
        
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Giriş Yapılmadı');
    });

    it('Geçerli bir token varsa kullanıcı bilgilerini çekip göstermelidir', async () => {
        localStorage.setItem('authToken', 'fake-token');
        const mockUserData: Partial<User> = { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@test.com' };
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUserData as User);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('Ahmet Yılmaz');
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Giriş Yapıldı');
    });

    it('logout fonksiyonu çağrıldığında kullanıcıyı çıkış yaptırmalıdır', async () => {
        localStorage.setItem('authToken', 'fake-token');
        const mockUserData: Partial<User> = { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz' };
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUserData as User);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Giriş Yapıldı');
        });

        const logoutButton = screen.getByText('Çıkış Yap');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Giriş Yapılmadı');
        });
        expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('useAuth context dışında kullanıldığında hata fırlatmalıdır', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const BuggyComponent = () => {
            useAuth();
            return null;
        };

        expect(() => render(<BuggyComponent />)).toThrow('useAuth must be used within an AuthProvider');
        consoleSpy.mockRestore();
    });

    it('localStorage hatası durumunda console.error çağrılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const storageSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
        });

        const LoginTrigger = () => {
            const { login } = useAuth();
            return <button onClick={() => login({ email: 't@t.com', password: 'p' } as LoginRequest)}>Login</button>;
        };

        vi.mocked(authService.login).mockResolvedValue({ token: 't', user: { id: 1, firstName: 'T', lastName: 'C', email: 't@t.com', role: 'CUSTOMER' } as User });

        render(
            <AuthProvider>
                <LoginTrigger />
            </AuthProvider>
        );

        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Token storage error');
        });

        consoleSpy.mockRestore();
        storageSpy.mockRestore();
    });

    it('register başarılı olduğunda kullanıcıyı set etmelidir', async () => {
        vi.mocked(authService.register).mockResolvedValue({ token: 'reg-t', user: { id: 2, firstName: 'Yeni', lastName: 'User' } as User });
        
        const RegisterTrigger = () => {
            const { register } = useAuth();
            return <button onClick={() => register({} as RegisterRequest)}>Register</button>;
        };

        render(<AuthProvider><RegisterTrigger /><TestComponent /></AuthProvider>);
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Yeni User'));
    });

    it('verifyEmail başarılı olduğunda kullanıcıyı set etmelidir', async () => {
        vi.mocked(authService.verifyEmail).mockResolvedValue({ token: 'v-t', user: { id: 3, firstName: 'Onaylı', lastName: 'User' } as User });

        const VerifyTrigger = () => {
            const { verifyEmail } = useAuth();
            return <button onClick={() => verifyEmail('a@b.com', '123')}>Verify</button>;
        };

        render(<AuthProvider><VerifyTrigger /><TestComponent /></AuthProvider>);
        fireEvent.click(screen.getByText('Verify'));

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Onaylı User'));
    });
});
