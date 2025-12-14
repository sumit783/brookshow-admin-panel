import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  Receipt,
  Ticket,
  Menu,
  X,
  Music2,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Verify Artists", url: "/verify-artists", icon: UserCheck },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Transactions", url: "/transactions", icon: Receipt },
  { title: "Bookings", url: "/bookings", icon: Ticket },
  { title: "Withdrawals", url: "/withdraw-requests", icon: Wallet },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 w-64 h-full",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-4 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow">
              <Music2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-hero text-xl text-foreground tracking-tight">
              Brookshow
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                <span className="font-medium text-sm">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@brookshow.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
          <Music2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-hero text-lg text-foreground tracking-tight">
          Brookshow
        </span>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>
    </header>
  );
}
