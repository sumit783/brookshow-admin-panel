
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Ticket,
  Users,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  IndianRupee,
  Mic2
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBookingStats, getBookings, Booking } from "@/api/bookings";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const iconMap: Record<string, any> = {
  Ticket: Ticket,
  Mic2: Mic2,
  IndianRupee: IndianRupee,
  Calendar: Calendar,
  TrendingUp: TrendingUp,
  Users: Users
};

export default function Bookings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ticket" | "artist">("all");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["bookingStats"],
    queryFn: getBookingStats,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || booking.bookingType === filterType;

    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      header: "Booking ID",
      accessor: (row: Booking) => (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.bookingType === "ticket" ? "bg-blue-500/20" : "bg-purple-500/20"
            }`}>
            {row.bookingType === "ticket" ? (
              <Ticket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            ) : (
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            )}
          </div>
          <span className="font-medium text-foreground text-xs sm:text-sm">{row.id.slice(-8)}</span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessor: (row: Booking) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs sm:text-sm truncate">{row.customerName}</p>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">{row.email !== "N/A" ? row.email : row.phone}</p>
        </div>
      ),
    },
    {
      header: "Event",
      accessor: (row: Booking) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs sm:text-sm truncate">{row.eventName}</p>
          <p className="text-xs text-muted-foreground truncate">{row.artistName != "N/A" ? row.artistName : ""}</p>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      header: "Type",
      accessor: (row: Booking) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.bookingType === "ticket"
          ? "bg-blue-500/20 text-blue-400"
          : "bg-purple-500/20 text-purple-400"
          }`}>
          {row.bookingType === "ticket" ? (row.quantity !== "N/A" ? `×${row.quantity}` : "Ticket") : row.service}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      header: "Amount",
      accessor: (row: Booking) => (
        <span className="text-foreground font-medium text-xs sm:text-sm">{formatCurrency(row.totalAmount)}</span>
      ),
    },
    {
      header: "Advance",
      accessor: (row: Booking) => (
        <span className="text-foreground font-medium text-xs sm:text-sm">{formatCurrency(row.advance)}</span>
      ),
    },
    {
      header: "",
      accessor: (row: Booking) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.location.href = `/bookings/${row.id}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Manage ticket and artist bookings"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        {/* <Button variant="glass" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button> */}
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-modern p-6 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))
        ) : (
          stats?.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Ticket;
            return (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value.toString()}
                subtitle={stat.subtitle}
                icon={IconComponent}
                variant={stat.variant}
              />
            );
          })
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All" },
          { value: "ticket", label: "Tickets" },
          { value: "artist", label: "Artists" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value as typeof filterType)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterType === tab.value
              ? "bg-gradient-primary text-primary-foreground shadow-glow"
              : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {bookingsLoading ? (
        <div className="glass-modern rounded-xl p-6 space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredBookings} />
      )}
    </>
  );
}
