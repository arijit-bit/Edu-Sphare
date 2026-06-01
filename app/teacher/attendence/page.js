"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "@/components/theme-toggle";
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
  Filter,
  Save,
  SendHorizontal,
  LayoutGrid,
  List,
  Clock3,
  X,
  XCircle,
  Users2,
  ChevronDown,
} from "lucide-react";
import { useTeacherLayout } from "../layout";

const studentsSeed = [
  { id: "ADM-001", rollNo: "01", name: "Alice Anderson",   status: "present", grade: "Grade 10", section: "A", subgroup: "10A" },
  { id: "ADM-002", rollNo: "02", name: "Benjamin Baker",  status: "absent",  grade: "Grade 10", section: "A", subgroup: "10A" },
  { id: "ADM-003", rollNo: "03", name: "Chloe Carter",    status: "leave",   grade: "Grade 10", section: "B", subgroup: "10B" },
  { id: "ADM-004", rollNo: "04", name: "Daniel Cooper",   status: "present", grade: "Grade 10", section: "A", subgroup: "10A" },
  { id: "ADM-005", rollNo: "05", name: "Ella Davis",      status: "present", grade: "Grade 11", section: "A", subgroup: "11A" },
  { id: "ADM-006", rollNo: "06", name: "Felix Evans",     status: "absent",  grade: "Grade 11", section: "A", subgroup: "11A" },
  { id: "ADM-007", rollNo: "07", name: "Grace Foster",    status: "present", grade: "Grade 11", section: "B", subgroup: "11B" },
  { id: "ADM-008", rollNo: "08", name: "Henry Green",     status: "leave",   grade: "Grade 12", section: "A", subgroup: "12A" },
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

/**
 * FiltersForm is extracted as its own component so each rendered instance
 * (desktop + mobile accordion) has its own independent datePickerOpen state,
 * preventing two calendars from opening simultaneously.
 */
function FiltersForm({
  classValue, setClassValue,
  sectionValue, setSectionValue,
  subjectValue, setSubjectValue,
  periodValue, setPeriodValue,
}) {
  const [dateValue, setDateValue] = useState("2023-10-24");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const formattedDateLabel = useMemo(() => {
    const parsed = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Select date";
    return format(parsed, "PPP");
  }, [dateValue]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Class</label>
        <Select value={classValue} onValueChange={setClassValue}>
          <SelectTrigger className="h-11 w-full rounded-lg bg-background">
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
          <SelectTrigger className="h-11 w-full rounded-lg bg-background">
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
          <SelectTrigger className="h-11 w-full rounded-lg bg-background">
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
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger
            render={(triggerProps) => (
              <Button
                {...triggerProps}
                type="button"
                variant="outline"
                data-empty={!dateValue}
                className="h-11 w-full justify-between rounded-lg bg-background text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                {dateValue ? <span>{formattedDateLabel}</span> : <span>Pick a date</span>}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            )}
          />
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker
              mode="single"
              selected={dateValue ? new Date(`${dateValue}T00:00:00`) : undefined}
              onSelect={(selectedDate) => {
                if (!selectedDate) return;
                setDateValue(format(selectedDate, "yyyy-MM-dd"));
                setDatePickerOpen(false);
              }}
              defaultMonth={dateValue ? new Date(`${dateValue}T00:00:00`) : undefined}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Period</label>
        <Select value={periodValue} onValueChange={setPeriodValue}>
          <SelectTrigger className="h-11 w-full rounded-lg bg-background">
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
}

export default function TeacherAttendencePage() {
  const { setMobileOpen } = useTeacherLayout();
  const [viewMode, setViewMode] = useState("grid");
  const [classValue, setClassValue] = useState("Grade 10");
  const [sectionValue, setSectionValue] = useState("A - Science");
  const [subjectValue, setSubjectValue] = useState("Physics");
  const [periodValue, setPeriodValue] = useState("Period 1 (08:00 AM)");
  const [searchValue, setSearchValue] = useState("");
  const [students, setStudents] = useState(studentsSeed);

  const filteredStudents = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !search ||
        [student.name, student.rollNo, student.id, student.subgroup].some((v) =>
          v.toLowerCase().includes(search)
        );
      return matchesSearch;
    });
  }, [searchValue, students]);

  const summary = useMemo(() => {
    const present = students.filter((s) => s.status === "present").length;
    const absent  = students.filter((s) => s.status === "absent").length;
    const leave   = students.filter((s) => s.status === "leave").length;
    const total   = students.length;
    return { total, present, absent, leave };
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

  const filtersFormProps = {
    classValue, setClassValue,
    sectionValue, setSectionValue,
    subjectValue, setSubjectValue,
    periodValue, setPeriodValue,
  };

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
              className="h-10 rounded-xl border-border bg-background pl-10 pr-9 text-sm shadow-none transition-all focus-visible:ring-primary/20"
            />
            {searchValue ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchValue("")}
                className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>

          <div className="ml-auto hidden items-center gap-1 md:flex md:gap-2">
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
        {/* Page Title + Actions */}
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
            <Button variant="outline" className="h-10 rounded-xl bg-background/50">
              <Download className="mr-2 size-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={resetAttendance}
              className="h-10 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 bg-background/50"
            >
              <RotateCcw className="mr-2 size-4" />
              Reset
            </Button>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-xl">
          <div className="hidden md:block">
            <FiltersForm {...filtersFormProps} />
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
                  <FiltersForm {...filtersFormProps} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-border/50 pt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{summary.total} students</span> in{" "}
              <span className="font-semibold text-foreground">Grade 10 - A ({subjectValue})</span>
            </p>
            <Button className="h-10 rounded-xl border border-cyan-800 bg-cyan-600/90 text-white shadow-sm hover:bg-cyan-500">
              <Users2 className="mr-2 size-4" />
              Load Students
            </Button>
          </div>
        </section>

        {/* Student List Section */}
        <section className="mt-4 mb-32 lg:mb-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Section Header: Quick Actions */}
          <div className="border-b border-border bg-muted/40 px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">Quick Actions:</span>
                <Button
                  size="sm"
                  onClick={markAllPresent}
                  className="h-8 rounded-md border border-emerald-700 bg-emerald-600 px-3 text-white shadow-none hover:bg-emerald-500"
                >
                  <CheckCircle2 className="mr-1.5 size-3.5" />
                  Mark All Present
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden mb-8">
            {/* Desktop Table */}
            <div className="hidden xl:block">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="h-12 px-4 pl-6 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Student Information</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Cohort</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Admission ID</TableHead>
                    <TableHead className="h-12 px-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground text-center">Attendance Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="border-border bg-card transition-colors hover:bg-muted/40">
                        {/* Student Info */}
                        <TableCell className="px-4 pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-border/50 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                                {getInitials(student.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{student.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{student.grade} · Section {student.section}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Cohort Badge */}
                        <TableCell className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                            {student.subgroup}
                          </span>
                        </TableCell>

                        {/* Admission ID */}
                        <TableCell className="px-4 py-4 text-sm text-muted-foreground font-mono">
                          {student.id}
                        </TableCell>

                        {/* Tri-state Attendance Toggle */}
                        <TableCell className="px-4 py-4 text-center">
                          <div className="inline-flex items-center bg-muted/50 p-1 rounded-lg border border-border/50 shadow-inner gap-0.5">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateStatus(student.id, option.value)}
                                className={cn(
                                  "px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide uppercase transition-all",
                                  student.status === option.value
                                    ? option.activeClass + " shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="size-10 text-muted-foreground/30" />
                          <p className="text-sm font-semibold text-muted-foreground">No students matched your search</p>
                          <p className="text-xs text-muted-foreground/70">Try a different name, ID, or change the group filter.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View (Grid) */}
            {viewMode === "grid" && (
              <div className="space-y-4 p-4 xl:hidden bg-muted/10">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <Card
                      key={student.id}
                      className={cn(
                        "overflow-hidden border-border shadow-sm transition-all hover:shadow-md",
                        student.status === "present"
                          ? "border-emerald-900 bg-emerald-950/20"
                          : student.status === "absent"
                            ? "border-red-900 bg-red-950/20"
                            : "bg-card"
                      )}
                    >
                      <CardContent className="p-4 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="size-12 border border-border/50 shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-base text-foreground truncate">{student.name}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="font-medium bg-muted px-1.5 py-0.5 rounded text-[10px]">Roll {student.rollNo}</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">{student.subgroup}</span>
                              <span className="text-xs text-muted-foreground">{student.id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
                          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50 shadow-inner gap-0.5">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => updateStatus(student.id, option.value)}
                                className={cn(
                                  "flex-1 py-2 rounded-md text-xs font-bold tracking-wide uppercase transition-all",
                                  student.status === option.value
                                    ? option.activeClass + " shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-16 flex flex-col items-center gap-2">
                    <Search className="size-10 text-muted-foreground/30" />
                    <p className="text-sm font-semibold text-muted-foreground">No students matched your search</p>
                    <p className="text-xs text-muted-foreground/70">Try a different name, ID, or change the group filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Compact List View */}
            {viewMode === "list" && (
              <div className="flex flex-col xl:hidden divide-y divide-border bg-background">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPresent = student.status === "present";
                    return (
                      <div
                        key={student.id}
                        onClick={() => updateStatus(student.id, isPresent ? "absent" : "present")}
                        className={cn(
                          "flex cursor-pointer items-center justify-between p-4 transition-colors",
                          isPresent
                            ? "bg-emerald-50/70 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
                            : "bg-red-50/70 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/30"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground border border-border shrink-0">
                            {student.rollNo}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{student.name}</p>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 mt-0.5">
                              {student.subgroup}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            updateStatus(student.id, isPresent ? "absent" : "present");
                          }}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md text-xs font-bold transition-all active:scale-95 shrink-0",
                            isPresent
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {isPresent ? "P" : "A"}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-16 flex flex-col items-center gap-2">
                    <Search className="size-10 text-muted-foreground/30" />
                    <p className="text-sm font-semibold text-muted-foreground">No students matched your search</p>
                    <p className="text-xs text-muted-foreground/70">Try a different name, ID, or change the group filter.</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="border-t border-border bg-card px-4 py-4 md:px-6 pb-0">
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
                  <Button variant="outline" className="h-10 rounded-xl shadow-sm">
                    Save
                    <Save className="ml-1 size-4" />
                  </Button>
                  <Button className="h-10 rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-500">
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
