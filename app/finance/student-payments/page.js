"use client";

import { useState } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/app/finance/analytics-ui";
import { Button }   from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Download, Search, GraduationCap, Check, Users, Coins, AlertTriangle,
  ReceiptText, Mail, CreditCard,
} from "lucide-react";

const INITIAL_PAYMENTS = [
  { id: "ADM-2401", name: "Aarav Sharma", classNum: "10", section: "A", month: "May 2026", fee: 12000, paid: 12000, status: "Paid",    date: "20 May 2026" },
  { id: "ADM-2417", name: "Diya Patel",   classNum: "8",  section: "B", month: "May 2026", fee: 10500, paid: 6000,  status: "Partial", date: "18 May 2026" },
  { id: "ADM-2328", name: "Kabir Verma",  classNum: "12", section: "C", month: "May 2026", fee: 15000, paid: 0,     status: "Overdue", date: "Due 10 May"  },
  { id: "ADM-2506", name: "Ira Khan",     classNum: "6",  section: "A", month: "May 2026", fee: 8800,  paid: 8800,  status: "Paid",    date: "16 May 2026" },
  { id: "ADM-2384", name: "Neil Dutta",   classNum: "9",  section: "B", month: "May 2026", fee: 11400, paid: 0,     status: "Pending", date: "Due 31 May"  },
  { id: "ADM-2442", name: "Sara Thomas",  classNum: "7",  section: "C", month: "May 2026", fee: 9600,  paid: 4800,  status: "Partial", date: "Due 28 May"  },
  { id: "ADM-2299", name: "Rohan Mehta",  classNum: "11", section: "A", month: "May 2026", fee: 14200, paid: 14200, status: "Paid",    date: "15 May 2026" },
];

