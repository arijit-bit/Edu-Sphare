/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compiler options ──────────────────────────────────────────────────────
  // Remove console.log in production (never leak debug info to browser)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // ── Security headers ──────────────────────────────────────────────────────
  // NOTE: CSP and HSTS are set dynamically by middleware.js (nonce-based).
  // These headers apply to static assets served by Next.js directly.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          // Disable browser XSS auditor — CSP is the modern approach
          { key: "X-XSS-Protection", value: "0" },
          // Prevent cross-origin info leakage
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
      // Allow static assets to be loaded cross-origin (fonts, images, etc.)
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Fix common attendance URL typo
      {
        source: "/:schoolSlug/teacher/attendence",
        destination: "/:schoolSlug/teacher/attendance",
        permanent: true,
      },
      // Dev convenience: role shortcuts → school-scoped paths
      { source: "/student/:path*", destination: "/demo-school/student/:path*", permanent: false },
      { source: "/teacher/:path*", destination: "/demo-school/teacher/:path*", permanent: false },
      { source: "/finance/:path*", destination: "/demo-school/finance/:path*", permanent: false },
      { source: "/admin/:path*", destination: "/demo-school/admin/:path*", permanent: false },
      // Role root → dashboard
      { source: "/:schoolSlug/student", destination: "/:schoolSlug/student/dashboard", permanent: false },
      { source: "/:schoolSlug/teacher", destination: "/:schoolSlug/teacher/dashboard", permanent: false },
      { source: "/:schoolSlug/finance", destination: "/:schoolSlug/finance/dashboard", permanent: false },
      { source: "/:schoolSlug/admin", destination: "/:schoolSlug/admin/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
