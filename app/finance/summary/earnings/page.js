"use client";

import { useState } from "react";

import { FinanceShell, PageHeader, StatCard } from "@/app/finance/analytics-ui";
import {
  earningsCards,
} from "@/app/finance/summary/summary-data";
import { SummarySectionNav } from "@/app/finance/summary/section-nav";
import { DistributionDonutChart } from "@/components/finance/distribution-donut-chart";
import { EarningsComparisonChart } from "@/components/finance/earnings-comparison-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  Calendar,
  PieChart,
  TrendingUp,
} from "lucide-react";

const EARNINGS_BY_RANGE = {
  month: {
    cards: earningsCards,
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 73, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 7, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 12, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 5, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 2, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 1, color: "#94a3b8" },
    ],
    totalLabel: "₹72.4L",
    growth: "+12.8%",
  },
  quarter: {
    cards: [
      { label: "Total Earnings This Quarter", value: "₹2.15Cr", delta: "+15.2% vs LQ", icon: TrendingUp, tone: "green" },
      { label: "Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: TrendingUp, tone: "blue" },
      { label: "Student Fees Collected", value: "₹1.54Cr", delta: "+14.1% collected", icon: Calendar, tone: "purple" },
      { label: "Admission Fees", value: "₹28.2L", delta: "+8.1% intake", icon: TrendingUp, tone: "cyan" },
    ],
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 71, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 10, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 13, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 2, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 3, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 1, color: "#94a3b8" },
    ],
    totalLabel: "₹2.15Cr",
    growth: "+15.2%",
  },
  year: {
    cards: [
      { label: "Total Earnings This Year", value: "₹8.96Cr", delta: "+18.4% vs LY", icon: TrendingUp, tone: "green" },
      { label: "Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: TrendingUp, tone: "blue" },
      { label: "Student Fees Collected", value: "₹6.42Cr", delta: "+16.9% collected", icon: Calendar, tone: "purple" },
      { label: "Admission Fees", value: "₹78.6L", delta: "+9.7% intake", icon: TrendingUp, tone: "cyan" },
    ],
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 62, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 11, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 9, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 5, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 7, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 6, color: "#94a3b8" },
    ],
    totalLabel: "₹8.96Cr",
    growth: "+18.4%",
  },
};

const earningsTrendData = [
  { label: "Jan", current: 62, previous: 49 },
  { label: "Mar", current: 74, previous: 58 },
  { label: "May", current: 92, previous: 67 },
  { label: "Jul", current: 88, previous: 64 },
  { label: "Sep", current: 118, previous: 86 },
  { label: "Nov", current: 142, previous: 109 },
];

const earningsRows = [
  { label: "Student Fees", val: 92, color: "#3d5af1" },
  { label: "Admission Fees", val: 48, color: "#0d9488" },
  { label: "Transport Fees", val: 56, color: "#0ea5e9" },
  { label: "Exam Fees", val: 38, color: "#d97706" },
  { label: "Hostel & Canteen", val: 32, color: "#f59e0b" },
  { label: "Events & Activities", val: 24, color: "#f43f5e" },
  { label: "Other Income", val: 18, color: "#94a3b8" },
];

export default function FinanceSummaryEarningsPage() {
  const [range, setRange] = useState("year");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const data = EARNINGS_BY_RANGE[range];

  return (
    <FinanceShell title="Finance Summary">
      <PageHeader
        title="Earnings Detail"
        subtitle="Deep-dive into revenue performance, collection mix, and category strength within the finance summary section."
      />

      <SummarySectionNav />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Tabs value={range} onValueChange={setRange} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 sm:max-w-sm">
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="quarter">This Quarter</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full sm:w-48">
          <Label className="sr-only">Academic Year</Label>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["2025-2026", "2024-2025", "2023-2024"].map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Earnings comparison (Year over Year)</CardTitle>
          </CardHeader>
          <CardContent>
            <EarningsComparisonChart
              data={earningsTrendData}
              title="Month"
              subtitle="A shadcn-style responsive chart for annual earnings trends."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <CardTitle className="text-base">Income source distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <DistributionDonutChart
              data={data.distribution}
              centerLabel={data.totalLabel}
              footerLabel="Total Income"
              className="mx-auto aspect-square h-[220px] max-h-[240px]"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="size-5 text-primary" />
            <CardTitle className="text-base">Earnings by category</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {earningsRows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex justify-between text-sm font-bold text-muted-foreground">
                <span>{row.label}</span>
                <span style={{ color: row.color }}>{row.val}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${row.val}%`, background: row.color }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </FinanceShell>
  );
}
