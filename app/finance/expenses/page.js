"use client";

import { useState } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, Search, Check, TrendingDown, BarChart3, PieChart, Briefcase,
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
  { id: "EXP-5812", category: "Teacher Salary",       description: "Payroll - Senior Wing",      date: "25 May 2026", amount: 3120000, status: "Paid"      },
  { id: "EXP-5798", category: "Transport",             description: "Bus fuel and maintenance",   date: "22 May 2026", amount: 385000,  status: "Approved"  },
  { id: "EXP-5784", category: "Electricity",           description: "Campus utility bill",        date: "21 May 2026", amount: 148000,  status: "Paid"      },
  { id: "EXP-5763", category: "Building Maintenance",  description: "Science block repairs",      date: "18 May 2026", amount: 235000,  status: "Scheduled" },
  { id: "EXP-5749", category: "Events",                description: "Inter-school arts festival", date: "16 May 2026", amount: 220000,  status: "Pending"   },
  { id: "EXP-5721", category: "Stationery",            description: "Exam answer sheets",         date: "12 May 2026", amount: 84000,   status: "Paid"      },
];

const distribution = [
  { label: "Teacher Salary",       value: "43%", pct: 43, color: "#3d5af1" },
  { label: "Staff Salary",         value: "14%", pct: 14, color: "#0d9488" },
  { label: "Transport",            value: "12%", pct: 12, color: "#0ea5e9" },
  { label: "Building Maintenance", value: "9%",  pct:  9, color: "#d97706" },
  { label: "Events",               value: "7%",  pct:  7, color: "#f43f5e" },
  { label: "Electricity",          value: "6%",  pct:  6, color: "#f59e0b" },
  { label: "Internet & Comms",     value: "3%",  pct:  3, color: "#7c3aed" },
  { label: "Stationery",           value: "3%",  pct:  3, color: "#8b5cf6" },
  { label: "Miscellaneous",        value: "3%",  pct:  3, color: "#94a3b8" },
];

const conicStr = "conic-gradient(#3d5af1 0% 43%, #0d9488 43% 57%, #0ea5e9 57% 69%, #d97706 69% 78%, #f43f5e 78% 85%, #f59e0b 85% 91%, #7c3aed 91% 94%, #8b5cf6 94% 97%, #94a3b8 97% 100%)";

const monthlyBars = [
  { prev: 45, curr: 52 }, { prev: 52, curr: 61 }, { prev: 43, curr: 49 },
  { prev: 57, curr: 68 }, { prev: 50, curr: 58 }, { prev: 62, curr: 76 },
  { prev: 55, curr: 64 }, { prev: 69, curr: 82 }, { prev: 60, curr: 69 },
  { prev: 73, curr: 88 }, { prev: 65, curr: 74 }, { prev: 78, curr: 92 },
];

export default function TotalExpensesPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [dateRange, setDateRange]       = useState("May 1 - May 31, 2026");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [search, setSearch]             = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(""), 3000); };

  const handlePayTransaction = (id) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Paid" } : t)));
    const tx = transactions.find((t) => t.id === id);
    showToast(`Transaction ${tx?.id} marked as Paid!`);
  };

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <FinanceShell title="Total Expenses">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-border animate-in slide-in-from-top-2">
          <Check className="size-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Total Expenses"
        subtitle="Track all school expenditure — salaries, maintenance, transport, and more."
        action={
          <Button size="sm" variant="outline" className="gap-2" onClick={() => showToast("Exporting CSV…")}>
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Expenses This Year" value="₹5.74Cr" delta="+8.6% vs LY"   icon={BarChart3}  tone="rose"   />
        <StatCard label="Expenses This Month"      value="₹46.9L"  delta="+3.2% vs Apr"  icon={TrendingDown} tone="blue" />
        <StatCard label="Teacher Salaries"         value="₹3.42Cr" delta="+6.1% planned" icon={Briefcase}  tone="purple" />
        <StatCard label="Maintenance Cost"         value="₹38.4L"  delta="-4.8% optimized" icon={Check}   tone="green"  />
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Date Range",         value: dateRange,       set: setDateRange,       opts: ["May 1 - May 31, 2026","This Quarter","This Year"] },
          { label: "Expense Category",   value: categoryFilter,  set: setCategoryFilter,  opts: ["All Categories","Teacher Salary","Transport","Electricity","Building Maintenance","Events","Stationery"] },
          { label: "Academic Year",      value: academicYear,    set: setAcademicYear,    opts: ["2025-2026","2024-2025","2023-2024"] },
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

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        {/* YoY Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Monthly expense comparison (YoY)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-2 border-b border-border pb-2">
              {monthlyBars.map((bar, i) => (
                <div key={i} className="flex flex-1 h-full items-end justify-center gap-0.5">
                  <span
                    className="flex-1 rounded-t-sm bg-muted hover:bg-muted-foreground/30 transition-colors cursor-pointer"
                    style={{ height: `${bar.prev}%` }}
                    title={`Prev Year: ${bar.prev}%`}
                  />
                  <span
                    className="flex-1 rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer bg-primary"
                    style={{ height: `${bar.curr}%` }}
                    title={`Current Year: ${bar.curr}%`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-12 text-center text-[10px] font-bold text-muted-foreground">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="flex gap-5 mt-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-4 h-0.5 bg-muted-foreground/40 rounded" /> Previous Year</span>
              <span className="flex items-center gap-1.5 text-primary"><span className="w-4 h-0.5 bg-primary rounded" /> Current Year</span>
            </div>
          </CardContent>
        </Card>

        {/* Donut */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <CardTitle className="text-base">Expense distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-36 h-36 rounded-full relative hover:scale-105 transition-transform shadow-inner" style={{ background: conicStr }}>
              <div className="absolute inset-3 rounded-full bg-card flex flex-col items-center justify-center">
                <span className="text-sm font-black text-foreground">₹5.74Cr</span>
                <span className="text-[9px] font-semibold text-muted-foreground">year total</span>
              </div>
            </div>
            <div className="w-full space-y-1.5">
              {distribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Ledger */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                <BarChart3 className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-base">Expense Transactions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{filteredTransactions.length} records</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 w-48 text-xs"
                  placeholder="Search transactions…"
                />
              </div>
              <Button size="sm" onClick={() => showToast("Exporting CSV…")} className="gap-2">
                <Download className="size-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Transaction ID","Category","Description","Date","Amount","Status","Action"].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No transactions match your filters.
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                  <TableCell className="font-semibold text-foreground">{row.category}</TableCell>
                  <TableCell className="text-muted-foreground">{row.description}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                  <TableCell className="font-black text-foreground">{formatCurrency(row.amount)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell>
                    {row.status !== "Paid" ? (
                      <Button
                        size="sm"
                        className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handlePayTransaction(row.id)}
                      >
                        <Check className="size-3.5" />
                        Pay
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">—</span>
                    )}
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
