
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_KEY = import.meta.env.VITE_API_KEY || "";

interface RequestOptions extends RequestInit {
    body?: any;
}

export const apiClient = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    const { body, headers, ...customConfig } = options;
    const token = localStorage.getItem("access_token");

    const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
    };

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...customConfig,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(new Error("Unauthorized, redirecting to login..."));
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText || "Request failed");
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
};
