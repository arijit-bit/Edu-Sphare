"use client";

import { StudentShell, ProgressRing } from "../student-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const getScoreColor = (score) => {
  if (score >= 90) return "#22c55e"; // Green for High score
  if (score >= 80) return "#facc15"; // Yellow Light
  if (score >= 65) return "#d97706"; // Dark Yellow / Orange
  return "#ef4444"; // Red
};

const subjects = [
  { name: "Mathematics", score: 91, max: 100, grade: "A+" },
  { name: "Physics", score: 85, max: 100, grade: "A" },
  { name: "Chemistry", score: 88, max: 100, grade: "A" },
  { name: "English Literature", score: 82, max: 100, grade: "A-" },
  { name: "Biology", score: 90, max: 100, grade: "A+" },
  { name: "Computer Science", score: 96, max: 100, grade: "A+" },
];

const gradeColor = (grade) => {
  if (grade === "A+") return "text-emerald-600 bg-emerald-500/10";
  if (grade === "A") return "text-blue-600 bg-blue-500/10";
  if (grade.startsWith("A-")) return "text-indigo-600 bg-indigo-500/10";
  if (grade.startsWith("B")) return "text-amber-600 bg-amber-500/10";
  return "text-destructive bg-destructive/10";
};

const performanceTable = [
  { subject: "Mathematics", marks: 91, max: 100, grade: "A+", remarks: "Outstanding" },
  { subject: "Physics", marks: 85, max: 100, grade: "A", remarks: "Very Good" },
  { subject: "Chemistry", marks: 88, max: 100, grade: "A", remarks: "Excellent" },
  { subject: "English Literature", marks: 82, max: 100, grade: "A-", remarks: "Good" },
  { subject: "Biology", marks: 90, max: 100, grade: "A+", remarks: "Outstanding" },
  { subject: "Computer Science", marks: 96, max: 100, grade: "A+", remarks: "Exceptional" },
  { subject: "History", marks: 79, max: 100, grade: "B+", remarks: "Above Average" },
  { subject: "Physical Education", marks: 95, max: 100, grade: "A+", remarks: "Outstanding" },
];

const remarkColor = (remark) => {
  if (["Outstanding", "Exceptional"].includes(remark)) return "text-emerald-600";
  if (["Excellent", "Very Good"].includes(remark)) return "text-blue-600";
  if (["Good", "Above Average"].includes(remark)) return "text-amber-600";
  return "text-muted-foreground";
};

const overallScore = 87.4;
const distinction = 90;

export default function StudentPerformancePage() {
  return (
    <StudentShell
      title="Academic Performance"
      subtitle="Detailed breakdown of your scores across all subjects."
    >
      <div className="space-y-6">

        {/* Overall Score Banner */}
        <Card className="overflow-hidden border bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950 border-zinc-800 text-white shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <p className="text-sm font-semibold opacity-80 mb-1">Overall Academic Score</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black">{overallScore}%</span>
                  <span className="text-base opacity-70 mb-2">/ 100%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">Progress to Distinction ({distinction}%)</span>
                    <span className="font-bold">{overallScore}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-700"
                      style={{ width: `${(overallScore / distinction) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs opacity-70">
                    {(distinction - overallScore).toFixed(1)}% away from Distinction
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-xs opacity-70">Class Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black">3.84</p>
                  <p className="text-xs opacity-70">GPA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black">A</p>
                  <p className="text-xs opacity-70">Overall</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <Card key={sub.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-bold text-foreground truncate">{sub.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          gradeColor(sub.grade)
                        )}
                      >
                        Grade {sub.grade}
                      </span>
                    </div>
                  </div>
                  <ProgressRing value={sub.score} size={64} strokeWidth={7} color={getScoreColor(sub.score)} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Score</span>
                    <span className="font-bold text-foreground">
                      {sub.score} / {sub.max}
                    </span>
                  </div>
                  <Progress value={sub.score} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Performer + Focus Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/15">
                <Trophy className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">
                  Top Subject
                </p>
                <p className="text-base font-black text-foreground">Computer Science</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  96/100 · Grade A+ · Exceptional
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/15">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">
                  Focus Area
                </p>
                <p className="text-base font-black text-foreground">History</p>
                <p className="text-xs text-amber-600 font-semibold mt-0.5">
                  79/100 · Grade B+ · Room to improve
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Details Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Performance Details</CardTitle>
            <CardDescription>Complete subject-wise breakdown</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Subject</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Marks</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Max</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Percentage</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Grade</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Remarks</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wide">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceTable.map((row) => {
                    const pct = ((row.marks / row.max) * 100).toFixed(1);
                    const trend =
                      row.marks >= 90
                        ? { icon: TrendingUp, color: "text-emerald-500" }
                        : row.marks < 80
                        ? { icon: TrendingDown, color: "text-destructive" }
                        : { icon: Minus, color: "text-muted-foreground" };
                    const TrendIcon = trend.icon;
                    return (
                      <TableRow key={row.subject} className="hover:bg-muted/30">
                        <TableCell className="font-semibold text-sm">{row.subject}</TableCell>
                        <TableCell className="font-bold text-foreground">{row.marks}</TableCell>
                        <TableCell className="text-muted-foreground">{row.max}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={parseFloat(pct)} className="h-1.5 w-16" />
                            <span className="text-xs font-semibold">{pct}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "text-xs font-bold px-2 py-1 rounded-full",
                              gradeColor(row.grade)
                            )}
                          >
                            {row.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn("text-xs font-semibold", remarkColor(row.remarks))}>
                            {row.remarks}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TrendIcon className={cn("h-4 w-4", trend.color)} />
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
