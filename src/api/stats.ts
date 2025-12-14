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

export interface WithdrawRequest {
    id: number;
    name: string;
    type: "artist" | "planner";
    amount: string;
    bankDetails: string;
    requestedAt: string;
    status: "pending" | "approved" | "rejected";
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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/withdraw-requests`, {
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
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
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
