/**
 * Student section layout — wraps every /[schoolSlug]/student/* page in StudentShell.
 * The shell itself reads schoolSlug via useParams(), so no prop drilling needed.
 */
import { StudentShell } from "@/components/shells/student-ui";

export default function StudentLayout({ children }) {
  return <StudentShell>{children}</StudentShell>;
}