export default function StudentPaymentsPage() {
  const [payments, setPayments]           = useState(INITIAL_PAYMENTS);
  const [search, setSearch]               = useState("");
  const [classFilter, setClassFilter]     = useState("All Classes");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [monthFilter, setMonthFilter]     = useState("May 2026");
  const [statusFilter, setStatusFilter]   = useState("All Status");
  const [yearFilter, setYearFilter]       = useState("2025-2026");
  const [toastMessage, setToastMessage]   = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [payAmount, setPayAmount]         = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSendReminder = (name) => showToast(`Reminder sent to parents of ${name}!`);

  const handleOpenPayModal = (item) => {
    setEditingPayment(item);
    setPayAmount(String(item.fee - item.paid));
  };

  const handleUpdatePayment = () => {
    if (!editingPayment) return;
    const added = Number(payAmount);
    if (isNaN(added) || added <= 0) { showToast("Please enter a valid amount."); return; }
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id !== editingPayment.id) return item;
        const newPaid = Math.min(item.paid + added, item.fee);
        return {
          ...item, paid: newPaid,
          status: newPaid >= item.fee ? "Paid" : "Partial",
          date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        };
      })
    );
    showToast(`Payment of ₹${Number(payAmount).toLocaleString()} recorded for ${editingPayment.name}!`);
    setEditingPayment(null);
  };

  const fmt = (val) => `₹${val.toLocaleString("en-IN")}`;

  const filtered = payments.filter((item) => {
    const matchSearch  = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchClass   = classFilter   === "All Classes"   || item.classNum === classFilter;
    const matchSection = sectionFilter === "All Sections"  || item.section  === sectionFilter;
    const matchStatus  = statusFilter  === "All Status"    || item.status   === statusFilter;
    return matchSearch && matchClass && matchSection && matchStatus;
  });

  const totalStudents  = 1842;
  const paidCount      = payments.filter((p) => p.status === "Paid").length * 200 + 426;
  const pendingCount   = payments.filter((p) => p.status !== "Paid").length * 40 + 118;
  const totalCollected = payments.reduce((s, p) => s + p.paid, 0) * 10 + 4800000;
  const totalDues      = payments.reduce((s, p) => s + (p.fee - p.paid), 0) * 10 + 720000;

  return (
    <FinanceShell title="Student Monthly Payments">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-foreground text-background px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-border animate-in slide-in-from-top-2">
          <Check className="size-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Student Monthly Payments"
        subtitle="Track monthly fee payments for every student with receipt, reminder, and payment actions."
        action={
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Students"   value={totalStudents.toLocaleString()}  delta="+126 enrolled"     icon={GraduationCap} tone="blue"   />
        <StatCard label="Paid Students"    value={paidCount.toLocaleString()}      delta="77.4% completed"   icon={Users}         tone="green"  />
        <StatCard label="Pending Payments" value={pendingCount.toLocaleString()}   delta="42 overdue"        icon={AlertTriangle} tone="amber"  />
        <StatCard label="Total Collected"  value={fmt(totalCollected)}             delta="+12.4% this month" icon={Coins}         tone="purple" />
        <StatCard label="Due Amount"       value={fmt(totalDues)}                  delta="-4.6% from Apr"    icon={CreditCard}    tone="rose"   />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid gap-3 xl:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  placeholder="Name, roll no, admission no"
                />
              </div>
            </div>

            {[
              { label: "Class",          value: classFilter,   set: setClassFilter,   opts: ["All Classes","6","7","8","9","10","11","12"] },
              { label: "Section",        value: sectionFilter, set: setSectionFilter, opts: ["All Sections","A","B","C"] },
              { label: "Month",          value: monthFilter,   set: setMonthFilter,   opts: ["May 2026","April 2026","March 2026"] },
              { label: "Status",         value: statusFilter,  set: setStatusFilter,  opts: ["All Status","Paid","Pending","Partial","Overdue"] },
              { label: "Academic Year",  value: yearFilter,    set: setYearFilter,    opts: ["2025-2026","2024-2025","2023-2024"] },
            ].map(({ label, value, set, opts }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                <Select value={value} onValueChange={set}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={!!editingPayment} onOpenChange={(open) => !open && setEditingPayment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Fee Payment</DialogTitle>
            <DialogDescription>
              Enter payment received from <strong>{editingPayment?.name}</strong> ({editingPayment?.id}) for {editingPayment?.month}.
            </DialogDescription>
          </DialogHeader>
          {editingPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted p-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total Fee</p>
                  <p className="font-black text-foreground mt-1">{fmt(editingPayment.fee)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Already Paid</p>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 mt-1">{fmt(editingPayment.paid)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Outstanding</p>
                  <p className="font-black text-rose-600 dark:text-rose-400 mt-1">{fmt(editingPayment.fee - editingPayment.paid)}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-amount">Payment Amount (₹)</Label>
                <Input
                  id="pay-amount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Enter amount received"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPayment(null)}>Cancel</Button>
            <Button onClick={handleUpdatePayment} className="gap-2">
              <Check className="size-4" />
              Submit Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ledger Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <CreditCard className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">Monthly Payment Records</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} records · May 2026</p>
            </div>
          </div>
        </CardHeader>

        {/* Mobile cards */}
        <CardContent className="md:hidden p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground font-medium">No records found.</p>
          ) : filtered.map((row) => (
            <div key={row.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.id} · Class {row.classNum}-{row.section}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm border-t border-border pt-3 mb-3">
                <div><p className="text-xs font-bold text-muted-foreground">Fee</p><p className="font-bold text-foreground mt-0.5">{fmt(row.fee)}</p></div>
                <div><p className="text-xs font-bold text-muted-foreground">Paid</p><p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{fmt(row.paid)}</p></div>
                <div><p className="text-xs font-bold text-muted-foreground">Due</p><p className="font-black text-rose-600 dark:text-rose-400 mt-0.5">{fmt(row.fee - row.paid)}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5"><ReceiptText className="size-3.5" />Receipt</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400" onClick={() => handleSendReminder(row.name)}>
                  <Mail className="size-3.5" />Reminder
                </Button>
                {row.status !== "Paid" && (
                  <Button size="sm" className="flex-1" onClick={() => handleOpenPayModal(row)}>Pay</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Student Name","Admission No.","Class","Section","Month","Fee Amount","Paid","Due","Status","Date","Actions"].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No records matching filters.</TableCell></TableRow>
              ) : filtered.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                  <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                  <TableCell className="text-muted-foreground">{row.classNum}</TableCell>
                  <TableCell className="text-muted-foreground">{row.section}</TableCell>
                  <TableCell className="text-muted-foreground">{row.month}</TableCell>
                  <TableCell className="font-semibold text-foreground">{fmt(row.fee)}</TableCell>
                  <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{fmt(row.paid)}</TableCell>
                  <TableCell className="font-black text-rose-600 dark:text-rose-400">{fmt(row.fee - row.paid)}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{row.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ReceiptText className="size-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400"
                        onClick={() => handleSendReminder(row.name)}
                      >
                        <Mail className="size-3.5" />
                      </Button>
                      {row.status !== "Paid" && (
                        <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenPayModal(row)}>
                          <CreditCard className="size-3" />Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FinanceShell>
  );
}
