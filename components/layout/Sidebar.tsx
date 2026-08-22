"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Clock, LogOut, Users, DollarSign, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isHr = user?.role === 'hr';

  const routes = isHr ? [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/employees", label: "Employees", icon: Users },
    { href: "/hr/leave", label: "Leave Requests", icon: Calendar },
    { href: "/hr/payroll", label: "Payroll", icon: DollarSign },
  ] : [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "My Profile", icon: Users },
    { href: "/dashboard/attendance", label: "Attendance", icon: Clock },
    { href: "/dashboard/leave", label: "Leave", icon: Calendar },
    { href: "/dashboard/payroll", label: "Payroll", icon: DollarSign },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xl tracking-tight text-primary">Dayflow</h2>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "w-64 border-r bg-card flex flex-col h-screen fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl tracking-tight text-primary">Dayflow</h2>
            <p className="text-xs text-muted-foreground mt-1">HR Management System</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 -mr-3 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto py-4 flex flex-col gap-1 px-3">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                {route.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium leading-none truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground mt-1 capitalize">{user?.role}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
