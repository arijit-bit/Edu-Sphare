"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FinanceShell,
  PageHeader,
  StatCard,
} from "@/components/shells/finance-ui";
import { transformSummaryMetrics } from "@/app/[schoolSlug]/finance/summary/summary-data";
import { SummarySectionNav } from "@/app/[schoolSlug]/finance/summary/section-nav";
import { DistributionDonutChart } from "@/components/finance/distribution-donut-chart";
import { FinanceBalanceChart } from "@/components/finance/finance-balance-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Download,
  PieChart,
  Scale,
  Loader2,
  BadgeIndianRupee,
  ReceiptText,
  WalletCards,
  TrendingUp,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXPENSE_COLORS = [
  "#3d5af1","#0d9488","#0ea5e9","#d97706","#f43f5e",
  "#f59e0b","#7c3aed","#8b5cf6","#94a3b8",
];

function fmtINR(value) {
  const v = parseFloat(value ?? 0);
  if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
  if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

export default function FinanceSummaryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/finance/summary");
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load summary data");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const metrics       = data?.metrics ?? {};
  const monthlyTrend  = data?.monthlyTrend ?? [];
  const expenseDist   = (data?.expenseDist ?? []).map((c, i) => ({
    ...c,
    color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
  }));
  const earningSummary = data?.earningSummary ?? {};
  const summaryCards   = transformSummaryMetrics(metrics);

  const auditorHighlights = [
    {
      label: "Total Earnings",
      title: `${data?.academicYear ?? "This year"} academic year`,
      value: fmtINR(metrics.totalEarnings),
      tone: "green",
      icon: TrendingUp,
    },
    {
      label: "Largest Cost Center",
      title: "Annual salary outflow",
      value: fmtINR(metrics.totalExpenses),
      tone: "rose",
      icon: ReceiptText,
    },
    {
      label: "Pending Student Dues",
      title: "Still outstanding",
      value: "Check dashboard",
      tone: "amber",
      icon: BadgeIndianRupee,
    },
    {
      label: "Net Surplus",
      title: metrics.netSurplus >= 0 ? "Healthy operating margin" : "Deficit — review needed",
      value: fmtINR(metrics.netSurplus),
      tone: metrics.netSurplus >= 0 ? "teal" : "rose",
      icon: WalletCards,
    },
  ];

  return (
    <FinanceShell title="Finance Summary">
      <PageHeader
        title="Auditor Summary"
        subtitle={`Combined earnings and expenses snapshot for ${data?.academicYear ?? "current academic year"}.`}
        action={
          <Button size="sm" className="gap-2">
            <Download className="size-4" />
            Export Summary
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
          {error} — <button className="underline font-semibold" onClick={loadSummary}>Retry</button>
        </div>
      )}

      <SummarySectionNav />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-24 animate-pulse bg-muted/40" />)
          : summaryCards.map((card) => (
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

      {/* Hero Banner */}
      <div className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,_rgba(61,90,241,0.22),_transparent_38%),linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#0f766e_100%)] p-6 text-white shadow-xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
              Auditor Lens
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                {metrics.netSurplus >= 0
                  ? "Earnings outpace expenses with a stable surplus curve."
                  : "Expenses exceed earnings — action required."}
              </h2>
              <p className="max-w-2xl text-sm font-medium text-slate-200/90 sm:text-base">
                Fee collection efficiency stands at {metrics.collectionEfficiency ?? 0}% for {data?.academicYear ?? "this year"}.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/10" />
              ))
            ) : (
              [
                { label: "Year Earnings", value: fmtINR(metrics.totalEarnings) },
                { label: "Year Expenses", value: fmtINR(metrics.totalExpenses) },
                { label: "Surplus",       value: fmtINR(metrics.netSurplus) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200/80">{item.label}</p>
                  <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trend Chart + Expense Donut */}
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <CardTitle className="text-base">Earnings vs expenses balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="size-5 animate-spin" /> Loading trend…
              </div>
            ) : monthlyTrend.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">No trend data for the active academic year.</p>
            ) : (
              <FinanceBalanceChart
                data={monthlyTrend}
                title="Month"
                subtitle="Blue bars show earnings, orange bars show expenses, teal line tracks surplus."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="size-5 text-primary" />
              <CardTitle className="text-base">Expense share mix</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-5">
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : expenseDist.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">No expense data yet.</p>
            ) : (
              <>
                <DistributionDonutChart
                  data={expenseDist}
                  centerLabel={fmtINR(metrics.totalExpenses)}
                  footerLabel="Annual spend"
                  className="mx-auto aspect-square h-[240px] max-h-[250px]"
                />
                <div className="grid w-full gap-2">
                  {expenseDist.slice(0, 5).map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
                        {item.label}
                      </span>
                      <span className="font-black text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auditor Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-32 animate-pulse bg-muted/40" />)
          : auditorHighlights.map((item) => (
              <Card key={item.label} className="transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <StatCard
                    label={item.label}
                    value={item.value}
                    delta={item.title}
                    icon={item.icon}
                    tone={item.tone}
                    className="border-0 bg-transparent p-0 shadow-none hover:shadow-none"
                  />
                  <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                    Review detail
                    <ArrowRight className="size-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </FinanceShell>
  );
}
