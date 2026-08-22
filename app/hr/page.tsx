"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Check, X, Users, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function HrDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState<any>(null);
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
    fetchApi("/leave/all")
      .then((data) => setRequests(data.records || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  const [processing, setProcessing] = useState<number[]>([]);

  const handleApprove = async (id: number) => {
    setProcessing(p => [...p, id]);
    try {
      await fetchApi(`/leave/${id}/approve`, { method: "POST" });
      fetchLeaveRequests();
    } catch (e: any) {
      alert(e.message || "Failed to approve");
    } finally {
      setProcessing(p => p.filter(pid => pid !== id));
    }
  };

  const handleReject = async (id: number) => {
    setProcessing(p => [...p, id]);
    try {
      await fetchApi(`/leave/${id}/reject`, { method: "POST" });
      fetchLeaveRequests();
    } catch (e: any) {
      alert(e.message || "Failed to reject");
    } finally {
      setProcessing(p => p.filter(pid => pid !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage employee leave requests and overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.total_workforce ?? analytics?.totalWorkforce ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.today_attendance ?? analytics?.todayAttendance ?? 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.pending_leaves ?? analytics?.pendingLeaves ?? 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {!analyticsLoading && analytics?.ai_insight && (
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary">Dayflow Smart Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">{analytics.ai_insight}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Review and approve or reject employee leave.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.filter(r => r.status === 'PENDING').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No pending leave requests.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.filter(r => r.status === 'PENDING').map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <p className="font-medium">{req.employee_name} <span className="text-muted-foreground font-normal ml-2">({req.leave_type})</span></p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">"{req.reason}"</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" disabled={processing.includes(req.id)} onClick={() => handleReject(req.id)}>
                      {processing.includes(req.id) ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <X className="w-4 h-4 mr-1" />} Reject
                    </Button>
                    <Button size="sm" disabled={processing.includes(req.id)} onClick={() => handleApprove(req.id)}>
                      {processing.includes(req.id) ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />} Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
