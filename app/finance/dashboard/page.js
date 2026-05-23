"use client";

import { useState } from "react";

import {
  FinanceShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/app/finance/analytics-ui";
import { EarningsComparisonChart } from "@/components/finance/earnings-comparison-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Download,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

const expenseCategories = [
  { name: "Salaries", percent: 60, color: "#3d5af1" },
  { name: "Maintenance", percent: 15, color: "#0d9488" },
  { name: "Transport", percent: 10, color: "#d97706" },
  { name: "Electricity", percent: 5, color: "#dc2626" },
  { name: "Events", percent: 5, color: "#7c3aed" },
  { name: "Misc", percent: 5, color: "#94a3b8" },
];

const conicStr =
  "conic-gradient(#3d5af1 0% 60%, #0d9488 60% 75%, #d97706 75% 85%, #dc2626 85% 90%, #7c3aed 90% 95%, #94a3b8 95% 100%)";

const recentTransactions = [
  { id: "TXN-8841", name: "Aarav Sharma", type: "Fee", amount: "₹12,000", date: "20 May", status: "Paid" },
  { id: "TXN-8842", name: "Diya Patel", type: "Partial Fee", amount: "₹6,000", date: "18 May", status: "Partial" },
  { id: "TXN-8843", name: "Teacher Payroll", type: "Salary", amount: "₹65,000", date: "15 May", status: "Approved" },
  { id: "TXN-8844", name: "Kabir Verma", type: "Fee", amount: "₹0", date: "Due 10 May", status: "Overdue" },
  { id: "TXN-8845", name: "Sara Thomas", type: "Fee", amount: "₹4,800", date: "Due 28 May", status: "Partial" },
];

const financialMetrics = [
  {
    label: "Monthly Fees Collected",
    amount: "₹12,00,000",
    pct: 85,
    color: "#3d5af1",
    badge: "85% of target",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    label: "Pending Student Fees",
    amount: "₹1,85,000",
    pct: 15,
    color: "#dc2626",
    badge: "Requires Action",
    badgeBg: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
  },
  {
    label: "Teacher Salary Paid",
    amount: "₹6,50,000",
    pct: 100,
    color: "#0d9488",
    badge: "Completed",
    badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
];

const earningsComparisonData = [
  { label: "Q1", current: 58, previous: 46 },
  { label: "Q2", current: 82, previous: 63 },
  { label: "Q3", current: 114, previous: 87 },
  { label: "Q4", current: 148, previous: 119 },
];

export default function DashboardOverviewPage() {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  return (
    <FinanceShell title="Finance Overview">
      <PageHeader
        title="Finance Overview"
        subtitle="Financial summary for the current academic year 2025-2026."
        action={
          <Button size="sm" className="gap-2">
            <Download className="size-4" />
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value="1,240" delta="+2.4% from last month" icon={GraduationCap} tone="blue" />
        <StatCard label="Monthly Revenue" value="₹72.4L" delta="+8.4% vs last month" icon={TrendingUp} tone="green" />
        <StatCard label="Pending Dues" value="₹7.8L" delta="42 overdue" icon={AlertTriangle} tone="rose" />
        <StatCard label="Net Balance" value="₹45.2K" delta="Healthy standing" icon={Building2} tone="teal" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Financial Metrics - May 2026</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {financialMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl p-3 transition-colors hover:bg-muted/40">
                <div className="mb-2.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="mt-0.5 text-xl font-black text-foreground">{metric.amount}</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${metric.badgeBg}`}>
                    {metric.badge}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${metric.pct}%`, background: metric.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Expense Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div
              className="relative h-40 w-40 rounded-full shadow-inner transition-transform duration-300 hover:scale-105 sm:h-44 sm:w-44"
              style={{ background: conicStr }}
            >
              <div className="absolute inset-4 flex rounded-full bg-card text-center">
                <div className="m-auto">
                  <p className="text-base font-black text-foreground">
                    {hoveredSlice !== null ? `${expenseCategories[hoveredSlice].percent}%` : "100%"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                    {hoveredSlice !== null ? expenseCategories[hoveredSlice].name : "Total Expense"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid w-full gap-1.5 sm:grid-cols-2">
              {expenseCategories.map((item, index) => (
                <div
                  key={item.name}
                  className={`cursor-pointer rounded-lg p-1.5 text-xs font-semibold transition-colors ${
                    hoveredSlice === index ? "bg-muted font-bold text-foreground" : "text-muted-foreground"
                  }`}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
                    <span className="min-w-0 truncate">
                      {item.name} ({item.percent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Earnings Comparison - Current vs Previous Year</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Quarterly revenue trend with year-over-year comparison.
            </p>
          </div>
          <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            2025-2026 vs 2024-2025
          </span>
        </CardHeader>
        <CardContent>
          <EarningsComparisonChart
            data={earningsComparisonData}
            title="Quarter"
            subtitle="Values are shown in thousands of rupees and resize cleanly on tablets and phones."
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <BarChart3 className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Recent Transactions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">May 2026 ledger</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Transaction ID", "Name / Purpose", "Type", "Amount", "Date", "Status"].map((heading) => (
                    <TableHead key={heading} className="text-xs font-semibold uppercase tracking-wide">
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/40">
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                        {transaction.id}
                      </code>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{transaction.name}</TableCell>
                    <TableCell className="text-muted-foreground">{transaction.type}</TableCell>
                    <TableCell className="font-bold text-foreground">{transaction.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </FinanceShell>
  );
}
