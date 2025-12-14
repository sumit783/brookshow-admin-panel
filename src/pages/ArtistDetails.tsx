import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getArtistById, verifyArtist, rejectArtist } from "@/api/artists";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Wallet, CheckCircle, XCircle, Music } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { toast } from "sonner";

import { RejectionDialog } from "@/components/dashboard/RejectionDialog";
import { useState } from "react";

export default function ArtistDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const { data: artist, isLoading, error } = useQuery({
        queryKey: ["artist", id],
        queryFn: () => getArtistById(id!),
        enabled: !!id,
    });

    const verifyMutation = useMutation({
        mutationFn: verifyArtist,
        onSuccess: () => {
            toast.success("Artist verified successfully!");
            queryClient.invalidateQueries({ queryKey: ["artist", id] });
            queryClient.invalidateQueries({ queryKey: ["artists"] });
        },
        onError: () => {
            toast.error("Failed to verify artist");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => rejectArtist(id, message),
        onSuccess: () => {
            toast.success("Artist rejected");
            queryClient.invalidateQueries({ queryKey: ["artist", id] });
            queryClient.invalidateQueries({ queryKey: ["artists"] });
            setIsRejectDialogOpen(false);
        },
        onError: () => {
            toast.error("Failed to reject artist");
        },
    });

    if (error) {
        console.error("Failed to fetch artist details:", error);
        toast.error("Failed to load artist details");
    }

    const handleVerify = () => {
        if (id) verifyMutation.mutate(id);
    };

    const handleReject = (reason: string) => {
        if (id) {
            rejectMutation.mutate({ id, message: reason });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] md:col-span-1 rounded-xl" />
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!artist) return <div>Artist not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Artist Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-modern rounded-xl p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <img
                                src={artist.profileImage.startsWith("http") ? artist.profileImage : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${artist.profileImage}`}
                                alt={artist.userId.displayName}
                                className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-lg mx-auto"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.userId.displayName)}&background=random`;
                                }}
                            />
                            <div className="absolute bottom-2 right-2">
                                <StatusBadge status={artist.verificationStatus === "verified" ? "approved" : artist.verificationStatus} />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">{artist.userId.displayName}</h2>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                            <Music className="w-4 h-4" />
                            <span>{artist.category.join(", ")}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {artist.verificationStatus === "pending" && (
                                <>
                                    <Button onClick={handleVerify} className="w-full bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Artist
                                    </Button>
                                    <Button onClick={() => setIsRejectDialogOpen(true)} variant="destructive" className="w-full">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Artist
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="glass-modern rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Contact Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{artist.userId.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">{artist.userId.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground flex-1">
                                    {artist.location.city}, {artist.location.state}, {artist.location.country}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Wallet & Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="glass-modern rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Wallet Balance</span>
                            </div>
                            <p className="text-2xl font-bold">₹{artist.wallet.balance.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="glass-modern rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Total Bookings</span>
                            </div>
                            <p className="text-2xl font-bold">{artist.bookings.length}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="glass-modern rounded-xl p-6">
                        <h3 className="font-semibold text-lg mb-4">About</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {artist.bio || "No biography provided."}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="glass-modern rounded-xl p-6">
                        <h3 className="font-semibold text-lg mb-4">Additional Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block mb-1">Member Since</span>
                                <span className="font-medium">{new Date(artist.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">WhatsApp Updates</span>
                                <span className={`font-medium ${artist.whatsappUpdates ? 'text-green-500' : 'text-muted-foreground'}`}>
                                    {artist.whatsappUpdates ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Last Updated</span>
                                <span className="font-medium">{new Date(artist.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RejectionDialog
                isOpen={isRejectDialogOpen}
                onClose={() => setIsRejectDialogOpen(false)}
                onConfirm={handleReject}
                title="Reject Artist"
                isSubmitting={rejectMutation.isPending}
            />
        </div>
    );
}
