import { Check, X, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawRequests } from "@/api/stats";
import { Skeleton } from "@/components/ui/skeleton";

export function WithdrawRequests() {
  const { data: withdrawRequests, isLoading, error } = useQuery({
    queryKey: ["withdraw-requests"],
    queryFn: getWithdrawRequests,
  });

  if (error) {
    console.error("Failed to load withdraw requests:", error);
  }

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
          {withdrawRequests?.length || 0} pending
        </span>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {withdrawRequests?.map((request) => (
          <div
            key={request.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${request.type === "artist" ? "bg-gradient-primary" : "bg-gradient-accent"
                }`}>
                {request.type === "artist" ? (
                  <User className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{request.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${request.type === "artist"
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                    }`}>
                    {request.type === "artist" ? "Artist" : "Planner"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{request.bankDetails}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{request.amount}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {request.requestedAt}
                </p>
              </div>
              <div className="flex gap-2">
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
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 transition-colors">
        View all requests →
      </button>
    </div>
  );
}
