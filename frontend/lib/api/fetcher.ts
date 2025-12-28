const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class APIError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = "APIError";
    }
}

export async function fetcher<T = any>(url: string): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    const res = await fetch(fullUrl, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || errorData.error || `HTTP ${res.status} error`;

        console.error(`API Error: ${message}`, { status: res.status, data: errorData });
        throw new APIError(message, res.status, errorData);
    }

    return res.json();
}

// Helper for mutations (POST, PUT, DELETE)
export async function mutateFetch<T = any>(
    url: string,
    {
        method = "GET",
        body,
    }: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: any;
    } = {}
): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    const res = await fetch(fullUrl, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });

    // DELETE might return 204 No Content
    if (res.status === 204) {
        return undefined as T;
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || errorData.error || `HTTP ${res.status} error`;

        console.error(`API Error: ${message}`, { status: res.status, data: errorData });
        throw new APIError(message, res.status, errorData);
    }

    return res.json();
}
