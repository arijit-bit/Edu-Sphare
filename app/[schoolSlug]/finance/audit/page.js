"use client";

import { useState } from "react";

import { FinanceShell, PageHeader, StatusBadge } from "@/app/finance/analytics-ui";
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
  Check,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  UserCheck,
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
  return `Rs ${value.toLocaleString("en-IN")}`;
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

function SummaryMetric({ label, value, hint, tone = "blue" }) {
  const tones = {
    blue: {
      card: "border-blue-200/70 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/20",
      value: "text-blue-700 dark:text-blue-300",
      hint: "text-blue-600/80 dark:text-blue-300/80",
      dot: "bg-blue-500",
    },
    emerald: {
      card: "border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/20",
      value: "text-emerald-700 dark:text-emerald-300",
      hint: "text-emerald-600/80 dark:text-emerald-300/80",
      dot: "bg-emerald-500",
    },
    amber: {
      card: "border-amber-200/70 bg-amber-50/85 dark:border-amber-900/60 dark:bg-amber-950/20",
      value: "text-amber-700 dark:text-amber-300",
      hint: "text-amber-700/80 dark:text-amber-300/80",
      dot: "bg-amber-500",
    },
  };
  const palette = tones[tone] || tones.blue;

  return (
    <div className={`min-w-[190px] shrink-0 rounded-2xl border p-3 shadow-sm sm:min-w-[210px] sm:p-4 ${palette.card}`}>
      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.18em]">
        <span className={`size-2 rounded-full ${palette.dot}`} />
        {label}
      </p>
      <p className={`mt-1.5 text-lg font-bold tracking-tight sm:mt-2 sm:text-2xl ${palette.value}`}>
        {value}
      </p>
      <p className={`mt-1 text-[11px] leading-snug sm:text-xs ${palette.hint}`}>
        {hint}
      </p>
    </div>
  );
}

function QueueHeader({ icon: Icon, title, description, countLabel }) {
  return (
    <div className="flex flex-col gap-3 border-b px-4 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2 text-sm">
        <span className="font-medium text-foreground">Current work queue</span>
        <span className="font-semibold text-muted-foreground">{countLabel}</span>
      </div>
    </div>
  );
}

