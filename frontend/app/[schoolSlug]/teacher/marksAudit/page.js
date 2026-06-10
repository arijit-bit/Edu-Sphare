"use client";

import React from 'react';
import { Menu, FileText, BarChart3, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTeacherLayout } from "../layout";

export default function MarksAuditPage() {
  const { setMobileOpen } = useTeacherLayout();

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 md:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden size-8" onClick={() => setMobileOpen(true)}>
          <Menu className="size-4" />
        </Button>
        <h1 className="text-sm font-semibold">Marks Audit Portal</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Marks Audit & Grades</h2>
            <p className="text-sm text-muted-foreground">Audit student exam scores, generate progress reports, and verify transcript logs.</p>
          </div>
          <Badge className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white font-medium gap-1.5 px-3 py-1 text-xs">
            <ShieldCheck className="size-3.5" /> Secure Audit Session Active
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#111111] text-teal-400">
                  <FileText className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Unreleased Grades</CardTitle>
                  <CardDescription className="text-xs">Class assessments pending signoff</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2 Exams</p>
              <p className="text-xs text-muted-foreground mt-1">Grade 10-A Algebra & Grade 11-B Physics</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#111111] text-amber-400">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Grade Discrepancies</CardTitle>
                  <CardDescription className="text-xs">Flagged during automated validation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0 Conflicts</p>
              <p className="text-xs text-muted-foreground mt-1">All grade records match school records.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#111111] text-violet-400">
                  <BarChart3 className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Department Average</CardTitle>
                  <CardDescription className="text-xs">Overall Mathematics performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">83.1%</p>
              <p className="text-xs text-muted-foreground mt-1">+2.1% compared to last semester</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#111111]">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Grade Verification & Auditing Logs</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
              This module allows you to review historical grade alterations, lock assessment parameters, and verify transcript consistency before finalizing reports.
            </p>
            <Button size="sm">Access Logs</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
