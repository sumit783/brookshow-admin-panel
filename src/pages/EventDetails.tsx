
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventById } from "@/api/events";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventInfo } from "@/components/event-details/EventInfo";
import { TicketList } from "@/components/event-details/TicketList";

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: event, isLoading, error } = useQuery({
        queryKey: ["event", id],
        queryFn: () => getEventById(id!),
        enabled: !!id,
    });

    if (error) {
        console.error("Failed to fetch event details:", error);
        toast.error("Failed to load event details");
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!event) return <div>Event not found</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <EventHeader event={event} />
            <EventInfo event={event} />
            <TicketList tickets={event.ticketTypes} />
        </div>
    );
}
