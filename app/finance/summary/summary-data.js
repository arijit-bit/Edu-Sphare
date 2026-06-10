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

export const summaryTabs = [
  { label: "Summary", href: "/finance/summary" },
  { label: "Expenses", href: "/finance/summary/expenses" },
  { label: "Earnings", href: "/finance/summary/earnings" },
];

export const summaryMetrics = [
  {
    label: "Total Earnings",
    value: "₹8.96Cr",
    delta: "+18.4% vs last year",
    tone: "green",
    icon: ArrowUpCircle,
  },
  {
    label: "Total Expenses",
    value: "₹5.74Cr",
    delta: "+8.6% vs last year",
    tone: "rose",
    icon: ArrowDownCircle,
  },
  {
    label: "Net Surplus",
    value: "₹3.22Cr",
    delta: "35.9% margin maintained",
    tone: "blue",
    icon: WalletCards,
  },
  {
    label: "Collection Efficiency",
    value: "92.4%",
    delta: "Auditor target exceeded",
    tone: "teal",
    icon: BadgeIndianRupee,
  },
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

export const combinedTrendData = [
  { label: "Jan", earnings: 62, expenses: 45, surplus: 17 },
  { label: "Feb", earnings: 71, expenses: 52, surplus: 19 },
  { label: "Mar", earnings: 74, expenses: 49, surplus: 25 },
  { label: "Apr", earnings: 68, expenses: 57, surplus: 11 },
  { label: "May", earnings: 92, expenses: 58, surplus: 34 },
  { label: "Jun", earnings: 88, expenses: 61, surplus: 27 },
  { label: "Jul", earnings: 95, expenses: 64, surplus: 31 },
  { label: "Aug", earnings: 108, expenses: 82, surplus: 26 },
  { label: "Sep", earnings: 118, expenses: 69, surplus: 49 },
  { label: "Oct", earnings: 126, expenses: 88, surplus: 38 },
  { label: "Nov", earnings: 142, expenses: 74, surplus: 68 },
  { label: "Dec", earnings: 154, expenses: 92, surplus: 62 },
];

export const categoryBalanceData = [
  { label: "Tuition Fees", earnings: 64, expenses: 0 },
  { label: "Transport", earnings: 11, expenses: 12 },
  { label: "Admissions", earnings: 9, expenses: 3 },
  { label: "Payroll", earnings: 0, expenses: 57 },
  { label: "Maintenance", earnings: 0, expenses: 15 },
  { label: "Facilities", earnings: 7, expenses: 13 },
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

export const auditorHighlights = [
  {
    label: "Best Collection Window",
    title: "November collection sprint",
    value: "₹1.42Cr earnings",
    tone: "green",
    icon: TrendingUp,
  },
  {
    label: "Largest Cost Center",
    title: "Senior wing payroll",
    value: "₹3.42Cr annual outflow",
    tone: "rose",
    icon: ReceiptText,
  },
  {
    label: "Risk Watch",
    title: "Pending student dues",
    value: "₹7.8L still outstanding",
    tone: "amber",
    icon: BadgeIndianRupee,
  },
  {
    label: "Auditor View",
    title: "Healthy operating margin",
    value: "Surplus trending upward",
    tone: "teal",
    icon: WalletCards,
  },
];
