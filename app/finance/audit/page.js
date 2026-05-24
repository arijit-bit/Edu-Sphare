"use client";

import { useMemo, useState } from "react";

import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeIndianRupee,
  Building2,
  CalendarRange,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  Landmark,
  ReceiptText,
  ShieldCheck,
  UserCheck,
  Wallet,
} from "lucide-react";

const MONTH_OPTIONS = ["April 2026", "May 2026", "June 2026", "July 2026"];

const TEACHER_ROWS = [
  { id: "FAC-1024", name: "Meera Iyer", faculty: "Mathematics", salary: 68000, month: "May 2026", status: "Pending" },
  { id: "FAC-1031", name: "Rahul Sen", faculty: "Science", salary: 82000, month: "May 2026", status: "Pending" },
  { id: "FAC-1048", name: "Ananya Bose", faculty: "English", salary: 58000, month: "May 2026", status: "Paid" },
  { id: "FAC-1075", name: "Farah Ali", faculty: "Computer Science", salary: 72000, month: "May 2026", status: "Pending" },
];

const STUDENT_ROWS = [
  { id: "STU-2401", name: "Aarav Sharma", grade: "10-A", fee: 12000, months: ["May 2026"], status: "Paid" },
  { id: "STU-2417", name: "Diya Patel", grade: "8-B", fee: 10500, months: ["May 2026", "June 2026"], status: "Pending" },
  { id: "STU-2328", name: "Kabir Verma", grade: "12-C", fee: 15000, months: ["May 2026"], status: "Pending" },
  { id: "STU-2506", name: "Ira Khan", grade: "6-A", fee: 8800, months: ["May 2026"], status: "Paid" },
];

const OTHER_DEFAULT = [
  { id: "OTH-101", category: "Hostel", type: "Income", amount: 185000, paymentMode: "Online", paymentRef: "HTL-778201", date: "2026-05-20", month: "May 2026" },
  { id: "OTH-102", category: "Transportation", type: "Income", amount: 92000, paymentMode: "Cash", paymentRef: "Paid via cash", date: "2026-05-18", month: "May 2026" },
  { id: "OTH-103", category: "Maintenance", type: "Expense", amount: 146000, paymentMode: "Online", paymentRef: "MNT-210554", date: "2026-05-14", month: "May 2026" },
  { id: "OTH-104", category: "Admission", type: "Income", amount: 248000, paymentMode: "Online", paymentRef: "ADM-990812", date: "2026-05-11", month: "May 2026" },
];

const OTHER_CATEGORY_OPTIONS = ["Hostel", "Transportation", "Maintenance", "Admission", "Custom"];

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatModeLabel(mode, transactionId) {
  return mode === "offline" ? "Paid via cash" : transactionId;
}

function MonthPills({ selectedMonths, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MONTH_OPTIONS.map((month) => {
        const active = selectedMonths.includes(month);

        return (
          <button
            key={month}
            type="button"
            onClick={() => onToggle(month)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {month}
          </button>
        );
      })}
    </div>
  );
}

