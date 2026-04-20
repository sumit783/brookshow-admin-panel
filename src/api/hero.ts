import { apiClient } from "./apiClient";

export interface HeroImage {
    _id: string;
    title: string;
    desktopUrl: string;
    desktopPublicId: string;
    tabletUrl: string;
    tabletPublicId: string;
    mobileUrl: string;
    mobilePublicId: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface HeroResponse {
    success: boolean;
    items: HeroImage[];
}

export const getHeroImages = async (): Promise<HeroResponse> => {
    return apiClient<HeroResponse>("/api/admin/hero");
};

export const createHeroImage = async (formData: FormData): Promise<{ success: boolean; item: HeroImage }> => {
    return apiClient<{ success: boolean; item: HeroImage }>("/api/admin/hero", {
        method: "POST",
        body: formData,
    });
};

export const updateHeroImage = async (id: string, data: Partial<HeroImage>): Promise<{ success: boolean; item: HeroImage }> => {
    return apiClient<{ success: boolean; item: HeroImage }>(`/api/admin/hero/${id}`, {
        method: "PUT",
        body: data,
    });
};

export const deleteHeroImage = async (id: string): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/api/admin/hero/${id}`, {
        method: "DELETE",
    });
};

export const toggleHeroStatus = async (id: string, isActive: boolean): Promise<{ success: boolean; item: HeroImage }> => {
    return apiClient<{ success: boolean; item: HeroImage }>(`/api/admin/hero/${id}`, {
        method: "PATCH",
        body: { isActive },
    });
};
