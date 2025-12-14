export interface BookingStat {
    title: string;
    value: string | number;
    icon: string;
    subtitle: string;
    variant: "default" | "primary" | "accent" | "success";
}

// For list view (simplified)
export interface Booking {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    eventName: string;
    artistName: string;
    type: string;
    service: string;
    quantity: string;
    totalAmount: number;
    advance: number;
    bookingDate: string;
    eventDate: string;
    status: "confirmed" | "pending" | "cancelled" | "completed";
    paymentStatus: "paid" | "unpaid" | "partial";
    bookingType: "artist" | "ticket";
}

// For detail view (full nested structure)
export interface ArtistBookingDetails {
    _id: string;
    artistId: {
        _id: string;
        userId: {
            _id: string;
            email: string;
            phone: string;
            displayName: string;
        };
        profileImage: string;
    };
    serviceId: {
        _id: string;
        category: string;
        unit: string;
        advance: number;
    };
    eventId: null;
    source: string;
    startAt: string;
    endAt: string;
    totalPrice: number;
    status: "confirmed" | "pending" | "cancelled" | "completed";
    paymentStatus: "paid" | "unpaid" | "partial";
    createdAt: string;
    updatedAt: string;
    type: "artist_booking";
}

export interface EventTicketDetails {
    _id: string;
    ticketTypeId: {
        _id: string;
        title: string;
        price: number;
    };
    eventId: {
        _id: string;
        plannerProfileId: {
            _id: string;
            userId: {
                _id: string;
                email: string;
                phone: string;
                displayName: string;
            };
            organization: string;
            logoUrl: string;
        };
        title: string;
        venue: string;
        startAt: string;
    };
    userId: {
        _id: string;
        email: string;
        phone: string;
        displayName: string;
    };
    buyerName: string;
    buyerPhone: string;
    persons: number;
    scannedPersons: number;
    isValide: boolean;
    issuedAt: string;
    scanned: boolean;
    scannedAt: string | null;
    qrPayload: {
        ticketId: string;
        eventId: string;
        buyerName: string;
        quantity: number;
        timestamp: number;
    };
    qrDataUrl: string;
    createdAt: string;
    updatedAt: string;
    type: "event_ticket";
}

export type BookingDetails = ArtistBookingDetails | EventTicketDetails;

export const getBookingStats = async (): Promise<BookingStat[]> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/booking-stats`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch booking stats");
    }

    return response.json();
};

export const getBookings = async (): Promise<Booking[]> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/bookings`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return response.json();
};

export const getBookingById = async (id: string): Promise<BookingDetails> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/bookings/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch booking details");
    }

    return response.json();
};
