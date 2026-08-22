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
        <Button variant="outline" onClick={() => router.push("/hr/employees")}>
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
        <Button variant="ghost" size="icon" onClick={() => router.push("/hr/employees")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
          <p className="text-muted-foreground mt-1">{employee.employee_id} • {employee.email}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-sm">
          {success}
        </div>
      )}

      <div className="bg-card border rounded-lg shadow-sm divide-y divide-border">
        {/* Profile Info Section (Read Only) */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Employee ID</div>
              <div className="mt-1 font-mono">{employee.employee_id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.role === 'hr' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                  {employee.role.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Info Section (Editable) */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Organizational Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Designation</label>
              <Input 
                value={designation} 
                onChange={(e) => setDesignation(e.target.value)} 
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary (INR)</label>
              <Input 
                type="number"
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
                placeholder="0"
                min="0"
              />
              {employee.salary > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {formatINR(employee.salary)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info Section (Editable) */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+91..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Full address"
              />
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
