"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeaveRecord {
  employee_name: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  admin_comment?: string;
}

export default function LeaveReportPage() {
  const [data, setData] = useState<{ records: LeaveRecord[], pending: number, approved: number, rejected: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/reports/leave")
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
        <p>Error loading leave report: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Leave Report</h1>
          <p className="text-muted-foreground mt-1">Overview of all employee leave requests.</p>
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Approved Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data?.approved || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{data?.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Rejected Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data?.rejected || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>All historical and upcoming leave requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Employee</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-md">Admin Comment</th>
                </tr>
              </thead>
              <tbody>
                {data?.records?.map((record, i) => (
                  <tr key={i} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {record.employee_name}
                      <span className="block text-xs text-muted-foreground">{record.employee_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-secondary border border-border">
                        {record.leave_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(record.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      {' - '}
                      {new Date(record.end_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      <span className="block text-xs text-muted-foreground mt-1">&quot;{record.reason}&quot;</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'APPROVED' ? 'bg-green-500/10 text-green-600' :
                        record.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground italic">
                      {record.admin_comment || '-'}
                    </td>
                  </tr>
                ))}
                {(!data?.records || data.records.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No leave records found.
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
