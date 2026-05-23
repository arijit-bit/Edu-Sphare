"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap, Users, BarChart3, Shield,
  Eye, EyeOff, ArrowRight, Lock, Mail
} from "lucide-react";
import { DesktopAuthArt } from "@/components/auth/desktop-auth-art";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roles = [
  { id: "student", label: "Student",  icon: GraduationCap, href: "/student/dashboard",  color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30"   },
  { id: "teacher", label: "Teacher",  icon: Users,          href: "/teacher/dashboard",  color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-950/30"   },
  { id: "finance", label: "Finance",  icon: BarChart3,      href: "/finance/dashboard",  color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
  { id: "admin",   label: "Admin",    icon: Shield,         href: "/admin/dashboard",    color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-950/30"   },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole]             = useState("student");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [remember, setRemember]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const selectedRole = roles.find((r) => r.id === role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(selectedRole?.href || "/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex lg:h-screen lg:overflow-hidden">
      <DesktopAuthArt />

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:h-screen lg:w-1/2 lg:flex-none lg:overflow-y-auto lg:p-12">
        <div className="w-full max-w-md lg:min-h-fit">
          {/* Mobile Brand */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-base font-bold">Edu Sphare</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
              Register here
            </Link>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@edusphare.edu"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded accent-primary cursor-pointer"
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer font-normal">Remember me for 30 days</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in as {selectedRole?.label} <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo */}
          <div className="mt-6">
            <p className="text-center text-xs text-muted-foreground mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <Button
                  key={r.id}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(r.href)}
                  className="text-xs"
                >
                  {r.label} Demo
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
