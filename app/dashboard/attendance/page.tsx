"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/attendance/weekly")
      .then(data => setRecords(data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
        <p className="text-muted-foreground mt-2">View your recent check-ins and working hours.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
          <CardDescription>Your check-ins for the past 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No recent attendance records found.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Check In</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Check Out</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Hours</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {records.map((record) => (
                    <tr key={record.id || record.check_in} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        {new Date(record.check_in).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(record.check_in).toLocaleTimeString()}
                      </td>
                      <td className="p-4 align-middle">
                        {record.check_out ? new Date(record.check_out).toLocaleTimeString() : "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {record.worked_hours ? `${record.worked_hours}h` : "-"}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status || 'present'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
