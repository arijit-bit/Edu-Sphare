"use client";

import { useState } from "react";
import { FinanceShell, PageHeader, StatCard } from "@/app/finance/analytics-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp, PieChart, LineChart, BarChart2, Calendar, Zap,
  GraduationCap, Coins,
} from "lucide-react";

const EARNINGS_BY_RANGE = {
  "year": {
    cards: [
      { label: "Total Earnings This Year", value: "₹8.96Cr",  delta: "+18.4% vs LY",       icon: TrendingUp,    tone: "green"  },
      { label: "Earnings This Month",      value: "₹72.4L",   delta: "+12.8% vs Apr",       icon: Coins,         tone: "blue"   },
      { label: "Student Fees Collected",   value: "₹6.42Cr",  delta: "+16.9% collected",    icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees",           value: "₹78.6L",   delta: "+9.7% intake",        icon: Zap,           tone: "cyan"   },
      { label: "Exam Fees",                value: "₹42.1L",   delta: "+6.4% scheduled",     icon: Calendar,      tone: "amber"  },
      { label: "Transport Fees",           value: "₹91.5L",   delta: "+14.2% routes",       icon: TrendingUp,    tone: "blue"   },
      { label: "Other Income",             value: "₹41.3L",   delta: "+5.8% activities",    icon: BarChart2,     tone: "teal"   },
    ],
    distribution: [
      { label: "Tuition Fees",    value: "62%", color: "#3d5af1" },
      { label: "Transport Fees",  value: "11%", color: "#0ea5e9" },
      { label: "Admission Fees",  value: "9%",  color: "#0d9488" },
      { label: "Exam Fees",       value: "5%",  color: "#d97706" },
      { label: "Hostel & Canteen",value: "7%",  color: "#f59e0b" },
      { label: "Other Income",    value: "6%",  color: "#94a3b8" },
    ],
    conic: "conic-gradient(#3d5af1 0% 62%, #0ea5e9 62% 73%, #0d9488 73% 82%, #d97706 82% 87%, #f59e0b 87% 94%, #94a3b8 94% 100%)",
    growth: "+18.4%",
    totalLabel: "₹8.96Cr",
  },
  "quarter": {
    cards: [
      { label: "Total Earnings This Quarter", value: "₹2.15Cr", delta: "+15.2% vs LQ",    icon: TrendingUp,    tone: "green"  },
      { label: "Earnings This Month",         value: "₹72.4L",  delta: "+12.8% vs Apr",   icon: Coins,         tone: "blue"   },
      { label: "Student Fees Collected",      value: "₹1.54Cr", delta: "+14.1% collected", icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees",              value: "₹28.2L",  delta: "+8.1% intake",    icon: Zap,           tone: "cyan"   },
      { label: "Exam Fees",                   value: "₹12.5L",  delta: "+5.2% scheduled", icon: Calendar,      tone: "amber"  },
      { label: "Transport Fees",              value: "₹22.8L",  delta: "+11.4% routes",   icon: TrendingUp,    tone: "blue"   },
      { label: "Other Income",                value: "₹9.1L",   delta: "+4.1% activities",icon: BarChart2,     tone: "teal"   },
    ],
    distribution: [
      { label: "Tuition Fees",    value: "71%", color: "#3d5af1" },
      { label: "Transport Fees",  value: "10%", color: "#0ea5e9" },
      { label: "Admission Fees",  value: "13%", color: "#0d9488" },
      { label: "Exam Fees",       value: "2%",  color: "#d97706" },
      { label: "Hostel & Canteen",value: "3%",  color: "#f59e0b" },
      { label: "Other Income",    value: "1%",  color: "#94a3b8" },
    ],
    conic: "conic-gradient(#3d5af1 0% 71%, #0ea5e9 71% 81%, #0d9488 81% 94%, #d97706 94% 96%, #f59e0b 96% 99%, #94a3b8 99% 100%)",
    growth: "+15.2%",
    totalLabel: "₹2.15Cr",
  },
  "month": {
    cards: [
      { label: "Total Earnings This Month", value: "₹72.4L",  delta: "+12.8% vs Apr",       icon: TrendingUp,    tone: "green"  },
      { label: "Student Fees Collected",    value: "₹52.8L",  delta: "73% of monthly target",icon: GraduationCap, tone: "purple" },
      { label: "Admission Fees",            value: "₹8.4L",   delta: "24 new admissions",    icon: Zap,           tone: "cyan"   },
      { label: "Exam Fees",                 value: "₹4.1L",   delta: "Scheduled exams paid", icon: Calendar,      tone: "amber"  },
      { label: "Transport Fees",            value: "₹5.2L",   delta: "All routes updated",   icon: TrendingUp,    tone: "blue"   },
      { label: "Other Income",              value: "₹1.9L",   delta: "Canteen & activities", icon: BarChart2,     tone: "teal"   },
    ],
    distribution: [
      { label: "Tuition Fees",    value: "73%", color: "#3d5af1" },
      { label: "Transport Fees",  value: "7%",  color: "#0ea5e9" },
      { label: "Admission Fees",  value: "12%", color: "#0d9488" },
      { label: "Exam Fees",       value: "5%",  color: "#d97706" },
      { label: "Hostel & Canteen",value: "2%",  color: "#f59e0b" },
      { label: "Other Income",    value: "1%",  color: "#94a3b8" },
    ],
    conic: "conic-gradient(#3d5af1 0% 73%, #0ea5e9 73% 80%, #0d9488 80% 92%, #d97706 92% 97%, #f59e0b 97% 99%, #94a3b8 99% 100%)",
    growth: "+12.8%",
    totalLabel: "₹72.4L",
  },
};

const earningsRows = [
  { label: "Student Fees",         val: 92, color: "#3d5af1" },
  { label: "Admission Fees",       val: 48, color: "#0d9488" },
  { label: "Transport Fees",       val: 56, color: "#0ea5e9" },
  { label: "Exam Fees",            val: 38, color: "#d97706" },
  { label: "Hostel & Canteen",     val: 32, color: "#f59e0b" },
  { label: "Events & Activities",  val: 24, color: "#f43f5e" },
  { label: "Other Income",         val: 18, color: "#94a3b8" },
];

const highlights = [
  { label: "Best Month",         title: "May 2026",     value: "₹72.4L", icon: Calendar,    tone: "blue"   },
  { label: "Highest Source",     title: "Tuition fees", value: "₹6.42Cr",icon: GraduationCap,tone: "teal"  },
  { label: "Pending Collection", title: "Student dues", value: "₹7.8L",  icon: Zap,         tone: "rose"   },
  { label: "Projected Year-End", title: "Forecast",     value: "₹9.82Cr",icon: TrendingUp,  tone: "purple" },
];

export default function TotalEarningsPage() {
  const [range, setRange]         = useState("year");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const data = EARNINGS_BY_RANGE[range] || EARNINGS_BY_RANGE["year"];

  return (
    <FinanceShell title="Total Earnings">
      <PageHeader
        title="Total Earnings"
        subtitle="Track school revenue by period — fees, admissions, transport, and other income streams."
      />

      {/* Range Tabs + Year Select */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <Tabs value={range} onValueChange={setRange} className="flex-1">
          <TabsList className="grid grid-cols-3 w-full max-w-sm">
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="quarter">This Quarter</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full sm:w-48">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sr-only">Academic Year</Label>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["2025-2026","2024-2025","2023-2024"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} delta={card.delta} icon={card.icon} tone={card.tone} />
        ))}
      </div>

      {/* Growth Banner */}
      <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f172a 100%)" }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between p-6 relative">
          <div aria-hidden="true" className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">Revenue Growth</p>
            <p className="mt-3 text-6xl font-black text-white">{data.growth}</p>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Compared to academic year 2024-2025 during the same period.
            </p>
          </div>
          {/* Mini bar chart */}
          <div className="flex h-28 flex-1 items-end gap-1.5 md:max-w-sm relative z-10">
            {[40,52,49,64,61,78,70,88].map((value, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-lg transition-all duration-500"
                style={{ height: `${value}%`, background: "linear-gradient(to top, #3d5af1, #86f2e4)" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SVG Line Chart + Donut */}
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        {/* SVG Earnings Line Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <LineChart className="size-5 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-base">Earnings comparison (Year over Year)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-64">
              <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-border pb-6 pl-10">
                {["150k","100k","50k","0"].map((tick) => (
                  <div key={tick} className="w-full border-t border-border/50 relative">
                    <span className="absolute -left-10 -top-2 text-[10px] text-muted-foreground font-semibold">{tick}</span>
                  </div>
                ))}
              </div>
              <svg
                className="absolute inset-0 h-[calc(100%-24px)] w-[calc(100%-12px)] ml-3"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="earningsLineAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d5af1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3d5af1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0,75 C 10,65 20,55 30,60 C 40,65 50,45 60,50 C 70,55 80,30 90,35 C 95,37 98,22 100,18 L 100,100 L 0,100 Z" fill="url(#earningsLineAreaFill)" />
                <path d="M 0,85 C 10,80 20,70 30,75 C 40,80 50,60 60,65 C 70,70 80,45 90,50 C 95,52 98,42 100,38" fill="none" stroke="#0d9488" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4,3" />
                <path d="M 0,75 C 10,65 20,55 30,60 C 40,65 50,45 60,50 C 70,55 80,30 90,35 C 95,37 98,22 100,18" fill="none" stroke="#3d5af1" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="45" r="2.5" fill="#3d5af1" />
                <circle cx="100" cy="18" r="2.5" fill="#3d5af1" />
              </svg>
              <div className="absolute bottom-0 left-10 w-full flex justify-between pr-4 text-[10px] font-bold text-muted-foreground">
                {["Jan","Mar","May","Jul","Sep","Nov"].map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
            <div className="flex gap-5 mt-4 text-xs font-semibold">
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

        {/* Donut Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <CardTitle className="text-base">Income source distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div
              className="w-44 h-44 rounded-full shadow-inner relative transition-transform duration-300 hover:scale-105"
              style={{ background: data.conic }}
            >
              <div className="absolute inset-4 bg-card rounded-full flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-base font-black text-foreground">{data.totalLabel}</span>
                <span className="text-[10px] font-bold text-muted-foreground">total income</span>
              </div>
            </div>
            <div className="w-full space-y-1.5">
              {data.distribution.map((item) => (
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

      {/* Horizontal Category Bars + Highlights */}
      <div className="grid gap-5 xl:grid-cols-2">
        {/* Horizontal Bars */}
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
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${row.val}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Highlights */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Monthly revenue highlights</CardTitle>
              <Badge variant="secondary" className="text-teal-700 bg-teal-100 dark:bg-teal-950/30 dark:text-teal-400">92.4% collection rate</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
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
