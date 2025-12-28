// Server-only API utilities for Server Components
// Use this for initial data fetching during SSR
// Uses API_URL (docker service name) instead of NEXT_PUBLIC_API_URL (browser)

const API_URL = process.env.API_URL || "http://backend:8080/api";

export class ServerAPIError extends Error {
    constructor(
        message: string,
        public status: number,
        public url: string
    ) {
        super(message);
        this.name = "ServerAPIError";
    }
}

interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    cache?: RequestCache;
    revalidate?: number;
}

/**
 * Generic server-side fetch with error handling
 * Use in Server Components for initial data loading
 */
export async function serverFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
    const {
        method = "GET",
        body,
        cache = "no-store", // Default: always fresh
        revalidate,
    } = options;

    const url = path.startsWith("http") ? path : `${API_URL}${path}`;

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
            cache,
            ...(revalidate !== undefined && { next: { revalidate } }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData.message || errorData.error || `HTTP ${res.status} error`;

            console.error(`[Server API Error] ${method} ${url}`, {
                status: res.status,
                message,
                data: errorData,
            });

            throw new ServerAPIError(message, res.status, url);
        }

        // Handle 204 No Content
        if (res.status === 204) {
            return undefined as T;
        }

        return res.json();
    } catch (error) {
        if (error instanceof ServerAPIError) {
            throw error;
        }

        // Network errors, etc.
        console.error(`[Server API Error] ${method} ${url}`, error);
        throw new Error(
            `Failed to fetch from ${url}: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
