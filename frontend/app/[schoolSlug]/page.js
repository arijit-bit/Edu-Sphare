import Link from "next/link";
import {
  GraduationCap, Users, BarChart3, Shield,
  ArrowRight, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function generateMetadata({ params }) {
  return {
    title: "School Portal — Edu Sphare",
    description: "Choose your portal to access the school management system.",
  };
}

export default async function SchoolPortalPage({ params }) {
  const { schoolSlug } = await params;

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access your dashboard, view results, check timetable, and track academic performance.",
      href: `/${schoolSlug}/student/dashboard`,
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
      href: `/${schoolSlug}/teacher/dashboard`,
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
      href: `/${schoolSlug}/finance/dashboard`,
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
      href: `/${schoolSlug}/admin/dashboard`,
      icon: Shield,
      gradient: "from-rose-600 to-pink-700",
      lightBg: "bg-rose-50 dark:bg-rose-950/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      features: ["User Management", "System Settings", "All Portal Access", "Analytics Overview"],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <span className="text-base font-bold">Edu Sphare</span>
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 capitalize">
                {schoolSlug.replace(/-/g, " ")}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 gap-1.5">
              <CheckCircle className="size-3 text-emerald-500" />
              Demo School Portal
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                Portal
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Select your role to access your personalized dashboard.
            </p>
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
                    <h2 className="text-lg font-bold">{role.title} Portal</h2>
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
      </main>

      <footer className="border-t py-5 text-center text-sm text-muted-foreground">
        © 2026 Edu Sphare. Demo School Portal.
      </footer>
    </div>
  );
}
