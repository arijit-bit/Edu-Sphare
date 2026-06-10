const fs = require('fs');
const cp = require('child_process');

const content = cp.execSync('git show 34e5bbb33c0d92031743491c8071bb3d437535db:app/admin/dashboard/page.js', { encoding: 'utf-8' });

let updated = content.replace(
  'import { usePathname } from "next/navigation";',
  'import { usePathname, useParams } from "next/navigation";'
);

updated = updated.replace(
  'export default function AdminDashboard() {\n  const pathname = usePathname() || "";',
  'export default function AdminDashboard() {\n  const { schoolSlug = "dummy-school" } = useParams() || {};\n  const pathname = usePathname() || "";'
);

updated = updated.replace(
  /const navItems = \[\s*\{ label: "Dashboard"[\s\S]*?\];/,
  `const getNavItems = (schoolSlug) => [
  { label: "Dashboard",    href: \`/\${schoolSlug}/admin/dashboard\`,  icon: LayoutDashboard },
  { label: "Students",     href: "#",                 icon: GraduationCap   },
  { label: "Teachers",     href: "#",                 icon: Users           },
  { label: "Finance",      href: \`/\${schoolSlug}/finance/dashboard\`,icon: CreditCard      },
  { label: "Analytics",    href: "#",                 icon: BarChart3       },
  { label: "Settings",     href: "#",                 icon: Settings        },
];`
);

updated = updated.replace(
  '{navItems.map((item) => {',
  '{getNavItems(schoolSlug).map((item) => {'
);

updated = updated.replace(
  /href: "\/student\/dashboard"/g,
  'href: `/${schoolSlug}/student/dashboard`'
);
updated = updated.replace(
  /href: "\/finance\/dashboard"/g,
  'href: `/${schoolSlug}/finance/dashboard`'
);
updated = updated.replace(
  /href: "\/teacher\/dashboard"/g,
  'href: `/${schoolSlug}/teacher/dashboard`'
);

fs.writeFileSync('e:/Project/1.Working/Edu-Sphare/frontend/app/[schoolSlug]/admin/dashboard/page.js', updated, 'utf-8');
console.log('Restored and patched admin dashboard successfully!');
