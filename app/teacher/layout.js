"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

// Create context for sub-pages to open the mobile sidebar if they have a hamburger button in their header
const TeacherLayoutContext = createContext({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useTeacherLayout = () => useContext(TeacherLayoutContext);

const navItems = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/teacher/attendence", icon: UserCheck },
  { label: "My Classes", href: "#", icon: BookOpen },
  { label: "Timetable", href: "#", icon: Calendar },
  { label: "Assignments", href: "#", icon: ClipboardList },
  { label: "Students", href: "#", icon: Users },
  { label: "Marks Audit", href: "/teacher/marksAudit", icon: FileText },
  { label: "Messages", href: "#", icon: MessageSquare },
  { label: "Settings", href: "#", icon: Settings },
];

const mobileBottomNavItems = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/teacher/attendence", icon: UserCheck },
  { label: "Classes", href: "#", icon: BookOpen },
  { label: "Students", href: "#", icon: Users },
];

export default function TeacherLayout({ children }) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col !bg-slate-900 dark:!bg-slate-950 text-slate-100 border-r border-slate-800">
      {/* Brand Logo Header */}
      <div className="flex h-14 items-center gap-3 border-b border-slate-800 px-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none tracking-wide text-white">Edu Sphare</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Teacher Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
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
                  ? "bg-teal-600 text-white shadow-md shadow-teal-900/20"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              )}
            >
              <Icon className="size-4.5" />
              <span className="flex-1 truncate">{item.label}</span>
              {active && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer in sidebar */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/40">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 px-3 py-2 border border-slate-800/30">
          <Avatar className="size-8 ring-2 ring-teal-500/20">
            <AvatarFallback className="bg-teal-600 text-white text-xs font-bold">RI</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">Rahul Iyer</p>
            <p className="text-[11px] text-slate-400 truncate">Mathematics · HOD</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <TeacherLayoutContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-300">
        {/* Desktop Sidebar (Wide) */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40 bg-slate-900 dark:bg-slate-950 border-r border-slate-800">
          {sidebarContent}
        </aside>

        {/* Mobile Slide-out Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 border-r-0 p-0 shadow-xl !bg-slate-900 dark:!bg-slate-950 text-slate-100">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="lg:pl-64 min-h-screen flex flex-col pb-0 max-lg:pb-16">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background lg:hidden shadow-lg">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.label + item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200",
                  active
                    ? "text-teal-600 dark:text-teal-400 scale-105"
                    : "text-muted-foreground hover:text-foreground"
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
