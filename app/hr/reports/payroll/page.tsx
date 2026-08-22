"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Loader2, Download, Filter, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PayrollRecord {
  pay_period: string;
  employee_name: string;
  designation: string;
  department: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
}

export default function PayrollReportPage() {
  const [data, setData] = useState<{ records: PayrollRecord[], totalPayroll: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/reports/payroll")
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
        <p>Error loading payroll report: {error}</p>
      </div>
    );
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payroll Report</h1>
          <p className="text-muted-foreground mt-1">Salary disbursements across the organization.</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Disbursed (All Time)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatINR(data?.totalPayroll || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>All processed salary slips.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Pay Period</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3 text-right">Base Salary</th>
                  <th className="px-4 py-3 text-right">Allowances</th>
                  <th className="px-4 py-3 text-right">Deductions</th>
                  <th className="px-4 py-3 text-right">Net Salary</th>
                  <th className="px-4 py-3 rounded-tr-md text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.records?.map((record, i) => (
                  <tr key={i} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium">
                      {new Date(record.pay_period + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{record.employee_name}</div>
                      <div className="text-xs text-muted-foreground">{record.designation} • {record.department}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{formatINR(record.base_salary)}</td>
                    <td className="px-4 py-3 text-right text-green-600">+{formatINR(record.allowances)}</td>
                    <td className="px-4 py-3 text-right text-destructive">-{formatINR(record.deductions)}</td>
                    <td className="px-4 py-3 text-right font-bold text-foreground">
                      {formatINR(record.net_salary)}
                    </td>
                    <td className="px-4 py-3 text-right">
                       <Button variant="ghost" size="sm" className="h-8 hover:bg-secondary/50" onClick={() => window.print()}>
                         <Printer className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
                {(!data?.records || data.records.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No payroll records found.
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
