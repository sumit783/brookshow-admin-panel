import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Search,
  Filter,
  Check,
  X,
  Eye
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DashboardStat, 
  getWithdrawalStats, 
  WithdrawRequest, 
  getWithdrawRequests,
  updateWithdrawalStatus 
} from "@/api/stats";
import { toast } from "sonner";
import { WithdrawalDetailsDialog } from "@/components/dashboard/WithdrawalDetailsDialog";
import { RejectionDialog } from "@/components/dashboard/RejectionDialog";

const iconMap = {
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
};

const getColumns = (
  onUpdateStatus: (id: string, status: "processed" | "rejected") => void,
  onViewDetails: (id: string) => void,
  updatingId: string | null
) => [
  {
    header: "ID",
    accessor: (row: WithdrawRequest) => <span className="text-xs font-mono">{row._id.slice(-6).toUpperCase()}</span>,
    hideOnMobile: true,
  },
  {
    header: "Name",
    accessor: (row: WithdrawRequest) => (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${row.userType === "artist" ? "bg-gradient-primary" : "bg-gradient-accent"
          }`}>
          {row.userType === "artist" ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Calendar className="w-4 h-4 text-accent-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{row.userId?.displayName || "Unknown"}</p>
          <p className="text-xs text-muted-foreground hidden sm:block">{row.userId?.email || "N/A"}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Type",
    hideOnMobile: true,
    accessor: (row: WithdrawRequest) => (
      <span className={`text-xs px-2 py-1 rounded-full ${row.userType === "artist"
          ? "bg-primary/20 text-primary"
          : "bg-accent/20 text-accent"
        }`}>
        {row.userType === "artist" ? "Artist" : "Event Planner"}
      </span>
    ),
  },
  {
    header: "Amount",
    accessor: (row: WithdrawRequest) => (
      <span className="font-semibold text-foreground">₹{row.amount?.toLocaleString() || "0"}</span>
    ),
  },
  {
    header: "Bank Details",
    accessor: (row: WithdrawRequest) => row.bankDetails?.upiId || row.bankDetails?.accountNumber || "N/A",
    hideOnMobile: true,
  },
  {
    header: "Requested",
    hideOnMobile: true,
    accessor: (row: WithdrawRequest) => (
      <span className="text-sm text-muted-foreground">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}</span>
    ),
  },
  {
    header: "Status",
    accessor: (row: WithdrawRequest) => (
      <StatusBadge status={row.status === "processed" ? "approved" : row.status} />
    ),
  },
  {
    header: "Actions",
    accessor: (row: WithdrawRequest) => (
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-secondary"
          onClick={() => onViewDetails(row._id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        {row.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-green-500 hover:bg-green-500/20 disabled:opacity-50"
              onClick={() => onUpdateStatus(row._id, "processed")}
              disabled={updatingId === row._id}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/20 disabled:opacity-50"
              onClick={() => onUpdateStatus(row._id, "rejected")}
              disabled={updatingId === row._id}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    ),
  },
];

export default function WithdrawRequests() {
  const [filter, setFilter] = useState<"all" | "pending" | "processed" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "artist" | "planner">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
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

  const { data: stats = [], isLoading: isLoadingStats } = useQuery<DashboardStat[]>({
    queryKey: ["withdrawal-stats"],
    queryFn: getWithdrawalStats,
  });

  const { data: withdrawRequests = [], isLoading: isLoadingRequests } = useQuery<WithdrawRequest[]>({
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

  const handleViewDetails = (id: string) => {
    setSelectedWithdrawalId(id);
    setIsDetailsOpen(true);
  };

  const filteredRequests = withdrawRequests.filter((request) => {
    const matchesStatus = filter === "all" || request.status === filter;
    const matchesType = typeFilter === "all" || request.userType === typeFilter;
    const matchesSearch = (request.userId?.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request._id || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <>
      <PageHeader
        title="Withdraw Requests"
        description="Manage withdrawal requests from artists and event planners."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {isLoadingStats ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-modern rounded-xl p-4 sm:p-6 h-24 sm:h-32">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          stats.map((stat, index) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap] || Wallet;
            return (
              <StatsCard
                key={index}
                {...stat}
                icon={Icon}
                className="fade-in-scale"
              />
            );
          })
        )}
      </div>

      {/* Filters */}
      <div className="glass-modern rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(["all", "pending", "processed", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === status
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {status === "processed" ? "Approved" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {(["all", "artist", "planner"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${typeFilter === type
                    ? "bg-gradient-accent text-accent-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {type === "artist" && <User className="w-4 h-4" />}
                {type === "planner" && <Calendar className="w-4 h-4" />}
                {type === "all" && <Filter className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {type === "all" ? "All Types" : type === "artist" ? "Artists" : "Planners"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-modern rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            All Requests ({filteredRequests.length})
          </h2>
        </div>
        {isLoadingRequests ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable columns={getColumns(handleUpdateStatus, handleViewDetails, updatingId)} data={filteredRequests} />
        )}
      </div>

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
    </>
  );
}
