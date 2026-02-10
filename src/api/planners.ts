import { apiClient } from "./apiClient";

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
    return apiClient<Planner[]>("/api/admin/planners");
};

export const getPlannerById = async (id: string): Promise<PlannerDetails> => {
    return apiClient<PlannerDetails>(`/api/admin/planners/${id}`);
};

export const verifyPlanner = async (id: string): Promise<void> => {
    return apiClient<void>(`/api/admin/planners/${id}/verify`, {
        method: "PUT",
    });
};

export const rejectPlanner = async (id: string, message: string): Promise<void> => {
    return apiClient<void>(`/api/admin/planners/${id}/reject`, {
        method: "PUT",
        body: { message },
    });
};