function TeacherAuditCards({ rows, onAudit }) {
  return (
    <div className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{row.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{row.id} - {row.faculty}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Salary</p>
              <p className="mt-1 font-semibold text-foreground">{formatCurrency(row.salary)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Month</p>
              <p className="mt-1 font-semibold text-foreground">{row.month}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="mt-4 w-full gap-2"
            variant={row.status === "Paid" ? "outline" : "default"}
            onClick={() => onAudit(row)}
          >
            <ClipboardCheck className="size-4" />
            {row.status === "Paid" ? "Review payment" : "Audit payment"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function StudentAuditCards({ rows, onAudit }) {
  return (
    <div className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{row.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{row.id} - Grade {row.grade}</p>
            </div>
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Fee / month</p>
              <p className="mt-1 font-semibold text-foreground">{formatCurrency(row.fee)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Months</p>
              <p className="mt-1 font-semibold text-foreground">{row.months.join(", ")}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="mt-4 w-full gap-2"
            variant={row.status === "Paid" ? "outline" : "default"}
            onClick={() => onAudit(row)}
          >
            <CreditCard className="size-4" />
            {row.status === "Paid" ? "Review receipt" : "Audit receipt"}
          </Button>
        </div>
      ))}
    </div>
  );
}

function LedgerCards({ rows }) {
  return (
    <div className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{row.category}</p>
              <p className="mt-1 text-xs text-muted-foreground">{row.date} - {row.month}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.type === "Income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"}`}>
              {row.type}
            </span>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">{formatCurrency(row.amount)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium text-foreground">{row.paymentMode}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Reference</span>
              <span className="text-right font-medium text-foreground">{row.paymentRef}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FinanceAuditPage() {
  const [activeTab, setActiveTab] = useState("teachers");
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

  const teacherPendingCount = teacherRows.filter((row) => row.status !== "Paid").length;
  const studentPendingCount = studentRows.filter((row) => row.status !== "Paid").length;
  const completedCount =
    teacherRows.filter((row) => row.status === "Paid").length +
    studentRows.filter((row) => row.status === "Paid").length;
  const totalQueueCount = teacherPendingCount + studentPendingCount;

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
      showToast("Enter a valid amount for the ledger entry.");
      return;
    }

    if (otherMode === "online" && !otherTransactionId.trim()) {
      showToast("Add a transaction ID for online ledger entries.");
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
    showToast("Ledger entry recorded successfully.");
  };

  return (
    <FinanceShell title="Finance Audit">
      {toastMessage ? (
        <div className="fixed right-4 top-20 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-border bg-foreground px-4 py-3 text-background shadow-2xl animate-in slide-in-from-top-2 sm:right-6">
          <Check className="size-5 shrink-0 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      ) : null}

      <PageHeader
        title="Finance Audit"
        subtitle="Keep the audit queue moving: verify pending payroll, reconcile student receipts, and log supporting ledger entries."
      />

      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max flex-nowrap gap-2 px-1 sm:gap-3">
          <SummaryMetric
            label="Pending payroll"
            value={teacherPendingCount}
            hint={`${teacherRows.length} teacher records in this cycle`}
            tone="blue"
          />
          <SummaryMetric
            label="Pending receipts"
            value={studentPendingCount}
            hint={`${studentRows.length} student receipts in this cycle`}
            tone="emerald"
          />
          <SummaryMetric
            label="Audits completed"
            value={completedCount}
            hint={totalQueueCount > 0 ? `${totalQueueCount} items still need review` : "Queue is clear"}
            tone="amber"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative grid h-auto w-full grid-cols-3 gap-1 overflow-hidden rounded-2xl border bg-muted/70 p-1.5 shadow-sm sm:gap-2">
          <div
            aria-hidden="true"
            className={`absolute bottom-1.5 top-1.5 z-0 w-[calc((100%-0.75rem)/3)] rounded-xl border border-primary/20 bg-primary/10 shadow-sm ring-1 ring-primary/10 transition-transform duration-300 ease-out dark:border-primary/25 dark:bg-primary/20 dark:ring-primary/15 ${
              activeTab === "teachers"
                ? "translate-x-0"
                : activeTab === "students"
                  ? "translate-x-[calc(100%+0.25rem)] sm:translate-x-[calc(100%+0.5rem)]"
                  : "translate-x-[calc(200%+0.5rem)] sm:translate-x-[calc(200%+1rem)]"
            }`}
          />
          <TabsTrigger
            value="teachers"
            className="relative z-10 h-auto min-h-12 rounded-xl border-0 bg-transparent px-2 py-2.5 text-[11px] leading-tight whitespace-normal text-center after:hidden data-active:bg-transparent data-active:text-foreground data-active:shadow-none dark:data-active:border-0 dark:data-active:bg-transparent"
          >
            Teacher Audit
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="relative z-10 h-auto min-h-12 rounded-xl border-0 bg-transparent px-2 py-2.5 text-[11px] leading-tight whitespace-normal text-center after:hidden data-active:bg-transparent data-active:text-foreground data-active:shadow-none dark:data-active:border-0 dark:data-active:bg-transparent"
          >
            Student Audit
          </TabsTrigger>
          <TabsTrigger
            value="other"
            className="relative z-10 h-auto min-h-12 rounded-xl border-0 bg-transparent px-2 py-2.5 text-[11px] leading-tight whitespace-normal text-center after:hidden data-active:bg-transparent data-active:text-foreground data-active:shadow-none dark:data-active:border-0 dark:data-active:bg-transparent"
          >
            Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers">
          <Card className="overflow-hidden">
            <QueueHeader
              icon={UserCheck}
              title="Teacher salary audit"
              description="Mark payroll items as verified, record the payment mode, and store the payment reference."
              countLabel={`${teacherPendingCount} pending / ${teacherRows.length} total`}
            />
            <CardContent className="p-4 sm:p-6">
              <TeacherAuditCards rows={teacherRows} onAudit={openTeacherAudit} />

              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Teacher", "Faculty ID", "Faculty", "Salary", "Month", "Status", "Action"].map((heading) => (
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
                        <TableCell className="font-semibold text-foreground">{formatCurrency(row.salary)}</TableCell>
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
                            {row.status === "Paid" ? "Review" : "Audit"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="overflow-hidden">
            <QueueHeader
              icon={ShieldCheck}
              title="Student fee audit"
              description="Reconcile monthly fee receipts, confirm covered months, and attach the payment proof."
              countLabel={`${studentPendingCount} pending / ${studentRows.length} total`}
            />
            <CardContent className="p-4 sm:p-6">
              <StudentAuditCards rows={studentRows} onAudit={openStudentAudit} />

              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Student", "Student ID", "Grade", "Fee / Month", "Months", "Status", "Action"].map((heading) => (
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
                        <TableCell className="font-semibold text-foreground">{formatCurrency(row.fee)}</TableCell>
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
                            {row.status === "Paid" ? "Review" : "Audit"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other">
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ledger entry</CardTitle>
                <CardDescription>
                  Add audit-supporting income or expense records without distracting from the main queue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    Offline entries are tagged automatically as paid via cash.
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={otherDate} onChange={(e) => setOtherDate(e.target.value)} />
                </div>

                <Button className="w-full gap-2" onClick={submitOtherEntry}>
                  <CircleDollarSign className="size-4" />
                  Record entry
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Recent ledger entries</CardTitle>
                <CardDescription>
                  Supporting entries stay visible here for quick audit reference.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <LedgerCards rows={otherRows} />

                <div className="hidden overflow-x-auto md:block">
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
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.type === "Income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"}`}>
                              {row.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">{formatCurrency(row.amount)}</TableCell>
                          <TableCell className="text-muted-foreground">{row.paymentMode}</TableCell>
                          <TableCell className="text-muted-foreground">{row.paymentRef}</TableCell>
                          <TableCell className="text-muted-foreground">{row.date}</TableCell>
                          <TableCell className="text-muted-foreground">{row.month}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!teacherAudit} onOpenChange={(open) => !open && setTeacherAudit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit teacher payment</DialogTitle>
            <DialogDescription>
              Mark the selected salary as verified and attach the correct audit trail.
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
                  <p className="mt-1 font-bold text-foreground">{formatCurrency(teacherAudit.salary)}</p>
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
                  <Label>Payment mode</Label>
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
                  Offline teacher payments will be recorded as paid via cash.
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
              Confirm covered months, verify the payment mode, and store proof for the receipt.
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
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Fee / Month</p>
                  <p className="mt-1 font-bold text-foreground">{formatCurrency(studentAudit.fee)}</p>
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
                  <div className="rounded-xl border bg-muted/40 px-4 py-2.5 text-sm font-bold text-foreground">
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
                  Offline student payments will be recorded as paid via cash.
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
