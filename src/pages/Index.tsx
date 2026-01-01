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
  LucideIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "@/api/stats";
import { StatsSkeleton } from "@/components/skeletons/StatsSkeleton";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Calendar,
  Ticket,
  IndianRupee,
};

const recentActivity = [
  { id: 1, type: "artist", name: "DJ Shadow", action: "submitted for verification", time: "2 mins ago" },
  { id: 2, type: "booking", name: "Summer Fest 2024", action: "received 45 new bookings", time: "15 mins ago" },
  { id: 3, type: "payment", name: "₹1,25,000", action: "payment received from Groove Night", time: "1 hour ago" },
  { id: 4, type: "event", name: "Electric Dreams", action: "event created by promoter", time: "2 hours ago" },
  { id: 5, type: "artist", name: "The Band Project", action: "verified and approved", time: "3 hours ago" },
];

export default function Index() {
  const navigate = useNavigate();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

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
              />
            );
          })
        )}
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
    </>
  );
}
