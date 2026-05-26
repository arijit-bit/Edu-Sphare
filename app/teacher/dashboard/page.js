"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, BookOpen, Calendar, ClipboardList,
  Bell, Menu, ChevronRight, TrendingUp, Clock, CheckCircle2,
  AlertTriangle, FileText, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useTeacherLayout } from "../layout";

const stats = [
  { label: "Total Students", value: "186",   delta: "4 sections",     icon: Users,         tone: "blue"   },
  { label: "Classes Today",  value: "6",     delta: "2 remaining",    icon: BookOpen,      tone: "teal"   },
  { label: "Pending Grades", value: "14",    delta: "Due by Friday",  icon: ClipboardList, tone: "amber"  },
  { label: "Attendance Avg", value: "91.2%", delta: "+1.4% this week",icon: TrendingUp,    tone: "green"  },
];

const toneMap = {
  blue:   "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
  teal:   "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400",
  amber:  "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
  green:  "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
  purple: "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
};

const todayClasses = [
  { time: "08:00", end: "09:00", subject: "Mathematics",   room: "Room 201", grade: "10-A", attended: 34, total: 36 },
  { time: "09:15", end: "10:15", subject: "Mathematics",   room: "Room 201", grade: "11-B", attended: 28, total: 30 },
  { time: "10:30", end: "11:30", subject: "Advanced Math", room: "Room 205", grade: "12-A", attended: 0,  total: 28, upcoming: true },
  { time: "11:45", end: "12:45", subject: "Mathematics",   room: "Lab 1",    grade: "10-B", attended: 0,  total: 32, upcoming: true },
];

const pending = [
  { task: "Grade Unit Test — Class 10-A",       due: "Today",      urgency: "urgent"  },
  { task: "Submit attendance for May 23",        due: "Today",      urgency: "urgent"  },
  { task: "Grade Monthly Exam — Class 11-B",    due: "Tomorrow",   urgency: "warning" },
  { task: "Prepare question paper — Class 12-A",due: "May 26",     urgency: "normal"  },
];

export default function TeacherDashboard() {
  const { setMobileOpen } = useTeacherLayout();

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 md:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden size-8" onClick={() => setMobileOpen(true)}>
          <Menu className="size-4" />
        </Button>
        <h1 className="text-sm font-semibold">Teacher Dashboard</h1>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative size-9">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
          </Button>
          <Avatar className="size-8 cursor-pointer">
            <AvatarFallback className="bg-cyan-600 text-white text-xs font-bold">RI</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Good morning, Rahul! 👋</h2>
            <p className="text-sm text-muted-foreground">Friday, May 23, 2026 · Mathematics Department</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/teacher/attendence">
              <Plus className="mr-2 size-4" />Mark Attendance
            </Link>
          </Button>
        </div>

        {/* KPI */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("size-10 rounded-lg flex items-center justify-center", toneMap[stat.tone])}>
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

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
                <Badge variant="outline">Friday · 23 May</Badge>
              </div>
              <CardDescription>4 classes scheduled — 2 completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayClasses.map((cls, i) => (
                <div key={i} className={cn("flex gap-3 rounded-lg p-3 border transition-colors",
                  cls.upcoming ? "bg-muted/30 border-border" : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                )}>
                  <div className="flex flex-col items-center pt-0.5">
                    <span className="text-xs font-bold text-muted-foreground">{cls.time}</span>
                    <div className="w-px flex-1 bg-border my-1" />
                    <span className="text-xs text-muted-foreground">{cls.end}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold">{cls.subject}</p>
                      {cls.upcoming ? (
                        <Badge variant="outline" className="text-xs shrink-0">
                          <Clock className="mr-1 size-2.5" />Upcoming
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-emerald-500 text-white shrink-0">
                          <CheckCircle2 className="mr-1 size-2.5" />Done
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{cls.grade} · {cls.room}</p>
                    {!cls.upcoming && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Attendance</span>
                          <span className="font-semibold">{cls.attended}/{cls.total}</span>
                        </div>
                        <Progress value={(cls.attended / cls.total) * 100} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pending Actions</CardTitle>
              <CardDescription>Tasks requiring your attention today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending.map((item, i) => (
                <div key={i} className={cn("flex items-start gap-3 rounded-lg p-3 border",
                  item.urgency === "urgent" ? "border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900" :
                  item.urgency === "warning" ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900" :
                  "border-border bg-muted/30"
                )}>
                  {item.urgency === "urgent" ? (
                    <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  ) : item.urgency === "warning" ? (
                    <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Due: {item.due}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Plus className="mr-2 size-4" />Add Task
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Performance Overview</CardTitle>
            <CardDescription>Average scores by section for latest assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { section: "Grade 10-A", avg: 84, rank: 1, students: 36 },
                { section: "Grade 10-B", avg: 79, rank: 2, students: 32 },
                { section: "Grade 11-B", avg: 88, rank: 1, students: 30 },
                { section: "Grade 12-A", avg: 81, rank: 3, students: 28 },
              ].map((cls) => (
                <div key={cls.section} className="rounded-xl border p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-sm font-bold">{cls.section}</p>
                    <Badge variant="outline" className="text-[10px]">{cls.students} students</Badge>
                  </div>
                  <p className="text-3xl font-bold">{cls.avg}%</p>
                  <div className="mt-2">
                    <Progress value={cls.avg} className="h-2" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Class Rank #{cls.rank}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
