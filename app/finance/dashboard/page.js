"use client";

import { useState } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, GraduationCap, TrendingUp, AlertTriangle, Building2,
  BarChart3, LineChart,
} from "lucide-react";

const expenseCategories = [
  { name: "Salaries",    percent: 60, color: "#3d5af1" },
  { name: "Maintenance", percent: 15, color: "#0d9488" },
  { name: "Transport",   percent: 10, color: "#d97706" },
  { name: "Electricity", percent:  5, color: "#dc2626" },
  { name: "Events",      percent:  5, color: "#7c3aed" },
  { name: "Misc",        percent:  5, color: "#94a3b8" },
];

const conicStr =
  "conic-gradient(#3d5af1 0% 60%, #0d9488 60% 75%, #d97706 75% 85%, #dc2626 85% 90%, #7c3aed 90% 95%, #94a3b8 95% 100%)";

const recentTransactions = [
  { id: "TXN-8841", name: "Aarav Sharma",   type: "Fee",         amount: "₹12,000", date: "20 May", status: "Paid"     },
  { id: "TXN-8842", name: "Diya Patel",     type: "Partial Fee", amount: "₹6,000",  date: "18 May", status: "Partial"  },
  { id: "TXN-8843", name: "Teacher Payroll",type: "Salary",      amount: "₹65,000", date: "15 May", status: "Approved" },
  { id: "TXN-8844", name: "Kabir Verma",    type: "Fee",         amount: "₹0",      date: "Due 10 May", status: "Overdue" },
  { id: "TXN-8845", name: "Sara Thomas",    type: "Fee",         amount: "₹4,800",  date: "Due 28 May", status: "Partial" },
];

const financialMetrics = [
  { label: "Monthly Fees Collected", amount: "₹12,00,000", pct: 85,  color: "#3d5af1", badge: "85% of target",    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  { label: "Pending Student Fees",   amount: "₹1,85,000",  pct: 15,  color: "#dc2626", badge: "Requires Action",  badgeBg: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" },
  { label: "Teacher Salary Paid",    amount: "₹6,50,000",  pct: 100, color: "#0d9488", badge: "Completed",        badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
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

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Students"  value="1,240"   delta="+2.4% from last month" icon={GraduationCap} tone="blue"  />
        <StatCard label="Monthly Revenue" value="₹72.4L"  delta="+8.4% vs last month"  icon={TrendingUp}    tone="green" />
        <StatCard label="Pending Dues"    value="₹7.8L"   delta="42 overdue"            icon={AlertTriangle} tone="rose"  />
        <StatCard label="Net Balance"     value="₹45.2K"  delta="Healthy standing"      icon={Building2}     tone="teal"  />
      </div>

      {/* Financial Metrics + Expense Donut */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Metrics card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Financial Metrics — May 2026</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {financialMetrics.map((m) => (
              <div key={m.label} className="rounded-xl p-3 hover:bg-muted/40 transition-colors">
                <div className="flex justify-between items-end mb-2.5">
                  <div>
                    <p className="text-sm text-muted-foreground">{m.label}</p>
                    <p className="text-xl font-black text-foreground mt-0.5">{m.amount}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${m.badgeBg}`}>
                    {m.badge}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.pct}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expense Donut */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Expense Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div
              className="w-44 h-44 rounded-full relative hover:scale-105 transition-transform duration-300 shadow-inner"
              style={{ background: conicStr }}
            >
              <div className="absolute inset-4 rounded-full bg-card flex flex-col items-center justify-center text-center">
                <p className="text-base font-black text-foreground">
                  {hoveredSlice !== null ? `${expenseCategories[hoveredSlice].percent}%` : "100%"}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                  {hoveredSlice !== null ? expenseCategories[hoveredSlice].name : "Total Expense"}
                </p>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-1.5">
              {expenseCategories.map((item, idx) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 rounded-lg p-1.5 cursor-pointer transition-colors text-xs font-semibold ${
                    hoveredSlice === idx ? "bg-muted text-foreground font-bold" : "text-muted-foreground"
                  }`}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
                  {item.name} ({item.percent}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Line Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="size-5 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-base">Earnings Comparison — Current vs Previous Year</CardTitle>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">2025-2026 vs 2024-2025</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-52">
            <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-border pb-6 pl-10">
              {["150k", "100k", "50k", "0"].map((tick) => (
                <div key={tick} className="w-full border-t border-border/50 relative">
                  <span className="absolute -left-10 -top-2 text-[10px] text-muted-foreground font-semibold">{tick}</span>
                </div>
              ))}
            </div>
            <svg
              className="absolute inset-0 h-[calc(100%-24px)] w-[calc(100%-8px)] ml-2"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="dashEarningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d5af1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3d5af1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Prev year */}
              <path d="M 0,80 C 25,65 25,75 50,60 C 75,45 75,55 100,30 L 100,100 L 0,100 Z" fill="rgba(13,148,136,0.08)" />
              <path d="M 0,80 C 25,65 25,75 50,60 C 75,45 75,55 100,30" fill="none" stroke="#0d9488" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4,3" />
              {/* Current year */}
              <path d="M 0,70 C 25,50 25,45 50,30 C 75,15 75,20 100,10 L 100,100 L 0,100 Z" fill="url(#dashEarningsFill)" />
              <path d="M 0,70 C 25,50 25,45 50,30 C 75,15 75,20 100,10" fill="none" stroke="#3d5af1" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="30" r="3" fill="#3d5af1" />
              <circle cx="100" cy="10" r="3" fill="#3d5af1" />
            </svg>
            <div className="absolute bottom-0 left-10 w-full flex justify-between pr-4 text-[10px] font-bold text-muted-foreground">
              {["Q1", "Q2", "Q3", "Q4"].map((q) => <span key={q}>{q}</span>)}
            </div>
          </div>
          <div className="flex gap-5 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded inline-block" />
              Current Year
            </span>
            <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <span className="w-5 h-0.5 bg-teal-600 dark:bg-teal-400 rounded inline-block opacity-50" />
              Previous Year
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <BarChart3 className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Recent Transactions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">May 2026 ledger</p>
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
                  {["Transaction ID", "Name / Purpose", "Type", "Amount", "Date", "Status"].map((h) => (
                    <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/40">
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{tx.id}</code>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{tx.name}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.type}</TableCell>
                    <TableCell className="font-bold text-foreground">{tx.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
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
