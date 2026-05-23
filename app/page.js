import Link from "next/link";
import {
  GraduationCap, Users, BookOpen, TrendingUp,
  ArrowRight, Shield, BarChart3, Calendar, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Edu Sphare — Modern School Management System",
  description: "A comprehensive school management platform for students, teachers, administrators, and finance teams.",
};

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Access your dashboard, view results, check timetable, and track academic performance.",
    href: "/student/dashboard",
    icon: GraduationCap,
    gradient: "from-blue-600 to-indigo-700",
    lightBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    features: ["Dashboard & Analytics", "Results & Grades", "Timetable", "Feedback Portal"],
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Manage classes, mark attendance, submit grades, and communicate with students.",
    href: "/teacher/dashboard",
    icon: Users,
    gradient: "from-teal-600 to-emerald-700",
    lightBg: "bg-teal-50 dark:bg-teal-950/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    features: ["Class Management", "Attendance Tracking", "Grade Submission", "Schedule View"],
  },
  {
    id: "finance",
    title: "Finance",
    description: "Track fee collections, manage payroll, generate reports, and analyze school finances.",
    href: "/finance/dashboard",
    icon: BarChart3,
    gradient: "from-violet-600 to-purple-700",
    lightBg: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    features: ["Fee Management", "Payroll Processing", "Financial Reports", "Expense Tracking"],
  },
  {
    id: "admin",
    title: "Admin",
    description: "Full system control — manage students, staff, finances, and school operations.",
    href: "/admin/dashboard",
    icon: Shield,
    gradient: "from-rose-600 to-pink-700",
    lightBg: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    features: ["User Management", "System Settings", "All Portal Access", "Analytics Overview"],
  },
];

const stats = [
  { label: "Students Enrolled", value: "1,240+", icon: GraduationCap },
  { label: "Faculty Members",   value: "86",     icon: Users },
  { label: "Active Classes",    value: "48",      icon: BookOpen },
  { label: "Reports Generated", value: "2,400+", icon: BarChart3 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-base font-bold">Edu Sphare</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 size-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-teal-500/5 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
            <Badge variant="outline" className="mb-6 gap-1.5">
              <CheckCircle className="size-3 text-emerald-500" />
              Production-Ready School Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              The Modern Platform for{" "}
              <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                School Management
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A comprehensive, real-world school management system built for students, teachers,
              finance teams, and administrators. Everything in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Started Free <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In to Portal</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/30 py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Role Selection */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Choose Your Portal</h2>
              <p className="mt-3 text-muted-foreground">Select your role to access your personalized dashboard.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Link key={role.id} href={role.href} className="group block">
                    <div className="h-full rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${role.lightBg}`}>
                        <Icon className={`size-6 ${role.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold">{role.title} Portal</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                      <ul className="mt-4 space-y-1.5">
                        {role.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className={`mt-5 flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
                        Enter Portal <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© 2026 Edu Sphare. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
