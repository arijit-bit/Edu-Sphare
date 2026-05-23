"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GraduationCap, Users, CreditCard, BarChart3,
  Settings, Bell, Search, Shield, LogOut, Sun, Moon, Laptop,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  UserPlus, BookOpen, Calendar, Activity, Menu, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",    href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Students",     href: "#",                 icon: GraduationCap   },
  { label: "Teachers",     href: "#",                 icon: Users           },
  { label: "Finance",      href: "/finance/dashboard",icon: CreditCard      },
  { label: "Analytics",    href: "#",                 icon: BarChart3       },
  { label: "Settings",     href: "#",                 icon: Settings        },
];

const stats = [
  { label: "Total Students", value: "1,240",  delta: "+126 enrolled",   icon: GraduationCap, tone: "blue"   },
  { label: "Total Teachers",  value: "86",     delta: "+4 new staff",    icon: Users,         tone: "teal"   },
  { label: "Monthly Revenue", value: "₹72.4L", delta: "+12.8% vs Apr",  icon: TrendingUp,    tone: "green"  },
  { label: "Pending Dues",    value: "₹7.8L",  delta: "42 overdue",     icon: AlertTriangle, tone: "amber"  },
  { label: "Active Classes",  value: "48",     delta: "8 subjects",      icon: BookOpen,      tone: "purple" },
  { label: "Attendance Rate", value: "91.2%",  delta: "+1.4% this week", icon: Activity,      tone: "rose"   },
];

const tones = {
  blue:   "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  teal:   "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400",
  green:  "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
  amber:  "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
  purple: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
  rose:   "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
};



const recentActivity = [
  { name: "Aarav Sharma",   action: "Fee payment received",     amount: "+₹12,000", time: "2m ago",  status: "success" },
  { name: "Meera Iyer",     action: "Salary processed",         amount: "₹70,500",  time: "18m ago", status: "info"    },
  { name: "Kabir Verma",    action: "Fee overdue alert sent",   amount: "₹15,000",  time: "1h ago",  status: "warning" },
  { name: "New Admission",  action: "Ananya Bose — Class 9A",   amount: "+₹8,400",  time: "2h ago",  status: "success" },
  { name: "Rahul Sen",      action: "Timetable updated",        amount: "—",         time: "3h ago",  status: "info"    },
];

export default function AdminDashboard() {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-600 text-white">
          <Shield className="size-4" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Edu Sphare</p>
          <p className="text-[11px] text-muted-foreground">Admin Portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href + item.label} href={item.href}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}>
              <Icon className="size-4" />
              {item.label}
              {active && <ChevronRight className="ml-auto size-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-rose-600 text-white text-xs font-bold">SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Super Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@edusphare.edu</p>
          </div>
          <Button variant="ghost" size="icon" className="size-7"><LogOut className="size-3.5 text-muted-foreground" /></Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-40">
        {sidebarContent}
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle></SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden size-8" onClick={() => setMobileOpen(true)}><Menu className="size-4" /></Button>
          <h1 className="text-sm font-semibold">Admin Dashboard</h1>
          <div className="ml-auto flex items-center gap-1">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9 h-8 w-56 text-sm" placeholder="Search students, staff…" />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative size-9">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
            </Button>
            <Avatar className="size-8 cursor-pointer">
              <AvatarFallback className="bg-rose-600 text-white text-xs font-bold">SA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 animate-slide-up">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
              <p className="text-sm text-muted-foreground">Full system overview — students, staff, finances, and operations.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><BarChart3 className="mr-2 size-4" />Reports</Button>
              <Button size="sm"><UserPlus className="mr-2 size-4" />Add User</Button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("size-10 rounded-lg flex items-center justify-center", tones[stat.tone])}>
                        <Icon className="size-5" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">{stat.label}</p>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">{stat.delta}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Middle Row */}
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* Portal Quick Access */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Portal Access</CardTitle>
                <CardDescription>Navigate to all sub-portals from here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Student Portal",  href: "/student/dashboard",  Icon: GraduationCap, cls: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"   },
                    { label: "Finance Portal",  href: "/finance/dashboard",  Icon: CreditCard,    cls: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
                    { label: "Teacher Portal",  href: "/teacher/dashboard",  Icon: Users,         cls: "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800"     },
                    { label: "Analytics",       href: "#",                   Icon: BarChart3,     cls: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"  },
                  ].map(({ label, href, Icon: Ic, cls }) => (
                    <Link key={label} href={href}
                      className={cn("flex flex-col items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm hover:-translate-y-0.5", cls)}>
                      <Ic className="size-6" />
                      <div>
                        <p className="text-sm font-bold">{label}</p>
                        <p className="text-xs opacity-70 mt-0.5 flex items-center gap-1">Open portal <ChevronRight className="size-3" /></p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* School Health */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">School Health Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Fee Collection Rate",  value: 92, color: "bg-emerald-500" },
                  { label: "Teacher Attendance",   value: 98, color: "bg-blue-500"    },
                  { label: "Student Attendance",   value: 91, color: "bg-violet-500"  },
                  { label: "Target Achievement",   value: 76, color: "bg-amber-500"   },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs font-bold bg-muted">
                        {item.name.charAt(0)}{item.name.split(" ")[1]?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-sm font-bold",
                        item.status === "success" ? "text-emerald-600 dark:text-emerald-400" :
                        item.status === "warning" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                      )}>{item.amount}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
