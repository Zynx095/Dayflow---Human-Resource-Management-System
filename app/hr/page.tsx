"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Check, X, Users, CheckCircle, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
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

interface Analytics {
  total_workforce?: number;
  totalWorkforce?: number;
  today_attendance?: number;
  todayAttendance?: number;
  pending_leaves?: number;
  pendingLeaves?: number;
  attendanceRate?: number;
  totalPayroll?: number;
}

export default function HrDashboardPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = () => {
    setAnalyticsLoading(true);
    fetchApi("/analytics/hr")
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null))
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
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">HR Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage employee leave requests and company overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <Card className="border-l-4 border-l-primary border-y-border border-r-border warm-shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card">
            <CardTitle className="text-sm font-medium text-foreground">Total Workforce</CardTitle>
            <div className="bg-primary/10 p-2 rounded-md">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{analytics?.total_workforce ?? analytics?.totalWorkforce ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(152,45%,38%)] border-y-border border-r-border warm-shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card">
            <CardTitle className="text-sm font-medium text-foreground">Today&apos;s Attendance</CardTitle>
            <div className="bg-[hsl(152,35%,90%)] p-2 rounded-md">
              <CheckCircle className="h-4 w-4 text-[hsl(152,45%,38%)]" />
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{analytics?.today_attendance ?? analytics?.todayAttendance ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent border-y-border border-r-border warm-shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card">
            <CardTitle className="text-sm font-medium text-foreground">Action Required</CardTitle>
            <div className="bg-accent/10 p-2 rounded-md">
              <AlertCircle className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{analytics?.pending_leaves ?? analytics?.pendingLeaves ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 border-y-border border-r-border warm-shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card">
            <CardTitle className="text-sm font-medium text-foreground">Attendance Rate</CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-md">
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{analytics?.attendanceRate ?? 0}%</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 border-y-border border-r-border warm-shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card">
            <CardTitle className="text-sm font-medium text-foreground">Payroll Summary</CardTitle>
            <div className="bg-green-500/10 p-2 rounded-md">
              <span className="font-bold text-green-500 text-sm leading-none">₹</span>
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(analytics?.totalPayroll ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      <Card className="border-border warm-shadow-md overflow-hidden bg-card">
        <CardHeader className="bg-secondary/30 border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground font-display">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription className="mt-1.5 text-muted-foreground">Review and approve or reject employee leave.</CardDescription>
            </div>
            {!loading && !error && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
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
              <Button onClick={fetchLeaveRequests} variant="outline" size="sm" className="border-border hover:bg-secondary/50 text-foreground">
                Try again
              </Button>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-4 border border-border">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium text-foreground">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No pending leave requests require your attention.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence initial={false}>
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-secondary/40 transition-colors bg-card">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                          {req.employee_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{req.employee_name}</p>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                              {req.leave_type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(req.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(req.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-sm mt-2 text-foreground/80 italic">&quot;{req.reason}&quot;</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:shrink-0 pt-2 sm:pt-0 border-t border-border sm:border-0 mt-2 sm:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                          disabled={processing.includes(req.id)}
                          onClick={() => handleReject(req.id)}
                          aria-label={`Reject leave request for ${req.employee_name}`}
                        >
                          {processing.includes(req.id) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="w-full sm:w-auto bg-[hsl(152,45%,38%)] hover:bg-[hsl(152,45%,33%)] text-white"
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
