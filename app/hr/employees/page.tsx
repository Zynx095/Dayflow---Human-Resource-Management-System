"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users } from "lucide-react";

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  role: string;
}

export default function HrEmployeeDirectory() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await fetchApi("/employees");
        setEmployees(data.employees || []);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    }
    loadEmployees();
  }, []);

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">Manage all employees and roles</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg warm-shadow-md overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border focus-visible:ring-primary/20 text-foreground"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center items-center bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive bg-card">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center bg-card">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4 border border-border">
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No employees found</h3>
            <p className="text-muted-foreground mt-1">Adjust your search or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-card">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Designation</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(emp => (
                  <tr key={emp.id} className="bg-card hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                          {emp.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{emp.employee_id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${emp.role === 'hr' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-secondary-foreground border-border'}`}>
                        {emp.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/80">{emp.department || '-'}</td>
                    <td className="px-6 py-4 text-foreground/80">{emp.designation || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/hr/employees/${emp.id}`)}
                        className="text-primary hover:text-accent font-medium text-sm transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
