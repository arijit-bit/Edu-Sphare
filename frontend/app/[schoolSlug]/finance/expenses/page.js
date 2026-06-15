import { redirect } from "next/navigation";

export default async function FinanceExpensesRedirect({ params }) {
  const { schoolSlug } = await params;
  redirect(`/${schoolSlug}/finance/summary/expenses`);
}
