"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, User, Lock, Check, Eye, EyeOff, ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  PORTAL_ROLES,
  PORTAL_LABELS,
  ROLE_LABELS,
  isValidPortal,
  getRequiredRoleForPortal,
  getDashboardForRole,
  getPortalForRole,
} from "@/lib/constants";

// Demo credentials - only auto-filled for the demo school
const DEMO_CREDS = {
  student: { email: "student@demo.edusphare.test", password: "DemoOnly!2026" },
  teacher: { email: "teacher@demo.edusphare.test", password: "DemoOnly!2026" },
  finance: { email: "finance@demo.edusphare.test", password: "DemoOnly!2026" },
  admin:   { email: "admin@demo.edusphare.test",   password: "DemoOnly!2026" },
};
const DEMO_SCHOOL_SLUG = "demo-school";

// Try to detect the demo role from either ?portal=, ?role=, or ?next=
function detectDemoRole(searchParams) {
  const portal = searchParams.get("portal");
  if (portal && DEMO_CREDS[portal.toLowerCase()]) {
    return portal.toLowerCase();
  }

  const role = searchParams.get("role");
  if (role && DEMO_CREDS[role.toLowerCase()]) {
    return role.toLowerCase();
  }

  const school = searchParams.get("school");
  if (school === DEMO_SCHOOL_SLUG && role && DEMO_CREDS[role]) {
    return role;
  }

  // Middleware / URL redirect flow: parse /<school>/<role>/...
  const next = searchParams.get("next") || "";
  const match = next.match(/^\/[^\/]+\/(student|teacher|finance|admin)(\/|$)/);
  if (match) return match[1];

  return null;
}

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const portalParam = (searchParams.get("portal") || searchParams.get("role") || "").toLowerCase();
  const nextParam   = searchParams.get("next");

  const [email, setEmail]               = useState("");
  const [schoolSlug, setSchoolSlug]     = useState(process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_SLUG || "demo-school");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState("");
  const [mismatchError, setMismatchError] = useState(null);

  // Bot protection
  const [honeypot, setHoneypot] = useState("");
  const loadTimeRef = useRef(0);
  const isDemoRef   = useRef(false);

  // Swipe-to-login state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const activePortal = portalParam && isValidPortal(portalParam) ? portalParam : (detectDemoRole(searchParams) || "student");
  const portalTitle = PORTAL_LABELS[activePortal] || "School Portal";

  useEffect(() => {
    loadTimeRef.current = Date.now();

    const demoRole = detectDemoRole(searchParams);
    if (demoRole && DEMO_CREDS[demoRole]) {
      isDemoRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchoolSlug(DEMO_SCHOOL_SLUG);
      setEmail(DEMO_CREDS[demoRole].email);
      setPassword(DEMO_CREDS[demoRole].password);
    }
  }, [searchParams]);

  // If user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const requiredRole = getRequiredRoleForPortal(activePortal);
      if (user.role === requiredRole || !portalParam) {
        const activeSlug = schoolSlug || "demo-school";
        let destination = getDashboardForRole(user.role, activeSlug);
        if (nextParam) {
          destination = nextParam.replace(/^\/[^\/]+(\/(student|teacher|finance|admin))/, `/${activeSlug}$1`);
        }
        router.push(destination);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMismatchError({
          userRole: user.role,
          attemptedPortal: activePortal,
        });
      }
    }
  }, [isLoading, isAuthenticated, user, activePortal, portalParam, nextParam, schoolSlug, router]);

  const submitLogin = async ({ slug, loginEmail, loginPassword, loginRemember }) => {
    setError("");
    setMismatchError(null);

    // Bot detection: honeypot
    if (honeypot) {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1800));
      setIsSubmitting(false);
      return;
    }

    // Timing guard - skip for auto-filled demo sessions
    if (!isDemoRef.current && Date.now() - loadTimeRef.current < 1500) {
      setError("Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email: loginEmail,
        password: loginPassword,
        portal: activePortal,
      });

      if (result.roleMatch || !portalParam) {
        const activeSlug = slug || "demo-school";
        let destination = getDashboardForRole(result.user.role, activeSlug);
        if (nextParam) {
          destination = nextParam.replace(/^\/[^\/]+(\/(student|teacher|finance|admin))/, `/${activeSlug}$1`);
        }
        router.push(destination);
      } else {
        setMismatchError({
          userRole: result.actualRole,
          attemptedPortal: activePortal,
        });
      }
    } catch (requestError) {
      setError(requestError.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    await submitLogin({ slug: schoolSlug, loginEmail: email, loginPassword: password, loginRemember: remember });
  };

  const handlePointerDown = (e) => {
    if (isSubmitting) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isSubmitting) return;
    const delta = e.clientX - startXRef.current;
    if (delta > 0) {
      setDragX(Math.min(delta, 152));
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging || isSubmitting) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
    
    if (dragX > 100) {
      setDragX(152);
      submitLogin({ slug: schoolSlug, loginEmail: email, loginPassword: password, loginRemember: remember });
    } else {
      setDragX(0);
    }
  };

  // If role mismatch state is active
  if (mismatchError) {
    const userRoleLabel = ROLE_LABELS[mismatchError.userRole] || mismatchError.userRole;
    const portalNameLabel = PORTAL_LABELS[mismatchError.attemptedPortal] || "Portal";
    const authorizedDashboard = getDashboardForRole(mismatchError.userRole, schoolSlug || "demo-school");

    return (
      <div className="min-h-screen bg-[#2A2A2B] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Your account does not have permission to access the <strong>{portalNameLabel}</strong>.
          </p>

          <div className="my-5 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs text-gray-600 text-left">
            <p className="font-semibold text-gray-800">Current Session:</p>
            <p className="mt-0.5">
              Logged in as <span className="font-bold text-[#0066FF] capitalize">{userRoleLabel}</span> ({user?.email})
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={authorizedDashboard}
              className="w-full h-11 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              Go to {userRoleLabel} Dashboard <ArrowRight className="ml-2 size-4" />
            </Link>

            <button
              type="button"
              className="w-full h-11 border border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold rounded-xl flex items-center justify-center transition-colors"
              onClick={async () => {
                await logout();
                setMismatchError(null);
              }}
            >
              <LogOut className="mr-2 size-4" /> Sign Out & Switch Account
            </button>

            <div className="pt-2">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Back to Home Portals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2A2A2B] flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] bg-white rounded-[32px] overflow-hidden flex shadow-2xl relative">

        {/* Left Side Illustration */}
        <div className="relative w-[45%] bg-white hidden md:flex flex-col items-center justify-center p-8 z-10">
          <div className="blue-circle absolute rounded-full bg-blue-600 w-[600px] h-[900px] right-20 bottom-70"></div>
          <div className="blue-circle absolute rounded-full bg-blue-600 w-[600px] h-[900px] right-30 top-70"></div>
          <div className="blue-circle absolute rounded-full bg-white w-[600px] h-[900px] left-30 top-70"></div>
          <div className="relative z-20 w-full max-w-[320px] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/20944363.svg" alt="Login Illustration" className="w-full h-auto drop-shadow-2xl" />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-[55%] flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 bg-white relative z-20 py-12">
          <div className="w-full max-w-[320px] flex flex-col items-center">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-md bg-[#2A2A2B] text-white flex items-center justify-center font-bold text-lg leading-none">
                  e
                </div>
                <h1 className="text-3xl font-bold text-[#2A2A2B] tracking-tight">edusphare</h1>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {portalParam ? `${portalTitle} Login` : "Access your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Honeypot (hidden from humans, bots fill it) */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
                  {error}
                </div>
              )}

              {/* School Slug */}
              <div className="space-y-1 relative group">
                <div className={`flex items-center border-b ${error ? "border-red-300" : "border-gray-300"} group-focus-within:border-[#0066FF] transition-colors pb-2`}>
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="schoolSlug"
                    type="text"
                    placeholder="School code (e.g. greenwood-high)"
                    value={schoolSlug}
                    onChange={(e) => setSchoolSlug(e.target.value.toLowerCase())}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-base"
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 relative group">
                <div className={`flex items-center border-b ${error ? "border-red-300" : "border-gray-300"} group-focus-within:border-[#0066FF] transition-colors pb-2`}>
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="loginId"
                    type="text"
                    placeholder="Email or ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-base"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 relative group mt-6">
                <div className={`flex items-center border-b ${error ? "border-red-300" : "border-gray-300"} group-focus-within:border-[#0066FF] transition-colors pb-2 relative`}>
                  <Lock className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-base pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? "bg-[#0066FF] border-[#0066FF]" : "border-gray-300 group-hover:border-[#0066FF]"}`}>
                    {remember && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="text-xs text-gray-500 font-medium">Keep me signed in</span>
                </label>
                <a href="#" className="text-xs text-[#0066FF] font-medium hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[200px] mx-auto h-12 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-medium transition-all shadow-md mt-10 relative group overflow-hidden touch-none"
              >
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{
                    left: isSubmitting ? "160px" : `calc(8px + ${dragX}px)`,
                    touchAction: "none"
                  }}
                  className={`absolute top-2 z-10 w-8 h-8 rounded-full bg-[#4ADE80] flex items-center justify-center text-white cursor-grab active:cursor-grabbing ${
                    !isDragging && !isSubmitting ? "transition-all duration-300 ease-out" : ""
                  } ${isSubmitting ? "transition-all duration-700 ease-in-out" : ""}`}
                >
                  {isSubmitting ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
                <span className="absolute w-full text-center uppercase tracking-wider text-sm font-bold z-0 pointer-events-none">
                  {isSubmitting ? "Signing in..." : "Login"}
                </span>
              </button>

              <div className="text-center pt-3">
                <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Portals
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}