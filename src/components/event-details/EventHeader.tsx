
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EventDetails } from "@/api/events";

interface EventHeaderProps {
    event: EventDetails;
}

export function EventHeader({ event }: EventHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/events")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{event.title}</h1>
                    <p className="text-muted-foreground text-sm">Organized by Planner ID: {event.plannerProfileId}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <StatusBadge status={event.published ? "active" : "pending"} />
                {!event.published && <span className="text-muted-foreground text-sm">(Draft)</span>}
            </div>
        </div>
    );
}
