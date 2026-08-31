"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDashboardForRole } from "@/lib/constants";
import { Loader2 } from "lucide-react";

/**
 * Wraps home/landing pages.
 * If user is already authenticated with an active session, automatically redirects them
 * directly to their authorized portal dashboard without flashing the landing page.
 * If user is unauthenticated, displays the public landing page normally.
 */
export function HomeAuthGuard({ children, schoolSlug }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const activeSlug =
        schoolSlug ||
        (typeof window !== "undefined" && localStorage.getItem("edusphere_school_slug")) ||
        user.schoolSlug ||
        "demo-school";
      const destination = getDashboardForRole(user.role, activeSlug);
      router.replace(destination);
    }
  }, [isLoading, isAuthenticated, user, schoolSlug, router]);

  // While checking session on mount or when redirecting authenticated user, prevent flash
  if (isLoading || (isAuthenticated && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-pulse">
            <Loader2 className="size-6 animate-spin" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  return children;
}
