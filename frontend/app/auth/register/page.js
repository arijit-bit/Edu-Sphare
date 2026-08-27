"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/student/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#2A2A2B] flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="w-full max-w-[1000px] h-[650px] bg-white rounded-[32px] overflow-hidden flex shadow-2xl relative">
        
        {/* Left Side (Blue Background with Curve) */}
        <div className="relative w-[45%] h-full bg-[#0066FF] hidden md:flex flex-col items-center justify-center p-8 z-10 text-white">
          {/* Custom SVG Curve for the right edge */}
          <svg 
            className="absolute top-0 right-0 h-full w-[120px] translate-x-[99%] text-[#0066FF]" 
            preserveAspectRatio="none" 
            viewBox="0 0 100 100" 
            fill="currentColor"
          >
            <path d="M0,0 C80,0 120,40 50,70 C10,85 40,100 0,100 Z" />
          </svg>

          {/* User's illustration will go here */}
          <div className="relative z-20 w-full max-w-[250px] aspect-square flex items-center justify-center">
             {/* You can replace this img with the actual SVG you attached for registration */}
             <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                <span className="text-white/80 text-sm text-center px-4 font-medium">Your Register SVG Illustration<br/>(Replace with your attached file)</span>
             </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-[55%] h-full flex flex-col items-center justify-center px-8 md:px-16 lg:px-20 bg-white relative z-20 overflow-y-auto">
          
          <div className="w-full max-w-[340px] flex flex-col items-center py-8">
            {/* Logo area */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-md bg-[#2A2A2B] text-white flex items-center justify-center font-bold text-lg leading-none">
                  e
                </div>
                <h1 className="text-3xl font-bold text-[#2A2A2B] tracking-tight">edusphare</h1>
              </div>
              <p className="text-sm text-gray-500 font-medium">Create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Full Name Input */}
              <div className="space-y-1 relative group">
                <div className="flex items-center border-b border-gray-300 group-focus-within:border-[#0066FF] transition-colors pb-2">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1 relative group">
                <div className="flex items-center border-b border-gray-300 group-focus-within:border-[#0066FF] transition-colors pb-2">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1 relative group">
                <div className="flex items-center border-b border-gray-300 group-focus-within:border-[#0066FF] transition-colors pb-2">
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

              {/* Confirm Password Input */}
              <div className="space-y-1 relative group">
                <div className="flex items-center border-b border-gray-300 group-focus-within:border-[#0066FF] transition-colors pb-2">
                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mt-4 pt-2">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-[#0066FF] transition-colors mt-0.5 flex-shrink-0">
                    <div className="w-2.5 h-2.5 bg-transparent rounded-sm group-has-[:checked]:bg-[#0066FF]" />
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    required
                  />
                  <span className="text-xs text-gray-500 font-medium leading-relaxed">
                    I agree to the <a href="#" className="text-[#0066FF] hover:underline">Terms</a> and <a href="#" className="text-[#0066FF] hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-[220px] mx-auto h-12 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-medium transition-all shadow-md mt-8 relative group"
              >
                {/* Green Arrow Icon styling like in the mock */}
                <div className="absolute left-2 w-8 h-8 rounded-full bg-[#4ADE80] flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <span className="ml-6 uppercase tracking-wider text-sm font-bold">
                  {loading ? "Creating..." : "Register"}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center pb-4">
              <Link href="/auth/login" className="text-xs text-gray-400 font-medium hover:text-[#0066FF] transition-colors">
                Already have an account? <span className="text-gray-700 font-bold hover:underline">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
