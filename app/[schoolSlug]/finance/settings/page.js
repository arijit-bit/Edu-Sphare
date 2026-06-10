"use client";

import { useState } from "react";
import { FinanceShell, PageHeader } from "@/app/finance/analytics-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  School,
  CreditCard,
  Receipt,
  Bell,
  Calendar,
  Shield,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SETTING_ITEMS = [
  {
    id: "fee",
    title: "Fee Structure",
    icon: School,
    bg: "text-blue-500 bg-blue-500/10",
    description: "Configure class-wise tuition, transport, exam, and activity fees.",
  },
  {
    id: "payments",
    title: "Payment Methods",
    icon: CreditCard,
    bg: "text-teal-500 bg-teal-500/10",
    description: "Manage cash, bank transfer, UPI, card, and online payment gateway settings.",
  },
  {
    id: "receipts",
    title: "Receipt Templates",
    icon: Receipt,
    bg: "text-purple-500 bg-purple-500/10",
    description: "Customize receipt numbering, school header, tax details, and footer notes.",
  },
  {
    id: "reminders",
    title: "Reminder Rules",
    icon: Bell,
    bg: "text-amber-500 bg-amber-500/10",
    description: "Set automatic due date notifications and overdue escalation rules.",
  },
  {
    id: "academic",
    title: "Academic Year",
    icon: Calendar,
    bg: "text-emerald-500 bg-emerald-500/10",
    description: "Control active school academic year and finance closing periods.",
  },
  {
    id: "roles",
    title: "Roles & Access",
    icon: Shield,
    bg: "text-rose-500 bg-rose-500/10",
    description: "Assign permissions for accountants, administrative staff, and auditors.",
  },
];

export default function FinanceSettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [feeRate, setFeeRate] = useState("12,000");
  const [activeYear, setActiveYear] = useState("2025-2026");
  const [reminderDays, setReminderDays] = useState("5");
  const [smsAlert, setSmsAlert] = useState(true);

  // Modal temporary values
  const [tempFeeRate, setTempFeeRate] = useState(feeRate);
  const [tempActiveYear, setTempActiveYear] = useState(activeYear);
  const [tempReminderDays, setTempReminderDays] = useState(reminderDays);
  const [tempSmsAlert, setTempSmsAlert] = useState(smsAlert);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSave = (title) => {
    if (selectedSetting === "fee") {
      setFeeRate(tempFeeRate);
    } else if (selectedSetting === "academic") {
      setActiveYear(tempActiveYear);
    } else if (selectedSetting === "reminders") {
      setReminderDays(tempReminderDays);
      setSmsAlert(tempSmsAlert);
    }
    triggerToast(`Settings for "${title}" saved successfully!`);
    setSelectedSetting(null);
  };

  const openSetting = (id) => {
    if (id === "fee") {
      setTempFeeRate(feeRate);
    } else if (id === "academic") {
      setTempActiveYear(activeYear);
    } else if (id === "reminders") {
      setTempReminderDays(reminderDays);
      setTempSmsAlert(smsAlert);
    }
    setSelectedSetting(id);
  };

  const getSettingTitle = () => {
    const item = SETTING_ITEMS.find((s) => s.id === selectedSetting);
    return item ? item.title : "Configuration";
  };

  return (
    <FinanceShell title="Settings">
      {/* Toast Alert */}
      {toast.show && (
        <div
          className={cn(
            "fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up",
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-300"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <PageHeader
        title="System Settings"
        subtitle="Configure financial workflows, fee structures, payment methods, reminders, and access controls."
      />

      {/* Settings Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mb-6">
        {SETTING_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors flex flex-col justify-between"
              onClick={() => openSetting(item.id)}
            >
              <CardHeader className="pb-3 flex flex-col gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <Separator />
              <CardFooter className="py-3 px-6 flex justify-between items-center text-xs font-bold text-primary shrink-0 hover:underline">
                Configure Settings
                <ChevronRight className="h-4 w-4" />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* ═══ INTERACTIVE MODAL DIALOGS ═══ */}

      {/* 1. Fee Structure Dialog */}
      <Dialog open={selectedSetting === "fee"} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Fee Structure</DialogTitle>
            <DialogDescription>
              Update school tuition fee base rates for the active academic term.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="base-fee">Tuition Fee Rate — Base Class 10 (Rs.)</Label>
              <Input
                id="base-fee"
                value={tempFeeRate}
                onChange={(e) => setTempFeeRate(e.target.value)}
                placeholder="e.g. 12,000"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Lab Fees (Rs.)</Label>
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Rs. 2,500
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Sports Fees (Rs.)</Label>
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Rs. 1,200
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setSelectedSetting(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave("Fee Structure")} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Academic Year Dialog */}
      <Dialog open={selectedSetting === "academic"} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Academic Year settings</DialogTitle>
            <DialogDescription>
              Control active school academic year and finance closing periods.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Active Fiscal/Academic Year</Label>
              <Select value={tempActiveYear} onValueChange={setTempActiveYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025 (Previous)</SelectItem>
                  <SelectItem value="2025-2026">2025-2026 (Active)</SelectItem>
                  <SelectItem value="2026-2027">2026-2027 (Planning)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <div>
                <Label className="font-bold text-sm block">Lock Financial Books</Label>
                <span className="text-xs text-muted-foreground">
                  Prevent edits to transactions in previous terms.
                </span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setSelectedSetting(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave("Academic Year")} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Reminder Rules Dialog */}
      <Dialog open={selectedSetting === "reminders"} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reminder Rules Configuration</DialogTitle>
            <DialogDescription>
              Configure automatic reminder parameters for unpaid student fee invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rem-days">Send Reminders Before Due Date (Days)</Label>
              <Input
                id="rem-days"
                type="number"
                value={tempReminderDays}
                onChange={(e) => setTempReminderDays(e.target.value)}
                placeholder="e.g. 5"
                required
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <div>
                <Label htmlFor="rem-sms" className="font-bold text-sm block cursor-pointer">
                  Send SMS/WhatsApp Alert
                </Label>
                <span className="text-xs text-muted-foreground">
                  Send mobile alerts alongside default email reminders.
                </span>
              </div>
              <Switch
                id="rem-sms"
                checked={tempSmsAlert}
                onCheckedChange={setTempSmsAlert}
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={() => setSelectedSetting(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave("Reminder Rules")} className="gap-1.5">
              <Save className="h-4 w-4" />
              Save Rules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Generic Dialog for Payments, Receipts, Roles */}
      <Dialog
        open={
          selectedSetting === "payments" ||
          selectedSetting === "receipts" ||
          selectedSetting === "roles"
        }
        onOpenChange={(open) => !open && setSelectedSetting(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {getSettingTitle()}</DialogTitle>
            <DialogDescription>
              System parameters configuration for the {getSettingTitle()} module.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              These settings have been synchronized with the main Edu Sphare database. You can manage
              active integrations, customize fields, or update system configurations.
            </p>
            <Separator className="my-4" />
            <div className="p-3 border rounded-xl bg-muted/10 text-xs font-semibold text-center text-primary">
              Standard integration hooks are operational.
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedSetting(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(getSettingTitle())}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinanceShell>
  );
}
