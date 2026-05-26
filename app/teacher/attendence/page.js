"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  CircleHelp,
  Download,
  Menu,
  RotateCcw,
  Search,
  Settings,
  CheckCircle2,
  Clock3,
  XCircle,
  Filter,
  Save,
  SendHorizontal,
  LayoutGrid,
  List
} from "lucide-react";
import { useTeacherLayout } from "../layout";

const studentsSeed = [
  { id: "ADM-001", rollNo: "01", name: "Alice Anderson", status: "present", remarks: "" },
  { id: "ADM-002", rollNo: "02", name: "Benjamin Baker", status: "absent", remarks: "Medical leave" },
  { id: "ADM-003", rollNo: "03", name: "Chloe Carter", status: "leave", remarks: "Bus delayed" },
  { id: "ADM-004", rollNo: "04", name: "Daniel Cooper", status: "present", remarks: "" },
  { id: "ADM-005", rollNo: "05", name: "Ella Davis", status: "present", remarks: "" },
  { id: "ADM-006", rollNo: "06", name: "Felix Evans", status: "absent", remarks: "Family function" },
];

const statusOptions = [
  {
    value: "present",
    short: "P",
    label: "Present",
    activeClass: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    legendClass: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  {
    value: "absent",
    short: "A",
    label: "Absent",
    activeClass: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800",
    dotClass: "bg-red-500",
    legendClass: "text-red-600 dark:text-red-400",
    icon: XCircle,
  },
  {
    value: "leave",
    short: "L",
    label: "Leave",
    activeClass: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800",
    dotClass: "bg-orange-500",
    legendClass: "text-orange-600 dark:text-orange-400",
    icon: Clock3,
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeacherAttendencePage() {
  const { setMobileOpen } = useTeacherLayout();
  const [viewMode, setViewMode] = useState("grid");
  const [classValue, setClassValue] = useState("Grade 10");
  const [sectionValue, setSectionValue] = useState("A - Science");
  const [subjectValue, setSubjectValue] = useState("Physics");
  const [periodValue, setPeriodValue] = useState("Period 1 (08:00 AM)");
  const [dateValue, setDateValue] = useState("2023-10-24");
  const [searchValue, setSearchValue] = useState("");
  const [students, setStudents] = useState(studentsSeed);

  const filteredStudents = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return students;
    return students.filter((student) =>
      [student.name, student.rollNo, student.id].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [searchValue, students]);

  const summary = useMemo(() => {
    const present = students.filter((student) => student.status === "present").length;
    const absent = students.filter((student) => student.status === "absent").length;
    const leave = students.filter((student) => student.status === "leave").length;
    const marked = students.length;
    return { total: students.length, marked, present, absent, leave };
  }, [students]);

  const updateStatus = (id, status) => {
    setStudents((current) =>
      current.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((current) =>
      current.map((student) => ({ ...student, status: "present" }))
    );
  };

  const resetAttendance = () => {
    setStudents(studentsSeed);
  };

  const filtersForm = (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Class</label>
        <Select value={classValue} onValueChange={setClassValue}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grade 10">Grade 10</SelectItem>
            <SelectItem value="Grade 11">Grade 11</SelectItem>
            <SelectItem value="Grade 12">Grade 12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Section</label>
        <Select value={sectionValue} onValueChange={setSectionValue}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A - Science">A - Science</SelectItem>
            <SelectItem value="B - Commerce">B - Commerce</SelectItem>
            <SelectItem value="C - Arts">C - Arts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Subject</label>
        <Select value={subjectValue} onValueChange={setSubjectValue}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
        <div className="relative">
          <Input
            type="date"
            value={dateValue}
            onChange={(event) => setDateValue(event.target.value)}
            className="h-11 rounded-xl bg-background pr-10"
          />
          <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Period</label>
        <Select value={periodValue} onValueChange={setPeriodValue}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Period 1 (08:00 AM)">Period 1 (08:00 AM)</SelectItem>
            <SelectItem value="Period 2 (09:00 AM)">Period 2 (09:00 AM)</SelectItem>
            <SelectItem value="Period 3 (10:00 AM)">Period 3 (10:00 AM)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="flex items-center gap-3 px-4 py-3 md:px-5">
          <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>

          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search students, classes, or ID..."
              className="h-10 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 pl-10 pr-10 text-sm shadow-none focus-visible:ring-primary/20 transition-all border-border"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              /
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
              <Bell className="size-4.5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
              <CircleHelp className="size-4.5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
              <Settings className="size-4.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 py-6 pb-32 md:px-5">
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Record Attendance</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage daily attendance records efficiently.</p>
          </div>

          <div className="flex gap-2 self-start items-center">
            <div className="flex xl:hidden bg-muted/50 p-1 rounded-xl mr-1">
              <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-lg px-2.5 h-8">
                <LayoutGrid className="size-4" />
              </Button>
              <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-lg px-2.5 h-8">
                <List className="size-4" />
              </Button>
            </div>
            <Button variant="outline" className="hidden sm:flex h-10 rounded-xl bg-background/50 backdrop-blur-sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={resetAttendance}
              className="h-10 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 bg-background/50 backdrop-blur-sm"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset
            </Button>
          </div>
        </section>

        {/* Filter Section with Glassmorphism */}
        <section className="rounded-2xl border border-border bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl mb-6">
          <div className="hidden md:block">
            {filtersForm}
          </div>

          <div className="block md:hidden">
            <Accordion className="w-full">
              <AccordionItem value="filters" className="border-b-0">
                <AccordionTrigger className="py-2 hover:no-underline text-sm font-semibold">
                  <div className="flex items-center gap-2 text-primary">
                    <Filter className="size-4" />
                    Show Filters
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {filtersForm}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-border/50 pt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{summary.total} students</span> in{" "}
              <span className="font-semibold text-foreground">Grade 10 - A ({subjectValue})</span>
            </p>
            <Button className="h-10 rounded-xl shadow-sm">
              Load Students
            </Button>
          </div>
        </section>

        <section className="mt-4 mb-32 lg:mb-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border bg-muted/40 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Quick Actions:</span>
              <Button
                variant="secondary"
                onClick={markAllPresent}
                className="h-9 rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
              >
                <CheckCircle2 className="mr-2 size-4" />
                Mark All Present
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {statusOptions.map((option) => {
                const count = students.filter((student) => student.status === option.value).length;
                return (
                  <div key={option.value} className={cn("flex items-center gap-2", option.legendClass)}>
                    <span className={cn("size-2 rounded-full", option.dotClass)} />
                    <span>
                      {option.label} ({count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden mb-8">
            {/* Desktop Table Rendering */}
            <div className="hidden xl:block">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Roll No.</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Student Name</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Admission ID</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground text-center">Attendance Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-border bg-card transition-colors hover:bg-muted/40">
                      <TableCell className="px-4 py-4 text-sm font-semibold text-foreground">{student.rollNo}</TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-foreground">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-muted-foreground">{student.id}</TableCell>
                      <TableCell className="px-4 py-4 text-center">
                        <ToggleGroup 
                          value={student.status}
                          className="justify-center gap-1 bg-muted/30 p-1 rounded-lg inline-flex"
                        >
                          {statusOptions.map((option) => (
                            <ToggleGroupItem 
                              key={option.value} 
                              value={option.value} 
                              aria-label={option.label}
                              onClick={() => updateStatus(student.id, option.value)}
                              className={cn(
                                "h-8 min-w-10 rounded-md border border-transparent text-xs font-semibold transition-all",
                                student.status === option.value 
                                  ? option.activeClass 
                                  : "text-muted-foreground hover:bg-background bg-transparent"
                              )}
                            >
                              <option.icon className="mr-1 size-3.5" />
                              {option.short}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Rendering (Grid View) */}
            {viewMode === "grid" && (
              <div className="space-y-4 p-4 xl:hidden bg-muted/10">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden border-border shadow-sm transition-all hover:shadow-md dark:bg-slate-900/80">
                  <CardContent className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12 border border-border/50 shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-base text-foreground truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span className="font-medium bg-muted px-1.5 py-0.5 rounded text-[10px]">Roll {student.rollNo}</span> 
                          <span>{student.id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                      <ToggleGroup 
                        value={student.status}
                        className="justify-start gap-2 w-full"
                      >
                        {statusOptions.map((option) => (
                          <ToggleGroupItem 
                            key={option.value} 
                            value={option.value} 
                            aria-label={option.label}
                            onClick={() => updateStatus(student.id, option.value)}
                            className={cn(
                              "flex-1 h-10 rounded-lg border text-sm font-semibold transition-all",
                              student.status === option.value 
                                ? option.activeClass 
                                : "text-muted-foreground border-border bg-background hover:bg-muted"
                            )}
                          >
                            <option.icon className="mr-1.5 size-4" />
                            {option.short}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}

            {/* Mobile Compact List View */}
            {viewMode === "list" && (
              <div className="flex flex-col xl:hidden divide-y divide-border bg-background">
                {filteredStudents.map((student) => {
                  const isPresent = student.status === "present";
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground border border-border">
                          {student.rollNo}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{student.name}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => updateStatus(student.id, isPresent ? "absent" : "present")}
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl border-2 transition-all active:scale-95",
                          isPresent 
                            ? "bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-900/40 dark:border-emerald-500" 
                            : "bg-red-50 border-red-200 text-red-400 dark:bg-red-900/20 dark:border-red-800/50"
                        )}
                      >
                        <CheckCircle2 className={cn("size-6", isPresent ? "opacity-100" : "opacity-50")} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Action Bar at the bottom of the list */}
            <div className="border-t border-border bg-background/50 dark:bg-slate-900/50 px-4 py-4 md:px-6 ">
              <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded-md">
                    Total: <span className="font-semibold text-foreground">{summary.total}</span>
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">
                    Present: <span className="font-semibold">{summary.present}</span>
                  </span>
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">
                    Absent: <span className="font-semibold">{summary.absent}</span>
                  </span>
                </div>

                <div className="flex justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <Button variant="outline" className="h-10 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm">
                    Save
                    <Save className="ml-1 size-4" />
                  </Button>
                  <Button className="h-10 rounded-xl shadow-sm">
                    Submit
                    <SendHorizontal className="ml-1 size-4" />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
