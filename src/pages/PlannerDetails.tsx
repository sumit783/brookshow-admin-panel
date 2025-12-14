import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlannerById, verifyPlanner, rejectPlanner } from "@/api/planners";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Mail,
    Phone,
    Globe,
    Calendar,
    Check,
    X,
    ArrowLeft,
    Wallet,
    MapPin,
    Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { RejectionDialog } from "@/components/dashboard/RejectionDialog";
import { useState } from "react";

export default function PlannerDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const { data: planner, isLoading, error } = useQuery({
        queryKey: ["planner", id],
        queryFn: () => getPlannerById(id!),
        enabled: !!id,
    });

    const verifyMutation = useMutation({
        mutationFn: verifyPlanner,
        onSuccess: () => {
            toast.success("Planner verified successfully!");
            queryClient.invalidateQueries({ queryKey: ["planner", id] });
            queryClient.invalidateQueries({ queryKey: ["planners"] });
        },
        onError: () => {
            toast.error("Failed to verify planner");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => rejectPlanner(id, message),
        onSuccess: () => {
            toast.success("Planner rejected");
            queryClient.invalidateQueries({ queryKey: ["planner", id] });
            queryClient.invalidateQueries({ queryKey: ["planners"] });
            setIsRejectDialogOpen(false);
        },
        onError: () => {
            toast.error("Failed to reject planner");
        },
    });

    if (error) {
        console.error("Failed to fetch planner details:", error);
        toast.error("Failed to load planner details");
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!planner) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <PageHeader
                        title="Planner Details"
                        description={`View and manage ${planner.userId.displayName}'s profile`}
                    />
                </div>
                <div className="flex gap-2">
                    {planner.verificationStatus === "pending" && (
                        <>
                            <Button
                                variant="success"
                                className="gap-2"
                                onClick={handleVerify}
                                disabled={verifyMutation.isPending}
                            >
                                <Check className="w-4 h-4" />
                                Approve Planner
                            </Button>
                            <Button
                                variant="destructive"
                                className="gap-2"
                                onClick={() => setIsRejectDialogOpen(true)}
                                disabled={rejectMutation.isPending}
                            >
                                <X className="w-4 h-4" />
                                Reject Planner
                            </Button>
                        </>
                    )}
                    {planner.verificationStatus !== "pending" && (
                        <div className="px-4 py-2 bg-secondary rounded-lg font-medium">
                            Status: <span className="capitalize">{planner.verificationStatus}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <Card className="glass-modern border-0">
                        <div className="relative h-32 bg-gradient-secondary rounded-t-xl" />
                        <CardContent className="relative pt-0 pb-6">
                            <div className="flex flex-col sm:flex-row gap-6 -mt-12 px-2">
                                <Avatar className="w-32 h-32 border-4 border-card bg-secondary shadow-lg">
                                    <AvatarImage
                                        src={planner.profileImage?.startsWith("http") ? planner.profileImage : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${planner.profileImage}`}
                                        alt={planner.userId.displayName}
                                    />
                                    <AvatarFallback>{planner.userId.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 pt-14 sm:pt-16 space-y-2">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <h2 className="text-2xl font-bold">{planner.userId.displayName}</h2>
                                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{planner.organization || "No Organization"}</span>
                                            </div>
                                        </div>
                                        <StatusBadge status={planner.verificationStatus === "verified" ? "approved" : planner.verificationStatus} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Events */}
                    <Card className="glass-modern border-0">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Managed Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {planner.events.length > 0 ? (
                                <div className="space-y-4">
                                    {planner.events.map((event) => (
                                        <div key={event._id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
                                            <div>
                                                <h4 className="font-semibold">{event.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {event.venue}, {event.city}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{format(new Date(event.startAt), "MMM d, yyyy")}</div>
                                                <div className="text-xs text-muted-foreground">{event.published ? "Published" : "Draft"}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No events found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card className="glass-modern border-0">
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate">{planner.userId.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{planner.userId.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate">{window.location.host}/planners/{id}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Wallet / Stats */}
                    <Card className="glass-modern border-0">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-primary" />
                                Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-xl bg-gradient-brand text-primary-foreground mb-4">
                                <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
                                <p className="text-2xl font-bold">₹{planner.walletBalance.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span>{format(new Date(planner.createdAt), "MMMM d, yyyy")}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {planner.verificationNote && (
                        <Card className="glass-modern border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">Verification Note</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground italic">"{planner.verificationNote}"</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <RejectionDialog
                isOpen={isRejectDialogOpen}
                onClose={() => setIsRejectDialogOpen(false)}
                onConfirm={handleReject}
                title="Reject Planner"
                isSubmitting={rejectMutation.isPending}
            />
        </div>
    );
}
