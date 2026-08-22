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
        <h1 className="text-3xl font-bold tracking-tight">Company Payroll</h1>
        <p className="text-muted-foreground mt-2">Overview of all employee salaries and compensations.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle>All Payslips</CardTitle>
            <CardDescription>View payroll records across the company.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employee..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center p-8 space-y-4">
              <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-md border border-destructive/20 inline-block">
                {error}
              </div>
              <div>
                <button onClick={fetchRecords} className="text-sm font-medium underline text-primary">Try Again</button>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
              No payroll records found.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 text-muted-foreground">
                    <th className="h-12 px-4 text-left font-medium">Employee</th>
                    <th className="h-12 px-4 text-left font-medium">Pay Period</th>
                    <th className="h-12 px-4 text-right font-medium">Base Salary</th>
                    <th className="h-12 px-4 text-right font-medium text-green-600">Allowances</th>
                    <th className="h-12 px-4 text-right font-medium text-red-600">Deductions</th>
                    <th className="h-12 px-4 text-right font-medium text-primary">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <p className="font-medium">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.business_id} • {record.department}</p>
                      </td>
                      <td className="p-4 align-middle">{record.pay_period}</td>
                      <td className="p-4 align-middle text-right">₹{Number(record.base_salary).toLocaleString('en-IN')}</td>
                      <td className="p-4 align-middle text-right text-green-600">+₹{Number(record.allowances).toLocaleString('en-IN')}</td>
                      <td className="p-4 align-middle text-right text-red-600">-₹{Number(record.deductions).toLocaleString('en-IN')}</td>
                      <td className="p-4 align-middle text-right font-bold">₹{Number(record.net_salary).toLocaleString('en-IN')}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="h-24 text-center text-muted-foreground">
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
