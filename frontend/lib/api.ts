import axios from "axios";

// Create axios instance with base configuration
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor (for adding auth tokens later)
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        // const token = localStorage.getItem("token");
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (for error handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message from backend
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "An error occurred";

        return Promise.reject(new Error(message));
    }
);

// GENERATOR:INJECT:EXPORTS
// Feature API exports will be injected here
// export * from '@/features/auth/api';
// END:GENERATOR:INJECT:EXPORTS
