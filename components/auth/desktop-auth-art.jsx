import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const featurePills = [
  { label: "Learning", Icon: BookOpen, tone: "from-sky-400/30 to-blue-500/10" },
  { label: "Teaching", Icon: Lightbulb, tone: "from-violet-400/30 to-fuchsia-500/10" },
  { label: "Finance", Icon: TrendingUp, tone: "from-emerald-400/30 to-teal-500/10" },
  { label: "Students", Icon: Users, tone: "from-orange-400/30 to-amber-500/10" },
];

const metricCards = [
  { value: "24/7", label: "Secure access" },
  { value: "4", label: "Core modules" },
  { value: "1", label: "Unified ecosystem" },
];

export function DesktopAuthArt() {
  return (
    <div className="relative hidden w-1/2 shrink-0 overflow-y-auto border-r border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.12),_transparent_30%),linear-gradient(145deg,_#0b1530_0%,_#182a64_46%,_#4d2f8e_100%)] text-white lg:flex lg:h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:38px_38px] opacity-[0.14]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-4rem] right-[-3rem] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_30%_35%,_rgba(255,255,255,0.16),_transparent_26%),radial-gradient(circle_at_72%_65%,_rgba(74,222,128,0.18),_transparent_20%)]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
        <div className="flex items-start justify-between gap-8">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300/30 via-white/16 to-emerald-300/25 shadow-[0_10px_30px_rgba(15,23,42,0.22)]">
              <svg viewBox="0 0 44 44" className="h-6 w-6 text-white" aria-hidden="true">
                <path
                  d="M10 28.5V14.5c0-1.1.9-2 2-2h8.5c4.7 0 7.5 2.4 7.5 6.1 0 4.1-3 6.4-7.8 6.4H15v3.5c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2Z"
                  fill="currentColor"
                  opacity="0.95"
                />
                <path
                  d="M15 21.6h5.1c2.3 0 3.8-1 3.8-2.9 0-1.8-1.4-2.8-3.8-2.8H15v5.7Z"
                  fill="#4ade80"
                />
                <path
                  d="M26.5 28c1.8-3.2 4.8-5.4 8.9-6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="35.5" cy="21.5" r="2.6" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/55">School Platform</p>
              <p className="text-lg font-semibold">Edu Sphare</p>
            </div>
          </div>

          <div className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur-md">
            Secure school operating system
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[1.05fr_0.95fr] items-center gap-10 py-10">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/65">
              Student • Teacher • Finance • Learning
            </p>
            <h1 className="max-w-lg text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white">
              Empowering the Future of Learning.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/74">
              All your school management, learning, and finances in one secure ecosystem.
            </p>

            <div className="mt-8 grid gap-3">
              {featurePills.map(({ label, Icon, tone }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-2xl border border-white/12 bg-gradient-to-r ${tone} px-4 py-3 backdrop-blur-xl`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-slate-950/20">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-white/62">
                      {label === "Learning" && "Digital books, coding, and academic progress."}
                      {label === "Teaching" && "Mentorship, analytics, and presentation tools."}
                      {label === "Finance" && "Protected operations, performance, and compliance."}
                      {label === "Students" && "Connected journeys, milestones, and collaboration."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-10 inset-y-12 rounded-[2.5rem] border border-white/10 bg-white/8 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl" />
            <div className="relative h-[33rem] w-full max-w-[31rem]">
              <div className="absolute left-8 top-8 rounded-[2rem] border border-white/12 bg-slate-950/18 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-100">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Learning Hub</p>
                    <p className="text-xs text-white/58">Live lessons and code labs</p>
                  </div>
                </div>
                <svg viewBox="0 0 220 110" className="h-24 w-56 text-blue-100/80" aria-hidden="true">
                  <rect x="8" y="12" width="204" height="86" rx="22" fill="rgba(255,255,255,0.08)" />
                  <path d="M38 73 L68 47 L94 60 L130 32 L178 58" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="38" cy="73" r="5" fill="#22d3ee" />
                  <circle cx="68" cy="47" r="5" fill="#60a5fa" />
                  <circle cx="94" cy="60" r="5" fill="#34d399" />
                  <circle cx="130" cy="32" r="5" fill="#c084fc" />
                  <circle cx="178" cy="58" r="5" fill="#f59e0b" />
                  <rect x="28" y="26" width="46" height="8" rx="4" fill="rgba(255,255,255,0.36)" />
                  <rect x="82" y="26" width="62" height="8" rx="4" fill="rgba(255,255,255,0.16)" />
                </svg>
              </div>

              <div className="absolute right-6 top-24 flex w-48 flex-col gap-3 rounded-[1.75rem] border border-white/12 bg-white/10 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-100">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-100">
                    Mentor mode
                  </span>
                </div>
                <p className="text-sm font-semibold">Teaching Studio</p>
                <p className="text-xs leading-5 text-white/62">
                  Lesson plans, dashboards, and guided progress in one flow.
                </p>
              </div>

              <div className="absolute bottom-16 left-10 w-44 rounded-[1.75rem] border border-white/12 bg-white/10 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-100">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Finance Guard</p>
                    <p className="text-[11px] text-white/58">Protected operations</p>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="h-10 w-3 rounded-full bg-emerald-300/35" />
                  <div className="h-14 w-3 rounded-full bg-emerald-300/45" />
                  <div className="h-8 w-3 rounded-full bg-orange-300/35" />
                  <div className="h-16 w-3 rounded-full bg-emerald-300/60" />
                  <div className="h-12 w-3 rounded-full bg-violet-300/45" />
                </div>
              </div>

              <div className="absolute bottom-8 right-10 w-52 rounded-[1.75rem] border border-white/12 bg-white/10 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-100">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Student Milestones</p>
                    <p className="text-[11px] text-white/58">Growth and collaboration</p>
                  </div>
                </div>
                <svg viewBox="0 0 180 72" className="h-16 w-full text-white/75" aria-hidden="true">
                  <path d="M18 56 C42 24, 70 24, 92 48 S138 72, 162 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="50" r="8" fill="rgba(255,255,255,0.22)" />
                  <circle cx="92" cy="48" r="8" fill="rgba(255,255,255,0.18)" />
                  <circle cx="150" cy="26" r="8" fill="rgba(74,222,128,0.75)" />
                </svg>
              </div>

              <svg
                viewBox="0 0 500 500"
                className="absolute inset-0 h-full w-full text-white/28"
                aria-hidden="true"
              >
                <path d="M126 165 C180 118, 242 112, 310 150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 10" />
                <path d="M196 266 C256 212, 324 202, 374 240" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 10" />
                <path d="M136 360 C212 316, 290 316, 354 342" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {metricCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-xl"
            >
              <p className="text-2xl font-black tracking-[-0.03em]">{item.value}</p>
              <p className="mt-1 text-sm text-white/62">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
