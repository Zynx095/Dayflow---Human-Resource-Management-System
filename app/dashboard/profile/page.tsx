"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

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

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Editable fields (only phone and address are permitted for employees)
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const { employee: meData } = await fetchApi("/auth/me");
        if (meData) {
          const data = await fetchApi(`/employees/${meData.id}`);
          setEmployee(data.employee);
          setPhone(data.employee.phone || "");
          setAddress(data.employee.address || "");
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to load profile details");
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (!employee) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await fetchApi(`/employees/${employee.id}`, {
        method: "PUT",
        body: JSON.stringify({
          phone,
          address
        })
      });
      setSuccess("Profile updated successfully");
      
      // Update local state
      setEmployee({
        ...employee,
        phone,
        address
      });
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
      <div className="p-8 text-center text-destructive font-medium">
        {error}
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your personal information</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-success/10 text-success border border-success/20 rounded-md text-sm">
          {success}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-border">
        {/* Profile Info Section (Read Only) */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="mt-1 font-medium">{employee.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="mt-1">{employee.email}</div>
            </div>
          </div>
        </div>

        {/* Job Info Section (Read Only) */}
        <div className="p-6 bg-secondary/30">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Job Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Employee ID</div>
              <div className="mt-1 font-mono text-sm">{employee.employee_id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Department</div>
              <div className="mt-1">{employee.department || "-"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Designation</div>
              <div className="mt-1">{employee.designation || "-"}</div>
            </div>
          </div>
        </div>

        {/* Salary Section (Read Only) */}
        <div className="p-6 bg-secondary/30">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Salary Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Base Salary</div>
              <div className="mt-1 text-xl font-medium text-success">
                {employee.salary ? formatINR(employee.salary) : "Not assigned"}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section (Editable) */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Contact Information (Editable)</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2 max-w-sm">
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
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