export default function FinanceAuditPage() {
  const [teacherRows, setTeacherRows] = useState(TEACHER_ROWS);
  const [studentRows, setStudentRows] = useState(STUDENT_ROWS);
  const [otherRows, setOtherRows] = useState(OTHER_DEFAULT);
  const [toastMessage, setToastMessage] = useState("");

  const [teacherAudit, setTeacherAudit] = useState(null);
  const [teacherPaymentMode, setTeacherPaymentMode] = useState("offline");
  const [teacherTransactionId, setTeacherTransactionId] = useState("");
  const [teacherMonth, setTeacherMonth] = useState("May 2026");

  const [studentAudit, setStudentAudit] = useState(null);
  const [studentPaymentMode, setStudentPaymentMode] = useState("offline");
  const [studentTransactionId, setStudentTransactionId] = useState("");
  const [studentMonths, setStudentMonths] = useState(["May 2026"]);

  const [otherCategory, setOtherCategory] = useState("Hostel");
  const [customName, setCustomName] = useState("");
  const [otherType, setOtherType] = useState("Income");
  const [otherAmount, setOtherAmount] = useState("");
  const [otherMode, setOtherMode] = useState("offline");
  const [otherTransactionId, setOtherTransactionId] = useState("");
  const [otherDate, setOtherDate] = useState("2026-05-24");
  const [otherMonth, setOtherMonth] = useState("May 2026");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const teacherPaidCount = teacherRows.filter((row) => row.status === "Paid").length;
  const studentPaidCount = studentRows.filter((row) => row.status === "Paid").length;
  const totalIncome = otherRows
    .filter((row) => row.type === "Income")
    .reduce((sum, row) => sum + row.amount, 0);
  const totalExpense = otherRows
    .filter((row) => row.type === "Expense")
    .reduce((sum, row) => sum + row.amount, 0);

  const auditKpis = useMemo(
    () => [
      { label: "Teacher Audits Closed", value: `${teacherPaidCount}/${teacherRows.length}`, delta: "Monthly salary verification", icon: UserCheck, tone: "blue" },
      { label: "Student Audits Closed", value: `${studentPaidCount}/${studentRows.length}`, delta: "Fee receipts reconciled", icon: ShieldCheck, tone: "green" },
      { label: "Other Income Logged", value: formatCurrency(totalIncome), delta: "Hostel, admission, transport", icon: ArrowUpCircle, tone: "teal" },
      { label: "Other Expenses Logged", value: formatCurrency(totalExpense), delta: "Maintenance and custom outflow", icon: ArrowDownCircle, tone: "rose" },
    ],
    [teacherPaidCount, teacherRows.length, studentPaidCount, studentRows.length, totalIncome, totalExpense]
  );

  const openTeacherAudit = (row) => {
    setTeacherAudit(row);
    setTeacherPaymentMode("offline");
    setTeacherTransactionId("");
    setTeacherMonth(row.month);
  };

  const submitTeacherAudit = () => {
    if (teacherPaymentMode === "online" && !teacherTransactionId.trim()) {
      showToast("Add a transaction ID for online teacher payments.");
      return;
    }

    setTeacherRows((prev) =>
      prev.map((row) =>
        row.id === teacherAudit.id
          ? {
              ...row,
              status: "Paid",
              month: teacherMonth,
              paymentMode: teacherPaymentMode === "online" ? "Online" : "Cash",
              paymentRef: formatModeLabel(teacherPaymentMode, teacherTransactionId.trim()),
            }
          : row
      )
    );
    showToast(`Teacher salary audited for ${teacherAudit.name}.`);
    setTeacherAudit(null);
  };

  const openStudentAudit = (row) => {
    setStudentAudit(row);
    setStudentPaymentMode("offline");
    setStudentTransactionId("");
    setStudentMonths(row.months);
  };

  const toggleStudentMonth = (month) => {
    setStudentMonths((prev) =>
      prev.includes(month) ? prev.filter((item) => item !== month) : [...prev, month]
    );
  };

  const submitStudentAudit = () => {
    if (studentMonths.length === 0) {
      showToast("Select at least one month for the student payment audit.");
      return;
    }

    if (studentPaymentMode === "online" && !studentTransactionId.trim()) {
      showToast("Add a transaction ID for online student payments.");
      return;
    }

    setStudentRows((prev) =>
      prev.map((row) =>
        row.id === studentAudit.id
          ? {
              ...row,
              status: "Paid",
              months: studentMonths,
              paymentMode: studentPaymentMode === "online" ? "Online" : "Cash",
              paymentRef: formatModeLabel(studentPaymentMode, studentTransactionId.trim()),
            }
          : row
      )
    );
    showToast(`Student fee audited for ${studentAudit.name}.`);
    setStudentAudit(null);
  };

  const submitOtherEntry = () => {
    const resolvedName = otherCategory === "Custom" ? customName.trim() : otherCategory;
    const amount = Number(otherAmount);

    if (!resolvedName) {
      showToast("Add a custom name when category is custom.");
      return;
    }

    if (!amount || amount <= 0) {
      showToast("Enter a valid amount for the other audit entry.");
      return;
    }

    if (otherMode === "online" && !otherTransactionId.trim()) {
      showToast("Add a transaction ID for online custom entries.");
      return;
    }

    setOtherRows((prev) => [
      {
        id: `OTH-${100 + prev.length + 1}`,
        category: resolvedName,
        type: otherType,
        amount,
        paymentMode: otherMode === "online" ? "Online" : "Cash",
        paymentRef: formatModeLabel(otherMode, otherTransactionId.trim()),
        date: otherDate,
        month: otherMonth,
      },
      ...prev,
    ]);

    setOtherCategory("Hostel");
    setCustomName("");
    setOtherType("Income");
    setOtherAmount("");
    setOtherMode("offline");
    setOtherTransactionId("");
    setOtherDate("2026-05-24");
    setOtherMonth("May 2026");
    showToast("Other audit entry recorded successfully.");
  };

  return (
    <FinanceShell title="Finance Audit">
      {toastMessage ? (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl border border-border bg-foreground px-5 py-3 text-background shadow-2xl animate-in slide-in-from-top-2">
          <Check className="size-5 shrink-0 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      ) : null}

      <PageHeader
        title="Finance Audit"
        subtitle="Audit teacher payroll, student fee receipts, and manual finance entries with payment mode verification and transaction proof."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {auditKpis.map((card) => (
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

      <div className="overflow-hidden rounded-3xl border bg-[linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_48%,_#0f766e_100%)] p-6 text-white shadow-xl">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
              Audit Control
            </span>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Verify every rupee moving through salary, tuition, and operating ledgers.
            </h2>
            <p className="max-w-2xl text-sm font-medium text-slate-200/90 sm:text-base">
              This workflow gives auditors one surface to mark payments, attach transaction IDs,
              and record cash-based entries across recurring and custom finance streams.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Teacher Payroll", value: formatCurrency(teacherRows.reduce((sum, row) => sum + row.salary, 0)) },
              { label: "Student Tuition", value: formatCurrency(studentRows.reduce((sum, row) => sum + row.fee, 0)) },
              { label: "Other Entries", value: `${otherRows.length} logged` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200/80">{item.label}</p>
                <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="teachers" className="space-y-5">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teachers">Teacher Audit</TabsTrigger>
          <TabsTrigger value="students">Student Audit</TabsTrigger>
          <TabsTrigger value="other">Other Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Teacher salary audit</CardTitle>
                  <CardDescription>
                    Select the payroll month, mark staff as paid, and record online references or cash settlement.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Name", "Faculty ID", "Faculty", "Salary", "Month", "Status", "Audit"].map((heading) => (
                      <TableHead key={heading} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherRows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.faculty}</TableCell>
                      <TableCell className="font-black text-foreground">{formatCurrency(row.salary)}</TableCell>
                      <TableCell className="text-muted-foreground">{row.month}</TableCell>
                      <TableCell><StatusBadge status={row.status} /></TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="gap-2"
                          variant={row.status === "Paid" ? "outline" : "default"}
                          onClick={() => openTeacherAudit(row)}
                        >
                          <ClipboardCheck className="size-4" />
                          {row.status === "Paid" ? "Review" : "Mark Paid"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Student fee audit</CardTitle>
                  <CardDescription>
                    Reconcile monthly tuition, select one or more months, and verify the payment mode for every student.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Name", "Student ID", "Grade", "Tuition / Month", "Months", "Status", "Audit"].map((heading) => (
                      <TableHead key={heading} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentRows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.grade}</TableCell>
                      <TableCell className="font-black text-foreground">{formatCurrency(row.fee)}</TableCell>
                      <TableCell className="text-muted-foreground">{row.months.join(", ")}</TableCell>
                      <TableCell><StatusBadge status={row.status} /></TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="gap-2"
                          variant={row.status === "Paid" ? "outline" : "default"}
                          onClick={() => openStudentAudit(row)}
                        >
                          <CreditCard className="size-4" />
                          {row.status === "Paid" ? "Review" : "Mark Paid"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
                    <Landmark className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Other income / expense entry</CardTitle>
                    <CardDescription>
                      Record hostel, transportation, maintenance, admission, or custom audit entries.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={otherCategory} onValueChange={setOtherCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OTHER_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {otherCategory === "Custom" ? (
                  <div className="space-y-1.5">
                    <Label>Custom name</Label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter custom ledger name"
                    />
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={otherType} onValueChange={setOtherType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={otherAmount}
                      onChange={(e) => setOtherAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Payment mode</Label>
                    <Select value={otherMode} onValueChange={setOtherMode}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Month</Label>
                    <Select value={otherMonth} onValueChange={setOtherMonth}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MONTH_OPTIONS.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {otherMode === "online" ? (
                  <div className="space-y-1.5">
                    <Label>Transaction ID</Label>
                    <Input
                      value={otherTransactionId}
                      onChange={(e) => setOtherTransactionId(e.target.value)}
                      placeholder="Enter payment reference"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                    Offline entries are automatically tagged as paid via cash.
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={otherDate} onChange={(e) => setOtherDate(e.target.value)} />
                </div>

                <Button className="w-full gap-2" onClick={submitOtherEntry}>
                  <CircleDollarSign className="size-4" />
                  Record audit entry
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <ReceiptText className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Manual audit ledger</CardTitle>
                    <CardDescription>
                      Logged entries across hostel, transport, maintenance, admission, and custom ledgers.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Category", "Type", "Amount", "Payment", "Reference", "Date", "Month"].map((heading) => (
                        <TableHead key={heading} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
                          {heading}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {otherRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/40">
                        <TableCell className="font-semibold text-foreground">{row.category}</TableCell>
                        <TableCell>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${row.type === "Income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"}`}>
                            {row.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-black text-foreground">{formatCurrency(row.amount)}</TableCell>
                        <TableCell className="text-muted-foreground">{row.paymentMode}</TableCell>
                        <TableCell className="text-muted-foreground">{row.paymentRef}</TableCell>
                        <TableCell className="text-muted-foreground">{row.date}</TableCell>
                        <TableCell className="text-muted-foreground">{row.month}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!teacherAudit} onOpenChange={(open) => !open && setTeacherAudit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit teacher payment</DialogTitle>
            <DialogDescription>
              Mark the selected teacher salary as paid and attach the correct audit trail.
            </DialogDescription>
          </DialogHeader>
          {teacherAudit ? (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Teacher</p>
                  <p className="mt-1 font-semibold text-foreground">{teacherAudit.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Salary</p>
                  <p className="mt-1 font-black text-foreground">{formatCurrency(teacherAudit.salary)}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Payment month</Label>
                  <Select value={teacherMonth} onValueChange={setTeacherMonth}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Mode of payment</Label>
                  <Select value={teacherPaymentMode} onValueChange={setTeacherPaymentMode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {teacherPaymentMode === "online" ? (
                <div className="space-y-1.5">
                  <Label>Transaction ID</Label>
                  <Input
                    value={teacherTransactionId}
                    onChange={(e) => setTeacherTransactionId(e.target.value)}
                    placeholder="Enter online transaction ID"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  Offline teacher payments will be automatically recorded as paid via cash.
                </div>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherAudit(null)}>Cancel</Button>
            <Button className="gap-2" onClick={submitTeacherAudit}>
              <Check className="size-4" />
              Mark paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!studentAudit} onOpenChange={(open) => !open && setStudentAudit(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit student payment</DialogTitle>
            <DialogDescription>
              Select one or more months, confirm the payment mode, and record proof for the student receipt.
            </DialogDescription>
          </DialogHeader>
          {studentAudit ? (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Student</p>
                  <p className="mt-1 font-semibold text-foreground">{studentAudit.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">ID</p>
                  <p className="mt-1 font-semibold text-foreground">{studentAudit.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Tuition / Month</p>
                  <p className="mt-1 font-black text-foreground">{formatCurrency(studentAudit.fee)}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Select month(s)</Label>
                <MonthPills selectedMonths={studentMonths} onToggle={toggleStudentMonth} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Payment mode</Label>
                  <Select value={studentPaymentMode} onValueChange={setStudentPaymentMode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Total selected value</Label>
                  <div className="rounded-xl border bg-muted/40 px-4 py-2.5 text-sm font-black text-foreground">
                    {formatCurrency(studentAudit.fee * studentMonths.length)}
                  </div>
                </div>
              </div>

              {studentPaymentMode === "online" ? (
                <div className="space-y-1.5">
                  <Label>Transaction ID</Label>
                  <Input
                    value={studentTransactionId}
                    onChange={(e) => setStudentTransactionId(e.target.value)}
                    placeholder="Enter online transaction ID"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  Offline student payments will be automatically recorded as paid via cash.
                </div>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentAudit(null)}>Cancel</Button>
            <Button className="gap-2" onClick={submitStudentAudit}>
              <Check className="size-4" />
              Mark paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  );
}
