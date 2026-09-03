"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/shells/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, Filter, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    className: "10",
    monthlyFee: "",
  });
  const [formError, setFormError] = useState("");

  // Mock states for UI
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("roll-desc");

  async function loadStudents() {
    try {
      const res = await apiFetch(`/api/admin/users?role=student&limit=50`);
      setStudents(res.users || []);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : 0,
          role: "student",
        }),
      });
      setIsModalOpen(false);
      setFormData({ firstName: "", middleName: "", lastName: "", email: "", className: "10", monthlyFee: "" });
      loadStudents(); // Refresh the list
    } catch (err) {
      setFormError(err.message || "Failed to create student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell title="Students">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Students Directory</h2>
            <p className="text-sm text-muted-foreground">Manage and view all enrolled students.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={<Button><UserPlus className="mr-2 size-4" /> Add New Student</Button>} />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student details below. Their password and UID will be automatically generated.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {formError && (
                  <div className="text-sm font-medium text-rose-500 bg-rose-500/10 p-2.5 rounded-md">
                    {formError}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">First Name *</label>
                    <Input name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Middle Name</label>
                    <Input name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Middle name (optional)" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Last Name *</label>
                    <Input name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Class *</label>
                    <Select value={formData.className} onValueChange={(val) => setFormData(prev => ({...prev, className: val}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                          <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Email Address *</label>
                    <Input name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="student@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Total Monthly Fee *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <Input name="monthlyFee" type="number" required min="0" step="0.01" value={formData.monthlyFee} onChange={handleInputChange} className="pl-7" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Create Student
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Sorting UI */}
        <div className="rounded-xl border bg-card p-4 flex flex-col sm:flex-row flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by name or email..." />
            </div>
          </div>
          
          <div className="w-full sm:w-32">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Class</label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="9">Class 9</SelectItem>
                <SelectItem value="8">Class 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-32">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Section</label>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Sort By</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roll-desc">Roll No (Highest Marks)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="secondary" className="w-full sm:w-auto">
            <Filter className="mr-2 size-4" /> Apply Filters
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Monthly Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex items-center justify-center text-muted-foreground gap-2">
                      <Loader2 className="size-5 animate-spin" /> Loading students...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-rose-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded">
                        {student.uid || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.first_name} {student.middle_name ? `${student.middle_name} ` : ""}{student.last_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.class_name ? `Class ${student.class_name}` : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{parseFloat(student.monthly_fee || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${student.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        {student.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminShell>
  );
}
