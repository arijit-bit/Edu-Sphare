import { redirect } from "next/navigation";

export default async function FinanceIndexPage({ params }) {
  const { schoolSlug } = await params;
  redirect(`/${schoolSlug}/finance/dashboard`);
}
