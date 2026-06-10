import { redirect } from "next/navigation";

export default async function StudentHomeRedirect({ params }) {
  const { schoolSlug } = await params;
  redirect(`/${schoolSlug}/student/dashboard`);
}
