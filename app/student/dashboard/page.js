"use client";

import { useState, useEffect } from "react";
import { StudentShell, ProgressRing } from "../student-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  TrendingUp,
  ClipboardList,
  Trophy,
  FileText,
  Download,
  MessageSquare,
  CreditCard,
  Phone,
  BarChart2,
  Info,
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Mail,
  ExternalLink,
  Star,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const getScoreColor = (score) => {
  if (score >= 90) return "#22c55e"; // Green for High score
  if (score >= 80) return "#facc15"; // Yellow Light
  if (score >= 65) return "#d97706"; // Dark Yellow / Orange
  return "#ef4444"; // Red
};

const statCards = [
  {
    label: "Total Subjects",
    value: "8",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    delta: null,
  },
  {
    label: "Current GPA",
    value: "3.84",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    delta: "+0.12",
    deltaUp: true,
  },
  {
    label: "Pending Assignments",
    value: "3",
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    delta: null,
  },
  {
    label: "Class Rank",
    value: "#12",
    icon: Trophy,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    delta: "+2",
    deltaUp: true,
  },
];

const upcomingExams = [
  {
    subject: "Mathematics",
    date: "25 May 2026",
    type: "Unit Test",
    urgency: "urgent",
  },
  {
    subject: "Physics",
    date: "28 May 2026",
    type: "Practical",
    urgency: "upcoming",
  },
  {
    subject: "English Literature",
    date: "2 Jun 2026",
    type: "Mid-term",
    urgency: "upcoming",
  },
  {
    subject: "Chemistry",
    date: "5 Jun 2026",
    type: "Unit Test",
    urgency: "upcoming",
  },
];

const quickActions = [
  { label: "View Results", icon: FileText, href: "/student/results", variant: "default" },
  { label: "Download Timetable", icon: Download, href: "/student/timetable", variant: "outline" },
  { label: "Submit Feedback", icon: MessageSquare, href: "/student/feedback", variant: "outline" },
  { label: "Check Performance", icon: BarChart2, href: "/student/performance", variant: "outline" },
  { label: "Pay Fees", icon: CreditCard, href: "/student/settings", variant: "outline" },
  { label: "Contact Teacher", icon: Phone, href: "#", variant: "outline" },
];

const notices = [
  {
    icon: Info,
    iconColor: "text-blue-500",
    title: "Annual Sports Day registration is open till 30 May",
    time: "Today",
  },
  {
    icon: AlertCircle,
    iconColor: "text-amber-500",
    title: "Parent-Teacher meeting scheduled for 1 June 2026",
    time: "Yesterday",
  },
  {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    title: "Holiday on 26 May for state elections",
    time: "2 days ago",
  },
];

const weekSchedule = [
  {
    time: "8:00 – 9:00",
    mon: { subject: "Mathematics", room: "B-201" },
    tue: { subject: "Physics", room: "Lab-1" },
    wed: { subject: "English", room: "A-105" },
    thu: { subject: "Chemistry", room: "Lab-2" },
    fri: { subject: "Mathematics", room: "B-201" },
  },
  {
    time: "9:00 – 10:00",
    mon: { subject: "English", room: "A-105" },
    tue: { subject: "Chemistry", room: "Lab-2" },
    wed: { subject: "Biology", room: "Lab-3" },
    thu: { subject: "Computer Sc.", room: "C-301" },
    fri: { subject: "Physics", room: "Lab-1" },
  },
  {
    time: "10:30 – 11:30",
    mon: { subject: "Biology", room: "Lab-3" },
    tue: { subject: "History", room: "A-108" },
    wed: { subject: "Mathematics", room: "B-201" },
    thu: { subject: "English", room: "A-105" },
    fri: { subject: "Chemistry", room: "Lab-2" },
  },
  {
    time: "11:30 – 12:30",
    mon: { subject: "Computer Sc.", room: "C-301" },
    tue: { subject: "Mathematics", room: "B-201" },
    wed: { subject: "History", room: "A-108" },
    thu: { subject: "Biology", room: "Lab-3" },
    fri: { subject: "English", room: "A-105" },
  },
];

const subjectColors = {
  Mathematics: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300",
  Physics: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300",
  Chemistry: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300",
  English: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300",
  Biology: "text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-300",
  History: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300",
  "Computer Sc.": "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300",
};

