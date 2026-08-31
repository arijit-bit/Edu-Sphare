"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin" portalName="admin">
      {children}
    </ProtectedRoute>
  );
}
