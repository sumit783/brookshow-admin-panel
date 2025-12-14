export interface Event {
    id: string;
    name: string;
    venue: string;
    date: string;
    time: string; // ISO string in the example, but likely used as a string in UI
    capacity: number;
    ticketsSold: number;
    artistsBooked: number;
    status: "active" | "completed" | "cancelled";
    image: string;
    price: number;
}


export interface TicketType {
    _id: string;
    eventId: string;
    title: string;
    price: number;
    quantity: number;
    sold: number;
    salesStart: string;
    salesEnd: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventDetails extends Event {
    _id: string; // The ID in the details response uses _id, but list used id. We'll handle both or prioritize _id
    plannerProfileId: string;
    title: string; // name in list, title in details
    description: string;
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    startAt: string; // date/time in list, startAt/endAt in details
    endAt: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    ticketTypes: TicketType[];
    banner?: string;
}

export const getEventById = async (id: string): Promise<EventDetails> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/events/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch event details");
    }

    return response.json();
};

export const getEvents = async (): Promise<Event[]> => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const apiKey = import.meta.env.VITE_API_KEY || "";
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${baseUrl}/api/admin/events`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch events");
    }

    return response.json();
};
