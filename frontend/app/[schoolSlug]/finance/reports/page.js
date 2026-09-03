"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FinanceShell,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/shells/finance-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Download, Plus, Search, CheckCircle2, AlertTriangle,
  Building2, Users, Clock, Briefcase, PieChart, Settings,
  Gavel, ShieldCheck, Navigation, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

const reportMetaMap = {
  fee:      { icon: Briefcase,  color: "text-blue-500 bg-blue-500/10" },
  payroll:  { icon: Users,      color: "text-emerald-500 bg-emerald-500/10" },
  expenses: { icon: PieChart,   color: "text-purple-500 bg-purple-500/10" },
  annual:   { icon: Building2,  color: "text-teal-500 bg-teal-500/10" },
  tax:      { icon: Gavel,      color: "text-amber-500 bg-amber-500/10" },
  transport:{ icon: Navigation, color: "text-rose-500 bg-rose-500/10" },
};

export default function ReportsPage() {
  const [reports, setReports]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("All Status");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle]             = useState("");
  const [newPeriod, setNewPeriod]           = useState("May 2026");
  const [newDesc, setNewDesc]               = useState("");
  const [newType, setNewType]               = useState("expenses");
  const [creating, setCreating]             = useState(false);
  const [toast, setToast]                   = useState({ show: false, message: "", type: "success" });

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        ...(statusFilter !== "All Status" && { status: statusFilter }),
        ...(search && { search }),
      });
      const res = await apiFetch(`/api/finance/reports?${qs}`);
      setReports(res.data ?? []);
    } catch (err) {
      setError("Failed to load reports. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleDownload = (title) => triggerToast(`Downloading ${title}… Started!`);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) { triggerToast("Please fill in all fields.", "error"); return; }
    setCreating(true);
    try {
      const now = new Date();
      const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const periodEnd   = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-28`;
      await apiFetch("/api/finance/reports", {
        method: "POST",
        body: JSON.stringify({ title: newTitle, type: newType, periodLabel: newPeriod, periodStart, periodEnd, description: newDesc }),
      });
      triggerToast(`Report "${newTitle}" submitted for generation!`);
      setShowCreateModal(false);
      setNewTitle(""); setNewDesc("");
      loadReports();
    } catch (err) {
      triggerToast(err.message || "Failed to create report.", "error");
    } finally {
      setCreating(false);
    }
  };

  const approved = reports.filter((r) => r.status === "Paid").length;
  const pending  = reports.filter((r) => r.status === "Pending" || r.status === "Processing").length;

  return (
    <FinanceShell title="Reports">
      {toast.show && (
        <div className={cn(
          "fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg",
          toast.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300"
            : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-300"
        )}>
          {toast.type === "success"
            ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            : <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <PageHeader
        title="Financial Reports"
        subtitle="Generate, review, and export finance summaries, tax ledgers, and academic year statements."
        action={
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Reports"       value={loading ? "…" : reports.length.toString()} delta="All time"        icon={FileText}  tone="blue"   />
        <StatCard label="Approved Documents"  value={loading ? "…" : approved.toString()}        delta="Verified"       icon={ShieldCheck} tone="green" />
        <StatCard label="Pending Audits"      value={loading ? "…" : pending.toString()}         delta="Needs review"   icon={Clock}     tone="amber"  />
        <StatCard label="Report Templates"    value="2"                                           delta="Auto-scheduled" icon={Settings}  tone="purple" />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <Label>Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search report titles or keywords…" className="pl-9 h-10" />
              </div>
            </div>
            <div className="w-full md:w-[220px] space-y-1.5">
              <Label>Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Paid">Approved / Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <CardContent className="space-y-3">
            <p className="text-rose-500 font-semibold">{error}</p>
            <Button variant="outline" onClick={loadReports}>Retry</Button>
          </CardContent>
        </Card>
      ) : reports.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report) => {
            const meta = reportMetaMap[report.type] || { icon: FileText, color: "text-slate-500 bg-slate-500/10" };
            const IconComponent = meta.icon;
            return (
              <Card key={report.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2.5 rounded-xl shrink-0", meta.color)}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold leading-tight">{report.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Period: {report.period} &nbsp;·&nbsp; Size: {report.size}
                        </CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                </CardContent>
                <Separator />
                <CardFooter className="p-3 bg-muted/20 flex justify-between items-center shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground">{report.reportNumber ?? report.id}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground" onClick={() => handleDownload(report.title)}>
                      <Download className="h-3.5 w-3.5" />Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => handleDownload(report.title)}>
                      <Download className="h-3.5 w-3.5" />CSV Ledger
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CardContent className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-foreground text-lg">No reports found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No reports match your filters. Try adjusting the search or generate a new one.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Report Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>Specify details to process a new school financial ledger.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateReport} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rep-title">Report Title</Label>
              <Input id="rep-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Hostels & Cafeteria Revenue" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rep-period">Reporting Period</Label>
                <Input id="rep-period" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} placeholder="e.g. May 2026" required />
              </div>
              <div className="space-y-1.5">
                <Label>Report Category</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fee">Student Fees</SelectItem>
                    <SelectItem value="payroll">Payroll Summary</SelectItem>
                    <SelectItem value="expenses">Operational Expense</SelectItem>
                    <SelectItem value="annual">Annual Statement</SelectItem>
                    <SelectItem value="tax">Tax Compliance</SelectItem>
                    <SelectItem value="transport">Transport / Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rep-desc">Description / Scope</Label>
              <Textarea id="rep-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Outline the scope, accounts involved, and purpose…" className="h-20" required />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" className="gap-1.5" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Generate Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  );
}
