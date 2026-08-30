"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, User, Lock, Check, Eye, EyeOff } from "lucide-react";

// Demo credentials - only auto-filled for the demo school
const DEMO_CREDS = {
  student: { email: "student@demo.edusphare.test", password: "DemoOnly!2026" },
  teacher: { email: "teacher@demo.edusphare.test", password: "DemoOnly!2026" },
  finance: { email: "finance@demo.edusphare.test", password: "DemoOnly!2026" },
  admin:   { email: "admin@demo.edusphare.test",   password: "DemoOnly!2026" },
};
const DEMO_SCHOOL_SLUG = "demo-school";

// Try to detect the demo role from either:
//   ?role=student&school=demo-school  (coming from portal page)
//   ?next=/demo-school/student/dashboard  (coming from middleware redirect)
function detectDemoRole(searchParams) {
  const school = searchParams.get("school");
  const role   = searchParams.get("role");

  // Direct portal flow
  if (school === DEMO_SCHOOL_SLUG && role && DEMO_CREDS[role]) {
    return role;
  }

  // Middleware redirect flow: parse /demo-school/<role>/...
  const next = searchParams.get("next") || "";
  const match = next.match(/^\/demo-school\/(student|teacher|finance|admin)(\/|$)/);
  if (match) return match[1];

  return null;
}

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail]           = useState("");
  const [schoolSlug, setSchoolSlug] = useState(process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_SLUG || "");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // Bot protection
  const [honeypot, setHoneypot] = useState("");
  const loadTimeRef = useRef(0);
  const isDemoRef   = useRef(false);

  // Swipe-to-login state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    loadTimeRef.current = Date.now();

    const demoRole = detectDemoRole(searchParams);
    if (demoRole) {
      isDemoRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchoolSlug(DEMO_SCHOOL_SLUG);
      setEmail(DEMO_CREDS[demoRole].email);
      setPassword(DEMO_CREDS[demoRole].password);
    }
  }, [searchParams]);

  const submitLogin = async ({ slug, loginEmail, loginPassword, loginRemember }) => {
    setError("");

    // Bot detection: honeypot
    if (honeypot) {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1800));
      setLoading(false);
      return;
    }
    // Timing guard - skip for auto-filled demo sessions
    if (!isDemoRef.current && Date.now() - loadTimeRef.current < 1500) {
      setError("Please try again.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

      // Fetch CSRF token
      let csrfToken = "";
      try {
        const csrfRes = await fetch(`${baseUrl}/v1/csrf-token`, { credentials: "include" });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          csrfToken = csrfData.csrfToken ?? "";
        }
      } catch {
        // CSRF endpoint unreachable
      }

      // Submit credentials
      const response = await fetch(`${baseUrl}/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({
          schoolSlug: slug.trim(),
          login: loginEmail,
          password: loginPassword,
          remember: loginRemember,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
          throw new Error("Invalid school code, email, or password.");
        } else if (response.status === 429) {
          throw new Error("Too many attempts. Please wait a minute and try again.");
        } else {
          throw new Error("Unable to sign in. Please try again.");
        }
      }

      // Success - clear loading state BEFORE navigation
      setLoading(false);
      const role = payload.data.roles.includes("admin")   ? "admin"
        : payload.data.roles.includes("finance") ? "finance"
        : payload.data.roles.includes("teacher") ? "teacher"
        : "student";

      // If there is a ?next= redirect param, honour it; otherwise go to the role dashboard
      const next = searchParams.get("next");
      if (next && next.startsWith("/")) {
        router.push(next);
      } else {
        router.push(`/${payload.data.schoolSlug}/${role}/dashboard`);
      }
    } catch (requestError) {
      setLoading(false);
      setError(requestError.message || "Unable to sign in. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    await submitLogin({ slug: schoolSlug, loginEmail: email, loginPassword: password, loginRemember: remember });
  };

  const handlePointerDown = (e) => {
    if (loading) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || loading) return;
    const delta = e.clientX - startXRef.current;
    if (delta > 0) {
      setDragX(Math.min(delta, 152));
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging || loading) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
    
    if (dragX > 100) {
      setDragX(152);
      submitLogin({ slug: schoolSlug, loginEmail: email, loginPassword: password, loginRemember: remember });
    } else {
      setDragX(0);
    }
  };

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
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-md bg-[#2A2A2B] text-white flex items-center justify-center font-bold text-lg leading-none">
                  e
                </div>
                <h1 className="text-3xl font-bold text-[#2A2A2B] tracking-tight">edusphare</h1>
              </div>
              <p className="text-sm text-gray-500 font-medium">Access your account</p>
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
                disabled={loading}
                className="w-[200px] mx-auto h-12 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-medium transition-all shadow-md mt-10 relative group overflow-hidden touch-none"
              >
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  style={{
                    left: loading ? "160px" : `calc(8px + ${dragX}px)`,
                    touchAction: "none"
                  }}
                  className={`absolute top-2 z-10 w-8 h-8 rounded-full bg-[#4ADE80] flex items-center justify-center text-white cursor-grab active:cursor-grabbing ${
                    !isDragging && !loading ? "transition-all duration-300 ease-out" : ""
                  } ${loading ? "transition-all duration-700 ease-in-out" : ""}`}
                >
                  {loading ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
                <span className="absolute w-full text-center uppercase tracking-wider text-sm font-bold z-0 pointer-events-none">
                  {loading ? "Signing in..." : "Login"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}