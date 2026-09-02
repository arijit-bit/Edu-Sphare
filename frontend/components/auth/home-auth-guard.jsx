"use client";

import { useEffect, useRef } from "react";
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
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    console.info(`[HomeAuthGuard] 🔍 Evaluating auth status: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, user=${user ? user.role : "null"}`);

    if (!isLoading && isAuthenticated && user && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      const activeSlug =
        schoolSlug ||
        (typeof window !== "undefined" && localStorage.getItem("edusphere_school_slug")) ||
        user.schoolSlug ||
        "demo-school";
      const destination = getDashboardForRole(user.role, activeSlug);

      console.info(`[HomeAuthGuard] 🚀 Authenticated user found (${user.role} - ${user.email}) -> Redirecting to dashboard: ${destination}`);

      // Primary navigation via Next.js client router
      router.push(destination);

      // Fallback navigation in case Next.js client transition is delayed during root hydration
      const fallbackTimer = setTimeout(() => {
        if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === `/${schoolSlug}`)) {
          console.info(`[HomeAuthGuard] ⚡ Executing direct fallback navigation to: ${destination}`);
          window.location.replace(destination);
        }
      }, 600);

      return () => clearTimeout(fallbackTimer);
    } else if (!isLoading && (!isAuthenticated || !user)) {
      console.info("[HomeAuthGuard] 🌐 Visitor is unauthenticated -> Displaying public landing page.");
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
          <p className="text-sm font-medium text-muted-foreground">
            {isAuthenticated && user ? `Redirecting to ${user.role} portal...` : "Checking session..."}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
