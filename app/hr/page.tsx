"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Check, X, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaveRequest {
  id: number;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

export default function HrDashboardPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveRequests();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = (data: anyp0: null) => {
    setAnalyticsLoading(true);
    fetchApi("/analytics/hr")
      .then((data) => fetchAnalytics(data))
      .catch(() => fetchAnalytics(null))
      .finally(() => setAnalyticsLoading(false));
  };

  const fetchLeaveRequests = () => {
    setLoading(true);
    setError(null);
    fetchApi("/leave/all")
      .then((data) => setRequests(data.records || []))
      .catch((err) => {
        setRequests([]);
        setError(err.message || "Failed to load leave requests");
      })
      .finally(() => setLoading(false));
  };

  const [processing, setProcessing] = useState<number[]>([]);

  const handleApprove = async (id: number) => {
    setProcessing(p => [...p, id]);
    try {
      await fetchApi(`/leave/${id}/approve`, { method: "POST" });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message || "Failed to approve");
    } finally {
      setProcessing(p => p.filter(pid => pid !== id));
    }
  };

  const handleReject = async (id: number) => {
    setProcessing(p => [...p, id]);
    try {
      await fetchApi(`/leave/${id}/reject`, { method: "POST" });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message || "Failed to reject");
    } finally {
      setProcessing(p => p.filter(pid => pid !== id));
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">HR Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage employee leave requests and company overview.</p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription className="mt-1.5">Review and approve or reject employee leave.</CardDescription>
            </div>
            {!loading && !error && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {pendingRequests.length} pending
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading requests...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="font-medium text-foreground mb-1">Unable to load requests</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchLeaveRequests} variant="outline" size="sm">
                Try again
              </Button>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No pending leave requests require your attention.</p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence initial={false}>
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-muted/20 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {req.employee_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{req.employee_name}</p>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                              {req.leave_type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(req.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(req.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-sm mt-2 text-foreground/80 italic">&quot;{req.reason}&quot;</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-0 mt-2 sm:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                          disabled={processing.includes(req.id)}
                          onClick={() => handleReject(req.id)}
                          aria-label={`Reject leave request for ${req.employee_name}`}
                        >
                          {processing.includes(req.id) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                          disabled={processing.includes(req.id)}
                          onClick={() => handleApprove(req.id)}
                          aria-label={`Approve leave request for ${req.employee_name}`}
                        >
                          {processing.includes(req.id) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
function setAnalyticsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

