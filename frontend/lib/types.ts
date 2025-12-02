// Shared TypeScript types

// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// Error response from backend
export interface ApiError {
    error: string;
    type?: string;
    details?: Record<string, string>;
}

// Add your module-specific types here
