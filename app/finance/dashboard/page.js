const navItems = [
  ["Dashboard Overview", "M3 12h7V3H3v9Zm0 9h7v-7H3v7Zm11 0h7v-9h-7v9Zm0-18v7h7V3h-7Z"],
  ["Student Monthly Payments", "M4 5h16M4 10h16M4 15h10M4 20h7"],
  ["Teacher Payment Details", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"],
  ["Total Earnings", "M4 19V5m0 14h16M8 16l3-4 3 2 5-7"],
  ["Total Expenses", "M5 6h14M7 6v14h10V6M9 6V4h6v2"],
  ["Reports", "M5 4h14v16H5V4Zm4 4h6M9 12h6M9 16h3"],
  ["Settings", "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v3m0 12v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M3 12h3m12 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"],
];

const stats = [
  ["Total Students", "1,842", "+7.8%", "bg-blue-50 text-blue-700", "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"],
  ["Total Teachers", "126", "+3.1%", "bg-violet-50 text-violet-700", "M12 14l9-5-9-5-9 5 9 5Zm0 0 6.16-3.42A12.08 12.08 0 0 1 19 15.5C19 18 15.87 20 12 20s-7-2-7-4.5c0-1.5.3-3.22.84-4.92L12 14Z"],
  ["Monthly Fees Collected", "Rs 48.6L", "+12.4%", "bg-emerald-50 text-emerald-700", "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"],
  ["Pending Student Fees", "Rs 7.8L", "-4.6%", "bg-amber-50 text-amber-700", "M12 9v4l3 2M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"],
  ["Teacher Salary Paid", "Rs 31.2L", "+5.3%", "bg-sky-50 text-sky-700", "M3 7h18M6 7V5h12v2M6 7v12h12V7M9 11h6M9 15h6"],
  ["Total Earnings", "Rs 72.4L", "+16.8%", "bg-green-50 text-green-700", "M4 18 9 9l4 4 7-10"],
  ["Total Expenses", "Rs 46.9L", "+6.2%", "bg-rose-50 text-rose-700", "M4 6h16M7 6l1 14h8l1-14M10 11v5m4-5v5"],
  ["Net Balance", "Rs 25.5L", "+22.1%", "bg-purple-50 text-purple-700", "M4 12h16M12 4v16M6 6l12 12M18 6 6 18"],
];

const studentPayments = [
  ["Aarav Sharma", "ADM-2401", "10 A", "May", "Rs 12,000", "Rs 12,000", "Rs 0", "Paid", "20 May 2026"],
  ["Diya Patel", "ADM-2417", "8 B", "May", "Rs 10,500", "Rs 6,000", "Rs 4,500", "Partial", "18 May 2026"],
  ["Kabir Verma", "ADM-2328", "12 C", "May", "Rs 15,000", "Rs 0", "Rs 15,000", "Overdue", "Due 10 May"],
  ["Ira Khan", "ADM-2506", "6 A", "May", "Rs 8,800", "Rs 8,800", "Rs 0", "Paid", "16 May 2026"],
  ["Neil Dutta", "ADM-2384", "9 B", "May", "Rs 11,400", "Rs 0", "Rs 11,400", "Pending", "Due 31 May"],
];

const teacherPayments = [
  ["Meera Iyer", "EMP-1024", "Mathematics", "Rs 68,000", "Rs 2,500", "Rs 5,000", "Rs 70,500", "Paid", "25 May 2026"],
  ["Rahul Sen", "EMP-1031", "Science", "Rs 64,000", "Rs 1,800", "Rs 3,500", "Rs 65,700", "Paid", "25 May 2026"],
  ["Ananya Bose", "EMP-1048", "English", "Rs 58,000", "Rs 1,200", "Rs 2,000", "Rs 58,800", "Processing", "Scheduled"],
  ["Vikram Rao", "EMP-1062", "Sports", "Rs 45,000", "Rs 900", "Rs 1,500", "Rs 45,600", "Pending", "28 May 2026"],
];

const expenses = [
  ["Teacher Salary", "Payroll", "25 May 2026", "Rs 31.2L", "Paid"],
  ["Electricity", "Utilities", "21 May 2026", "Rs 1.48L", "Paid"],
  ["Transport", "Operations", "19 May 2026", "Rs 3.85L", "Approved"],
  ["Events", "Annual Day", "16 May 2026", "Rs 2.2L", "Pending"],
  ["Maintenance", "Campus", "12 May 2026", "Rs 1.15L", "Paid"],
];

const earningsBars = [
  ["Tuition Fees", 92, "bg-blue-500"],
  ["Transport", 48, "bg-emerald-500"],
  ["Hostel", 38, "bg-violet-500"],
  ["Activities", 30, "bg-cyan-500"],
  ["Exam Fees", 24, "bg-indigo-500"],
];

const expenseBars = [
  ["Teacher Salary", 82, "bg-violet-500"],
  ["Staff Salary", 46, "bg-blue-500"],
  ["Maintenance", 28, "bg-emerald-500"],
  ["Transport", 52, "bg-cyan-500"],
  ["Electricity", 24, "bg-amber-500"],
  ["Internet", 12, "bg-sky-500"],
  ["Events", 34, "bg-pink-500"],
  ["Stationery", 18, "bg-indigo-500"],
  ["Miscellaneous", 16, "bg-slate-500"],
];

function Icon({ path, className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function Filter({ label, value }) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
      <select className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
        <option>{value}</option>
      </select>
    </label>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Partial: "bg-blue-50 text-blue-700 ring-blue-200",
    Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
    Processing: "bg-violet-50 text-violet-700 ring-violet-200",
    Approved: "bg-sky-50 text-sky-700 ring-sky-200",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[status] || styles.Pending}`}>{status}</span>;
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ${className}`}>{children}</div>;
}

