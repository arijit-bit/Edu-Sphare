import { NextResponse } from "next/server";

export function proxy(request) {
  // 1. Auth check for protected routes
  const pathname = request.nextUrl.pathname;
  
  // Protected route prefixes mapping to /:schoolSlug/student/:path* etc.
  const isProtectedRoute = pathname.match(/^\/[^\/]+\/(student|teacher|finance|admin)(\/.*)?$/);

  if (isProtectedRoute) {
    const cookie = request.cookies.get(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "edu_sphare_session");
    if (!cookie?.value) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Security headers (CSP, HSTS, etc) for all routes
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  // Build a strict CSP. In development we allow eval (Next.js HMR needs it).
  const csp = [
    `default-src 'self'`,
    // Scripts: only same-origin + nonce-tagged inline scripts
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    // Styles: allow same-origin + inline (needed for Tailwind CSS-in-JS)
    `style-src 'self' 'unsafe-inline'`,
    // Images: same-origin + data URIs (for base64 avatars/icons)
    `img-src 'self' data: blob:`,
    // Fonts: same-origin + Google Fonts
    `font-src 'self' https://fonts.gstatic.com`,
    // API calls: same-origin + backend API
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}`,
    // No frames allowed
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    // No plugins
    `object-src 'none'`,
    // Block mixed content
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  // Pass nonce to layout via header so server components can read it
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-csp", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set CSP header on the response
  response.headers.set("Content-Security-Policy", csp);

  // HSTS — only in production (dev runs HTTP)
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Additional headers (next.config.mjs already sets some of these,
  // middleware sets them here to ensure they're on every response type)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  response.headers.set("X-XSS-Protection", "0"); // Disabled — CSP is the modern replacement

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)",
  ],
};
