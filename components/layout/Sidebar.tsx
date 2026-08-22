"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Clock, LogOut, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const isHr = user?.role === 'hr';
  
  const routes = isHr ? [
    { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hr/employees", label: "Employees", icon: Users },
    { href: "/hr/leave", label: "Leave Requests", icon: Calendar },
  ] : [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/attendance", label: "Attendance", icon: Clock },
    { href: "/dashboard/leave", label: "Leave", icon: Calendar },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl tracking-tight text-primary">Dayflow</h2>
        <p className="text-xs text-muted-foreground mt-1">HR Management System</p>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {route.label}
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{user?.name}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{user?.role}</span>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
