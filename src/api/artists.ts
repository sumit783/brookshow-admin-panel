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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/artists`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch artists");
    }

    return response.json();
    return response.json();
};

export const getArtistById = async (id: string): Promise<ArtistDetails> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/artists/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch artist details");
    }

    return response.json();
};

export const verifyArtist = async (id: string): Promise<void> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/artists/${id}/verify`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to verify artist");
    }
};

export const rejectArtist = async (id: string, message: string): Promise<void> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/artists/${id}/reject`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error("Failed to reject artist");
    }
};
