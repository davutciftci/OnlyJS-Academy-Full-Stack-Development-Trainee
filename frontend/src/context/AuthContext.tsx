import { useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContextObject';
import type { User, LoginRequest, RegisterRequest } from '../types';

const getStoredToken = (): string | null => {
    try {
        return localStorage.getItem('authToken');
    } catch {
        return null;
    }
};

const setStoredToken = (token: string | null) => {
    try {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    } catch {
        console.error('Token storage error');
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = getStoredToken();
                if (token) {
                    const { authService } = await import('../services/authService');
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Auth init error:', error);
                setStoredToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        const { authService } = await import('../services/authService');
        const response = await authService.login(data);
        setStoredToken(response.token);
        setUser(response.user);
    };

    const register = async (data: RegisterRequest) => {
        const { authService } = await import('../services/authService');
        const response = await authService.register(data);
        if (response.token) {
            setStoredToken(response.token);
            setUser(response.user);
        }
    };

    const verifyEmail = async (email: string, code: string) => {
        const { authService } = await import('../services/authService');
        const response = await authService.verifyEmail(email, code);
        setStoredToken(response.token);
        setUser(response.user);
    };

    const logout = () => {
        setStoredToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                verifyEmail,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
