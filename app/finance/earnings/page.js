"use client";

import { useState } from "react";

import { FinanceShell, PageHeader, StatCard } from "@/app/finance/analytics-ui";
import { DistributionDonutChart } from "@/components/finance/distribution-donut-chart";
import { EarningsComparisonChart } from "@/components/finance/earnings-comparison-chart";
import { Badge } from "@/components/ui/badge";
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
  Coins,
  GraduationCap,
  PieChart,
  TrendingUp,
  Zap,
} from "lucide-react";

const EARNINGS_BY_RANGE = {
  year: {
    cards: [
      { label: "Total Earnings This Year", value: "₹8.96Cr", delta: "+18.4% vs LY", icon: TrendingUp, tone: "green" },
      { label: "Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: Coins, tone: "blue" },
      { label: "Student Fees Collected", value: "₹6.42Cr", delta: "+16.9% collected", icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees", value: "₹78.6L", delta: "+9.7% intake", icon: Zap, tone: "cyan" },
      { label: "Exam Fees", value: "₹42.1L", delta: "+6.4% scheduled", icon: Calendar, tone: "amber" },
      { label: "Transport Fees", value: "₹91.5L", delta: "+14.2% routes", icon: TrendingUp, tone: "blue" },
      { label: "Other Income", value: "₹41.3L", delta: "+5.8% activities", icon: BarChart2, tone: "teal" },
    ],
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 62, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 11, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 9, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 5, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 7, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 6, color: "#94a3b8" },
    ],
    growth: "+18.4%",
    totalLabel: "₹8.96Cr",
  },
  quarter: {
    cards: [
      { label: "Total Earnings This Quarter", value: "₹2.15Cr", delta: "+15.2% vs LQ", icon: TrendingUp, tone: "green" },
      { label: "Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: Coins, tone: "blue" },
      { label: "Student Fees Collected", value: "₹1.54Cr", delta: "+14.1% collected", icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees", value: "₹28.2L", delta: "+8.1% intake", icon: Zap, tone: "cyan" },
      { label: "Exam Fees", value: "₹12.5L", delta: "+5.2% scheduled", icon: Calendar, tone: "amber" },
      { label: "Transport Fees", value: "₹22.8L", delta: "+11.4% routes", icon: TrendingUp, tone: "blue" },
      { label: "Other Income", value: "₹9.1L", delta: "+4.1% activities", icon: BarChart2, tone: "teal" },
    ],
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 71, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 10, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 13, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 2, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 3, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 1, color: "#94a3b8" },
    ],
    growth: "+15.2%",
    totalLabel: "₹2.15Cr",
  },
  month: {
    cards: [
      { label: "Total Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: TrendingUp, tone: "green" },
      { label: "Student Fees Collected", value: "₹52.8L", delta: "73% of monthly target", icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees", value: "₹8.4L", delta: "24 new admissions", icon: Zap, tone: "cyan" },
      { label: "Exam Fees", value: "₹4.1L", delta: "Scheduled exams paid", icon: Calendar, tone: "amber" },
      { label: "Transport Fees", value: "₹5.2L", delta: "All routes updated", icon: TrendingUp, tone: "blue" },
      { label: "Other Income", value: "₹1.9L", delta: "Canteen & activities", icon: BarChart2, tone: "teal" },
    ],
    distribution: [
      { key: "tuition", label: "Tuition Fees", value: 73, color: "#3d5af1" },
      { key: "transport", label: "Transport Fees", value: 7, color: "#0ea5e9" },
      { key: "admission", label: "Admission Fees", value: 12, color: "#0d9488" },
      { key: "exam", label: "Exam Fees", value: 5, color: "#d97706" },
      { key: "hostel", label: "Hostel & Canteen", value: 2, color: "#f59e0b" },
      { key: "other", label: "Other Income", value: 1, color: "#94a3b8" },
    ],
    growth: "+12.8%",
    totalLabel: "₹72.4L",
  },
};

const earningsRows = [
  { label: "Student Fees", val: 92, color: "#3d5af1" },
  { label: "Admission Fees", val: 48, color: "#0d9488" },
  { label: "Transport Fees", val: 56, color: "#0ea5e9" },
  { label: "Exam Fees", val: 38, color: "#d97706" },
  { label: "Hostel & Canteen", val: 32, color: "#f59e0b" },
  { label: "Events & Activities", val: 24, color: "#f43f5e" },
  { label: "Other Income", val: 18, color: "#94a3b8" },
];

const highlights = [
  { label: "Best Month", title: "May 2026", value: "₹72.4L", icon: Calendar, tone: "blue" },
  { label: "Highest Source", title: "Tuition fees", value: "₹6.42Cr", icon: GraduationCap, tone: "teal" },
  { label: "Pending Collection", title: "Student dues", value: "₹7.8L", icon: Zap, tone: "rose" },
  { label: "Projected Year-End", title: "Forecast", value: "₹9.82Cr", icon: TrendingUp, tone: "purple" },
];

const earningsTrendData = [
  { label: "Jan", current: 62, previous: 49 },
  { label: "Mar", current: 74, previous: 58 },
  { label: "May", current: 92, previous: 67 },
  { label: "Jul", current: 88, previous: 64 },
  { label: "Sep", current: 118, previous: 86 },
  { label: "Nov", current: 142, previous: 109 },
];

export default function TotalEarningsPage() {
  const [range, setRange] = useState("year");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const data = EARNINGS_BY_RANGE[range] || EARNINGS_BY_RANGE.year;

  return (
    <FinanceShell title="Total Earnings">
      <PageHeader
        title="Total Earnings"
        subtitle="Track school revenue by period - fees, admissions, transport, and other income streams."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Tabs value={range} onValueChange={setRange} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 sm:max-w-sm">
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="quarter">This Quarter</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full sm:w-48">
          <Label className="sr-only text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Academic Year
          </Label>
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
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            delta={card.delta}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f172a 100%)" }}
      >
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">Revenue Growth</p>
            <p className="mt-3 text-4xl font-black text-white sm:text-5xl md:text-6xl">{data.growth}</p>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Compared to academic year 2024-2025 during the same period.
            </p>
          </div>
          <div className="relative z-10 flex h-28 flex-1 items-end gap-1.5 md:max-w-sm">
            {[40, 52, 49, 64, 61, 78, 70, 88].map((value, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-lg transition-all duration-500"
                style={{ height: `${value}%`, background: "linear-gradient(to top, #3d5af1, #86f2e4)" }}
              />
            ))}
          </div>
        </div>
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
            <div className="w-full space-y-1.5">
              {data.distribution.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="font-black text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
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

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">Monthly revenue highlights</CardTitle>
              <Badge
                variant="secondary"
                className="w-fit bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400"
              >
                92.4% collection rate
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  delta={item.title}
                  icon={item.icon}
                  tone={item.tone}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceShell>
  );
}
