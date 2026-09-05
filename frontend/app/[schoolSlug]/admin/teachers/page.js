"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/shells/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, Search, Filter, UserPlus, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock states for UI
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true);
        // Fetch all users with role=teacher
        const res = await apiFetch(`/api/admin/users?role=teacher&limit=50`);
        setTeachers(res.users || []);
      } catch (err) {
        setError(err.message || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  return (
    <AdminShell title="Teachers">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Teachers Directory" 
          description="Manage and view all teaching staff."
        >
          <Button aria-label="Add New Teacher"><UserPlus className="mr-2 size-4" /> Add New Teacher</Button>
        </PageHeader>

        {/* Filters and Sorting UI */}
        <div className="sm:hidden mb-2">
          <Button variant="outline" className="w-full" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="filters-section">
            <Filter className="mr-2 size-4" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        <div id="filters-section" className={cn("rounded-xl border bg-card p-4 flex-col sm:flex-row flex-wrap gap-4 items-end", showFilters ? "flex" : "hidden sm:flex")}>
          <div className="flex-1 w-full min-w-[200px]">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by name or email..." />
            </div>
          </div>
          
          <div className="w-full sm:w-40">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Department</label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="arts">Arts & Humanities</SelectItem>
                <SelectItem value="languages">Languages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <label className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex items-center justify-center text-muted-foreground gap-2">
                      <Loader2 className="size-5 animate-spin" /> Loading teachers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-rose-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <EmptyState 
                      icon={Users} 
                      title="No teachers found" 
                      description="You haven't added any teachers yet, or none match your filters."
                      action={<Button><UserPlus className="mr-2 size-4" /> Add New Teacher</Button>}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.first_name} {teacher.last_name}</TableCell>
                    <TableCell className="text-muted-foreground">{teacher.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${teacher.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        {teacher.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(teacher.created_at).toLocaleDateString()}
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
