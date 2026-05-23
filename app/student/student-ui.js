"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  Home,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  GraduationCap,
  Menu,
  Bell,
  Sun,
  Moon,
  Laptop,
  ChevronRight,
  BookOpen,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/* ── Nav Config ── */
export const studentNavItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Performance", href: "/student/performance", icon: TrendingUp },
  { label: "Timetable", href: "/student/timetable", icon: Calendar },
  { label: "Results", href: "/student/results", icon: FileText },
  { label: "Feedback", href: "/student/feedback", icon: MessageSquare },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

const mobileNavItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "Performance", href: "/student/performance", icon: TrendingUp },
  { label: "Results", href: "/student/results", icon: FileText },
  { label: "Feedback", href: "/student/feedback", icon: MessageSquare },
];

/* ── ProgressRing SVG Component ── */
export function ProgressRing({ value = 0, size = 80, strokeWidth = 8, color = "#3d5af1" }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const trackColor = "hsl(var(--muted))";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`${value}% progress`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-bold text-foreground leading-none">{value}%</span>
      </div>
    </div>
  );
}



/* ── Sidebar Nav Item ── */
function SidebarNavItem({ item, pathname, onClick }) {
  const Icon = item.icon;
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
      {isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-70" />}
    </Link>
  );
}

/* ── Sidebar Content ── */
function SidebarContent({ pathname, onNavClick }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-black text-foreground leading-tight">Edu Sphare</p>
          <p className="text-[11px] font-medium text-muted-foreground">Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Student navigation">
        <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Main Menu
        </p>
        {studentNavItems.slice(0, 6).map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
        <Separator className="my-3" />
        <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Preferences
        </p>
        {studentNavItems.slice(6).map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              AM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Aarav Malhotra</p>
            <p className="text-xs text-muted-foreground truncate">Grade 12-A</p>
          </div>
          <Link href="/student/settings">
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── useStudentNav hook ── */
export function useStudentNav() {
  const pathname = usePathname() || "";
  const activeItem = studentNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  return { pathname, activeItem };
}

/* ── StudentShell ── */
export function StudentShell({ children, title, subtitle }) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const notifications = [
    {
      icon: FileText,
      text: "Math assignment due tomorrow",
      time: "2h ago",
      color: "text-blue-500",
    },
    {
      icon: Bell,
      text: "Tech Fest registration is now open",
      time: "5h ago",
      color: "text-emerald-500",
    },
    {
      icon: Trophy,
      text: "Fee payment reminder – due in 3 days",
      time: "1d ago",
      color: "text-amber-500",
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">

        {/* ══ SIDEBAR (Desktop) ══ */}
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card lg:flex">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <div className="lg:pl-64 flex flex-col min-h-screen">

          {/* Header */}
          <header className="sticky top-0 z-30 flex items-center gap-3 justify-between px-4 md:px-6 h-14 bg-card/90 backdrop-blur-md border-b border-border shrink-0">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger via Sheet */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden h-9 w-9"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  }
                />
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <SidebarContent
                    pathname={pathname}
                    onNavClick={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {title && (
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Bell Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary" className="text-xs">3 new</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((n, i) => {
                    const NIcon = n.icon;
                    return (
                      <DropdownMenuItem key={i} className="flex items-start gap-3 py-3 cursor-pointer">
                        <NIcon className={cn("h-4 w-4 mt-0.5 shrink-0", n.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">{n.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-xs text-primary font-medium">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Avatar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/student/settings">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        AM
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Aarav Malhotra – Grade 12-A</TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-4 md:px-6 py-6 pb-24 lg:pb-8 max-w-[1440px] w-full mx-auto">
            {(title || subtitle) && (
              <div className="mb-6 animate-slide-up">
                {title && (
                  <h1 className="text-2xl font-black text-foreground leading-tight">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
            <div className="animate-slide-up stagger-1">{children}</div>
          </main>

          {/* Footer */}
          <footer className="hidden lg:flex border-t border-border bg-card px-6 py-3 items-center justify-between text-xs text-muted-foreground shrink-0">
            <p>© 2026 Edu Sphare. All rights reserved.</p>
            <p>Student Portal v3.0</p>
          </footer>
        </div>

        {/* ══ MOBILE BOTTOM NAV ══ */}
        <nav
          className="fixed bottom-0 left-0 z-50 w-full grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur-md px-2 py-1.5 lg:hidden"
          aria-label="Mobile navigation"
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}
