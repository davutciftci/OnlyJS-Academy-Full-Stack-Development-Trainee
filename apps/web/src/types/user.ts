export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    birth_date?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birth_date: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