const days = ["mon", "tue", "wed", "thu", "fri"];
const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function CombinedStudentDashboardPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState(1); // Default to 1 (Monday)

  useEffect(() => {
    setCurrentDayIndex(new Date().getDay());
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <StudentShell title="Student Dashboard" subtitle="Overview of your profile, schedule, and academics.">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300 shadow-lg animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Combined Profile Hero Card */}
        <Card className="overflow-hidden">
          <div className="relative h-24 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 border-b" />
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-2 text-center sm:text-left">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-card shadow-lg shrink-0 -mt-10 sm:-mt-12 z-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-black">
                  AM
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 justify-center sm:justify-start">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">Aarav S. Malhotra</h2>
                  <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20 font-semibold h-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1.5" />
                    Online
                  </Badge>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Grade 12-A
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> STU-2024-0921
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> aarav.malhotra@edusphare.edu
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto" onClick={() => triggerToast("Navigating to Edit Profile settings...")}>
                <ExternalLink className="h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Key Metrics Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex justify-center items-center gap-2">
                      <div className={cn("p-2 rounded-xl", stat.bg)}>
                      <Icon className={cn("h-4.5 w-4.5", stat.color)} />
                    </div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    </div> 
                    {stat.delta && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", stat.deltaUp ? "text-emerald-600 bg-emerald-500/10" : "text-destructive bg-destructive/10")}>
                        {stat.delta}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 3. Combined Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Left Column (Timetable + Actions) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Today's Schedule</CardTitle>
                  <CardDescription>
                    {(() => {
                      const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;
                      return isWeekend ? "Showing Monday's schedule (Weekend)" : "Your classes and rooms for today";
                    })()}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={cn("gap-1 text-xs font-semibold px-2.5 py-0.5 shrink-0", (currentDayIndex === 0 || currentDayIndex === 6) && "border-amber-500/30 text-amber-500 bg-amber-500/5")}>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {(() => {
                    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return dayNames[currentDayIndex];
                  })()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const dayKeys = ["mon", "mon", "tue", "wed", "thu", "fri", "mon"]; // Sunday/Saturday map to "mon"
                  const todayKey = dayKeys[currentDayIndex];
                  return weekSchedule.map((row, index) => {
                    const cell = row[todayKey];
                    const colorClass = subjectColors[cell.subject] || "text-foreground bg-muted";
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 p-3.5 rounded-xl border bg-card hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col items-start justify-center min-w-[85px] border-r pr-3 border-border">
                            <span className="text-xs font-bold text-foreground">{row.time.split("–")[0].trim()}</span>
                            <span className="text-[10px] text-muted-foreground">{row.time.split("–")[1]?.trim()}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{cell.subject}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Room {cell.room}</p>
                          </div>
                        </div>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 border uppercase tracking-wider", colorClass)}>
                          Classroom
                        </span>
                      </div>
                    );
                  });
                })()}
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                <CardDescription>Shortcut links to essential pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.label}
                        variant={action.variant}
                        className="flex flex-col items-center justify-center text-center h-auto py-3.5 gap-2 text-xs font-semibold hover:border-primary/45 transition-colors border"
                        asChild
                      >
                        <a href={action.href}>
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          {action.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Right Column (Attendance, Exams, Notices, Fees) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attendance Ring Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Attendance Term Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-6">
                  <ProgressRing value={92.4} size={88} strokeWidth={8} color={getScoreColor(92.4)} />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                        Present
                      </span>
                      <span className="font-bold text-foreground">138 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
                        Absent
                      </span>
                      <span className="font-bold text-foreground">8 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                        Late
                      </span>
                      <span className="font-bold text-foreground">4 days</span>
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Total Term Days</span>
                      <span>150 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exams Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Upcoming Exams</CardTitle>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                    <Clock className="h-3 w-3 mr-1" /> Term Tests
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.subject}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {exam.subject}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {exam.type} · {exam.date}
                      </p>
                    </div>
                    <Badge
                      variant={exam.urgency === "urgent" ? "destructive" : "secondary"}
                      className="shrink-0 capitalize text-[9px] font-bold px-2 py-0.5 rounded-full"
                    >
                      {exam.urgency}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Notices */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Recent Notices</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notices.map((notice, i) => {
                  const NIcon = notice.icon;
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <NIcon className={cn("h-4 w-4 mt-0.5 shrink-0", notice.iconColor)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground leading-snug">
                          {notice.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold uppercase tracking-wider">{notice.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Pending Fee Banner */}
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" />
                  Outstanding Dues
                </CardTitle>
                <CardDescription className="text-[10px]">Term 2 · Due 30 May 2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Amount Due</span>
                  <span className="font-bold text-foreground">₹12,500</span>
                </div>
                <Progress value={60} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground font-medium">60% paid – ₹7,500 remaining</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button size="sm" className="w-full text-xs font-bold" onClick={() => triggerToast("Opening fee transaction portal...")}>
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  Pay Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
