import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getBookingTrends } from "@/api/stats";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  tickets: {
    label: "Ticket Bookings",
    color: "hsl(200, 98%, 64%)",
  },
  artists: {
    label: "Artist Bookings",
    color: "hsl(323, 73%, 38%)",
  },
};

export function BookingsChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ["booking-trends"],
    queryFn: getBookingTrends,
  });

  if (error) {
    console.error("Failed to load booking trends:", error);
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
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Bookings Trend</h2>
      <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="tickets" fill="hsl(200, 98%, 64%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="artists" fill="hsl(323, 73%, 38%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
