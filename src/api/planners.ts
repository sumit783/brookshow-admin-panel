export interface PlannerUser {
    _id: string;
    email: string;
    phone: string;
    displayName: string;
    role: string;
}

export interface Planner {
    _id: string;
    userId: PlannerUser;
    profileImage: string;
    verificationStatus: "pending" | "verified" | "rejected";
    isVerified: boolean;
    organization?: string;
}

export interface PlannerDetails extends Planner {
    logoUrl?: string;
    verified: boolean;
    verificationNote: string;
    walletBalance: number;
    createdAt: string;
    updatedAt: string;
    events: {
        _id: string;
        title: string;
        description: string;
        venue: string;
        city: string;
        state: string;
        startAt: string;
        endAt: string;
        published: boolean;
    }[];
}

export const getPlanners = async (): Promise<Planner[]> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/planners`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch planners");
    }

    return response.json();
};

export const getPlannerById = async (id: string): Promise<PlannerDetails> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/planners/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch planner details");
    }

    return response.json();
};

export const verifyPlanner = async (id: string): Promise<void> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/planners/${id}/verify`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to verify planner");
    }
};

export const rejectPlanner = async (id: string, message: string): Promise<void> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/planners/${id}/reject`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error("Failed to reject planner");
    }
};
