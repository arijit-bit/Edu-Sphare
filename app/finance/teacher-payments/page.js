"use client";

import { useState } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
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
  Check, Download, Search, Users, TrendingUp, Briefcase, ReceiptText, Coins,
} from "lucide-react";

const INITIAL_SALARIES = [
  { id: "EMP-1024", name: "Meera Iyer",   department: "Mathematics",     designation: "Senior Teacher", basic: 68000, deductions: 2500, bonus: 5000, status: "Paid",       date: "25 May 2026" },
  { id: "EMP-1031", name: "Rahul Sen",    department: "Science",         designation: "HOD",            basic: 82000, deductions: 3200, bonus: 6000, status: "Paid",       date: "25 May 2026" },
  { id: "EMP-1048", name: "Ananya Bose",  department: "English",         designation: "PGT",            basic: 58000, deductions: 1200, bonus: 2000, status: "Processing", date: "28 May 2026" },
  { id: "EMP-1062", name: "Vikram Rao",   department: "Sports",          designation: "Coach",          basic: 45000, deductions: 900,  bonus: 1500, status: "Pending",    date: "28 May 2026" },
  { id: "EMP-1075", name: "Farah Ali",    department: "Computer Science",designation: "Senior Teacher", basic: 72000, deductions: 2100, bonus: 4000, status: "Paid",       date: "25 May 2026" },
  { id: "EMP-1088", name: "Nikhil Menon", department: "Social Science",  designation: "TGT",            basic: 54000, deductions: 1100, bonus: 1500, status: "Processing", date: "29 May 2026" },
];

export default function TeacherPaymentsPage() {
  const [salaries, setSalaries]                 = useState(INITIAL_SALARIES);
  const [search, setSearch]                     = useState("");
  const [deptFilter, setDeptFilter]             = useState("All Departments");
  const [statusFilter, setStatusFilter]         = useState("All Status");
  const [salaryTypeFilter, setSalaryTypeFilter] = useState("All Types");
  const [monthFilter, setMonthFilter]           = useState("May 2026");
  const [toastMessage, setToastMessage]         = useState("");

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(""), 3000); };

  const handleMarkAsPaid = (id) => {
    setSalaries((prev) => prev.map((item) =>
      item.id === id
        ? { ...item, status: "Paid", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }
        : item
    ));
    const t = salaries.find((s) => s.id === id);
    showToast(`Salary for ${t?.name} marked as Paid!`);
  };

  const handleBulkMarkPaid = () => {
    setSalaries((prev) => prev.map((item) =>
      item.status !== "Paid"
        ? { ...item, status: "Paid", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }
        : item
    ));
    showToast("All pending and processing salaries marked as Paid!");
  };

  const handleGenerateSlip = (name) => showToast(`Payslip generated for ${name}! Downloading…`);
  const fmt = (val) => `₹${val.toLocaleString("en-IN")}`;

  const filtered = salaries.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchDept   = deptFilter   === "All Departments" || item.department === deptFilter;
    const matchStatus = statusFilter === "All Status"      || item.status     === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPaid       = salaries.filter((i) => i.status === "Paid").reduce((s, i) => s + (i.basic - i.deductions + i.bonus), 0);
  const totalPending    = salaries.filter((i) => i.status !== "Paid").reduce((s, i) => s + (i.basic - i.deductions + i.bonus), 0);
  const totalDeductions = salaries.reduce((s, i) => s + i.deductions, 0);

  return (
    <FinanceShell title="Teacher Payroll">
      {/* Toast */}
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
            <Button className="gap-2" onClick={handleBulkMarkPaid}>
              <Check className="size-4" />
              Bulk Mark Paid
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => showToast("Exporting payroll data…")}>
              <Download className="size-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Teachers"      value="126"                delta="+4 new staff"    icon={Users}       tone="blue"   />
        <StatCard label="Salary Paid"         value={fmt(totalPaid)}     delta="+5.3% this month" icon={TrendingUp}  tone="green"  />
        <StatCard label="Pending Salaries"    value={fmt(totalPending)}  delta={`${salaries.filter((s) => s.status !== "Paid").length} records left`} icon={Briefcase} tone="amber" />
        <StatCard label="Average Salary"      value="₹58,400"           delta="+₹2,100 YoY"     icon={Coins}       tone="purple" />
        <StatCard label="Total Deductions"    value={fmt(totalDeductions)} delta="-1.2% vs Apr"  icon={ReceiptText} tone="rose"   />
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
              { label: "Department",   value: deptFilter,       set: setDeptFilter,       opts: ["All Departments","Mathematics","Science","English","Sports","Computer Science","Social Science"] },
              { label: "Month",        value: monthFilter,      set: setMonthFilter,      opts: ["May 2026","April 2026","March 2026"] },
              { label: "Status",       value: statusFilter,     set: setStatusFilter,     opts: ["All Status","Paid","Pending","Processing"] },
              { label: "Salary Type",  value: salaryTypeFilter, set: setSalaryTypeFilter, opts: ["All Types","Monthly","Contract","Part-time"] },
            ].map(({ label, value, set, opts }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                <Select value={value} onValueChange={set}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
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
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} records · May 2026 payroll</p>
            </div>
          </div>
        </CardHeader>

        {/* Mobile cards */}
        <CardContent className="md:hidden p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground font-medium">No records found.</p>
          ) : filtered.map((row) => (
            <div key={row.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.id} · {row.department} · {row.designation}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-t border-border pt-3 mb-3">
                <div><p className="text-xs font-bold text-muted-foreground">Basic</p><p className="font-bold text-foreground mt-0.5">{fmt(row.basic)}</p></div>
                <div><p className="text-xs font-bold text-muted-foreground">Bonus</p><p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{fmt(row.bonus)}</p></div>
                <div><p className="text-xs font-bold text-muted-foreground">Net Pay</p><p className="font-black text-blue-600 dark:text-blue-400 mt-0.5">{fmt(row.basic - row.deductions + row.bonus)}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => handleGenerateSlip(row.name)}>
                  <ReceiptText className="size-3.5" />Payslip
                </Button>
                {row.status !== "Paid" && (
                  <Button size="sm" className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleMarkAsPaid(row.id)}>
                    <Check className="size-3.5" />Mark Paid
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Teacher Name","Employee ID","Department","Designation","Basic Salary","Deductions","Bonus","Net Salary","Status","Date","Actions"].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No records matching filters.</TableCell></TableRow>
              ) : filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                  <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                  <TableCell className="text-muted-foreground">{row.department}</TableCell>
                  <TableCell className="text-muted-foreground">{row.designation}</TableCell>
                  <TableCell className="font-semibold text-foreground">{fmt(row.basic)}</TableCell>
                  <TableCell className="font-semibold text-rose-600 dark:text-rose-400">-{fmt(row.deductions)}</TableCell>
                  <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">+{fmt(row.bonus)}</TableCell>
                  <TableCell className="font-black text-blue-600 dark:text-blue-400">{fmt(row.basic - row.deductions + row.bonus)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => handleGenerateSlip(row.name)}>
                        <ReceiptText className="size-3.5" />Slip
                      </Button>
                      {row.status !== "Paid" && (
                        <Button size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleMarkAsPaid(row.id)}>
                          <Check className="size-3.5" />Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FinanceShell>
  );
}
