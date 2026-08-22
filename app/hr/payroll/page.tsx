"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchApi } from "@/lib/api";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PayrollRecord {
  id: number;
  pay_period: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  employee_id: number;
  business_id: string;
  name: string;
  department: string;
}

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(value);
}

export default function HrPayrollPage() {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecords = () => {
    setLoading(true);
    setError(null);
    fetchApi("/payroll/all")
      .then(data => setRecords(data.records || []))
      .catch((err) => {
        setRecords([]);
        setError(err.message || "Failed to load payroll records.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record =>
    record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.business_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Company Payroll</h1>
        <p className="text-muted-foreground mt-2">Overview of all employee salaries and compensations.</p>
      </div>

      <Card className="border-border warm-shadow-md bg-card">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border bg-secondary/30">
          <div>
            <CardTitle className="text-foreground font-display">All Payslips</CardTitle>
            <CardDescription className="text-muted-foreground">View payroll records across the company.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employee..."
              className="pl-9 bg-card border-border focus-visible:ring-primary/20 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 space-y-4">
              <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-md border border-destructive/20 inline-block">
                {error}
              </div>
              <div>
                <button onClick={fetchRecords} className="text-sm font-medium underline text-primary hover:text-primary/80">Try Again</button>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed border-border rounded-lg m-4">
              No payroll records found.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-border">
                  <tr className="border-b border-border transition-colors hover:bg-secondary/50 text-muted-foreground bg-secondary/50">
                    <th className="h-12 px-4 text-left font-medium">Employee</th>
                    <th className="h-12 px-4 text-left font-medium">Pay Period</th>
                    <th className="h-12 px-4 text-right font-medium">Base Salary</th>
                    <th className="h-12 px-4 text-right font-medium text-[hsl(var(--success))]">Allowances</th>
                    <th className="h-12 px-4 text-right font-medium text-[hsl(var(--danger))]">Deductions</th>
                    <th className="h-12 px-4 text-right font-medium text-[hsl(var(--primary))]">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0 divide-y divide-border">
                  {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                    <tr key={record.id} className="transition-colors hover:bg-secondary/40 bg-card">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                             {record.name?.charAt(0) || 'U'}
                           </div>
                           <div>
                             <p className="font-medium text-foreground">{record.name}</p>
                             <p className="text-xs text-muted-foreground">{record.business_id} • {record.department}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-foreground/80">{record.pay_period}</td>
                      <td className="p-4 align-middle text-right text-foreground/80">{formatINR(Number(record.base_salary))}</td>
                      <td className="p-4 align-middle text-right text-[hsl(var(--success))] font-medium">+{formatINR(Number(record.allowances))}</td>
                      <td className="p-4 align-middle text-right text-[hsl(var(--danger))] font-medium">-{formatINR(Number(record.deductions))}</td>
                      <td className="p-4 align-middle text-right font-bold text-[hsl(var(--primary))]">{formatINR(Number(record.net_salary))}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="h-24 text-center text-muted-foreground bg-card">
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
