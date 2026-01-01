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
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/api/admin/stats`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
    }

    return response.json();
};

export const getRevenueChartData = async (): Promise<RevenueChartData[]> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/revenue-chart`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch revenue chart data");
    }

    return response.json();
};

export const getBookingTrends = async (): Promise<BookingTrendData[]> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/booking-trends`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch booking trends");
    }

    return response.json();
};

export const getWithdrawRequests = async (): Promise<WithdrawRequest[]> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/withdrawals`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch withdraw requests");
    }

    return response.json();
};

export const getTransactions = async (): Promise<Transaction[]> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/transactions`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
};

export const getWithdrawalStats = async (): Promise<DashboardStat[]> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/withdrawals/stats`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch withdrawal stats");
    }

    return response.json();
};

export const updateWithdrawalStatus = async (
    id: string,
    status: "processed" | "rejected",
    adminNotes?: string
): Promise<WithdrawRequest> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/withdrawals/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            status,
            ...(status === "rejected" && { adminNotes })
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update withdrawal status to ${status}`);
    }

    return response.json();
};

export const getWithdrawRequestById = async (id: string): Promise<WithdrawRequest> => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/withdrawals/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch withdrawal request details");
    }

    return response.json();
};
