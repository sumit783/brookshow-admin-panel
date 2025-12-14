
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
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

const stats = [
  {
    title: "Total Requests",
    value: "156",
    subtitle: "All time requests",
    icon: Wallet,
    variant: "default" as const,
  },
  {
    title: "Pending",
    value: "24",
    subtitle: "₹8.5L total amount",
    icon: Clock,
    variant: "primary" as const,
  },
  {
    title: "Approved",
    value: "118",
    subtitle: "₹42.3L disbursed",
    icon: CheckCircle,
    variant: "success" as const,
  },
  {
    title: "Rejected",
    value: "14",
    subtitle: "Due to invalid details",
    icon: XCircle,
    variant: "accent" as const,
  },
];

const withdrawRequests = [
  {
    id: "WR001",
    name: "DJ Shadow",
    type: "artist",
    email: "djshadow@email.com",
    amount: "₹45,000",
    bankDetails: "HDFC Bank ****1234",
    requestedAt: "2024-01-15 10:30 AM",
    status: "pending",
  },
  {
    id: "WR002",
    name: "EventPro Solutions",
    type: "planner",
    email: "contact@eventpro.com",
    amount: "₹1,25,000",
    bankDetails: "ICICI Bank ****5678",
    requestedAt: "2024-01-15 08:15 AM",
    status: "pending",
  },
  {
    id: "WR003",
    name: "The Band Project",
    type: "artist",
    email: "band@project.com",
    amount: "₹32,500",
    bankDetails: "SBI ****9012",
    requestedAt: "2024-01-14 04:45 PM",
    status: "pending",
  },
  {
    id: "WR004",
    name: "StarEvents",
    type: "planner",
    email: "hello@starevents.com",
    amount: "₹85,000",
    bankDetails: "Axis Bank ****3456",
    requestedAt: "2024-01-14 02:20 PM",
    status: "pending",
  },
  {
    id: "WR005",
    name: "Acoustic Nights",
    type: "artist",
    email: "acoustic@nights.com",
    amount: "₹28,000",
    bankDetails: "Kotak Bank ****7890",
    requestedAt: "2024-01-13 11:00 AM",
    status: "approved",
  },
  {
    id: "WR006",
    name: "Prime Productions",
    type: "planner",
    email: "info@primeprod.com",
    amount: "₹2,50,000",
    bankDetails: "HDFC Bank ****2345",
    requestedAt: "2024-01-12 09:30 AM",
    status: "approved",
  },
  {
    id: "WR007",
    name: "Solo Singer Jay",
    type: "artist",
    email: "jay@singer.com",
    amount: "₹15,000",
    bankDetails: "Invalid Account",
    requestedAt: "2024-01-11 03:15 PM",
    status: "rejected",
  },
  {
    id: "WR008",
    name: "Metro Events",
    type: "planner",
    email: "metro@events.com",
    amount: "₹1,80,000",
    bankDetails: "Yes Bank ****6789",
    requestedAt: "2024-01-10 10:00 AM",
    status: "approved",
  },
];

type WithdrawRequest = typeof withdrawRequests[0];

const getColumns = () => [
  {
    header: "ID",
    accessor: "id" as keyof WithdrawRequest,
    hideOnMobile: true,
  },
  {
    header: "Name",
    accessor: (row: WithdrawRequest) => (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${row.type === "artist" ? "bg-gradient-primary" : "bg-gradient-accent"
          }`}>
          {row.type === "artist" ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Calendar className="w-4 h-4 text-accent-foreground" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground hidden sm:block">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Type",
    hideOnMobile: true,
    accessor: (row: WithdrawRequest) => (
      <span className={`text-xs px-2 py-1 rounded-full ${row.type === "artist"
          ? "bg-primary/20 text-primary"
          : "bg-accent/20 text-accent"
        }`}>
        {row.type === "artist" ? "Artist" : "Event Planner"}
      </span>
    ),
  },
  {
    header: "Amount",
    accessor: (row: WithdrawRequest) => (
      <span className="font-semibold text-foreground">{row.amount}</span>
    ),
  },
  {
    header: "Bank Details",
    accessor: "bankDetails" as keyof WithdrawRequest,
    hideOnMobile: true,
  },
  {
    header: "Requested",
    hideOnMobile: true,
    accessor: (row: WithdrawRequest) => (
      <span className="text-sm text-muted-foreground">{row.requestedAt}</span>
    ),
  },
  {
    header: "Status",
    accessor: (row: WithdrawRequest) => (
      <StatusBadge status={row.status as "pending" | "approved" | "rejected"} />
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
        >
          <Eye className="w-4 h-4" />
        </Button>
        {row.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-500"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    ),
  },
];

export default function WithdrawRequests() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "artist" | "planner">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = withdrawRequests.filter((request) => {
    const matchesStatus = filter === "all" || request.status === filter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
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
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            {...stat}
            className="fade-in-scale"
          />
        ))}
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
            {(["all", "pending", "approved", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === status
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <DataTable columns={getColumns()} data={filteredRequests} />
      </div>
    </>
  );
}
