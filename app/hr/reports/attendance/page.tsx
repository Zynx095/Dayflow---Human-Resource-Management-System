"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AttendanceRecord {
  date: string;
  employee_name: string;
  employee_id: string;
  status: string;
  check_in?: string;
  check_out?: string;
  worked_hours?: number;
  payment_status?: string;
}

export default function AttendanceReportPage() {
  const [data, setData] = useState<{ records: AttendanceRecord[], totalPresent: number, totalAbsent: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/reports/attendance")
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive py-12">
        <p>Error loading attendance report: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance Report</h1>
          <p className="text-muted-foreground mt-1">Detailed view of all employee attendance records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data?.totalPresent || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data?.totalAbsent || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Records</CardTitle>
          <CardDescription>Comprehensive log of all check-ins and check-outs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Date</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Check In</th>
                  <th className="px-4 py-3">Check Out</th>
                  <th className="px-4 py-3 text-right">Hours</th>
                  <th className="px-4 py-3 rounded-tr-md text-right">Payroll Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.records?.map((record, i) => (
                  <tr key={i} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-4 py-3">{new Date(record.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {record.employee_name}
                      <span className="block text-xs text-muted-foreground">{record.employee_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        record.status === 'present' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.check_in ? new Date(`1970-01-01T${record.check_in}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {record.check_out ? new Date(`1970-01-01T${record.check_out}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {record.worked_hours ? `${Number(record.worked_hours).toFixed(2)} hrs` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {record.payment_status ? (
                        <span className="text-[hsl(var(--success))]">{record.payment_status}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!data?.records || data.records.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
