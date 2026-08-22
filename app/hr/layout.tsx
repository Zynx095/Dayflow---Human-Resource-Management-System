"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import GlobalClickSpark from '@/components/GlobalClickSpark';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "hr") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user?.role !== "hr") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <GlobalClickSpark />
      <Sidebar />
      <main className="flex-1 md:pl-64 min-h-screen pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
