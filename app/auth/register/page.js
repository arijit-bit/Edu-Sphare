"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Users, BarChart3, Shield,
  Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone
} from "lucide-react";
import { DesktopAuthArt } from "@/components/auth/desktop-auth-art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const roles = [
  { id: "student", label: "Student",  icon: GraduationCap, color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30"    },
  { id: "teacher", label: "Teacher",  icon: Users,          color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-950/30"    },
  { id: "finance", label: "Finance",  icon: BarChart3,      color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
  { id: "admin",   label: "Admin",    icon: Shield,         color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-950/30"    },
];

const roleHrefs = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  finance: "/finance/dashboard",
  admin: "/admin/dashboard",
};

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole]           = useState("student");
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [classNum, setClassNum]   = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) { setError("Please fill in all required fields."); return; }
    if (password !== confirmPw) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(roleHrefs[role] || "/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex lg:h-screen lg:overflow-hidden">
      <DesktopAuthArt />

      {/* Right Form */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 lg:h-screen lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:p-12">
        <div className="w-full max-w-md lg:min-h-fit">
          {/* Mobile Brand */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-base font-bold">Edu Sphare</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>

          {/* Role Selector */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition-all cursor-pointer",
                    role === r.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:border-border hover:bg-muted"
                  )}
                >
                  <Icon className={cn("size-5", role === r.id ? "text-primary" : r.color)} />
                  {r.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" placeholder="Aarav Sharma" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regEmail">Email Address <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input id="regEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="you@edusphare.edu" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" placeholder="+91 98765 43210" />
              </div>
            </div>

            {role === "student" && (
              <div className="space-y-1.5">
                <Label>Class / Grade</Label>
                <Select value={classNum} onValueChange={setClassNum}>
                  <SelectTrigger><SelectValue placeholder="Select your class" /></SelectTrigger>
                  <SelectContent>
                    {["6","7","8","9","10","11","12"].map((c) => (
                      <SelectItem key={c} value={c}>Class {c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="regPassword">Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="regPassword" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="Min 8 chars" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input id="confirmPassword" type={showPw ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="pl-10" placeholder="Repeat password" required />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="showPw" type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="size-4 rounded accent-primary cursor-pointer" />
              <Label htmlFor="showPw" className="text-sm cursor-pointer font-normal">Show passwords</Label>
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" required className="mt-0.5 size-4 rounded accent-primary cursor-pointer" />
              <Label htmlFor="terms" className="text-sm cursor-pointer font-normal leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
