import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawRequestById, WithdrawRequest, WalletTransaction } from "@/api/stats";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Wallet, 
    Calendar, 
    Banknote, 
    CreditCard, 
    Clock, 
    Mail, 
    Phone, 
    Hash,
    Shield,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle,
    XCircle
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWithdrawalStatus } from "@/api/stats";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RejectionDialog } from "@/components/dashboard/RejectionDialog";
import { useState } from "react";

interface WithdrawalDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    withdrawalId: string | null;
}

export function WithdrawalDetailsDialog({
    isOpen,
    onClose,
    withdrawalId,
}: WithdrawalDetailsDialogProps) {
    const queryClient = useQueryClient();
    const [rejectionDialog, setRejectionDialog] = useState<{
        isOpen: boolean;
        withdrawalId: string | null;
    }>({
        isOpen: false,
        withdrawalId: null,
    });

    const { data: withdrawal, isLoading, error } = useQuery({
        queryKey: ["withdrawal-request", withdrawalId],
        queryFn: () => getWithdrawRequestById(withdrawalId!),
        enabled: !!withdrawalId && isOpen,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ 
            id, 
            status, 
            adminNotes 
        }: { 
            id: string; 
            status: "processed" | "rejected";
            adminNotes?: string;
        }) => updateWithdrawalStatus(id, status, adminNotes),
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ["withdraw-requests"] });
            queryClient.invalidateQueries({ queryKey: ["withdrawal-stats"] });
            queryClient.invalidateQueries({ queryKey: ["withdrawal-request", withdrawalId] });
            toast.success(`Request ${status === "processed" ? "approved" : "rejected"} successfully`);
            if (status === "processed" || status === "rejected") {
                // Keep dialog open to show updated status, or close it? 
                // Let's keep it open for now so they can see the change.
            }
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to update request");
        },
        onSettled: () => {
            setRejectionDialog({ isOpen: false, withdrawalId: null });
        },
    });

    const handleUpdateStatus = (id: string, status: "processed" | "rejected", adminNotes?: string) => {
        if (status === "rejected" && !adminNotes) {
            setRejectionDialog({ isOpen: true, withdrawalId: id });
        } else {
            updateStatusMutation.mutate({ id, status, adminNotes });
        }
    };

    const isTransaction = (tx: string | WalletTransaction | undefined): tx is WalletTransaction => {
        return typeof tx === 'object' && tx !== null && '_id' in tx;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-modern border-border">
                <DialogHeader className="mb-4">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Wallet className="w-5 h-5 text-primary" />
                        Withdrawal Request Details
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg">
                        Failed to load withdrawal details. Please try again.
                    </div>
                ) : withdrawal ? (
                    <div className="space-y-8">
                        {/* Transaction Header */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl bg-secondary/30">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-foreground">₹{withdrawal.amount?.toLocaleString()}</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
                                <Badge 
                                    className={`text-sm py-1 px-3 ${
                                        withdrawal.status === "processed" 
                                            ? "bg-green-500/20 text-green-500" 
                                            : withdrawal.status === "rejected"
                                            ? "bg-destructive/20 text-destructive"
                                            : "bg-amber-500/20 text-amber-500"
                                    }`}
                                >
                                    {withdrawal.status?.toUpperCase() || "PENDING"}
                                </Badge>
                            </div>
                        </div>

                        {/* User & Request Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                    <User className="w-4 h-4" /> USER INFORMATION
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                                            {withdrawal.userId?.displayName?.[0] || "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium">{withdrawal.userId?.displayName || "N/A"}</p>
                                            <Badge variant="outline" className="text-[10px] h-4">
                                                {withdrawal.userType?.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        {withdrawal.userId?.email || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                                        <Phone className="w-3.5 h-3.5" />
                                        {withdrawal.userId?.phone || "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-4 h-4" /> REQUEST TIMELINE
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" /> Created
                                        </span>
                                        <span>{new Date(withdrawal.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5" /> Updated
                                        </span>
                                        <span>{new Date(withdrawal.updatedAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Hash className="w-3.5 h-3.5" /> Request ID
                                        </span>
                                        <span className="font-mono text-[10px]">{withdrawal._id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* Bank Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                <CreditCard className="w-4 h-4" /> SETTLEMENT METHOD
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border/50 bg-secondary/10">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Account Type</p>
                                    <p className="font-medium">{withdrawal.bankDetails?.upiId ? "UPI" : "Bank Transfer"}</p>
                                </div>
                                {withdrawal.bankDetails?.upiId ? (
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">UPI ID</p>
                                        <p className="font-medium text-primary">{withdrawal.bankDetails.upiId}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Account Holder</p>
                                            <p className="font-medium">{withdrawal.bankDetails?.accountHolderName || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Account number</p>
                                            <p className="font-mono">{withdrawal.bankDetails?.accountNumber || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">IFSC Code</p>
                                            <p className="font-mono">{withdrawal.bankDetails?.ifscCode || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Bank Name</p>
                                            <p className="font-medium">{withdrawal.bankDetails?.bankName || "N/A"}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Ledger Transaction */}
                        {isTransaction(withdrawal.transactionId) && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                                    <Banknote className="w-4 h-4" /> LEDGER TRANSACTION
                                </h3>
                                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium flex items-center gap-2">
                                                {withdrawal.transactionId.type === "debit" ? (
                                                    <ArrowUpRight className="w-4 h-4 text-destructive" />
                                                ) : (
                                                    <ArrowDownLeft className="w-4 h-4 text-green-500" />
                                                )}
                                                {withdrawal.transactionId.description}
                                            </p>
                                            <p className="text-[10px] font-mono text-muted-foreground">ID: {withdrawal.transactionId._id}</p>
                                        </div>
                                        <Badge className={
                                            withdrawal.transactionId.status === "completed" 
                                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/10" 
                                                : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10"
                                        }>
                                            {withdrawal.transactionId.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-primary/10">
                                        <span className="text-muted-foreground">Ledger Amount</span>
                                        <span className="font-bold">₹{withdrawal.transactionId.amount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {withdrawal.status === "pending" && (
                            <div className="flex gap-3 pt-6 border-t border-border/50">
                                <Button 
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => handleUpdateStatus(withdrawal._id, "processed")}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Request
                                </Button>
                                <Button 
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleUpdateStatus(withdrawal._id, "rejected")}
                                    disabled={updateStatusMutation.isPending}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Request
                                </Button>
                            </div>
                        )}
                    </div>
                ) : null}
            </DialogContent>

            <RejectionDialog
                isOpen={rejectionDialog.isOpen}
                onClose={() => setRejectionDialog({ isOpen: false, withdrawalId: null })}
                onConfirm={(reason) => {
                    if (rejectionDialog.withdrawalId) {
                        handleUpdateStatus(rejectionDialog.withdrawalId, "rejected", reason);
                    }
                }}
                title="Reject Withdrawal Request"
                description="Please provide a reason for rejecting this withdrawal request. This note will be recorded for reference."
                isSubmitting={updateStatusMutation.isPending}
            />
        </Dialog>
    );
}