function LineChart() {
  return (
    <svg viewBox="0 0 620 260" className="h-72 w-full" role="img" aria-label="Earnings previous year versus current year line chart">
      <defs>
        <linearGradient id="earnFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 90, 140, 190, 240].map((y) => <line key={y} x1="40" x2="600" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="5 7" />)}
      <path d="M48 198 C95 184 105 166 150 170 C200 176 212 124 252 132 C310 144 320 92 368 102 C420 111 440 62 492 74 C540 82 560 48 596 52" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 176 C98 150 112 155 154 134 C198 112 216 116 260 92 C306 68 338 88 374 62 C420 34 448 50 496 30 C542 12 570 34 596 22" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 176 C98 150 112 155 154 134 C198 112 216 116 260 92 C306 68 338 88 374 62 C420 34 448 50 496 30 C542 12 570 34 596 22 L596 242 L48 242Z" fill="url(#earnFill)" />
      {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((month, index) => <text key={month} x={58 + index * 104} y="258" fill="#64748b" fontSize="12">{month}</text>)}
    </svg>
  );
}

function ExpenseChart() {
  const current = [48, 58, 43, 65, 54, 71, 60, 74, 62, 80, 68, 86];
  const previous = [42, 50, 38, 54, 46, 58, 52, 62, 56, 66, 60, 72];

  return (
    <div className="h-72">
      <div className="flex h-60 items-end justify-between gap-2 border-b border-slate-200 px-1">
        {current.map((value, index) => (
          <div key={index} className="flex h-full flex-1 items-end justify-center gap-1">
            <span className="w-full max-w-4 rounded-t-lg bg-slate-200" style={{ height: `${previous[index]}%` }} />
            <span className="w-full max-w-4 rounded-t-lg bg-violet-500" style={{ height: `${value}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2 text-center text-xs font-medium text-slate-400">
        {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((month) => <span key={month}>{month}</span>)}
      </div>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
      <div className="relative grid h-48 w-48 place-items-center rounded-full" style={{ background: "conic-gradient(#2563eb 0 58%, #10b981 58% 75%, #8b5cf6 75% 88%, #06b6d4 88% 100%)" }}>
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner">
          <span className="text-2xl font-black text-slate-950">92%</span>
          <span className="-mt-4 text-xs font-semibold text-slate-400">collected</span>
        </div>
      </div>
      <div className="grid gap-3 text-sm">
        {["Tuition Fees", "Transport", "Hostel", "Activities"].map((item, index) => (
          <div key={item} className="flex items-center gap-3 font-semibold text-slate-600">
            <span className={`h-3 w-3 rounded-full ${["bg-blue-600", "bg-emerald-500", "bg-violet-500", "bg-cyan-500"][index]}`} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="h-52 w-52 rounded-full shadow-inner" style={{ background: "conic-gradient(#8b5cf6 0 43%, #2563eb 43% 58%, #06b6d4 58% 72%, #10b981 72% 82%, #f59e0b 82% 91%, #64748b 91% 100%)" }} />
      <div className="grid w-full grid-cols-2 gap-2 text-xs font-bold text-slate-500">
        {["Teacher Salary", "Staff Salary", "Transport", "Maintenance", "Utilities", "Other"].map((item, index) => (
          <span key={item} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${["bg-violet-500", "bg-blue-600", "bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-slate-500"][index]}`} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="mb-9 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-200">ES</div>
            <div>
              <p className="text-lg font-black text-slate-950">Edu Sphare</p>
              <p className="text-xs font-semibold text-slate-400">Finance Manager</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map(([label, icon], index) => (
              <a key={label} href={`#${label.toLowerCase().replaceAll(" ", "-")}`} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${index === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}>
                <Icon path={icon} />
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-white shadow-xl">
            <p className="text-sm font-bold text-blue-200">Fee Collection Rate</p>
            <p className="mt-2 text-4xl font-black">92.4%</p>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <div className="h-2 w-[92%] rounded-full bg-emerald-400" />
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Account Manager Dashboard</p>
                <h1 className="text-3xl font-black text-slate-950 md:text-4xl">School finance command center</h1>
              </div>
              <div className="flex flex-1 items-center gap-3 xl:max-w-2xl">
                <div className="relative flex-1">
                  <Icon path="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Search students, invoices, reports..." />
                </div>
                <button className="relative grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                  <Icon path="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                  <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>
                <button className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">AK</span>
                  <span className="hidden text-left text-sm font-bold text-slate-700 sm:block">Admin Kumar</span>
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-4 py-6 md:px-8">
            <section id="dashboard-overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(([label, value, delta, style, icon]) => (
                <Card key={label} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{label}</p>
                      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
                    </div>
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl ${style}`}>
                      <Icon path={icon} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-emerald-600">{delta} this month</p>
                </Card>
              ))}
            </section>

            <section id="student-monthly-payments" className="space-y-5">
              <SectionHeader eyebrow="Student monthly payments" title="Fee payment records" action={<button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-200">Export Records</button>} />
              <Card>
                <div className="mb-5 grid gap-3 md:grid-cols-5">
                  <Filter label="Class" value="All Classes" />
                  <Filter label="Section" value="All Sections" />
                  <Filter label="Month" value="May 2026" />
                  <Filter label="Status" value="All Status" />
                  <Filter label="Academic Year" value="2025-2026" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                      <tr>{["Student Name", "Admission No", "Class", "Month", "Fee Amount", "Paid Amount", "Due Amount", "Status", "Payment Date", "Action"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentPayments.map((row) => (
                        <tr key={row[1]} className="hover:bg-slate-50/70">
                          {row.map((cell, index) => <td key={`${row[1]}-${index}`} className="px-4 py-4 font-semibold text-slate-600">{index === 7 ? <StatusBadge status={cell} /> : cell}</td>)}
                          <td className="px-4 py-4"><button className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            <section id="teacher-payment-details" className="space-y-5">
              <SectionHeader eyebrow="Teacher payment details" title="Salary disbursement" />
              <Card>
                <div className="mb-5 grid gap-3 md:grid-cols-3">
                  <Filter label="Department" value="All Departments" />
                  <Filter label="Month" value="May 2026" />
                  <Filter label="Payment Status" value="All Status" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                      <tr>{["Teacher Name", "Employee ID", "Department", "Basic Salary", "Deductions", "Bonus", "Net Salary", "Payment Status", "Payment Date", "Action"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teacherPayments.map((row) => (
                        <tr key={row[1]} className="hover:bg-slate-50/70">
                          {row.map((cell, index) => <td key={`${row[1]}-${index}`} className="px-4 py-4 font-semibold text-slate-600">{index === 7 ? <StatusBadge status={cell} /> : cell}</td>)}
                          <td className="px-4 py-4"><button className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-black text-violet-700">Payslip</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            <section id="total-earnings" className="space-y-5">
              <SectionHeader eyebrow="Total earnings received" title="Revenue analytics" action={<div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-700">Monthly growth +16.8%</div>} />
              <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-950">Previous year vs current year earnings</h3>
                    <div className="flex gap-4 text-xs font-bold text-slate-500"><span className="text-blue-600">Current</span><span>Previous</span></div>
                  </div>
                  <LineChart />
                </Card>
                <Card>
                  <h3 className="mb-5 text-lg font-black text-slate-950">Income sources</h3>
                  <DonutChart />
                </Card>
              </div>
              <Card>
                <h3 className="mb-5 text-lg font-black text-slate-950">Earnings by category</h3>
                <div className="space-y-4">
                  {earningsBars.map(([label, value, color]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-sm font-bold text-slate-600"><span>{label}</span><span>{value}%</span></div>
                      <div className="h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section id="total-expenses" className="space-y-5">
              <SectionHeader eyebrow="Total expenses" title="Expense analytics" />
              <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <Card>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-950">Previous year vs current year expenses</h3>
                    <div className="flex gap-4 text-xs font-bold text-slate-500"><span className="text-violet-600">Current</span><span>Previous</span></div>
                  </div>
                  <ExpenseChart />
                </Card>
                <Card>
                  <h3 className="mb-5 text-lg font-black text-slate-950">Expense distribution</h3>
                  <PieChart />
                </Card>
              </div>
              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <Card>
                  <h3 className="mb-5 text-lg font-black text-slate-950">Monthly expense trend</h3>
                  <div className="flex h-64 items-end gap-2 rounded-2xl bg-slate-50 p-4">
                    {[36, 44, 39, 58, 48, 64, 51, 72, 61, 76, 67, 82].map((value, index) => (
                      <div key={index} className="flex flex-1 items-end">
                        <div className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-emerald-400" style={{ height: `${value}%` }} />
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <h3 className="mb-5 text-lg font-black text-slate-950">Recent expense transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>{["Category", "Account", "Date", "Amount", "Status"].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {expenses.map((row) => (
                          <tr key={`${row[0]}-${row[2]}`}>
                            {row.map((cell, index) => <td key={`${row[0]}-${index}`} className="px-4 py-4 font-semibold text-slate-600">{index === 4 ? <StatusBadge status={cell} /> : cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
