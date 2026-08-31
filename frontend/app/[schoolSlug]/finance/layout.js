"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";

export default function FinanceLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="finance_manager" portalName="finance">
      {children}
    </ProtectedRoute>
  );
}
