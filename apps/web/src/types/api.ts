export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    results?: number;
    errors?: ValidationError[];
}

export interface PaginatedResponse<T> {
    status: 'success' | 'error';
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        productsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
