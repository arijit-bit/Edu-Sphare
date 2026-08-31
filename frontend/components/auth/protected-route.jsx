"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, PORTAL_LABELS, getDashboardForRole, getPortalForRole } from "@/lib/constants";
import { ShieldAlert, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ProtectedRoute({ children, requiredRole, portalName }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const targetPortal = portalName || (requiredRole ? getPortalForRole(requiredRole) : "student");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?portal=${targetPortal}&next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, targetPortal, pathname]);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="size-7 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-base font-bold text-foreground">Verifying session...</h2>
            <p className="text-xs text-muted-foreground mt-1">Please wait while we authenticate your access</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (handles transition before router.push finishes)
  if (!isAuthenticated || !user) {
    return null;
  }

  // 3. Role Mismatch — Access Denied Screen
  if (requiredRole && user.role !== requiredRole) {
    const userRoleLabel = ROLE_LABELS[user.role] || user.role;
    const portalTitle = PORTAL_LABELS[targetPortal] || "Portal";
    const authorizedDashboard = getDashboardForRole(user.role);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/30 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />
          <CardHeader className="text-center pb-3 pt-6">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldAlert className="size-7" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">Access Denied</CardTitle>
            <CardDescription className="text-sm mt-1.5 leading-relaxed">
              Your account does not have permission to access the <strong className="text-foreground">{portalTitle}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <div className="rounded-xl border bg-muted/40 p-3.5 text-xs text-muted-foreground">
              You are currently logged in as{" "}
              <span className="font-bold text-foreground capitalize">{userRoleLabel}</span> ({user.email}).
            </div>

            <div className="flex flex-col gap-2.5">
              <Button asChild className="w-full gap-2 font-semibold">
                <a href={authorizedDashboard}>
                  Go to {userRoleLabel} Dashboard <ArrowRight className="size-4" />
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                onClick={async () => {
                  await logout();
                  router.push(`/auth/login?portal=${targetPortal}`);
                }}
              >
                <LogOut className="size-4" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Authorized State
  return children;
}
