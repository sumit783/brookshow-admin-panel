import { apiClient } from "./apiClient";

export interface DashboardStat {
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    variant: "default" | "primary" | "accent" | "success";
}

export interface StatsResponse {
    stats: DashboardStat[];
}

export interface RevenueChartData {
    month: string;
    revenue: number;
    bookings: number;
}

export interface BookingTrendData {
    month: string;
    tickets: number;
    artists: number;
}

export interface WalletTransaction {
    _id: string;
    ownerId: string;
    ownerType: string;
    type: string;
    amount: number;
    source: string;
    referenceId: string | null;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface WithdrawRequest {
    _id: string;
    userId: {
        _id: string;
        displayName: string;
        email?: string;
        phone?: string;
        role?: string;
    };
    userType: "artist" | "planner";
    amount: number;
    status: "pending" | "processed" | "rejected";
    bankDetails?: {
        upiId?: string;
        accountNumber?: string;
        ifscCode?: string;
        bankName?: string;
        accountHolderName?: string;
    };
    transactionId?: string | WalletTransaction;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface Transaction {
    id: string;
    eventName: string;
    artistName: string;
    advancePayment: number;
    totalPayment: number;
    receivedAmount: number;
    pendingAmount: number;
    date: string;
    status: "completed" | "pending" | "cancelled";
    type: "incoming" | "outgoing";
}

export const getDashboardStats = async (): Promise<DashboardStat[]> => {
    return apiClient<DashboardStat[]>("/api/admin/stats");
};

export const getRevenueChartData = async (): Promise<RevenueChartData[]> => {
    return apiClient<RevenueChartData[]>("/api/admin/revenue-chart");
};

export const getBookingTrends = async (): Promise<BookingTrendData[]> => {
    return apiClient<BookingTrendData[]>("/api/admin/booking-trends");
};

export const getWithdrawRequests = async (): Promise<WithdrawRequest[]> => {
    return apiClient<WithdrawRequest[]>("/api/admin/withdrawals");
};

export const getTransactions = async (): Promise<WalletTransaction[]> => {
    return apiClient<WalletTransaction[]>("/api/admin/transactions");
};

export const getWithdrawalStats = async (): Promise<DashboardStat[]> => {
    return apiClient<DashboardStat[]>("/api/admin/withdrawals/stats");
};

export const updateWithdrawalStatus = async (
    id: string,
    status: "processed" | "rejected",
    adminNotes?: string
): Promise<WithdrawRequest> => {
    return apiClient<WithdrawRequest>(`/api/admin/withdrawals/${id}/status`, {
        method: "PUT",
        body: {
            status,
            ...(status === "rejected" && { adminNotes })
        },
    });
};

export const getWithdrawRequestById = async (id: string): Promise<WithdrawRequest> => {
    return apiClient<WithdrawRequest>(`/api/admin/withdrawals/${id}`);
};

export interface Commission {
    _id: string;
    artistBookingCommission: number;
    ticketSellCommission: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CommissionResponse {
    success: boolean;
    commission: Commission;
}

export const getCommissionData = async (): Promise<CommissionResponse> => {
    return apiClient<CommissionResponse>("/api/commissions/");
};

export const updateCommission = async (
    id: string,
    data: {
        artistBookingCommission: number;
        ticketSellCommission: number;
    }
): Promise<CommissionResponse> => {
    return apiClient<CommissionResponse>(`/api/commissions/${id}`, {
        method: "PUT",
        body: data,
    });
};
