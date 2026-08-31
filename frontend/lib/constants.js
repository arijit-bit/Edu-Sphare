/**
 * Centralized Portal and Role Constants & Helpers for EduSphere
 */

export const PORTAL_ROLES = {
  student: "student",
  teacher: "teacher",
  finance: "finance_manager",
  admin: "admin",
};

export const ROLE_PORTALS = {
  student: "student",
  teacher: "teacher",
  finance_manager: "finance",
  admin: "admin",
};

export const PORTAL_LABELS = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  finance: "Finance Portal",
  admin: "Admin Portal",
};

export const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  finance_manager: "Finance Manager",
  admin: "Administrator",
};

export const PORTAL_DASHBOARDS = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  finance: "/finance/dashboard",
  admin: "/admin/dashboard",
};

export const ALL_PORTALS = Object.keys(PORTAL_ROLES);

export function isValidPortal(portal) {
  return typeof portal === "string" && ALL_PORTALS.includes(portal.toLowerCase());
}

export function getRequiredRoleForPortal(portal) {
  if (!isValidPortal(portal)) return null;
  return PORTAL_ROLES[portal.toLowerCase()];
}

export function getDashboardForRole(role, schoolSlug = "demo-school") {
  const portal = ROLE_PORTALS[role] || "student";
  // Route to the role dashboard
  return `/${schoolSlug}/${portal}/dashboard`;
}

export function getPortalForRole(role) {
  return ROLE_PORTALS[role] || "student";
}
