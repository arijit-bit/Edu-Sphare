"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { format } from "date-fns";

import { FinanceShell, PageHeader, StatusBadge } from "@/components/shells/finance-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Check,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";


const OTHER_CATEGORY_OPTIONS = ["Hostel", "Transportation", "Maintenance", "Admission", "Custom"];


function formatCurrency(value) {
  return `Rs ${value.toLocaleString("en-IN")}`;
}

function formatModeLabel(mode, transactionId) {
  return mode === "offline" ? "Paid via cash" : transactionId;
}

// ── Components ──

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

function FloatingStat({ icon: Icon, label, value, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3 shadow-sm backdrop-blur-md border border-border/50 transition-all hover:bg-muted/60">
      <div className={cn("flex size-9 items-center justify-center rounded-full", tones[tone])}>
        <Icon className="size-4.5" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-lg font-black leading-none text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function QueueListRow({ title, subtitle, icon: Icon, amount, meta, status, onClick }) {
  const isPaid = status === "Paid";
  
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-full border", isPaid ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900" : "bg-primary/10 border-primary/20 text-primary")}>
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="font-bold text-foreground truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="truncate">{subtitle}</span>
            <span className="size-1 rounded-full bg-border" />
            <span className="font-semibold text-foreground">{formatCurrency(amount)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
        <div className="flex flex-col sm:items-end gap-1">
          <StatusBadge status={status} />
          <span className="text-[11px] font-medium text-muted-foreground">{meta}</span>
        </div>
        <Button 
          variant={isPaid ? "secondary" : "default"} 
          className="shrink-0 rounded-full h-9 px-5 text-xs font-bold"
          onClick={onClick}
        >
          {isPaid ? "Review" : "Audit"}
        </Button>
      </div>
    </div>
  );
}

const MONTH_OPTIONS = ["April 2026", "May 2026", "June 2026", "July 2026"];

