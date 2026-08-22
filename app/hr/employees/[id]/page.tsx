"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  salary: number;
  phone: string;
  address: string;
  role: string;
}

export default function HrEmployeeProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await fetchApi(`/employees/${id}`);
        setEmployee(data.employee);
        setDepartment(data.employee.department || "");
        setDesignation(data.employee.designation || "");
        setSalary(data.employee.salary ? data.employee.salary.toString() : "0");
        setPhone(data.employee.phone || "");
        setAddress(data.employee.address || "");
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to load employee details");
      } finally {
        setLoading(false);
      }
    }
    loadEmployee();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const parsedSalary = parseFloat(salary);
      if (isNaN(parsedSalary) || parsedSalary < 0) {
        throw new Error("Salary must be a valid positive number");
      }

      await fetchApi(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          department,
          designation,
          salary: parsedSalary,
          phone,
          address
        })
      });
      setSuccess("Employee profile updated successfully");
      
      // Update local state
      if (employee) {
        setEmployee({
          ...employee,
          department,
          designation,
          salary: parsedSalary,
          phone,
          address
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive font-medium mb-4">{error}</div>
        <Button variant="outline" onClick={() => router.push("/hr/employees")} className="border-border hover:bg-secondary/50 text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/hr/employees")} className="hover:bg-secondary/50 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display text-xl font-bold border border-primary/20">
            {employee.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">{employee.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">{employee.employee_id} • {employee.email}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm font-medium">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-[hsl(152,35%,90%)] text-[hsl(152,45%,38%)] border border-[hsl(152,45%,38%)]/20 rounded-md text-sm font-medium">
          {success}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg warm-shadow-md divide-y divide-border overflow-hidden">
        {/* Profile Info Section (Read Only) */}
        <div className="p-6 bg-secondary/10">
          <h3 className="text-lg font-display font-semibold mb-4 text-foreground">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Employee ID</div>
              <div className="mt-1 font-mono text-foreground/80">{employee.employee_id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="mt-1">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${employee.role === 'hr' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-secondary-foreground border-border'}`}>
                  {employee.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Info Section (Editable) */}
        <div className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4 text-foreground">Organizational Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Department</label>
              <Input 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                placeholder="e.g. Engineering"
                className="bg-card border-border focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Designation</label>
              <Input 
                value={designation} 
                onChange={(e) => setDesignation(e.target.value)} 
                placeholder="e.g. Software Engineer"
                className="bg-card border-border focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Salary (INR)</label>
              <Input 
                type="number"
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
                placeholder="0"
                min="0"
                className="bg-card border-border focus-visible:ring-primary/20 font-mono"
              />
              {employee.salary > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Current: <span className="font-medium text-foreground/80">{formatINR(employee.salary)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Section (Editable) */}
        <div className="p-6">
          <h3 className="text-lg font-display font-semibold mb-4 text-foreground">Contact Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+91..."
                className="bg-card border-border focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Full address"
                className="bg-card border-border focus-visible:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end bg-secondary/10">
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
