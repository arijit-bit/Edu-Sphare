"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Lock, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [schoolSlug, setSchoolSlug] = useState(process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_SLUG || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Bot protection ────────────────────────────────────────────────────────
  // Honeypot field: hidden from humans via CSS (not display:none — bots detect that).
  // Bots fill it in; humans never see it and leave it blank.
  const [honeypot, setHoneypot] = useState("");
  // Track page-load time to reject submissions that happen unrealistically fast
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    setLoadTime(Date.now());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Bot detection ─────────────────────────────────────────────────────
    // 1. Honeypot: if the hidden field has any value, it's a bot
    if (honeypot) {
      // Silently fake a successful delay so bots think they won — never hit backend
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1800));
      setLoading(false);
      return;
    }
    // 2. Timing: humans take >1.5s to fill a form; bots submit instantly
    if (Date.now() - loadTime < 1500) {
      setError("Please try again.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

      // ① Fetch a CSRF token from the backend before submitting credentials.
      //    This implements the Double-Submit Cookie pattern.
      let csrfToken = "";
      try {
        const csrfRes = await fetch(`${baseUrl}/v1/csrf-token`, { credentials: "include" });
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          csrfToken = csrfData.csrfToken ?? "";
        }
      } catch {
        // If CSRF endpoint is unreachable (e.g. dev without backend), proceed anyway.
        // The backend will reject mutating requests without a valid token in production.
      }

      // ② Submit login credentials
      const response = await fetch(`${baseUrl}/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({ schoolSlug: schoolSlug.trim(), login: email, password, remember }),
      });

      const payload = await response.json();

      // ③ Map status codes to safe, user-facing messages — never expose internals
      if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
          throw new Error("Invalid school code, email, or password.");
        } else if (response.status === 429) {
          throw new Error("Too many attempts. Please wait a minute and try again.");
        } else {
          throw new Error("Unable to sign in. Please try again.");
        }
      }

      // ④ Successful login — route by primary role
      const role = payload.data.roles.includes("admin") ? "admin"
        : payload.data.roles.includes("finance") ? "finance"
        : payload.data.roles.includes("teacher") ? "teacher" : "student";

      router.push(`/${payload.data.schoolSlug}/${role}/dashboard`);
    } catch (requestError) {
      setLoading(false);
      setError(requestError.message || "Unable to sign in. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-[#2A2A2B] flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-[1000px] h-[600px] bg-white rounded-[32px] overflow-hidden flex shadow-2xl relative">
        
        {/* Left Side (Illustration) */}
        <div className="relative w-[45%] h-full bg-white hidden md:flex flex-col items-center justify-center p-8 z-10">
        <div className="blue-circle absolute rounded-full bg-blue-600 w-[600px] h-[900px] right-20 bottom-70 "></div>
        <div className="blue-circle absolute rounded-full bg-blue-600 w-[600px] h-[900px] right-30 top-70 "></div>
        <div className="blue-circle absolute rounded-full bg-white w-[600px] h-[900px] left-30 top-70 "></div>
          {/* User's illustration will go here */}
          <div className="relative z-20 w-full max-w-[320px] flex items-center justify-center">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/20944363.svg" alt="Login Illustration" className="w-full h-auto drop-shadow-2xl" />
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-[55%] h-full flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 bg-white relative z-20">
          
          <div className="w-full max-w-[320px] flex flex-col items-center">
            {/* Logo area */}
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
              {/*
                Bot protection — honeypot field.
                Visually hidden off-screen (NOT display:none — bots skip those).
                Legitimate users never see or fill this. Bots auto-fill it → blocked.
                The tabIndex=-1 and autoComplete=off further discourage accidental fills.
              */}
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
              {/* Error Message Display */}
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
                  {error}
                </div>
              )}

              {/* Email or ID Input */}
              <div className="space-y-1 relative group">
                <div className={`flex items-center border-b ${error ? 'border-red-300' : 'border-gray-300'} group-focus-within:border-[#0066FF] transition-colors pb-2`}>
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="schoolSlug"
                    type="text"
                    placeholder="School code (for example, greenwood-high)"
                    value={schoolSlug}
                    onChange={(e) => setSchoolSlug(e.target.value.toLowerCase())}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <div className={`flex items-center border-b ${error ? 'border-red-300' : 'border-gray-300'} group-focus-within:border-[#0066FF] transition-colors pb-2`}>
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="loginId"
                    type="text"
                    placeholder="Email or ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1 relative group mt-6">
                <div className={`flex items-center border-b ${error ? 'border-red-300' : 'border-gray-300'} group-focus-within:border-[#0066FF] transition-colors pb-2`}>
                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? 'bg-[#0066FF] border-[#0066FF]' : 'border-gray-300 group-hover:border-[#0066FF]'}`}>
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
                className="w-[200px] mx-auto h-12 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-medium transition-all shadow-md mt-10 relative group overflow-hidden"
              >
                {/* Green Arrow Icon styling like in the mock */}
                {/* Using ease-in-out for slow-fast-slow animation, increased duration to 700ms for smoothness */}
                <div 
                  className={`absolute top-2 z-10 w-8 h-8 rounded-full bg-[#4ADE80] flex items-center justify-center text-white transition-all duration-700 ease-in-out ${
                    loading ? "left-[160px]" : "left-2"
                  }`}
                >
                  {loading ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
                <span 
                  className="absolute w-full text-center uppercase tracking-wider text-sm font-bold z-0"
                >
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
