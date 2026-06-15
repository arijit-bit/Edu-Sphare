const fs = require('fs');

const file = 'e:/Project/1.Working/Edu-Sphare/frontend/app/[schoolSlug]/student/dashboard/page.js';
let content = fs.readFileSync(file, 'utf-8');

const target1 = `const quickActions = [
  { label: "View Results", icon: FileText, href: \`/\\${schoolSlug}/student/results\`, variant: "default" },
  { label: "Download Timetable", icon: Download, href: \`/\\${schoolSlug}/student/timetable\`, variant: "outline" },
  { label: "Submit Feedback", icon: MessageSquare, href: \`/\\${schoolSlug}/student/feedback\`, variant: "outline" },
  { label: "Check Performance", icon: BarChart2, href: \`/\\${schoolSlug}/student/performance\`, variant: "outline" },
  { label: "Pay Fees", icon: CreditCard, href: \`/\\${schoolSlug}/student/settings\`, variant: "outline" },
  { label: "Contact Teacher", icon: Phone, href: "#", variant: "outline" },
];`;

const replacement1 = `const getQuickActions = (schoolSlug) => [
  { label: "View Results", icon: FileText, href: \`/\\${schoolSlug}/student/results\`, variant: "default" },
  { label: "Download Timetable", icon: Download, href: \`/\\${schoolSlug}/student/timetable\`, variant: "outline" },
  { label: "Submit Feedback", icon: MessageSquare, href: \`/\\${schoolSlug}/student/feedback\`, variant: "outline" },
  { label: "Check Performance", icon: BarChart2, href: \`/\\${schoolSlug}/student/performance\`, variant: "outline" },
  { label: "Pay Fees", icon: CreditCard, href: \`/\\${schoolSlug}/student/settings\`, variant: "outline" },
  { label: "Contact Teacher", icon: Phone, href: "#", variant: "outline" },
];`;

const target2 = `{quickActions.map((action) => {`;
const replacement2 = `{getQuickActions(schoolSlug).map((action) => {`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed student dashboard ReferenceError!');
