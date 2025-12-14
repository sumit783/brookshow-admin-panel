
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    email: string;
    access_token: string;
}

export const loginAdmin = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    const response = await fetch(`${baseUrl}/api/auth/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
    }

    return response.json();
};
