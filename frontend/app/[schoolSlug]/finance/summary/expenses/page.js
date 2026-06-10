"use client";

import { useState } from "react";

import {
  FinanceShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/shells/finance-ui";
import {
  expenseCards,
  expenseDistribution,
} from "@/app/[schoolSlug]/finance/summary/summary-data";
import { SummarySectionNav } from "@/app/[schoolSlug]/finance/summary/section-nav";
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
  Check,
  Download,
  PieChart,
  Search,
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
  { id: "EXP-5812", category: "Teacher Salary", description: "Payroll - Senior Wing", date: "25 May 2026", amount: 3120000, status: "Paid" },
  { id: "EXP-5798", category: "Transport", description: "Bus fuel and maintenance", date: "22 May 2026", amount: 385000, status: "Approved" },
  { id: "EXP-5784", category: "Electricity", description: "Campus utility bill", date: "21 May 2026", amount: 148000, status: "Paid" },
  { id: "EXP-5763", category: "Building Maintenance", description: "Science block repairs", date: "18 May 2026", amount: 235000, status: "Scheduled" },
  { id: "EXP-5749", category: "Events", description: "Inter-school arts festival", date: "16 May 2026", amount: 220000, status: "Pending" },
  { id: "EXP-5721", category: "Stationery", description: "Exam answer sheets", date: "12 May 2026", amount: 84000, status: "Paid" },
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

export default function FinanceSummaryExpensesPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [dateRange, setDateRange] = useState("May 1 - May 31, 2026");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [search, setSearch] = useState("");

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const filteredTransactions = transactions.filter((t) => {
    const query = search.toLowerCase();
    const matchesSearch =
      t.description.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "All Categories" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <FinanceShell title="Finance Summary">
      <PageHeader
        title="Expense Detail"
        subtitle="Track spend patterns, category concentration, and transaction-level outflows inside the finance summary section."
        action={
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      <SummarySectionNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {expenseCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
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
              data={expenseDistribution}
              centerLabel="₹5.74Cr"
              footerLabel="Year Total"
              className="mx-auto aspect-square h-[220px] max-h-[240px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Expense Transactions</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{filteredTransactions.length} records</p>
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
              <Button size="sm" className="gap-2">
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
                {["Transaction ID", "Category", "Description", "Date", "Amount", "Status"].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                  <TableCell className="font-semibold text-foreground">{row.category}</TableCell>
                  <TableCell className="text-muted-foreground">{row.description}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-black text-foreground">{formatCurrency(row.amount)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FinanceShell>
  );
}
