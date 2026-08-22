"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { Loader2, DollarSign } from "lucide-react";

export default function PayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/payroll/me")
      .then(data => setRecords(data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Payroll</h1>
        <p className="text-muted-foreground mt-2">View your salary and payment history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payslips</CardTitle>
          <CardDescription>Your recent salary information.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No payroll records found.
            </div>
          ) : (
            <div className="space-y-4">
              {records.map(record => (
                <div key={record.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-card gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Pay Period: {record.pay_period}</p>
                      <p className="text-sm text-muted-foreground">Issued: {new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto grid grid-cols-2 md:flex gap-4 md:gap-8 text-sm">
                    <div>
                      <p className="text-muted-foreground">Base Salary</p>
                      <p className="font-medium">${Number(record.base_salary).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Allowances</p>
                      <p className="font-medium text-green-600">+${Number(record.allowances).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deductions</p>
                      <p className="font-medium text-red-600">-${Number(record.deductions).toLocaleString()}</p>
                    </div>
                    <div className="border-t md:border-l md:border-t-0 pt-2 md:pt-0 md:pl-8 text-right">
                      <p className="text-muted-foreground">Net Pay</p>
                      <p className="font-bold text-lg">${Number(record.net_salary).toLocaleString()}</p>
                    </div>
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
