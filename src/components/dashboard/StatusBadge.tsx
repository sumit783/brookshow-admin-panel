import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected" | "completed" | "active" | "cancelled" | "confirmed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
