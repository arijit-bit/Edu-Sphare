"use client";

import { useState } from "react";
import { StudentShell } from "@/app/student/student-ui";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Send,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Academic", "Facility", "Teacher", "Administration", "Extracurricular", "Other"];
const subjectOptions = ["Mathematics", "Physics", "Chemistry", "English Literature", "Biology", "Computer Science", "History", "General / School"];

const feedbackHistory = [
  {
    id: "FB-001",
    subject: "Mathematics",
    category: "Academic",
    priority: "high",
    message: "The pace of algebra lessons is too fast. More practice examples would be helpful.",
    date: "15 May 2026",
    status: "responded",
    response: "Noted. Additional worksheets will be shared this week.",
  },
  {
    id: "FB-002",
    subject: "General / School",
    category: "Facility",
    priority: "medium",
    message: "The science lab equipment needs calibration – some instruments give inconsistent readings.",
    date: "10 May 2026",
    status: "pending",
    response: null,
  },
  {
    id: "FB-003",
    subject: "Computer Science",
    category: "Academic",
    priority: "low",
    message: "Please include more real-world programming projects in the curriculum.",
    date: "2 May 2026",
    status: "reviewed",
    response: null,
  },
];

const statusConfig = {
  responded: { label: "Responded", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", icon: Clock },
  reviewed: { label: "Under Review", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", icon: BarChart2 },
};

const priorityConfig = {
  high: { label: "High", variant: "destructive" },
  medium: { label: "Medium", color: "text-amber-600 border-amber-400" },
  low: { label: "Low", variant: "outline" },
};

export default function StudentFeedbackPage() {
  const [anonymous, setAnonymous] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !category || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage("");
      setSubject("");
      setCategory("");
      setPriority("medium");
    }, 2500);
  };

  return (
    <StudentShell
      title="Submit Feedback"
      subtitle="Share your thoughts, suggestions, or concerns with the school."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Feedback Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">New Feedback</CardTitle>
                  <CardDescription>All submissions are taken seriously and reviewed promptly.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2.5">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Submit Anonymously</p>
                    <p className="text-xs text-muted-foreground">Your name will not be disclosed</p>
                  </div>
                </div>
                <Switch
                  id="anonymous-toggle"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subject / Area
                  </Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="feedback-subject" className="h-10">
                      <SelectValue placeholder="Select subject…" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-category" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="feedback-category" className="h-10">
                      <SelectValue placeholder="Select category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority Tabs */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Priority
                </Label>
                <Tabs value={priority} onValueChange={setPriority}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="low" className="text-xs font-semibold">Low</TabsTrigger>
                    <TabsTrigger value="medium" className="text-xs font-semibold">Medium</TabsTrigger>
                    <TabsTrigger value="high" className="text-xs font-semibold">High</TabsTrigger>
                  </TabsList>
                </Tabs>
                {priority === "high" && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" /> High priority is for urgent issues requiring immediate attention.
                  </p>
                )}
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <Label htmlFor="feedback-message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your Feedback
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder="Describe your feedback clearly. The more details you provide, the better we can help…"
                  className="min-h-[140px] resize-y text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length} / 1000 characters
                </p>
              </div>
            </CardContent>
            <CardFooter className="gap-3">
              <Button
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={submitted || !subject || !category || !message.trim()}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Submitted!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Feedback
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setMessage(""); setSubject(""); setCategory(""); }}>
                Clear
              </Button>
            </CardFooter>
          </Card>

          {/* Feedback History Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Feedback History</CardTitle>
              <CardDescription>Your previously submitted feedback and responses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {feedbackHistory.map((fb, i) => {
                  const s = statusConfig[fb.status];
                  const SIcon = s.icon;
                  const p = priorityConfig[fb.priority];
                  return (
                    <div key={fb.id} className={cn("px-5 py-4 hover:bg-muted/30 transition-colors", i !== feedbackHistory.length - 1 && "border-b border-border")}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-muted-foreground">{fb.id}</span>
                            <Badge variant="outline" className="text-xs">{fb.category}</Badge>
                            <Badge
                              variant={p.variant || "outline"}
                              className={cn("text-xs capitalize", !p.variant && p.color)}
                            >
                              {p.label}
                            </Badge>
                            <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", s.color)}>
                              <SIcon className="h-3 w-3" /> {s.label}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-foreground mb-0.5">{fb.subject}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{fb.message}</p>
                          {fb.response && (
                            <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                              <p className="text-xs font-semibold text-emerald-600 mb-0.5">School Response:</p>
                              <p className="text-xs text-muted-foreground">{fb.response}</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">{fb.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Feedback Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl font-black text-foreground">3</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Total Submitted</p>
              </div>
              <Separator />
              {[
                { label: "Response Rate", value: "67%", color: "text-emerald-500" },
                { label: "Avg. Response Time", value: "2.4 days", color: "text-blue-500" },
                { label: "Responded", value: "1", color: "text-emerald-500" },
                { label: "Under Review", value: "1", color: "text-blue-500" },
                { label: "Pending", value: "1", color: "text-amber-500" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{stat.label}</span>
                  <span className={cn("font-bold", stat.color)}>{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-5">
              <MessageSquare className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-bold text-foreground mb-1">Tips for Good Feedback</p>
              <ul className="space-y-1.5">
                {[
                  "Be specific and constructive",
                  "Focus on the issue, not the person",
                  "Suggest possible solutions",
                  "Use high priority only when urgent",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentShell>
  );
}
