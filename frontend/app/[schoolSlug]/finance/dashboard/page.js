"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FinanceShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/shells/finance-ui";
import { DistributionDonutChart } from "@/components/finance/distribution-donut-chart";
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
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

// Colour palette for expense donut slices
const EXPENSE_COLORS = ["#3d5af1","#0d9488","#d97706","#dc2626","#7c3aed","#0ea5e9","#f59e0b","#8b5cf6","#94a3b8"];

function fmtINR(value) {
  if (!value && value !== 0) return "—";
  const n = parseFloat(value);
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [data, setData]       = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/finance/dashboard");
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Derived values from real data
  const stats             = data?.stats            ?? {};
  const recentTxns        = data?.recentTransactions ?? [];
  const financialMetrics  = data?.financialMetrics  ?? [];
  const expenseCategories = (data?.expenseCategories ?? []).map((c, i) => ({
    ...c,
    color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
  }));

  const netBalance   = stats?.netBalance?.netBalance ?? 0;
  const totalRevenue = stats?.netBalance?.totalRevenue ?? 0;

  return (
    <FinanceShell title="Finance Overview">
      <PageHeader
        title="Finance Overview"
        subtitle="Financial summary for the current academic year."
        action={
          <Button size="sm" className="gap-2">
            <Download className="size-4" />
            Export Report
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
          {error} —{" "}
          <button className="underline font-semibold" onClick={loadDashboard}>Retry</button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-28 animate-pulse bg-muted/40" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Students"
              value={stats.totalStudents?.toLocaleString("en-IN") ?? "—"}
              delta="Active enrolled students"
              icon={GraduationCap}
              tone="blue"
            />
            <StatCard
              label="Monthly Revenue"
              value={fmtINR(stats.monthlyRevenue)}
              delta="Fee collections this month"
              icon={TrendingUp}
              tone="green"
            />
            <StatCard
              label="Pending Dues"
              value={fmtINR(stats.pendingDues)}
              delta="Outstanding up to last month"
              icon={AlertTriangle}
              tone="rose"
            />
            <StatCard
              label="Net Balance"
              value={fmtINR(netBalance)}
              delta={netBalance >= 0 ? "Healthy standing" : "Deficit — review expenses"}
              icon={Building2}
              tone={netBalance >= 0 ? "teal" : "rose"}
            />
          </>
        )}
      </div>

      {/* Financial Metrics + Expense Donut */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <CardTitle className="text-base">Financial Metrics — This Month</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
                <Loader2 className="size-5 animate-spin" /> Loading metrics…
              </div>
            ) : financialMetrics.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No fee records for this month yet.</p>
            ) : (
              financialMetrics.map((metric, i) => {
                const colors = ["#3d5af1", "#dc2626", "#0d9488"];
                const badgeBgs = [
                  "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
                  "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
                ];
                const badges = ["Collection progress", "Requires action", "Completed"];
                return (
                  <div key={metric.label} className="rounded-xl p-3 transition-colors hover:bg-muted/40">
                    <div className="mb-2.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="mt-0.5 text-xl font-black text-foreground">{fmtINR(metric.amount)}</p>
                      </div>
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${badgeBgs[i]}`}>
                        {metric.pct}% — {badges[i]}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(metric.pct, 100)}%`, background: colors[i] }}
                      />
                    </div>
                  </div>
                );
              })
            )}
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
            {loading ? (
              <div className="h-[220px] w-full flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : expenseCategories.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No expense data yet.</p>
            ) : (
              <>
                <DistributionDonutChart
                  data={expenseCategories}
                  centerLabel={String(expenseCategories.length)}
                  footerLabel="Categories"
                  className="mx-auto aspect-square h-[220px] max-h-[240px]"
                />
                <div className="grid w-full gap-1.5 sm:grid-cols-2">
                  {expenseCategories.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-lg bg-muted/50 p-2 text-xs font-semibold text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <span className="font-black text-foreground">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <BarChart3 className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Recent Transactions</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Latest fee & salary ledger entries</p>
              </div>
            </div>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading transactions…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentTxns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No transactions recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTxns.map((txn, i) => (
                    <TableRow key={txn.id ?? i} className="hover:bg-muted/40">
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                          {txn.id ?? "—"}
                        </code>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{txn.name}</TableCell>
                      <TableCell className="text-muted-foreground">{txn.type}</TableCell>
                      <TableCell className="font-bold text-foreground">{fmtINR(txn.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {txn.date ? new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </FinanceShell>
  );
}
