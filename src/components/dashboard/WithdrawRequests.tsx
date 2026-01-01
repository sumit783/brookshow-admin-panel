import { Check, X, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWithdrawRequests, updateWithdrawalStatus, WithdrawRequest } from "@/api/stats";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithdrawalDetailsDialog } from "./WithdrawalDetailsDialog";
import { RejectionDialog } from "./RejectionDialog";

export function WithdrawRequests() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState<{
    isOpen: boolean;
    withdrawalId: string | null;
  }>({
    isOpen: false,
    withdrawalId: null,
  });

  const { data: withdrawRequests, isLoading, error } = useQuery<WithdrawRequest[]>({
    queryKey: ["withdraw-requests"],
    queryFn: getWithdrawRequests,
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
    onMutate: ({ id }) => {
      setUpdatingId(id);
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["withdraw-requests"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawal-stats"] });
      toast.success(`Request ${status === "processed" ? "approved" : "rejected"} successfully`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update request");
    },
    onSettled: () => {
      setUpdatingId(null);
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

  if (error) {
    console.error("Failed to load withdraw requests:", error);
  }

  const pendingRequests = withdrawRequests?.filter(r => r.status === "pending") || [];
  const recentRequests = withdrawRequests?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="glass-modern rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 sm:p-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-modern rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Withdraw Requests</h2>
        <span className="bg-destructive/20 text-destructive px-2 py-0.5 rounded-full text-xs font-medium">
          {pendingRequests.length} pending
        </span>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {recentRequests.map((request) => (
          <div
            key={request._id}
            onClick={() => {
              setSelectedWithdrawalId(request._id);
              setIsDetailsOpen(true);
            }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${request.userType === "artist" ? "bg-gradient-primary" : "bg-gradient-accent"
                }`}>
                {request.userType === "artist" ? (
                  <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{request.userId?.displayName || "Unknown"}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded leading-none ${request.userType === "artist"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                    }`}>
                    {request.userType === "artist" ? "Artist" : "Planner"}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded leading-none ${
                    request.status === "processed" 
                      ? "bg-green-500/20 text-green-500" 
                      : request.status === "rejected"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-amber-500/20 text-amber-500"
                  }`}>
                    {request.status === "processed" ? "Approved" : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {request.bankDetails?.upiId || request.bankDetails?.accountNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">₹{request.amount?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="flex gap-2">
                {request.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-500 disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(request._id, "processed");
                      }}
                      disabled={updatingId === request._id}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive disabled:opacity-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(request._id, "rejected");
                      }}
                      disabled={updatingId === request._id}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {recentRequests.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-4">No requests found</p>
        )}
      </div>
      <button 
        onClick={() => navigate("/withdrawals")}
        className="w-full mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View all requests →
      </button>

      <WithdrawalDetailsDialog 
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedWithdrawalId(null);
        }}
        withdrawalId={selectedWithdrawalId}
      />

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
    </div>
  );
}
