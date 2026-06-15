"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  UserCheck,
  Upload,
  Megaphone,
  CalendarDays,
  Wallet,
  MessageCircle,
  HelpCircle,
  Settings,
  Bell,
  Search,
  Printer,
  Download,
  ReceiptText,
  Eye,
  Filter,
  TrendingUp,
  Moon,
  Sun,
  FileQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const salaryStats = [
  {
    label: "Net Earnings YTD",
    value: "$42,850.00",
    helper: "+4.2% vs last year",
    icon: TrendingUp,
  },
  {
    label: "Next Payday",
    value: "Oct 31",
    helper: "12 days remaining",
  },
  {
    label: "Total Deductions",
    value: "$8,240",
    helper: "Tax & Benefits",
  },
];

const chartData = [
  {
    month: "Apr",
    amount: 4200,
    height: "65%",
  },
  {
    month: "May",
    amount: 4200,
    height: "65%",
  },
  {
    month: "Jun",
    amount: 4800,
    height: "72%",
    highlight: true,
  },
  {
    month: "Jul",
    amount: 4200,
    height: "65%",
  },
  {
    month: "Aug",
    amount: 4200,
    height: "65%",
  },
  {
    month: "Sep",
    amount: 4550,
    height: "70%",
    current: true,
  },
];

const paymentRecords = [
  {
    id: 1,
    month: "September",
    year: "2023",
    basicSalary: "$5,000.00",
    bonus: "+$350.00",
    deductions: "-$800.00",
    netAmount: "$4,550.00",
    status: "Processing",
    downloadable: false,
  },
  {
    id: 2,
    month: "August",
    year: "2023",
    basicSalary: "$5,000.00",
    bonus: "-",
    deductions: "-$800.00",
    netAmount: "$4,200.00",
    status: "Paid",
    downloadable: true,
  },
  {
    id: 3,
    month: "July",
    year: "2023",
    basicSalary: "$5,000.00",
    bonus: "-",
    deductions: "-$800.00",
    netAmount: "$4,200.00",
    status: "Paid",
    downloadable: true,
  },
  {
    id: 4,
    month: "June",
    year: "2023",
    basicSalary: "$5,000.00",
    bonus: "+$600.00",
    deductions: "-$800.00",
    netAmount: "$4,800.00",
    status: "Paid",
    downloadable: true,
  },
];

export default function SalaryPage() {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filteredRecords = useMemo(() => {
    const searchValue = query.toLowerCase().trim();

    if (!searchValue) return paymentRecords;

    return paymentRecords.filter((record) => {
      return (
        record.month.toLowerCase().includes(searchValue) ||
        record.year.includes(searchValue) ||
        record.status.toLowerCase().includes(searchValue)
      );
    });
  }, [query]);

  const toggleTheme = () => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);

    if (nextValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 md:p-6 lg:p-8 animate-fade-in">
            <PageHeader />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-4">
                <SalarySummaryCards />
              </div>

              <div className="lg:col-span-8">
                <SalaryTrendChart />
              </div>
            </div>

            <PaymentRecordsTable
              query={query}
              setQuery={setQuery}
              records={filteredRecords}/>
    </section>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Financial Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your salary, deductions, bonuses, and payment history.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Summary
        </Button>

        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download YTD
        </Button>
      </div>
    </div>
  );
}

function SalarySummaryCards() {
  return (
    <>
      <Card className="relative overflow-hidden">
        <CardContent className="p-5">
          <div className="absolute right-4 top-4 text-primary/10">
            <Wallet className="h-20 w-20" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Earnings YTD
          </p>

          <h3 className="mt-2 text-3xl font-bold">$42,850.00</h3>

          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            +4.2% vs last year
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {salaryStats.slice(1).map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="mt-2 text-xl font-bold">{stat.value}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function SalaryTrendChart() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Salary Trend</CardTitle>

        <Select defaultValue="net">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="net">Net Amount</SelectItem>
            <SelectItem value="gross">Gross Salary</SelectItem>
            <SelectItem value="deductions">Deductions</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="relative h-[280px]">
          <div className="absolute inset-x-0 top-0 flex h-[230px] flex-col justify-between text-xs text-muted-foreground">
            <div className="border-t">$6k</div>
            <div className="border-t">$4k</div>
            <div className="border-t">$2k</div>
            <div className="border-t">$0</div>
          </div>

          <div className="relative z-10 flex h-full items-end justify-between gap-3 pl-8">
            {chartData.map((item) => (
              <div
                key={item.month}
                className="group flex flex-1 flex-col items-center justify-end"
              >
                <div
                  className={`relative w-full max-w-[52px] rounded-t-lg transition-all group-hover:opacity-80 ${
                    item.current
                      ? "bg-primary"
                      : item.highlight
                      ? "bg-primary/70"
                      : "bg-primary/30"
                  }`}
                  style={{ height: item.height }}
                >
                  <div className="absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow group-hover:block">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>

                <span
                  className={`mt-2 text-xs font-medium ${
                    item.current ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentRecordsTable({ query, setQuery, records }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-primary" />
            Payment Records
          </CardTitle>

          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
                placeholder="Filter by month, year, or status..."
              />
            </div>

            <Button size="icon" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.length > 0 ? (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.month}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.year}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{record.basicSalary}</TableCell>

                    <TableCell
                      className={
                        record.bonus !== "-"
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {record.bonus}
                    </TableCell>

                    <TableCell className="text-destructive">
                      {record.deductions}
                    </TableCell>

                    <TableCell className="font-semibold">
                      {record.netAmount}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          record.status === "Paid" ? "secondary" : "default"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={!record.downloadable}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {records.length} of {paymentRecords.length} records
          </span>

          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled>
              Previous
            </Button>
            <Button size="sm">1</Button>
            <Button size="sm" variant="outline">
              2
            </Button>
            <Button size="sm" variant="outline">
              3
            </Button>
            <Button size="sm" variant="outline">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}