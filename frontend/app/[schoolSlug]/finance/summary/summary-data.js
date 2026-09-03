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

export const earningsCards = [
  { label: "Total Earnings This Year", value: "₹8.96Cr", delta: "+18.4% vs LY", icon: TrendingUp, tone: "green" },
  { label: "Earnings This Month", value: "₹72.4L", delta: "+12.8% vs Apr", icon: Coins, tone: "blue" },
  { label: "Student Fees Collected", value: "₹6.42Cr", delta: "+16.9% collected", icon: ReceiptText, tone: "purple" },
  { label: "Admission Fees", value: "₹78.6L", delta: "+9.7% intake", icon: TrendingUp, tone: "cyan" },
];

export const expenseCards = [
  { label: "Total Expenses This Year", value: "₹5.74Cr", delta: "+8.6% vs LY", icon: TrendingDown, tone: "rose" },
  { label: "Expenses This Month", value: "₹46.9L", delta: "+3.2% vs Apr", icon: TrendingDown, tone: "blue" },
  { label: "Teacher Salaries", value: "₹3.42Cr", delta: "+6.1% planned", icon: ReceiptText, tone: "purple" },
  { label: "Maintenance Cost", value: "₹38.4L", delta: "-4.8% optimized", icon: BadgeIndianRupee, tone: "green" },
];

export const expenseDistribution = [
  { key: "teacher", label: "Teacher Salary", value: 43, color: "#3d5af1" },
  { key: "staff", label: "Staff Salary", value: 14, color: "#0d9488" },
  { key: "transport", label: "Transport", value: 12, color: "#0ea5e9" },
  { key: "maintenance", label: "Building Maintenance", value: 9, color: "#d97706" },
  { key: "events", label: "Events", value: 7, color: "#f43f5e" },
  { key: "electricity", label: "Electricity", value: 6, color: "#f59e0b" },
  { key: "internet", label: "Internet & Comms", value: 3, color: "#7c3aed" },
  { key: "stationery", label: "Stationery", value: 3, color: "#8b5cf6" },
  { key: "misc", label: "Miscellaneous", value: 3, color: "#94a3b8" },
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
