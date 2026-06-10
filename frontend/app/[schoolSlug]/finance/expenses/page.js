import { redirect } from "next/navigation";

export default function FinanceExpensesRedirect() {
  redirect("/finance/summary/expenses");
}
