"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  GraduationCap,
  Menu,
  Bell,
  ChevronRight,
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
function getStudentNavItems(t) {
  return [
    { label: t("Dashboard"), href: "/student/dashboard", icon: LayoutDashboard },
    { label: t("Performance"), href: "/student/performance", icon: TrendingUp },
    { label: t("Timetable"), href: "/student/timetable", icon: Calendar },
    { label: t("Results"), href: "/student/results", icon: FileText },
    { label: t("Feedback"), href: "/student/feedback", icon: MessageSquare },
    { label: t("Settings"), href: "/student/settings", icon: Settings },
  ];
}

function getMobileNavItems(t) {
  return [
    { label: t("Dashboard"), href: "/student/dashboard", icon: LayoutDashboard },
    { label: t("Performance"), href: "/student/performance", icon: TrendingUp },
    { label: t("Timetable"), href: "/student/timetable", icon: Calendar },
    { label: t("Results"), href: "/student/results", icon: FileText },
    { label: t("Feedback"), href: "/student/feedback", icon: MessageSquare },
  ];
}

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
  const { t } = useLanguage();
  const studentNavItems = getStudentNavItems(t);

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-black text-foreground leading-tight">Edu Sphare</p>
          <p className="text-[11px] font-medium text-muted-foreground">{t("Student Portal")}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Student navigation">
        <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {t("Main Menu")}
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
          {t("Preferences")}
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
  const { t } = useLanguage();
  const studentNavItems = getStudentNavItems(t);
  const activeItem = studentNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  return { pathname, activeItem };
}

/* ── StudentShell ── */
export function StudentShell({ children, title, subtitle }) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, dateLocale } = useLanguage();
  const mobileNavItems = getMobileNavItems(t);
  const translatedTitle = title ? t(title) : title;
  const translatedSubtitle = subtitle ? t(subtitle) : subtitle;

  const notifications = [
    {
      icon: FileText,
      text: t("Math assignment due tomorrow"),
      time: t("2h ago"),
      color: "text-blue-500",
    },
    {
      icon: Bell,
      text: t("Tech Fest registration is now open"),
      time: t("5h ago"),
      color: "text-emerald-500",
    },
    {
      icon: Trophy,
      text: "Fee payment reminder – due in 3 days",
      time: t("1d ago"),
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
        <div className="flex min-h-screen min-w-0 flex-col lg:pl-64">

          {/* Header */}
          <header className="sticky top-0 z-30 flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-card/90 px-3 backdrop-blur-md sm:h-14 sm:gap-3 sm:px-4 md:px-6">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile hamburger via Sheet */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 lg:hidden sm:h-9 sm:w-9"
                      aria-label={t("Open navigation")}
                    >
                      <Menu className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </Button>
                  }
                />
                <SheetContent side="left" className="w-64 p-0">
                  <SheetHeader className="sr-only">
                    <SheetTitle>{t("Navigation")}</SheetTitle>
                  </SheetHeader>
                  <SidebarContent
                    pathname={pathname}
                    onNavClick={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {title && (
                <div className="hidden md:block">
                  <p className="text-sm font-bold leading-tight text-foreground">{translatedTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString(dateLocale, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Bell Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9" aria-label={t("Notifications")}>
                    <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-card bg-destructive sm:right-1.5 sm:top-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>{t("Notifications")}</span>
                    <Badge variant="secondary" className="text-xs">{t("3 new")}</Badge>
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
                    {t("View all notifications")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Avatar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/student/settings">
                    <Avatar className="h-[30px] w-[30px] cursor-pointer sm:h-8 sm:w-8">
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
          <main className="mx-auto w-full max-w-[1440px] flex-1 px-3 py-4 pb-20 sm:px-4 md:px-6 md:py-6 md:pb-28 lg:pb-8">
            {(title || subtitle) && (
              <div className="mb-4 animate-slide-up md:mb-6">
                {title && (
                  <h1 className="text-lg font-black leading-tight text-foreground sm:text-xl md:text-2xl">{translatedTitle}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm md:block hidden">{translatedSubtitle}</p>
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
          className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-5 border-t border-border bg-card/95 px-2 py-1 backdrop-blur-md lg:hidden"
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
                  "flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[9px] font-bold transition-all duration-200 sm:text-[10px]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}
