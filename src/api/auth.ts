
import { apiClient } from "./apiClient";

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
    return apiClient<LoginResponse>("/api/auth/admin-login", {
        method: "POST",
        body: credentials,
    });
};
