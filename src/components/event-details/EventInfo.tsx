
import { EventDetails } from "@/api/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface EventInfoProps {
    event: EventDetails;
}

export function EventInfo({ event }: EventInfoProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="glass-modern border-0">
                    <div className="relative h-64 sm:h-80 rounded-t-xl overflow-hidden group">
                        <img
                            src={event.banner ? (event.banner.startsWith("http") ? event.banner : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${event.banner}`) : event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(event.title)}&background=random`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2 shadow-sm">{event.title}</h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="w-4 h-4" />
                                <p className="font-medium">{event.venue}, {event.city}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="glass-modern border-0">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-lg">
                            {event.description}
                        </p>
                    </CardContent>
                </Card>

                {/* Map Section */}
                <Card className="glass-modern border-0 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Location</CardTitle>
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open in Maps
                            </a>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 h-[300px] w-full relative">
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${event.lat},${event.lng}&z=15&output=embed`}
                            className="w-full h-full filter grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="glass-modern border-0 sticky top-6">
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Date</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(event.startAt), "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Time</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(event.startAt), "h:mm a")} - {format(new Date(event.endAt), "h:mm a")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">
                                    {event.venue} <br />
                                    {event.address} <br />
                                    {event.city}, {event.state}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
