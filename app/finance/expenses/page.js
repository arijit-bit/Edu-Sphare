"use client";

import { useState } from "react";

import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
import { DistributionDonutChart } from "@/components/finance/distribution-donut-chart";
import { EarningsComparisonChart } from "@/components/finance/earnings-comparison-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Briefcase,
  Check,
  Download,
  PieChart,
  Search,
  TrendingDown,
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
  { id: "EXP-5812", category: "Teacher Salary", description: "Payroll - Senior Wing", date: "25 May 2026", amount: 3120000, status: "Paid" },
  { id: "EXP-5798", category: "Transport", description: "Bus fuel and maintenance", date: "22 May 2026", amount: 385000, status: "Approved" },
  { id: "EXP-5784", category: "Electricity", description: "Campus utility bill", date: "21 May 2026", amount: 148000, status: "Paid" },
  { id: "EXP-5763", category: "Building Maintenance", description: "Science block repairs", date: "18 May 2026", amount: 235000, status: "Scheduled" },
  { id: "EXP-5749", category: "Events", description: "Inter-school arts festival", date: "16 May 2026", amount: 220000, status: "Pending" },
  { id: "EXP-5721", category: "Stationery", description: "Exam answer sheets", date: "12 May 2026", amount: 84000, status: "Paid" },
];

const distribution = [
  { key: "teacher", label: "Teacher Salary", value: 43, color: "#3d5af1" },
  { key: "staff", label: "Staff Salary", value: 14, color: "#0d9488" },
  { key: "transport", label: "Transport", value: 12, color: "#0ea5e9" },
  { key: "maintenance", label: "Building Maintenance", value: 9, color: "#d97706" },
  { key: "events", label: "Events", value: 7, color: "#f43f5e" },
  { key: "electricity", label: "Electricity", value: 6, color: "#f59e0b" },
  { key: "internet", label: "Internet & Comms", value: 3, color: "#7c3aed" },
  { key: "stationery", label: "Stationery", value: 3, color: "#8b5cf6" },
  { key: "misc", label: "Miscellaneous", value: 3, color: "#94a3b8" },
];

const monthlyBars = [
  { label: "Jan", previous: 45, current: 52 },
  { label: "Feb", previous: 52, current: 61 },
  { label: "Mar", previous: 43, current: 49 },
  { label: "Apr", previous: 57, current: 68 },
  { label: "May", previous: 50, current: 58 },
  { label: "Jun", previous: 62, current: 76 },
  { label: "Jul", previous: 55, current: 64 },
  { label: "Aug", previous: 69, current: 82 },
  { label: "Sep", previous: 60, current: 69 },
  { label: "Oct", previous: 73, current: 88 },
  { label: "Nov", previous: 65, current: 74 },
  { label: "Dec", previous: 78, current: 92 },
];

export default function TotalExpensesPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [dateRange, setDateRange] = useState("May 1 - May 31, 2026");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

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
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-foreground px-5 py-3 text-background shadow-2xl animate-in slide-in-from-top-2">
          <Check className="size-5 shrink-0 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Total Expenses"
        subtitle="Track all school expenditure - salaries, maintenance, transport, and more."
        action={
          <Button size="sm" variant="outline" className="gap-2" onClick={() => showToast("Exporting CSV...")}>
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Expenses This Year" value="₹5.74Cr" delta="+8.6% vs LY" icon={BarChart3} tone="rose" />
        <StatCard label="Expenses This Month" value="₹46.9L" delta="+3.2% vs Apr" icon={TrendingDown} tone="blue" />
        <StatCard label="Teacher Salaries" value="₹3.42Cr" delta="+6.1% planned" icon={Briefcase} tone="purple" />
        <StatCard label="Maintenance Cost" value="₹38.4L" delta="-4.8% optimized" icon={Check} tone="green" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Date Range", value: dateRange, set: setDateRange, opts: ["May 1 - May 31, 2026", "This Quarter", "This Year"] },
          { label: "Expense Category", value: categoryFilter, set: setCategoryFilter, opts: ["All Categories", "Teacher Salary", "Transport", "Electricity", "Building Maintenance", "Events", "Stationery"] },
          { label: "Academic Year", value: academicYear, set: setAcademicYear, opts: ["2025-2026", "2024-2025", "2023-2024"] },
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

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Monthly expense comparison (YoY)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <EarningsComparisonChart
              data={monthlyBars}
              title="Month"
              subtitle="Monthly expense trend shown in lakhs with the same responsive shadcn-style behavior as the earnings chart."
              currentLabel="Current Year"
              previousLabel="Previous Year"
              valueFormatter={(value) => `₹${value}L`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <CardTitle className="text-base">Expense distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <DistributionDonutChart
              data={distribution}
              centerLabel="₹5.74Cr"
              footerLabel="Year Total"
              className="mx-auto aspect-square h-[220px] max-h-[240px]"
            />
            <div className="w-full space-y-1.5">
              {distribution.map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                    {item.label}
                  </span>
                  <span className="font-black text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
                <BarChart3 className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-base">Expense Transactions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">{filteredTransactions.length} records</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-48 pl-9 text-xs"
                  placeholder="Search transactions..."
                />
              </div>
              <Button size="sm" onClick={() => showToast("Exporting CSV...")} className="gap-2">
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
                {["Transaction ID", "Category", "Description", "Date", "Amount", "Status", "Action"].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">{h}</TableHead>
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
                  <TableCell className="whitespace-nowrap text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-black text-foreground">{formatCurrency(row.amount)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell>
                    {row.status !== "Paid" ? (
                      <Button
                        size="sm"
                        className="h-8 gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handlePayTransaction(row.id)}
                      >
                        <Check className="size-3.5" />
                        Pay
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">-</span>
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
