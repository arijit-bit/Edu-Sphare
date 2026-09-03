"use client";

import { useState, useEffect, useCallback } from "react";
import { FinanceShell, PageHeader, StatCard, StatusBadge } from "@/components/shells/finance-ui";
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
import {
  Download, Search, GraduationCap, Check, Users, Coins, AlertTriangle,
  ReceiptText, Mail, CreditCard, Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useParams } from "next/navigation";

export default function StudentPaymentsPage() {
  const params = useParams();
  const [records, setRecords]       = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [search, setSearch]               = useState("");
  const [classFilter, setClassFilter]     = useState("All Classes");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [monthFilter, setMonthFilter]     = useState("May 2026");
  const [statusFilter, setStatusFilter]   = useState("All Status");

  const [toastMessage, setToastMessage]   = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [payAmount, setPayAmount]         = useState("");
  const [submitting, setSubmitting]       = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        month: monthFilter,
        ...(classFilter !== "All Classes" && { classFilter }),
        ...(sectionFilter !== "All Sections" && { section: sectionFilter }),
        ...(statusFilter !== "All Status" && { status: statusFilter }),
        ...(search && { search }),
        limit: "100",
      });
      const res = await apiFetch(`/api/finance/student-payments?${params}`);
      setRecords(res.data.records ?? []);
      setStats(res.data.stats ?? {});
    } catch (err) {
      setError(err.message || "Failed to load payment records");
    } finally {
      setLoading(false);
    }
  }, [monthFilter, classFilter, sectionFilter, statusFilter, search]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadPayments(); }, [loadPayments]);

  const handleSendReminder = (name) => showToast(`Reminder sent to parents of ${name}!`);

  const handleOpenPayModal = (item) => {
    setEditingPayment(item);
    setPayAmount(String(item.fee - item.paid));
  };

  const handleUpdatePayment = async () => {
    if (!editingPayment) return;
    const added = Number(payAmount);
    if (isNaN(added) || added <= 0) { showToast("Please enter a valid amount."); return; }

    setSubmitting(true);
    try {
      await apiFetch(`/api/finance/student-payments/${editingPayment.fee_record_id}/pay`, {
        method: "POST",
        body: JSON.stringify({ amount: added, paymentMode: "cash" }),
      });
      showToast(`Payment of ₹${added.toLocaleString("en-IN")} recorded for ${editingPayment.name}!`);
      setEditingPayment(null);
      loadPayments(); // refresh table
    } catch (err) {
      showToast(err.message || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  return (
    <FinanceShell title="Student Monthly Payments">
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
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Card key={i} className="h-24 animate-pulse bg-muted/40" />)
        ) : (
          <>
            <StatCard label="Total Students"   value={(stats.totalStudents ?? 0).toLocaleString()}  delta="Enrolled this month"      icon={GraduationCap} tone="blue"   />
            <StatCard label="Paid Students"    value={(stats.paidCount ?? 0).toLocaleString()}      delta="Fully paid fees"          icon={Users}         tone="green"  />
            <StatCard label="Pending Payments" value={(stats.pendingCount ?? 0).toLocaleString()}   delta="Awaiting payment"         icon={AlertTriangle} tone="amber"  />
            <StatCard label="Total Collected"  value={fmt(stats.totalCollected)}                    delta="This month collected"     icon={Coins}         tone="purple" />
            <StatCard label="Due Amount"       value={fmt(stats.totalDues)}                         delta="Outstanding balance"      icon={CreditCard}    tone="rose"   />
          </>
        )}
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
              { label: "Class",         value: classFilter,   set: setClassFilter,   opts: ["All Classes","6","7","8","9","10","11","12"] },
              { label: "Section",       value: sectionFilter, set: setSectionFilter, opts: ["All Sections","A","B","C","D"] },
              { label: "Month",         value: monthFilter,   set: setMonthFilter,   opts: ["May 2026","April 2026","March 2026","February 2026","January 2026"] },
              { label: "Status",        value: statusFilter,  set: setStatusFilter,  opts: ["All Status","Paid","Pending","Partial","Overdue"] },
            ].map(({ label, value, set, opts }) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
                <Select value={value} onValueChange={set}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
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
            <Button variant="outline" onClick={() => setEditingPayment(null)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleUpdatePayment} className="gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
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
              <p className="text-xs text-muted-foreground mt-0.5">{records.length} records · {monthFilter}</p>
            </div>
          </div>
        </CardHeader>

        {/* Desktop table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Student Name","Admission No.","Class","Section","Month","Fee Amount","Paid","Due","Status","Date","Actions"].map((h) => (
                  <TableHead key={h} className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Loading records…
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center text-rose-500">{error}</TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No records matching filters.</TableCell></TableRow>
              ) : (
                records.map((row) => (
                  <TableRow key={row.fee_record_id} className="hover:bg-muted/40">
                    <TableCell className="font-semibold text-foreground">{row.name}</TableCell>
                    <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{row.id}</code></TableCell>
                    <TableCell className="text-muted-foreground">{row.class_name}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </FinanceShell>
  );
}
