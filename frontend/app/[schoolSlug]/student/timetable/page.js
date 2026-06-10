"use client";

import { useState } from "react";
import { StudentShell } from "@/components/shells/student-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, User, MapPin, Calendar, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const subjectColors = {
  Mathematics: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-300", border: "border-blue-500/30" },
  Physics: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-500/30" },
  Chemistry: { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-300", border: "border-purple-500/30" },
  English: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/30" },
  "English Literature": { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/30" },
  Biology: { bg: "bg-teal-500/10", text: "text-teal-700 dark:text-teal-300", border: "border-teal-500/30" },
  History: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", border: "border-amber-500/30" },
  "Computer Sc.": { bg: "bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-500/30" },
  "Phys. Ed.": { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-300", border: "border-orange-500/30" },
  Library: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-300", border: "border-slate-300" },
  "Free Period": { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  Lunch: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

const timetable = {
  Mon: [
    { time: "8:00 – 9:00", subject: "Mathematics", teacher: "Mr. R. Sharma", room: "B-201" },
    { time: "9:00 – 10:00", subject: "English", teacher: "Ms. P. Rao", room: "A-105" },
    { time: "10:00 – 10:30", subject: "Free Period", teacher: "—", room: "—" },
    { time: "10:30 – 11:30", subject: "Biology", teacher: "Dr. N. Singh", room: "Lab-3" },
    { time: "11:30 – 12:30", subject: "Computer Sc.", teacher: "Ms. A. Joshi", room: "C-301" },
    { time: "12:30 – 1:15", subject: "Lunch", teacher: "—", room: "—" },
    { time: "1:15 – 2:15", subject: "History", teacher: "Mr. K. Verma", room: "A-108" },
    { time: "2:15 – 3:15", subject: "Phys. Ed.", teacher: "Mr. D. Kumar", room: "Ground" },
  ],
  Tue: [
    { time: "8:00 – 9:00", subject: "Physics", teacher: "Dr. A. Mishra", room: "Lab-1" },
    { time: "9:00 – 10:00", subject: "Chemistry", teacher: "Ms. S. Patel", room: "Lab-2" },
    { time: "10:00 – 10:30", subject: "Free Period", teacher: "—", room: "—" },
    { time: "10:30 – 11:30", subject: "History", teacher: "Mr. K. Verma", room: "A-108" },
    { time: "11:30 – 12:30", subject: "Mathematics", teacher: "Mr. R. Sharma", room: "B-201" },
    { time: "12:30 – 1:15", subject: "Lunch", teacher: "—", room: "—" },
    { time: "1:15 – 2:15", subject: "English", teacher: "Ms. P. Rao", room: "A-105" },
    { time: "2:15 – 3:15", subject: "Library", teacher: "Ms. K. Bhat", room: "Library" },
  ],
  Wed: [
    { time: "8:00 – 9:00", subject: "English", teacher: "Ms. P. Rao", room: "A-105" },
    { time: "9:00 – 10:00", subject: "Biology", teacher: "Dr. N. Singh", room: "Lab-3" },
    { time: "10:00 – 10:30", subject: "Free Period", teacher: "—", room: "—" },
    { time: "10:30 – 11:30", subject: "Mathematics", teacher: "Mr. R. Sharma", room: "B-201" },
    { time: "11:30 – 12:30", subject: "History", teacher: "Mr. K. Verma", room: "A-108" },
    { time: "12:30 – 1:15", subject: "Lunch", teacher: "—", room: "—" },
    { time: "1:15 – 2:15", subject: "Chemistry", teacher: "Ms. S. Patel", room: "Lab-2" },
    { time: "2:15 – 3:15", subject: "Computer Sc.", teacher: "Ms. A. Joshi", room: "C-301" },
  ],
  Thu: [
    { time: "8:00 – 9:00", subject: "Chemistry", teacher: "Ms. S. Patel", room: "Lab-2" },
    { time: "9:00 – 10:00", subject: "Computer Sc.", teacher: "Ms. A. Joshi", room: "C-301" },
    { time: "10:00 – 10:30", subject: "Free Period", teacher: "—", room: "—" },
    { time: "10:30 – 11:30", subject: "English", teacher: "Ms. P. Rao", room: "A-105" },
    { time: "11:30 – 12:30", subject: "Biology", teacher: "Dr. N. Singh", room: "Lab-3" },
    { time: "12:30 – 1:15", subject: "Lunch", teacher: "—", room: "—" },
    { time: "1:15 – 2:15", subject: "Physics", teacher: "Dr. A. Mishra", room: "Lab-1" },
    { time: "2:15 – 3:15", subject: "Mathematics", teacher: "Mr. R. Sharma", room: "B-201" },
  ],
  Fri: [
    { time: "8:00 – 9:00", subject: "Mathematics", teacher: "Mr. R. Sharma", room: "B-201" },
    { time: "9:00 – 10:00", subject: "Physics", teacher: "Dr. A. Mishra", room: "Lab-1" },
    { time: "10:00 – 10:30", subject: "Free Period", teacher: "—", room: "—" },
    { time: "10:30 – 11:30", subject: "Chemistry", teacher: "Ms. S. Patel", room: "Lab-2" },
    { time: "11:30 – 12:30", subject: "English", teacher: "Ms. P. Rao", room: "A-105" },
    { time: "12:30 – 1:15", subject: "Lunch", teacher: "—", room: "—" },
    { time: "1:15 – 2:15", subject: "Biology", teacher: "Dr. N. Singh", room: "Lab-3" },
    { time: "2:15 – 3:15", subject: "Phys. Ed.", teacher: "Mr. D. Kumar", room: "Ground" },
  ],
};

const examTimetable = [
  { date: "Monday, 25 May 2026", time: "9:00 AM – 11:30 AM", subject: "Mathematics", paperCode: "MATH-12", room: "Exam Hall A", supervisor: "Mr. R. Sharma" },
  { date: "Thursday, 28 May 2026", time: "9:00 AM – 11:30 AM", subject: "Physics", paperCode: "PHYS-12", room: "Physics Lab", supervisor: "Dr. A. Mishra" },
  { date: "Monday, 1 June 2026", time: "9:00 AM – 11:30 AM", subject: "English Literature", paperCode: "ENGL-12", room: "Exam Hall A", supervisor: "Ms. P. Rao" },
  { date: "Wednesday, 3 June 2026", time: "9:00 AM – 11:30 AM", subject: "Biology", paperCode: "BIOL-12", room: "Biology Lab", supervisor: "Dr. N. Singh" },
  { date: "Friday, 5 June 2026", time: "9:00 AM – 11:30 AM", subject: "Chemistry", paperCode: "CHEM-12", room: "Chemistry Lab", supervisor: "Ms. S. Patel" },
];

const days = Object.keys(timetable);
const timeSlots = timetable.Mon.map((c) => c.time);

function TimelineCard({ period }) {
  const c = subjectColors[period.subject] || subjectColors["Free Period"];
  const isBreak = period.subject === "Lunch" || period.subject === "Free Period";
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-xl border", c.bg, c.border, isBreak && "opacity-60")}>
      <div className="flex flex-col items-center pt-1 min-w-[56px]">
        <span className="text-[11px] font-bold text-muted-foreground leading-tight">{period.time.split("–")[0].trim()}</span>
        <span className="text-[10px] text-muted-foreground">–</span>
        <span className="text-[11px] font-bold text-muted-foreground leading-tight">{period.time.split("–")[1]?.trim()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-bold leading-tight", c.text)}>{period.subject}</p>
        {!isBreak && (
          <>
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <User className="h-3 w-3" /> {period.teacher}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3" /> {period.room}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function StudentTimetablePage() {
  const [activeSchedule, setActiveSchedule] = useState("class");

  return (
    <StudentShell
      title="Schedules & Timetable"
      subtitle="View your weekly class schedule or upcoming exams."
    >
      <div className="space-y-6">
        
        {/* Timetable Type Switcher */}
        <div className="flex justify-start">
          <Tabs value={activeSchedule} onValueChange={setActiveSchedule} className="w-full sm:w-[400px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="class" className="text-xs font-bold gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Class Timetable
              </TabsTrigger>
              <TabsTrigger value="exam" className="text-xs font-bold gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Exam Timetable
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab 1: Class Timetable */}
        {activeSchedule === "class" && (
          <>
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <Tabs defaultValue="Mon">
                <TabsList className="grid grid-cols-5 w-full mb-4">
                  {days.map((day) => (
                    <TabsTrigger key={day} value={day} className="text-xs font-bold">
                      {day}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {days.map((day) => (
                  <TabsContent key={day} value={day} className="space-y-2 mt-2">
                    {timetable[day].map((period, i) => (
                      <TimelineCard key={i} period={period} />
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Desktop Layout */}
            <Card className="hidden lg:block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Full Week Schedule</CardTitle>
                    <CardDescription>Academic Year 2025–26 · Term 2</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Clock className="h-3 w-3" /> 8 periods/day
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-28 text-xs font-bold uppercase tracking-wide">
                          Time
                        </TableHead>
                        {days.map((day) => (
                          <TableHead key={day} className="text-xs font-bold uppercase tracking-wide text-center">
                            {day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : "Friday"}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((slot, rowIdx) => (
                        <TableRow key={slot} className="hover:bg-muted/20">
                          <TableCell className="text-xs font-semibold text-muted-foreground align-top py-3 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {slot}
                            </span>
                          </TableCell>
                          {days.map((day) => {
                            const period = timetable[day][rowIdx];
                            const c = subjectColors[period.subject] || subjectColors["Free Period"];
                            const isBreak = period.subject === "Lunch" || period.subject === "Free Period";
                            return (
                              <TableCell key={day} className="py-2 px-2">
                                <div
                                  className={cn(
                                    "rounded-lg p-2.5 border h-full",
                                    c.bg,
                                    c.border,
                                    isBreak && "opacity-50"
                                  )}
                                >
                                  <p className={cn("text-xs font-bold leading-tight", c.text)}>
                                    {period.subject}
                                  </p>
                                  {!isBreak && (
                                    <>
                                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                                        <User className="h-2.5 w-2.5 shrink-0" /> {period.teacher}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                        <MapPin className="h-2.5 w-2.5 shrink-0" /> {period.room}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Color Legend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Subject Color Key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(subjectColors)
                    .filter(([k]) => !["Free Period", "Lunch", "Library"].includes(k))
                    .map(([subject, c]) => (
                      <span key={subject} className={cn("text-xs font-semibold px-3 py-1 rounded-full border", c.bg, c.text, c.border)}>
                        {subject}
                      </span>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tab 2: Examination Timetable */}
        {activeSchedule === "exam" && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Term 2 Final Examination Timetable</CardTitle>
                  <CardDescription>Scheduled from May 25 to June 5, 2026 · Class 12-A</CardDescription>
                </div>
                <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-rose-500/30 gap-1.5 font-bold">
                  <Shield className="h-3 w-3" />
                  Official Schedule
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="pl-6 text-xs font-bold uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Time</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Subject</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Paper Code</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Room</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider pr-6">Supervisor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examTimetable.map((exam, i) => {
                      const c = subjectColors[exam.subject] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
                      return (
                        <TableRow key={i} className="hover:bg-muted/20">
                          <TableCell className="pl-6 text-xs font-bold text-foreground">{exam.date}</TableCell>
                          <TableCell className="text-xs font-semibold text-muted-foreground">{exam.time}</TableCell>
                          <TableCell>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded border", c.bg, c.text, c.border)}>
                              {exam.subject}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-mono font-medium text-muted-foreground">{exam.paperCode}</TableCell>
                          <TableCell className="text-xs font-semibold text-foreground">{exam.room}</TableCell>
                          <TableCell className="pr-6 text-xs text-muted-foreground">{exam.supervisor}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile List Card View */}
              <div className="block sm:hidden p-4 space-y-3">
                {examTimetable.map((exam, i) => {
                  const c = subjectColors[exam.subject] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
                  return (
                    <div key={i} className="p-3 border rounded-xl bg-muted/20 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-foreground">{exam.date}</span>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", c.bg, c.text, c.border)}>
                          {exam.subject}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                        <div>
                          <span className="font-semibold block text-[10px] uppercase text-muted-foreground/60">Time</span>
                          {exam.time}
                        </div>
                        <div>
                          <span className="font-semibold block text-[10px] uppercase text-muted-foreground/60">Paper Code</span>
                          <span className="font-mono">{exam.paperCode}</span>
                        </div>
                        <div>
                          <span className="font-semibold block text-[10px] uppercase text-muted-foreground/60">Room</span>
                          {exam.room}
                        </div>
                        <div>
                          <span className="font-semibold block text-[10px] uppercase text-muted-foreground/60">Supervisor</span>
                          {exam.supervisor}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </StudentShell>
  );
}

