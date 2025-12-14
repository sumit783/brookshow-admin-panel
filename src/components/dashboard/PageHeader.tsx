import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:mb-8">
      <div className="slide-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 fade-in-scale">
          {children}
        </div>
      )}
    </div>
  );
}
