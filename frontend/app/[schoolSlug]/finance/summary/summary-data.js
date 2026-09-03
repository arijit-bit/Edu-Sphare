import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeIndianRupee,
  Coins,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

// Tab navigation
export const summaryTabs = [
  { label: "Summary",  href: "/finance/summary" },
  { label: "Expenses", href: "/finance/summary/expenses" },
  { label: "Earnings", href: "/finance/summary/earnings" },
];

/**
 * Transform raw API summary data into the shape expected by the Summary page UI.
 * This is the single mapping point — UI never reads raw API fields directly.
 */
export function transformSummaryMetrics(apiMetrics) {
  if (!apiMetrics) return [];
  const fmt = (n) => {
    const v = parseFloat(n ?? 0);
    if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
    if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
    return `₹${v.toLocaleString("en-IN")}`;
  };
  return [
    {
      label: "Total Earnings",
      value: fmt(apiMetrics.totalEarnings),
      delta: "+vs last year",
      tone: "green",
      icon: ArrowUpCircle,
    },
    {
      label: "Total Expenses",
      value: fmt(apiMetrics.totalExpenses),
      delta: "This academic year",
      tone: "rose",
      icon: ArrowDownCircle,
    },
    {
      label: "Net Surplus",
      value: fmt(apiMetrics.netSurplus),
      delta: `${apiMetrics.collectionEfficiency ?? 0}% margin`,
      tone: "blue",
      icon: WalletCards,
    },
    {
      label: "Collection Efficiency",
      value: `${apiMetrics.collectionEfficiency ?? 0}%`,
      delta: "Fee collection rate",
      tone: "teal",
      icon: BadgeIndianRupee,
    },
  ];
}

export function transformEarningsCards(apiEarning) {
  if (!apiEarning) return [];
  const fmt = (n) => {
    const v = parseFloat(n ?? 0);
    if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
    if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
    return `₹${v.toLocaleString("en-IN")}`;
  };
  return [
    { label: "Student Fees Collected", value: fmt(apiEarning.feeCollected),  delta: "This academic year", icon: ReceiptText, tone: "purple" },
    { label: "Admission Fees",         value: fmt(apiEarning.admissionFees), delta: "New admissions",     icon: TrendingUp, tone: "cyan" },
    { label: "Other Income",           value: fmt(apiEarning.otherIncome),   delta: "Hostel, events etc", icon: Coins,      tone: "blue" },
  ];
}

export function transformExpenseCards(apiMetrics, apiEarningSummary) {
  if (!apiMetrics) return [];
  const fmt = (n) => {
    const v = parseFloat(n ?? 0);
    if (v >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
    if (v >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
    return `₹${v.toLocaleString("en-IN")}`;
  };
  return [
    { label: "Total Expenses This Year", value: fmt(apiMetrics.totalExpenses), delta: "This academic year", icon: TrendingDown,       tone: "rose" },
    { label: "Net Surplus",              value: fmt(apiMetrics.netSurplus),     delta: "Revenue - Expenses", icon: BadgeIndianRupee,  tone: "green" },
  ];
}
