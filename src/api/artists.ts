import { apiClient } from "./apiClient";

export interface ArtistUser {
    _id: string;
    email: string;
    phone: string;
    displayName: string;
}

export interface ArtistLocation {
    city: string;
    state: string;
    country: string;
}

export interface Artist {
    _id: string;
    userId: ArtistUser;
    location: ArtistLocation;
    profileImage: string;
    category: string[];
    verificationStatus: "pending" | "verified" | "rejected";
    isVerified: boolean;
}

export interface ArtistDetails extends Artist {
    wallet: {
        balance: number;
        pendingAmount: number;
        transactions: any[];
    };
    bio: string;
    bookings: any[];
    whatsappUpdates: boolean;
    verificationNote: string;
    calendar: any[];
    createdAt: string;
    updatedAt: string;
}

export const getArtists = async (): Promise<Artist[]> => {
    return apiClient<Artist[]>("/api/admin/artists");
};

export const getArtistById = async (id: string): Promise<ArtistDetails> => {
    return apiClient<ArtistDetails>(`/api/admin/artists/${id}`);
};

export const verifyArtist = async (id: string): Promise<void> => {
    return apiClient<void>(`/api/admin/artists/${id}/verify`, {
        method: "PUT",
    });
};

export const rejectArtist = async (id: string, message: string): Promise<void> => {
    return apiClient<void>(`/api/admin/artists/${id}/reject`, {
        method: "PUT",
        body: { message },
    });
};
