import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/api/events";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  if (error) {
    toast.error("Failed to load events");
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Events"
        description="Manage all events on the platform"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </PageHeader>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-modern rounded-xl overflow-hidden h-[380px]">
              <Skeleton className="h-40 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-full mt-4" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="glass-modern rounded-xl overflow-hidden hover-glow group"
            >
              {/* Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src={event.image.startsWith("http") ? event.image : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${event.image}`}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.name)}&background=random`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <StatusBadge status={event.status} />
                </div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                  <span className="bg-gradient-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-primary-foreground">
                    ₹{event.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate flex-1">
                    {event.name}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border z-50">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>
                      {format(new Date(event.date), "MMM d, yyyy")} • {format(new Date(event.time), "h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{event.artistsBooked} artists booked</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <span className="text-muted-foreground">Tickets Sold</span>
                    <span className="font-medium text-foreground">
                      {event.ticketsSold}/{event.capacity}
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${event.capacity > 0 ? (event.ticketsSold / event.capacity) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="glass"
                  className="w-full text-xs sm:text-sm"
                  onClick={() => window.location.href = `/events/${event.id}`} // Using window.location to force navigation if Link isn't working or simple replacement
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
