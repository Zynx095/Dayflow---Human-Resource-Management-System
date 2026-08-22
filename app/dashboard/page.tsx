"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/attendance/today")
      .then((data) => setAttendance(data.record))
      .catch(() => setAttendance(null))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await fetchApi("/attendance/check-in", { method: "POST" });
      setAttendance(res.check_in_record || { check_in: res.check_in, status: 'present' });
    } catch (e: any) {
      alert(e.message || "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetchApi("/attendance/check-out", { method: "POST" });
      setAttendance(res.record || { ...attendance, check_out: res.check_out });
    } catch (e: any) {
      alert(e.message || "Failed to check out");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your work day.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : attendance ? (
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">
                    {attendance.check_out ? 'Completed' : 'Checked In'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In: {new Date(attendance.check_in).toLocaleTimeString()}
                    {attendance.check_out && ` • Out: ${new Date(attendance.check_out).toLocaleTimeString()}`}
                  </p>
                </div>
                {!attendance.check_out && (
                  <Button onClick={handleCheckOut} variant="secondary" className="w-full">
                    Check Out
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">Not Started</p>
                  <p className="text-xs text-muted-foreground mt-1">You haven't checked in yet today.</p>
                </div>
                <Button onClick={handleCheckIn} className="w-full">
                  Check In Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Available paid leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Holiday</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Thanksgiving</div>
            <p className="text-xs text-muted-foreground mt-1">Nov 28, 2026</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
