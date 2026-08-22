"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";

interface AttendanceRecord {
  check_in: string;
  check_out?: string;
  worked_hours?: number;
  status: string;
  payment_status?: string;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [elapsed, setElapsed] = useState<number>(0);

  const fetchToday = () => {
    setLoading(true);
    setError(null);
    fetchApi("/attendance/today")
      .then((data) => setAttendance(data.record))
      .catch((err) => {
        setAttendance(null);
        setError(err.message || "Failed to load attendance");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    if (attendance && !attendance.check_out) {
      const checkInTime = new Date(attendance.check_in).getTime();
      const updateTimer = () => {
        setElapsed(Date.now() - checkInTime);
        animationFrameId = requestAnimationFrame(updateTimer);
      };
      animationFrameId = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [attendance]);

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError(null);
    try {
      await fetchApi("/attendance/check-in", { method: "POST" });
      fetchToday();
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Failed to check in");
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    setError(null);
    try {
      await fetchApi("/attendance/check-out", { method: "POST" });
      fetchToday();
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Failed to check out");
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-display font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-2">Here&apos;s an overview of your work day.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="h-full border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Attendance</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                    {error}
                  </div>
                  <Button onClick={fetchToday} variant="outline" className="w-full">
                    Try Again
                  </Button>
                </div>
              ) : attendance ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-secondary/10 p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-semibold text-[hsl(var(--success))] uppercase tracking-wider mb-1">
                        {attendance.check_out ? 'Completed' : 'Checked In'}
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {new Date(attendance.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {attendance.check_out && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Out
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {new Date(attendance.check_out).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Worked
                    </p>
                    <p className="font-display text-2xl font-bold text-foreground">
                      {attendance.check_out
                        ? (attendance.worked_hours
                            ? `${Math.floor(attendance.worked_hours)}h ${Math.floor((attendance.worked_hours % 1) * 60)}m`
                            : formatDuration(new Date(attendance.check_out).getTime() - new Date(attendance.check_in).getTime()))
                        : formatDuration(elapsed)}
                    </p>
                  </div>

                  {attendance.check_out && attendance.payment_status && (
                    <div className="bg-[hsl(var(--success))]/10 p-4 rounded-lg border border-[hsl(var(--success))]/20">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[hsl(var(--success))] uppercase tracking-wider">
                          Payroll Status
                        </p>
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))]" />
                      </div>
                      <p className="font-display text-lg font-bold text-foreground mt-1">
                        {attendance.payment_status}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="text-xs text-destructive flex items-center gap-1 bg-destructive/10 p-2 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      {error}
                    </div>
                  )}
                  {!attendance.check_out && (
                    <Button onClick={handleCheckOut} className="w-full font-medium shadow-sm bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))/0.9]" disabled={checkingOut}>
                      {checkingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Check Out
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-foreground">Not Started</p>
                    <p className="text-xs text-muted-foreground mt-1">You haven&apos;t checked in yet today.</p>
                  </div>
                  {error && (
                    <div className="text-xs text-destructive flex items-center gap-1 bg-destructive/10 p-2 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      {error}
                    </div>
                  )}
                  <Button onClick={handleCheckIn} className="w-full font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90" disabled={checkingIn}>
                    {checkingIn ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Check In Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card className="h-full border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14 Days</div>
              <p className="text-xs text-muted-foreground mt-1">Available paid leave</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card className="h-full border-border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-success" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Next Holiday</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Diwali</div>
              <p className="text-xs text-muted-foreground mt-1">Nov 8, 2026</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
