import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: "glass-modern",
  primary: "bg-gradient-primary",
  accent: "bg-gradient-accent",
  success: "bg-gradient-success",
  warning: "bg-gradient-warning",
};

const iconBgStyles = {
  default: "bg-gradient-primary",
  primary: "bg-background/20",
  accent: "bg-background/20",
  success: "bg-background/20",
  warning: "bg-background/20",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
}: StatsCardProps) {
  const isGradient = variant !== "default";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 sm:p-6 transition-all duration-300 hover-glow",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
          <p className={cn(
            "text-xs sm:text-sm font-medium",
            isGradient ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight font-heading truncate",
            isGradient ? "text-primary-foreground" : "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs truncate",
              isGradient ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
          {/* {trend && (
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className={cn(
                "text-xs hidden sm:inline",
                isGradient ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                vs last month
              </span>
            </div>
          )} */}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0",
            iconBgStyles[variant]
          )}
        >
          <Icon className={cn(
            "w-5 h-5 sm:w-6 sm:h-6",
            isGradient ? "text-primary-foreground" : "text-primary-foreground"
          )} />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-background/5 blur-2xl" />
      <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-background/5 blur-xl" />
    </div>
  );
}
