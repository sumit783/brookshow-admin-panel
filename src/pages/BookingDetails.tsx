import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingById, BookingDetails as BookingDetailsType } from "@/api/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, IndianRupee, Ticket, Users, Building2, QrCode } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function BookingDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading, error } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => getBookingById(id!),
        enabled: !!id,
    });

    if (error) {
        console.error("Failed to fetch booking details:", error);
        toast.error("Failed to load booking details");
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

    if (!booking) return <div>Booking not found</div>;

    const isArtistBooking = booking.type === "artist_booking";
    const isEventTicket = booking.type === "event_ticket";

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/bookings")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isArtistBooking ? "Artist Booking Details" : "Event Ticket Details"}
                        </h1>
                        <p className="text-muted-foreground text-sm">ID: {booking._id.slice(-12)}</p>
                    </div>
                </div>
                {/* <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${booking.paymentStatus === "paid"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : booking.paymentStatus === "partial"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-red-500/20 text-red-400"
                        }`}>
                        {booking.paymentStatus}
                    </div>
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <Card className="glass-modern border-0">
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isArtistBooking && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Booking Source</p>
                                            <p className="text-sm text-muted-foreground capitalize">{booking.source}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {isEventTicket && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Buyer Name</p>
                                            <p className="text-sm text-muted-foreground">{booking.buyerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">{booking.userId.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Phone</p>
                                            <p className="text-sm text-muted-foreground">{booking.buyerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Number of Persons</p>
                                            <p className="text-sm text-muted-foreground">{booking.persons}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Booking Information */}
                    <Card className="glass-modern border-0">
                        <CardHeader>
                            <CardTitle>Booking Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isArtistBooking && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Artist</p>
                                            <p className="text-sm text-muted-foreground">{booking.artistId.userId.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{booking.artistId.userId.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Ticket className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Service Category</p>
                                            <p className="text-sm text-muted-foreground">{booking.serviceId.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Service Period</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(booking.startAt), "MMM d, yyyy")}
                                                {booking.startAt !== booking.endAt && ` - ${format(new Date(booking.endAt), "MMM d, yyyy")}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Booking Date</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {isEventTicket && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Event</p>
                                            <p className="text-sm text-muted-foreground">{booking.eventId.title}</p>
                                            <p className="text-xs text-muted-foreground">{booking.eventId.venue}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Organizer</p>
                                            <p className="text-sm text-muted-foreground">{booking.eventId.plannerProfileId.organization}</p>
                                            <p className="text-xs text-muted-foreground">{booking.eventId.plannerProfileId.userId.displayName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Ticket className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Ticket Type</p>
                                            <p className="text-sm text-muted-foreground">{booking.ticketTypeId.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Event Date</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(booking.eventId.startAt), "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Issued Date</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(booking.issuedAt), "MMM d, yyyy 'at' h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                    {booking.scanned && booking.scannedAt && (
                                        <div className="flex items-start gap-3">
                                            <QrCode className="w-5 h-5 text-emerald-400 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Scanned</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(booking.scannedAt), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {booking.scannedPersons} of {booking.persons} persons scanned
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* QR Code for Event Tickets */}
                    {isEventTicket && booking.qrDataUrl && (
                        <Card className="glass-modern border-0">
                            <CardHeader>
                                <CardTitle>Ticket QR Code</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <img
                                    src={booking.qrDataUrl}
                                    alt="Ticket QR Code"
                                    className="w-64 h-64 border-4 border-border rounded-lg"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="glass-modern border-0 sticky top-6">
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isArtistBooking && (
                                <>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-muted-foreground">Total Amount</span>
                                        <span className="font-bold text-lg">{formatCurrency(booking.totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-muted-foreground">Advance Required</span>
                                        <span className="font-semibold text-amber-400">{formatCurrency(booking.serviceId.advance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Balance Due</span>
                                        <span className="font-semibold text-emerald-400">
                                            {formatCurrency(booking.totalPrice - booking.serviceId.advance)}
                                        </span>
                                    </div>
                                </>
                            )}
                            {isEventTicket && (
                                <>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-muted-foreground">Price per Ticket</span>
                                        <span className="font-semibold">{formatCurrency(booking.ticketTypeId.price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border">
                                        <span className="text-muted-foreground">Quantity</span>
                                        <span className="font-semibold">{booking.persons}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Total Amount</span>
                                        <span className="font-bold text-lg">{formatCurrency(booking.ticketTypeId.price * booking.persons)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`w-2 h-2 rounded-full ${booking.isValide ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                            <span className="text-muted-foreground">
                                                Ticket {booking.isValide ? 'Valid' : 'Invalid'}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
