import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingsChart } from "@/components/dashboard/BookingsChart";
import { WithdrawRequests } from "@/components/dashboard/WithdrawRequests";
import {
  Users,
  Calendar,
  Ticket,
  IndianRupee,
  Music,
  Wallet,
  ArrowRightLeft,
  ChevronRight,
  LucideIcon,
  Edit
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getCommissionData, updateCommission } from "@/api/stats";
import { StatsSkeleton } from "@/components/skeletons/StatsSkeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Calendar,
  Ticket,
  IndianRupee,
};
export default function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [artistCommission, setArtistCommission] = useState("");
  const [ticketCommission, setTicketCommission] = useState("");
  const [revenueSplit, setRevenueSplit] = useState<{ total: number; title: string } | null>(null);

  const parseRevenue = (val: string | number) => {
    if (typeof val === 'number') return val;
    return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: commissionData, isLoading: isLoadingCommission } = useQuery({
    queryKey: ["commission-data"],
    queryFn: getCommissionData,
  });

  const updateCommissionMutation = useMutation({
    mutationFn: (data: { artistBookingCommission: number; ticketSellCommission: number }) =>
      updateCommission(commissionData?.commission?._id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-data"] });
      toast.success("Commission updated successfully");
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update commission");
    },
  });

  const handleEditClick = () => {
    setArtistCommission(commissionData?.commission?.artistBookingCommission?.toString() || "0");
    setTicketCommission(commissionData?.commission?.ticketSellCommission?.toString() || "0");
    setIsEditDialogOpen(true);
  };

  const handleSaveCommission = () => {
    const artistValue = parseFloat(artistCommission);
    const ticketValue = parseFloat(ticketCommission);

    if (isNaN(artistValue) || isNaN(ticketValue)) {
      toast.error("Please enter valid numbers");
      return;
    }

    if (artistValue < 0 || artistValue > 100 || ticketValue < 0 || ticketValue > 100) {
      toast.error("Commission must be between 0 and 100");
      return;
    }

    updateCommissionMutation.mutate({
      artistBookingCommission: artistValue,
      ticketSellCommission: ticketValue,
    });
  };

  if (error) {
    console.error("Failed to load stats:", error);
  }

  const quickActions = [
    { label: "Verify Artists", icon: Users, path: "/artists", gradient: "bg-gradient-primary" },
    { label: "Manage Events", icon: Calendar, path: "/events", gradient: "bg-secondary" },
    { label: "Withdrawals", icon: Wallet, path: "/withdrawals", gradient: "bg-secondary" },
    { label: "Manage Bookings", icon: Ticket, path: "/bookings", gradient: "bg-secondary" },
    { label: "Transactions", icon: ArrowRightLeft, path: "/transactions", gradient: "bg-secondary" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with Brookshow."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatsSkeleton key={i} />)
        ) : (
          stats?.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Users; // Fallback to Users
            return (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={IconComponent}
                variant={stat.variant}
                className="fade-in-scale"
                onInfoClick={stat.title.toLowerCase().includes('revenue') ? () => setRevenueSplit({ total: parseRevenue(stat.value), title: stat.title }) : undefined}
              />
            );
          })
        )}
      </div>

      {/* Commission Stats */}
      <div className="glass-modern rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Commission Settings</h2>
          <Button
            onClick={handleEditClick}
            disabled={isLoadingCommission}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {isLoadingCommission ? (
            Array(2).fill(0).map((_, i) => <StatsSkeleton key={i} />)
          ) : (
            <>
              <StatsCard
                title="Artist Booking Commission"
                value={`${commissionData?.commission?.artistBookingCommission || 0}%`}
                subtitle="Commission on artist bookings"
                icon={Music}
                variant="accent"
                className="fade-in-scale"
              />
              <StatsCard
                title="Ticket Sell Commission"
                value={`${commissionData?.commission?.ticketSellCommission || 0}%`}
                subtitle="Commission on ticket sales"
                icon={Ticket}
                variant="success"
                className="fade-in-scale"
              />
            </>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* Withdraw Requests & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2">
          <WithdrawRequests />
        </div>

        {/* Quick Actions */}
        <div className="glass-modern rounded-xl p-4 sm:p-6 h-full">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 group ${
                  action.gradient.includes("gradient") 
                    ? `${action.gradient} text-primary-foreground hover:shadow-glow` 
                    : "bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/50 hover:border-primary/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  action.gradient.includes("gradient") 
                    ? "bg-white/20" 
                    : "bg-primary/10 text-primary"
                }`}>
                  <action.icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className="font-medium text-sm sm:text-base flex-1 text-left">{action.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                  action.gradient.includes("gradient") 
                    ? "text-primary-foreground/50 group-hover:translate-x-1" 
                    : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="glass-modern rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                {activity.type === "artist" && <Music className="w-5 h-5 text-primary-foreground" />}
                {activity.type === "booking" && <Ticket className="w-5 h-5 text-primary-foreground" />}
                {activity.type === "payment" && <IndianRupee className="w-5 h-5 text-primary-foreground" />}
                {activity.type === "event" && <Calendar className="w-5 h-5 text-primary-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.name}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Edit Commission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Commission Settings</DialogTitle>
            <DialogDescription>
              Update the commission percentages for artist bookings and ticket sales.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="artistCommission">Artist Booking Commission (%)</Label>
              <Input
                id="artistCommission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={artistCommission}
                onChange={(e) => setArtistCommission(e.target.value)}
                placeholder="Enter commission percentage"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ticketCommission">Ticket Sell Commission (%)</Label>
              <Input
                id="ticketCommission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={ticketCommission}
                onChange={(e) => setTicketCommission(e.target.value)}
                placeholder="Enter commission percentage"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateCommissionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCommission}
              disabled={updateCommissionMutation.isPending}
            >
              {updateCommissionMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revenue Split Dialog */}
      <Dialog open={!!revenueSplit} onOpenChange={(open) => !open && setRevenueSplit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revenue Split Details</DialogTitle>
            <DialogDescription>
              Breakdown of {revenueSplit?.title} ({formatCurrency(revenueSplit?.total || 0)})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Sumit</p>
                  <p className="text-xs text-muted-foreground">Commission: 10%</p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency((revenueSplit?.total || 0) * 0.1)}
                </p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Aditya Raj</p>
                  <p className="text-xs text-muted-foreground">Commission: 45%</p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency((revenueSplit?.total || 0) * 0.45)}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Indar</p>
                  <p className="text-xs text-muted-foreground">Commission: 45%</p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency((revenueSplit?.total || 0) * 0.45)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between px-3">
                <p className="text-sm font-semibold">Total Revenue</p>
                <p className="text-lg font-bold">{formatCurrency(revenueSplit?.total || 0)}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRevenueSplit(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
