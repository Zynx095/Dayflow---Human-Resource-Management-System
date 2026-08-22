"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function LeavePage() {
  const [leaveType, setLeaveType] = useState("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMyLeaves = () => {
    setLoading(true);
    fetchApi("/leave/my")
      .then(data => setRequests(data.records || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    try {
      await fetchApi("/leave", {
        method: "POST",
        body: JSON.stringify({
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason,
        })
      });
      
      setStartDate("");
      setEndDate("");
      setReason("");
      fetchMyLeaves();
      alert("Leave request submitted!");
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground mt-2">Request time off and view your history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Leave</CardTitle>
            <CardDescription>Submit a new leave request for approval.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Leave Type</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <Input type="text" placeholder="Brief reason" required value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Your past and pending requests.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground border-2 border-dashed rounded-lg">
                No leave requests found.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{req.leave_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
