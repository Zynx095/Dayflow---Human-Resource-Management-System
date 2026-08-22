"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Check, X } from "lucide-react";

export default function HrDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = () => {
    setLoading(true);
    fetchApi("/leave/all")
      .then((data) => setRequests(data.records || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: number) => {
    try {
      await fetchApi(`/leave/${id}/approve`, { method: "POST" });
      fetchLeaveRequests();
    } catch (e: any) {
      alert(e.message || "Failed to approve");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetchApi(`/leave/${id}/reject`, { method: "POST" });
      fetchLeaveRequests();
    } catch (e: any) {
      alert(e.message || "Failed to reject");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage employee leave requests and overview.</p>
      </div>

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
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(req.id)}>
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(req.id)}>
                      <Check className="w-4 h-4 mr-1" /> Approve
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
