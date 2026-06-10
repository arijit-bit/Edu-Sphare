"use client";

import {
  FinanceShell,
  PageHeader,
  StatCard,
} from "@/components/shells/finance-ui";
import {
  auditorHighlights,
  categoryBalanceData,
  combinedTrendData,
  expenseDistribution,
  summaryMetrics,
} from "@/app/[schoolSlug]/finance/summary/summary-data";
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
} from "lucide-react";

export default function FinanceSummaryPage() {
  return (
    <FinanceShell title="Finance Summary">
      <PageHeader
        title="Auditor Summary"
        subtitle="Combined earnings and expenses snapshot with balance trends, category mix, and surplus health for the current academic year."
        action={
          <Button size="sm" className="gap-2">
            <Download className="size-4" />
            Export Summary
          </Button>
        }
      />

      <SummarySectionNav />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryMetrics.map((card) => (
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

      <div className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,_rgba(61,90,241,0.22),_transparent_38%),linear-gradient(135deg,_#0f172a_0%,_#111827_52%,_#0f766e_100%)] p-6 text-white shadow-xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
              Auditor Lens
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Earnings outpace expenses with a stable surplus curve.
              </h2>
              <p className="max-w-2xl text-sm font-medium text-slate-200/90 sm:text-base">
                Revenue growth remains ahead of operational spend across every major review window,
                giving auditors a clean line of sight into margin quality and category exposure.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Year Earnings", value: "₹8.96Cr" },
              { label: "Year Expenses", value: "₹5.74Cr" },
              { label: "Surplus", value: "₹3.22Cr" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200/80">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <Scale className="size-5 text-primary" />
              <CardTitle className="text-base">Earnings vs expenses balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <FinanceBalanceChart
              data={combinedTrendData}
              title="Month"
              subtitle="Blue bars show earnings, orange bars show expenses, and the teal line tracks surplus in lakhs."
            />
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
            <DistributionDonutChart
              data={expenseDistribution}
              centerLabel="₹5.74Cr"
              footerLabel="Annual spend"
              className="mx-auto aspect-square h-[240px] max-h-[250px]"
            />
            <div className="grid w-full gap-2">
              {expenseDistribution.slice(0, 5).map((item) => (
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Category balance map</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {categoryBalanceData.map((item) => {
              const total = item.earnings + item.expenses || 1;
              const earningsWidth = (item.earnings / total) * 100;
              const expensesWidth = (item.expenses / total) * 100;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">
                      ₹{item.earnings}L in / ₹{item.expenses}L out
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-full bg-muted">
                    <div className="flex h-3">
                      <span
                        className="h-full bg-[#3d5af1]"
                        style={{ width: `${earningsWidth}%` }}
                      />
                      <span
                        className="h-full bg-[#f97316]"
                        style={{ width: `${expensesWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {auditorHighlights.map((item) => (
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
      </div>
    </FinanceShell>
  );
}

