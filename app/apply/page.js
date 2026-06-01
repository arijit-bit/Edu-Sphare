"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  School,
  MapPin,
  Mail,
  Phone,
  Users,
  Hash,
  FileText,
  CheckCircle,
  Calendar,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    schoolName: "",
    location: "",
    pincode: "",
    email: "",
    phone: "",
    facultyCount: "",
    studentCount: "",
    details: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.schoolName.trim()) tempErrors.schoolName = "School Name is required";
    if (!formData.location.trim()) tempErrors.location = "Location is required";
    
    // Pincode validation: 6 digits for India or general 5-10 digit zip
    if (!formData.pincode.trim()) {
      tempErrors.pincode = "Pincode is required";
    } else if (!/^\d{5,10}$/.test(formData.pincode.replace(/\s/g, ""))) {
      tempErrors.pincode = "Please enter a valid pincode (5-10 digits)";
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[+]?[0-9]{8,15}$/.test(formData.phone.replace(/[\s-()]/g, ""))) {
      tempErrors.phone = "Please enter a valid phone number (8-15 digits)";
    }

    // Faculty count validation
    if (!formData.facultyCount.trim()) {
      tempErrors.facultyCount = "Faculty count is required";
    } else if (isNaN(formData.facultyCount) || parseInt(formData.facultyCount) <= 0) {
      tempErrors.facultyCount = "Must be a positive number";
    }

    // Student count validation
    if (!formData.studentCount.trim()) {
      tempErrors.studentCount = "Approx. student count is required";
    } else if (isNaN(formData.studentCount) || parseInt(formData.studentCount) <= 0) {
      tempErrors.studentCount = "Must be a positive number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Dynamic Background Mesh / Blurs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] size-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] size-[500px] rounded-full bg-teal-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Edu Sphare</span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="gap-1.5 hover:-translate-x-0.5 transition-transform">
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:px-6">
        <div className="w-full max-w-5xl">
          
          {!isSubmitted ? (
            <div className="grid gap-8 lg:grid-cols-12 items-stretch animate-slide-up">
              
              {/* Left Column: Interactive Promo & Features */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-muted/40 border p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-teal-500/[0.02] pointer-events-none" />
                
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20">
                    <Sparkles className="size-3 text-teal-600 dark:text-teal-400" />
                    School Digitalization Program
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      Take your school to the{" "}
                      <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                        Next Level
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Join hundreds of forward-thinking educational institutions that use Edu Sphare to streamline administration, empower teachers, and engage students.
                    </p>
                  </div>

                  <div className="divider" />

                  {/* Highlights List */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 shrink-0">
                        <CheckCircle className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Centralized Dashboards</h4>
                        <p className="text-xs text-muted-foreground">Portals customized for admins, teachers, students, and parents.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 shrink-0">
                        <CheckCircle className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Finance & Fees</h4>
                        <p className="text-xs text-muted-foreground">Automated invoicing, online payments, and comprehensive reports.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 shrink-0">
                        <CheckCircle className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Live Classroom Integration</h4>
                        <p className="text-xs text-muted-foreground">Manage timetables, homeworks, exams and feedback on a single interface.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold">Secure & Reliable</h5>
                    <p className="text-[10px] text-muted-foreground">Full data protection compliance and continuous daily backups.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Application Form */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight">Apply to Digitalize Your School</h3>
                    <p className="text-sm text-muted-foreground mt-1">Please provide accurate information about your school.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* School Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="schoolName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">School Name</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          id="schoolName"
                          name="schoolName"
                          placeholder="e.g. Greenwood International High School"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          className="pl-9 h-10"
                          aria-invalid={!!errors.schoolName}
                        />
                      </div>
                      {errors.schoolName && <p className="text-xs text-destructive">{errors.schoolName}</p>}
                    </div>

                    {/* Location and Pincode */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            placeholder="e.g. Bangalore, Karnataka"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.location}
                          />
                        </div>
                        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="pincode" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pincode</Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="pincode"
                            name="pincode"
                            placeholder="e.g. 560001"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.pincode}
                          />
                        </div>
                        {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Official Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g. contact@school.edu"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.email}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="e.g. +91 9876543210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.phone}
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Faculty and Students counts */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="facultyCount" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Faculty Count</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="facultyCount"
                            name="facultyCount"
                            type="number"
                            placeholder="e.g. 50"
                            value={formData.facultyCount}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.facultyCount}
                          />
                        </div>
                        {errors.facultyCount && <p className="text-xs text-destructive">{errors.facultyCount}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="studentCount" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Students Approx.</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            id="studentCount"
                            name="studentCount"
                            type="number"
                            placeholder="e.g. 800"
                            value={formData.studentCount}
                            onChange={handleInputChange}
                            className="pl-9 h-10"
                            aria-invalid={!!errors.studentCount}
                          />
                        </div>
                        {errors.studentCount && <p className="text-xs text-destructive">{errors.studentCount}</p>}
                      </div>
                    </div>

                    {/* Essential Details (Textarea) */}
                    <div className="space-y-1.5">
                      <Label htmlFor="details" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Essential Details & Requirements</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 size-4 text-muted-foreground" />
                        <Textarea
                          id="details"
                          name="details"
                          rows={3}
                          placeholder="Tell us about special requirements, board affiliations, current software, or goals..."
                          value={formData.details}
                          onChange={handleInputChange}
                          className="pl-9 min-h-24 resize-y"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full text-sm font-semibold h-11" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Application...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          Submit Application <ArrowRight className="size-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* Success Status Screen: "What Next" Timeline */
            <div className="max-w-2xl mx-auto rounded-2xl border bg-card text-card-foreground shadow-lg p-8 animate-scale-in text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-primary to-indigo-600" />
              
              <div className="mb-8 flex flex-col items-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-pulse-soft">
                  <CheckCircle className="size-10 stroke-[1.5]" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Application Submitted</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Thank you for applying! We are excited to partner with you to digitalize your educational ecosystem.
                </p>
              </div>

              <div className="divider my-6" />

              {/* What Next Section */}
              <div className="text-left space-y-6">
                <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-teal-500" />
                  What happens next?
                </h3>

                {/* Timeline Component */}
                <div className="relative pl-6 border-l-2 border-muted-foreground/20 space-y-8 ml-3">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    {/* Circle badge */}
                    <div className="absolute -left-[35px] top-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold ring-4 ring-background">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Clock className="size-4 text-teal-600 dark:text-teal-400" />
                        Executive Contact
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Our executive will reach out to you within <span className="font-semibold text-foreground">7 working days</span> to verify details and understand your setup.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    {/* Circle badge */}
                    <div className="absolute -left-[35px] top-0 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold ring-4 ring-background">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Calendar className="size-4 text-teal-600 dark:text-teal-400" />
                        Detailed Online Meeting
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        After confirmation, a detailed online meeting will be hosted with your administration to customize and demonstrate your setup.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    {/* Circle badge */}
                    <div className="absolute -left-[35px] top-0 flex size-6 items-center justify-center rounded-full bg-teal-500 text-white text-xs font-bold ring-4 ring-background">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-teal-600 dark:text-teal-400">
                        <Zap className="size-4 text-teal-600 dark:text-teal-400 fill-teal-600/10" />
                        Go Online & Launch
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        After a little advance payment, <span className="font-semibold text-foreground">your whole system moves completely online</span> with onboarding and staff training.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button size="lg" asChild className="w-full sm:w-auto font-semibold">
                  <Link href="/">
                    Return to Homepage
                  </Link>
                </Button>
                <div className="text-xs text-muted-foreground">
                  Need urgent help? <a href="mailto:support@edusphare.com" className="text-primary hover:underline font-medium">support@edusphare.com</a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Edu Sphare. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Help Center"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