export default function FinanceAuditPage() {
  const [activeView, setActiveView] = useState("teachers");
  const [selectedMonth, setSelectedMonth] = useState("May 2026");

  const [teacherRows, setTeacherRows] = useState([]);
  const [studentRows, setStudentRows] = useState([]);
  const [otherRows, setOtherRows]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Load all three data sources in parallel when month changes
  const loadAuditData = useCallback(async () => {
    setLoading(true);
    try {
      const [teacherRes, studentRes, otherRes] = await Promise.all([
        apiFetch(`/api/finance/audit/teachers?month=${encodeURIComponent(selectedMonth)}`),
        apiFetch(`/api/finance/audit/students?month=${encodeURIComponent(selectedMonth)}`),
        apiFetch(`/api/finance/audit/other-income?month=${encodeURIComponent(selectedMonth)}`),
      ]);
      setTeacherRows(teacherRes.data ?? []);
      setStudentRows(studentRes.data ?? []);
      setOtherRows(otherRes.data ?? []);
    } catch (err) {
      showToast("Failed to load audit data: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => { loadAuditData(); }, [loadAuditData]);


  // Audit Sheet States
  const [teacherAudit, setTeacherAudit] = useState(null);
  const [teacherPaymentMode, setTeacherPaymentMode] = useState("offline");
  const [teacherTransactionId, setTeacherTransactionId] = useState("");
  const [teacherMonth, setTeacherMonth] = useState("May 2026");

  const [studentAudit, setStudentAudit] = useState(null);
  const [studentPaymentMode, setStudentPaymentMode] = useState("offline");
  const [studentTransactionId, setStudentTransactionId] = useState("");
  const [studentMonths, setStudentMonths] = useState(["May 2026"]);

  // Ledger States
  const [otherCategory, setOtherCategory] = useState("Hostel");
  const [customName, setCustomName] = useState("");
  const [otherType, setOtherType] = useState("Income");
  const [otherAmount, setOtherAmount] = useState("");
  const [otherMode, setOtherMode] = useState("offline");
  const [otherTransactionId, setOtherTransactionId] = useState("");
  const [otherDate, setOtherDate] = useState("2026-05-24");
  const [otherMonth, setOtherMonth] = useState("May 2026");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const formattedOtherDate = useMemo(() => {
    const parsed = new Date(`${otherDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Select date";
    return format(parsed, "PPP");
  }, [otherDate]);

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

  // Actions
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

  const submitOtherEntry = async () => {
    const resolvedName = otherCategory === "Custom" ? customName.trim() : otherCategory;
    const amount = Number(otherAmount);

    if (!resolvedName) { showToast("Add a custom name when category is custom."); return; }
    if (!amount || amount <= 0) { showToast("Enter a valid amount for the ledger entry."); return; }
    if (otherMode === "online" && !otherTransactionId.trim()) { showToast("Add a transaction ID for online ledger entries."); return; }

    try {
      await apiFetch("/api/finance/audit/other-income", {
        method: "POST",
        body: JSON.stringify({
          category: resolvedName.toLowerCase().replace(/\s+/g, "_"),
          description: `${resolvedName} — ${otherType}`,
          amount,
          incomeDate: otherDate,
          paymentMode: otherMode === "online" ? "online" : "cash",
          transactionReference: otherMode === "online" ? otherTransactionId.trim() : undefined,
        }),
      });
      setOtherCategory("Hostel");
      setCustomName("");
      setOtherType("Income");
      setOtherAmount("");
      setOtherMode("offline");
      setOtherTransactionId("");
      showToast("Ledger entry recorded successfully.");
      loadAuditData(); // refresh table from DB
    } catch (err) {
      showToast(err.message || "Failed to record entry.");
    }
  };


  return (
    <FinanceShell title="Finance Audit">
      {toastMessage && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-xl border border-border bg-foreground px-4 py-3 text-background shadow-2xl animate-in slide-in-from-top-2 sm:right-6">
          <Check className="size-5 shrink-0 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Audit Queue"
        subtitle="Master interface for clearing pending payroll, processing receipts, and logging supporting entries."
      />

      {/* Floating Stats Bar */}
      <div className="grid gap-3 sm:grid-cols-3">
        <FloatingStat icon={Clock} label="Pending Payroll" value={teacherPendingCount} tone="blue" />
        <FloatingStat icon={ListTodo} label="Pending Receipts" value={studentPendingCount} tone="amber" />
        <FloatingStat icon={CheckCircle2} label="Audits Completed" value={completedCount} tone="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] items-start mt-4">
        {/* Modern Sidebar Nav */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 lg:sticky lg:top-20 scrollbar-hide">
          <p className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Audit Views</p>
          
          <button
            onClick={() => setActiveView("teachers")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all shrink-0",
              activeView === "teachers" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <UserCheck className="size-4.5" />
            Teacher Payroll
            {teacherPendingCount > 0 && (
              <span className={cn(
                "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black",
                activeView === "teachers" ? "bg-black/20 text-white" : "bg-primary/10 text-primary"
              )}
              >
                {teacherPendingCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveView("students")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all shrink-0",
              activeView === "students" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <ShieldCheck className="size-4.5" />
            Student Receipts
            {studentPendingCount > 0 && (
              <span className={cn(
                "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black",
                activeView === "students" ? "bg-black/20 text-white" : "bg-primary/10 text-primary"
              )}
              >
                {studentPendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("ledger")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all shrink-0",
              activeView === "ledger" 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <CircleDollarSign className="size-4.5" />
            Ledger Entries
          </button>
        </nav>

        {/* Content Area */}
        <div className="min-w-0">
          {activeView === "teachers" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1 mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Teacher Payroll Queue</h3>
                  <p className="text-sm text-muted-foreground mt-1">Review and process faculty salaries for the current cycle.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {teacherRows.map((row) => (
                  <QueueListRow
                    key={row.id}
                    title={row.name}
                    subtitle={`${row.id} • ${row.faculty}`}
                    icon={ClipboardCheck}
                    amount={row.salary}
                    meta={`Cycle: ${row.month}`}
                    status={row.status}
                    onClick={() => openTeacherAudit(row)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeView === "students" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1 mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Student Receipts Queue</h3>
                  <p className="text-sm text-muted-foreground mt-1">Verify incoming fee payments and allocate to correct months.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {studentRows.map((row) => (
                  <QueueListRow
                    key={row.id}
                    title={row.name}
                    subtitle={`${row.id} • Grade ${row.grade}`}
                    icon={CreditCard}
                    amount={row.fee}
                    meta={`Covered: ${row.months.length} mo`}
                    status={row.status}
                    onClick={() => openStudentAudit(row)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeView === "ledger" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1 mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Supporting Ledger</h3>
                  <p className="text-sm text-muted-foreground mt-1">Record one-off incomes or expenses tied to audits.</p>
                </div>
              </div>
              
              <div className="grid gap-6 xl:grid-cols-[400px_1fr] items-start">
                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                  <h4 className="font-bold text-lg mb-6">New Entry</h4>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
                      <Select value={otherCategory} onValueChange={setOtherCategory}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {OTHER_CATEGORY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {otherCategory === "Custom" && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Custom Name</Label>
                        <Input
                          className="h-11 rounded-xl"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Annual Donation"
                        />
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Type</Label>
                        <Select value={otherType} onValueChange={setOtherType}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Amount</Label>
                        <Input
                          type="number"
                          className="h-11 rounded-xl font-bold"
                          value={otherAmount}
                          onChange={(e) => setOtherAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Payment Mode</Label>
                        <Select value={otherMode} onValueChange={setOtherMode}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="offline">Cash/Cheque</SelectItem>
                            <SelectItem value="online">Online Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Month</Label>
                        <Select value={otherMonth} onValueChange={setOtherMonth}>
                          <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {MONTH_OPTIONS.map((month) => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {otherMode === "online" ? (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Reference ID</Label>
                        <Input
                          className="h-11 rounded-xl"
                          value={otherTransactionId}
                          onChange={(e) => setOtherTransactionId(e.target.value)}
                          placeholder="TXN-..."
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 px-4 py-3 text-xs font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                        Cash entries will be logged without a digital reference.
                      </div>
                    )}

                    <div className="space-y-2 flex flex-col">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Date</Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className="h-11 w-full justify-between rounded-xl px-3 font-normal bg-background"
                            />
                          }
                        >
                          {otherDate ? <span className="font-semibold">{formattedOtherDate}</span> : <span className="text-muted-foreground">Select</span>}
                          <ChevronDown className="size-4 opacity-50" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                          <CalendarPicker
                            mode="single"
                            selected={otherDate ? new Date(`${otherDate}T00:00:00`) : undefined}
                            onSelect={(date) => {
                              if (date) setOtherDate(format(date, "yyyy-MM-dd"));
                              setDatePickerOpen(false);
                            }}
                            defaultMonth={otherDate ? new Date(`${otherDate}T00:00:00`) : undefined}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button className="w-full h-12 rounded-xl text-sm font-bold gap-2 mt-2" onClick={submitOtherEntry}>
                      <CircleDollarSign className="size-5" />
                      Add to Ledger
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground px-2 mb-2">Recent Entries</h4>
                  {otherRows.map((row) => (
                    <div key={row.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 items-start sm:items-center justify-between transition-colors hover:bg-muted/50">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 shrink-0 rounded-full", row.type === "Income" ? "bg-emerald-500" : "bg-rose-500")} />
                          <p className="font-bold text-foreground truncate">{row.category}</p>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mt-1">{row.date} • {row.paymentMode}</p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <div className="text-left sm:text-right">
                          <p className="font-black text-foreground">{formatCurrency(row.amount)}</p>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">{row.paymentRef}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Audit Sheet */}
      <Sheet open={!!teacherAudit} onOpenChange={(open) => !open && setTeacherAudit(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l shadow-2xl">
          <div className="px-6 py-5 border-b bg-muted/30 backdrop-blur-md">
            <SheetTitle className="text-xl font-bold">Process Payroll</SheetTitle>
            <SheetDescription className="mt-1">
              Verify salary disbursement details.
            </SheetDescription>
          </div>
          
          {teacherAudit && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 rounded-full bg-primary/20 text-primary items-center justify-center">
                    <UserCheck className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{teacherAudit.name}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5">{teacherAudit.faculty} • {teacherAudit.id}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-primary/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Salary</p>
                  <p className="text-2xl font-black text-primary">{formatCurrency(teacherAudit.salary)}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cycle Month</Label>
                  <Select value={teacherMonth} onValueChange={setTeacherMonth}>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mode of Payment</Label>
                  <Select value={teacherPaymentMode} onValueChange={setTeacherPaymentMode}>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Cash / Cheque</SelectItem>
                      <SelectItem value="online">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {teacherPaymentMode === "online" ? (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Transaction Ref</Label>
                    <Input
                      className="h-12 rounded-xl bg-muted/30 border-border/50"
                      value={teacherTransactionId}
                      onChange={(e) => setTeacherTransactionId(e.target.value)}
                      placeholder="e.g. UTR-123456"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                    Offline payments are logged as paid in cash.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-background mt-auto">
            <Button className="w-full h-12 rounded-xl text-[15px] font-bold" onClick={submitTeacherAudit}>
              Confirm & Mark Paid
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Student Audit Sheet */}
      <Sheet open={!!studentAudit} onOpenChange={(open) => !open && setStudentAudit(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l shadow-2xl">
          <div className="px-6 py-5 border-b bg-muted/30 backdrop-blur-md">
            <SheetTitle className="text-xl font-bold">Process Receipt</SheetTitle>
            <SheetDescription className="mt-1">
              Verify student fee payment and coverage.
            </SheetDescription>
          </div>
          
          {studentAudit && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 rounded-full bg-emerald-500/20 text-emerald-600 items-center justify-center dark:text-emerald-400">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight text-foreground">{studentAudit.name}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5">Grade {studentAudit.grade} • {studentAudit.id}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-emerald-500/10 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Fee / Mo</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(studentAudit.fee)}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Covered Months</Label>
                  <MonthPills selectedMonths={studentMonths} onToggle={toggleStudentMonth} />
                </div>
                
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 border border-border/50">
                  <span className="font-semibold text-sm">Total to collect</span>
                  <span className="text-lg font-black">{formatCurrency(studentAudit.fee * Math.max(1, studentMonths.length))}</span>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Payment Mode</Label>
                  <Select value={studentPaymentMode} onValueChange={setStudentPaymentMode}>
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Cash / Cheque</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {studentPaymentMode === "online" ? (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Transaction ID</Label>
                    <Input
                      className="h-12 rounded-xl bg-muted/30 border-border/50"
                      value={studentTransactionId}
                      onChange={(e) => setStudentTransactionId(e.target.value)}
                      placeholder="e.g. TXN-123456"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                    Offline payments are logged as paid in cash.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-background mt-auto">
            <Button className="w-full h-12 rounded-xl text-[15px] font-bold" onClick={submitStudentAudit}>
              Confirm & Mark Paid
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </FinanceShell>
  );
}
