"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, CreditCard, ReceiptText, TrendingUp, TrendingDown,
  BarChart3, Settings, Bell, Search, Download, Menu, X, Building2, PencilLine,
  LogOut, User, Sun, Moon, Laptop, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function getNavItems(schoolSlug) {
  const base = `/${schoolSlug}/finance`;
  return [
    { label: "Dashboard",        href: `${base}/dashboard`,        icon: LayoutDashboard, short: "Dashboard" },
    { label: "Student Payments", href: `${base}/student-payments`, icon: CreditCard,      short: "Payments"  },
    { label: "Teacher Payroll",  href: `${base}/teacher-payments`, icon: ReceiptText,     short: "Payroll"   },
    { label: "Summary",          href: `${base}/summary`,          icon: TrendingUp,      short: "Summary"   },
    { label: "Audit",            href: `${base}/audit`,            icon: PencilLine,      short: "Audit"     },
    { label: "Reports",          href: `${base}/reports`,          icon: BarChart3,       short: "Reports"   },
    { label: "Settings",         href: `${base}/settings`,         icon: Settings,        short: "Settings"  },
  ];
}



/* ── Sidebar Nav Item ── */
function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
      {isActive && <ChevronRight className="ml-auto size-3.5 opacity-60" />}
    </Link>
  );
}

/* ── Sidebar Content ── */
function SidebarContent({ pathname, onNav }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="size-4" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Edu Sphare</p>
          <p className="text-[11px] text-muted-foreground">Finance Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Main Menu</p>
        {navItems.slice(0, 6).map((item) => (
          <NavItem key={item.href} item={item} isActive={pathname === item.href || pathname.startsWith(item.href + "/")} onClick={onNav} />
        ))}
        <Separator className="my-3" />
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">System</p>
        {navItems.slice(6).map((item) => (
          <NavItem key={item.href} item={item} isActive={pathname === item.href} onClick={onNav} />
        ))}
      </nav>

      {/* User card */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Alex Morgan</p>
            <p className="text-xs text-muted-foreground truncate">Senior Accountant</p>
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0">
            <LogOut className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── FinanceShell ── */
export function FinanceShell({ children, title = "Finance" }) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { schoolSlug = "dummy-school" } = useParams() || {};
  const navItems = getNavItems(schoolSlug);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r bg-card">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent pathname={pathname} onNav={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden size-8" onClick={() => setMobileOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-9 hidden sm:flex">
              <Search className="size-4" />
            </Button>
            <ThemeToggle />
            <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative size-9">
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { text: "Kabir Verma's fee is overdue.", time: "1h ago" },
                  { text: "May payroll batch is pending approval.", time: "3h ago" },
                  { text: "Annual report generated successfully.", time: "1d ago" },
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2.5">
                    <span className="text-sm font-medium">{n.text}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="size-8 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">AM</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden animate-slide-up px-3 py-4 sm:px-4 md:px-6 md:py-6">
          <div className="mx-auto flex min-w-0 w-full max-w-[1400px] flex-col gap-5 sm:gap-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
          <div className="flex justify-around px-2 py-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-semibold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("size-5", isActive && "fill-primary/20")} />
                  {item.short}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}

/* ── Shared UI primitives ── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, delta, icon: Icon, tone = "blue", className }) {
  const tones = {
    blue:   { bg: "bg-blue-50 dark:bg-blue-950/30",   icon: "text-blue-600 dark:text-blue-400",   delta: "text-blue-600 dark:text-blue-400"   },
    green:  { bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "text-emerald-600 dark:text-emerald-400", delta: "text-emerald-600 dark:text-emerald-400" },
    purple: { bg: "bg-violet-50 dark:bg-violet-950/30", icon: "text-violet-600 dark:text-violet-400", delta: "text-violet-600 dark:text-violet-400" },
    amber:  { bg: "bg-amber-50 dark:bg-amber-950/30",  icon: "text-amber-600 dark:text-amber-400",  delta: "text-amber-600 dark:text-amber-400"  },
    rose:   { bg: "bg-rose-50 dark:bg-rose-950/30",    icon: "text-rose-600 dark:text-rose-400",    delta: "text-rose-600 dark:text-rose-400"    },
    teal:   { bg: "bg-teal-50 dark:bg-teal-950/30",    icon: "text-teal-600 dark:text-teal-400",    delta: "text-teal-600 dark:text-teal-400"    },
    cyan:   { bg: "bg-cyan-50 dark:bg-cyan-950/30",    icon: "text-cyan-600 dark:text-cyan-400",    delta: "text-cyan-600 dark:text-cyan-400"    },
  };
  const t = tones[tone] || tones.blue;
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className={cn("size-10 rounded-lg flex items-center justify-center", t.bg)}>
          {Icon && <Icon className={cn("size-5", t.icon)} />}
        </div>
        <p className="max-w-[11rem] text-right text-[11px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground sm:text-xs">{label}</p>
      </div>
      <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{value}</p>
      {delta && <p className={cn("text-xs font-semibold mt-1", t.delta)}>{delta}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const variants = {
    Paid:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    Approved:   "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    Pending:    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Partial:    "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    Overdue:    "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    Processing: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    Scheduled:  "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[status] || "bg-muted text-muted-foreground")}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ── Backward-compatible aliases (for pages still being migrated) ── */
export const SummaryCard = StatCard;

export function FilterSelect({ label, value, onChange, options = [] }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

export function Icon({ name, className, style }) {
  /* Fallback renderer for legacy Material Symbol icon calls */
  return <span className={cn("material-symbols-outlined", className)} style={style} aria-hidden="true">{name}</span>;
}

export function Card({ children, className, style }) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)} style={style}>
      {children}
    </div>
  );
}
