import { apiClient } from "./apiClient";

export interface CategoryResponse {
    categories: string[];
}

export const getCategories = async (): Promise<CategoryResponse> => {
    return apiClient<CategoryResponse>("/api/artist/categories?activeOnly=true");
};

export const createCategory = async (name: string): Promise<void> => {
    return apiClient<void>("/api/admin/categories", {
        method: "POST",
        body: { name },
    });
};
