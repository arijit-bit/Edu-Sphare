import { redirect } from "next/navigation";

export default async function StudentIndexPage({ params }) {
  const { schoolSlug } = await params;
  redirect(`/${schoolSlug}/student/dashboard`);
}
