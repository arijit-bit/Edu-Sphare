"use client";

import { useState } from "react";
import { StudentShell } from "../student-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { Trophy, Star, CheckCircle2, XCircle, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const statCards = [
  { label: "Class Rank", value: "#12", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Best Score", value: "96%", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Exams Taken", value: "24", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Average Score", value: "87.4%", icon: Star, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const allResults = [
  { subject: "Mathematics", examType: "Unit Test 1", marks: 47, max: 50, grade: "A+", status: "pass" },
  { subject: "Mathematics", examType: "Mid-Term", marks: 88, max: 100, grade: "A+", status: "pass" },
  { subject: "Physics", examType: "Unit Test 1", marks: 42, max: 50, grade: "A", status: "pass" },
  { subject: "Physics", examType: "Practical", marks: 48, max: 50, grade: "A+", status: "pass" },
  { subject: "Chemistry", examType: "Unit Test 1", marks: 44, max: 50, grade: "A+", status: "pass" },
  { subject: "Chemistry", examType: "Mid-Term", marks: 85, max: 100, grade: "A", status: "pass" },
  { subject: "English Literature", examType: "Unit Test 1", marks: 40, max: 50, grade: "A-", status: "pass" },
  { subject: "English Literature", examType: "Mid-Term", marks: 79, max: 100, grade: "B+", status: "pass" },
  { subject: "Biology", examType: "Unit Test 1", marks: 46, max: 50, grade: "A+", status: "pass" },
  { subject: "Biology", examType: "Practical", marks: 50, max: 50, grade: "A+", status: "pass" },
  { subject: "Computer Science", examType: "Unit Test 1", marks: 49, max: 50, grade: "A+", status: "pass" },
  { subject: "Computer Science", examType: "Mid-Term", marks: 95, max: 100, grade: "A+", status: "pass" },
  { subject: "History", examType: "Unit Test 1", marks: 38, max: 50, grade: "B+", status: "pass" },
  { subject: "History", examType: "Mid-Term", marks: 76, max: 100, grade: "B+", status: "pass" },
  { subject: "Physical Education", examType: "Practical", marks: 48, max: 50, grade: "A+", status: "pass" },
];

const gradeColor = (grade) => {
  if (grade === "A+" ) return "default";
  if (grade === "A" || grade === "A-") return "secondary";
  if (grade.startsWith("B")) return "outline";
  return "destructive";
};

const gradeTextColor = (grade) => {
  if (grade === "A+") return "text-emerald-600 bg-emerald-500/10";
  if (grade === "A" || grade === "A-") return "text-blue-600 bg-blue-500/10";
  if (grade.startsWith("B")) return "text-amber-600 bg-amber-500/10";
  return "text-destructive bg-destructive/10";
};

const examTypes = ["All Exams", "Unit Test 1", "Mid-Term", "Practical"];
const years = ["2025–26", "2024–25", "2023–24"];

export default function StudentResultsPage() {
  const [yearFilter, setYearFilter] = useState("2025–26");
  const [examFilter, setExamFilter] = useState("All Exams");

  const filtered = allResults.filter(
    (r) => examFilter === "All Exams" || r.examType === examFilter
  );

  return (
    <StudentShell
      title="Exam Results"
      subtitle="View and download your exam results and grade history."
    >
      <div className="space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className={cn("p-2.5 rounded-xl w-fit mb-3", stat.bg)}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters + Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <CardTitle className="text-base font-bold">Results Table</CardTitle>
                <CardDescription>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-36 h-9 text-sm">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={examFilter} onValueChange={setExamFilter}>
                  <SelectTrigger className="w-40 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Subject</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Exam Type</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Marks</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Max</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Grade</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide w-36">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row, i) => {
                    const pct = Math.round((row.marks / row.max) * 100);
                    return (
                      <TableRow key={i} className="hover:bg-muted/30">
                        <TableCell className="font-semibold text-sm">{row.subject}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.examType}</TableCell>
                        <TableCell className="font-bold text-foreground">{row.marks}</TableCell>
                        <TableCell className="text-muted-foreground">{row.max}</TableCell>
                        <TableCell>
                          <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", gradeTextColor(row.grade))}>
                            {row.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          {row.status === "pass" ? (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Pass
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" /> Fail
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-1.5 flex-1" />
                            <span className="text-xs font-semibold text-muted-foreground w-9 text-right">
                              {pct}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </StudentShell>
  );
}
