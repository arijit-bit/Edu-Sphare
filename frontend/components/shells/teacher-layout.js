"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  Calendar,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  GraduationCap,
  ChevronRight,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const TeacherLayoutContext = createContext({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useTeacherLayout = () => useContext(TeacherLayoutContext);

function getNavItems(schoolSlug) {
  const base = `/${schoolSlug}/teacher`;
  return [
    { label: "Dashboard", href: `${base}/dashboard`, icon: LayoutDashboard },
    { label: "Attendance", href: `${base}/attendence`, icon: UserCheck },
    { label: "My Classes", href: "#", icon: BookOpen },
    { label: "Timetable", href: "#", icon: Calendar },
    { label: "Assignments", href: "#", icon: ClipboardList },
    { label: "Students", href: "#", icon: Users },
    { label: "Marks Audit", href: `${base}/marksAudit`, icon: FileText },
    { label: "Messages", href: "#", icon: MessageSquare },
    { label: "Settings", href: "#", icon: Settings },
  ];
}

function getMobileNavItems(schoolSlug) {
  const base = `/${schoolSlug}/teacher`;
  return [
    { label: "Dashboard", href: `${base}/dashboard`, icon: LayoutDashboard },
    { label: "Attendance", href: `${base}/attendence`, icon: UserCheck },
    { label: "Classes", href: "#", icon: BookOpen },
    { label: "Students", href: "#", icon: Users },
  ];
}

export default function TeacherLayout({ children }) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const { schoolSlug = "dummy-school" } = useParams() || {};
  const navItems = getNavItems(schoolSlug);
  const mobileBottomNavItems = getMobileNavItems(schoolSlug);

  useEffect(() => {
    if (theme === "light" || theme === "dark") {
      setResolvedTheme(theme);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    applyTheme();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }

    mediaQuery.addListener(applyTheme);
    return () => mediaQuery.removeListener(applyTheme);
  }, [theme]);

  const isDark = resolvedTheme === "dark";

  const teacherThemeVars = useMemo(
    () => ({
      "--background": isDark ? "#050505" : "#f5f7fa",
      "--foreground": isDark ? "#fafafa" : "#0f172a",
      "--card": isDark ? "#1a1a1a" : "#ffffff",
      "--card-foreground": isDark ? "#fafafa" : "#0f172a",
      "--popover": isDark ? "#1a1a1a" : "#ffffff",
      "--popover-foreground": isDark ? "#fafafa" : "#0f172a",
      "--primary": "#0891b2",
      "--primary-foreground": "#ffffff",
      "--secondary": isDark ? "#171717" : "#e8eef5",
      "--secondary-foreground": isDark ? "#fafafa" : "#0f172a",
      "--muted": isDark ? "#141414" : "#edf2f7",
      "--muted-foreground": isDark ? "#a3a3a3" : "#64748b",
      "--accent": isDark ? "#171717" : "#e0f2fe",
      "--accent-foreground": isDark ? "#fafafa" : "#0f172a",
      "--border": isDark ? "#262626" : "#dbe4ee",
      "--input": isDark ? "#262626" : "#dbe4ee",
      "--ring": "#22d3ee",
      "--sidebar": isDark ? "#050505" : "#ffffff",
      "--sidebar-foreground": isDark ? "#fafafa" : "#0f172a",
      "--sidebar-primary": "#0891b2",
      "--sidebar-primary-foreground": "#ffffff",
      "--sidebar-accent": isDark ? "#171717" : "#f1f5f9",
      "--sidebar-accent-foreground": isDark ? "#fafafa" : "#0f172a",
      "--sidebar-border": isDark ? "#262626" : "#dbe4ee",
      "--sidebar-ring": "#22d3ee",
    }),
    [isDark]
  );

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r",
        isDark ? "border-neutral-800 bg-[#050505] text-neutral-100" : "border-slate-200 bg-white text-slate-900"
      )}
    >
      <div className={cn("flex h-14 items-center gap-3 border-b px-4", isDark ? "border-neutral-800" : "border-slate-200")}>
        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-md">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className={cn("text-sm font-bold leading-none tracking-wide", isDark ? "text-white" : "text-slate-950")}>Edu Sphare</p>
          <p className={cn("mt-0.5 text-[10px]", isDark ? "text-neutral-400" : "text-slate-500")}>Teacher Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.label + item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/20"
                  : isDark
                    ? "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              <Icon className="size-4.5" />
              <span className="flex-1 truncate">{item.label}</span>
              {active && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t p-3", isDark ? "border-neutral-800 bg-[#090909]" : "border-slate-200 bg-slate-50")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2",
            isDark ? "border-neutral-800 bg-[#111111]" : "border-slate-200 bg-white"
          )}
        >
          <Avatar className="size-8 ring-2 ring-cyan-500/20">
            <AvatarFallback className="bg-cyan-600 text-white text-xs font-bold">RI</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn("truncate text-sm font-semibold", isDark ? "text-white" : "text-slate-950")}>Rahul Iyer</p>
            <p className={cn("truncate text-[11px]", isDark ? "text-neutral-400" : "text-slate-500")}>Mathematics · HOD</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 rounded-lg",
              isDark ? "text-neutral-400 hover:bg-neutral-900 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <TeacherLayoutContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div
        className="min-h-screen bg-background text-foreground transition-colors duration-300"
        style={teacherThemeVars}
      >
        <aside
          className={cn(
            "hidden lg:fixed lg:inset-y-0 z-40 lg:flex lg:w-64 lg:flex-col border-r",
            isDark ? "border-neutral-800 bg-[#050505]" : "border-slate-200 bg-white"
          )}
        >
          {sidebarContent}
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className={cn(
              "w-64 border-r-0 p-0 shadow-xl",
              isDark ? "bg-[#050505] text-neutral-100" : "bg-white text-slate-900"
            )}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>

        <div className="flex min-h-screen flex-col pb-0 max-lg:pb-16 lg:pl-64">
          <div className="flex flex-1 flex-col">{children}</div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background lg:hidden shadow-lg">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 transition-all duration-200",
                  active ? "scale-105 text-cyan-500" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </TeacherLayoutContext.Provider>
  );
}
