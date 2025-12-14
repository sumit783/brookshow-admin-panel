import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getRevenueChartData } from "@/api/stats";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(323, 73%, 38%)",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(200, 98%, 64%)",
  },
};

export function RevenueChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: getRevenueChartData,
  });

  if (error) {
    console.error("Failed to load revenue chart data:", error);
  }

  if (isLoading) {
    return (
      <div className="glass-modern rounded-xl p-4 sm:p-6 h-[264px] sm:h-[344px] flex flex-col">
        <div className="h-7 w-48 mb-6">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-modern rounded-xl p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Revenue Overview</h2>
      <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(323, 73%, 38%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(323, 73%, 38%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 18%)" />
            <XAxis
              dataKey="month"
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 65%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(323, 73%, 38%)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
