"use client";

import { useState, useEffect, useCallback } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/components/shells/finance-ui";
import { Button }   from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Check, Download, Search, Users, TrendingUp, Briefcase, ReceiptText, Coins, Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherPaymentsPage() {
  const [records, setRecords]             = useState([]);
  const [stats, setStats]                 = useState({});
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const [search, setSearch]                     = useState("");
  const [deptFilter, setDeptFilter]             = useState("All Departments");
  const [statusFilter, setStatusFilter]         = useState("All Status");
  const [salaryTypeFilter, setSalaryTypeFilter] = useState("All Types");
  const [monthFilter, setMonthFilter]           = useState("May 2026");
  const [toastMessage, setToastMessage]         = useState("");
  const [markingId, setMarkingId]               = useState(null);
  const [bulkLoading, setBulkLoading]           = useState(false);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(""), 3000); };

  const loadPayroll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        month: monthFilter,
        ...(deptFilter !== "All Departments" && { department: deptFilter }),
        ...(statusFilter !== "All Status" && { status: statusFilter }),
        ...(salaryTypeFilter !== "All Types" && { salaryType: salaryTypeFilter }),
        ...(search && { search }),
        limit: "100",
      });
      const res = await apiFetch(`/api/finance/teacher-payments?${params}`);
      setRecords(res.data.records ?? []);
      setStats(res.data.stats ?? {});
    } catch (err) {
      setError(err.message || "Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, deptFilter, statusFilter, salaryTypeFilter, search]);

  useEffect(() => { loadPayroll(); }, [loadPayroll]);

  const handleMarkAsPaid = async (salaryPaymentId, name) => {
    setMarkingId(salaryPaymentId);
    try {
      await apiFetch(`/api/finance/teacher-payments/${salaryPaymentId}/mark-paid`, { method: "PUT" });
      showToast(`Salary for ${name} marked as Paid!`);
      loadPayroll();
    } catch (err) {
      showToast(err.message || "Failed to mark as paid");
    } finally {
      setMarkingId(null);
    }
  };

  const handleBulkMarkPaid = async () => {
    setBulkLoading(true);
    try {
      const res = await apiFetch("/api/finance/teacher-payments/bulk-pay", {
        method: "POST",
        body: JSON.stringify({ payMonth: monthFilter }),
      });
      showToast(`${res.data?.updatedCount ?? 0} salary records marked as Paid!`);
      loadPayroll();
    } catch (err) {
      showToast(err.message || "Bulk pay failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const fmt = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  return (
    <FinanceShell title="Teacher Payroll">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-border animate-in slide-in-from-top-2">
          <Check className="size-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Teacher Payroll"
        subtitle="Manage teacher salary records, payslips, deductions, bonuses, and payment approvals."
        action={
          <div className="flex gap-2">
            <Button className="gap-2" onClick={handleBulkMarkPaid} disabled={bulkLoading}>
              {bulkLoading ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Bulk Mark Paid
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-24 animate-pulse bg-muted/40" />)
        ) : (
          <>
            <StatCard label="Total Teachers"   value={(stats.totalTeachers ?? 0).toLocaleString()} delta="Staff on payroll"         icon={Users}       tone="blue"   />
            <StatCard label="Salary Paid"       value={fmt(stats.paidAmount)}                        delta="Disbursed this month"     icon={TrendingUp}  tone="green"  />
            <StatCard label="Pending Salaries"  value={fmt(stats.pendingAmount)}                     delta="Awaiting approval"        icon={Briefcase}   tone="amber"  />
            <StatCard label="Total Deductions"  value={fmt(stats.totalDeductions)}                   delta="PF + PT + TDS"            icon={ReceiptText} tone="rose"   />
          </>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid gap-3 xl:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search Teacher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" placeholder="Name or employee ID" />
              </div>
            </div>
            {[
              { label: "Department",  value: deptFilter,       set: setDeptFilter,       opts: ["All Departments","Mathematics","Science","English","Sports","Computer Science","Social Science"] },
              { label: "Month",       value: monthFilter,      set: setMonthFilter,      opts: ["May 2026","April 2026","March 2026","February 2026","January 2026"] },
              { label: "Status",      value: statusFilter,     set: setStatusFilter,     opts: ["All Status","Paid","Pending","Processing"] },
              { label: "Salary Type", value: salaryTypeFilter, set: setSalaryTypeFilter, opts: ["All Types","Monthly","Contract","Part-time"] },
            ].map(({ label, value, set, opts }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                <Select value={value} onValueChange={set}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
              <ReceiptText className="size-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-base">Salary Payment Ledger</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{records.length} records · {monthFilter} payroll</p>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Teacher Name","Employee ID","Department","Designation","Basic Salary","Deductions","Bonus","Net Salary","Status","Date","Actions"].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Loading payroll…
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-rose-500">{error}</TableCell></TableRow>
              ) : records.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No records matching filters.</TableCell></TableRow>
              ) : (
                records.map((row) => (
                  <TableRow key={row.salary_payment_id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                    <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                    <TableCell className="text-muted-foreground">{row.department}</TableCell>
                    <TableCell className="text-muted-foreground">{row.designation}</TableCell>
                    <TableCell className="font-semibold text-foreground">{fmt(row.basic)}</TableCell>
                    <TableCell className="font-semibold text-rose-600 dark:text-rose-400">-{fmt(row.deductions)}</TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">+{fmt(row.bonus)}</TableCell>
                    <TableCell className="font-black text-blue-600 dark:text-blue-400">{fmt(row.net_salary)}</TableCell>
                    <TableCell><StatusBadge status={row.status} /></TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ReceiptText className="size-3.5" />Slip
                        </Button>
                        {row.status !== "Paid" && (
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleMarkAsPaid(row.salary_payment_id, row.name)}
                            disabled={markingId === row.salary_payment_id}
                          >
                            {markingId === row.salary_payment_id
                              ? <Loader2 className="size-3.5 animate-spin" />
                              : <Check className="size-3.5" />}
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FinanceShell>
  );
}
