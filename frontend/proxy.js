import { NextResponse } from "next/server";

// This is an optimistic browser gate only. Every API and data-access call is
// independently authenticated and authorised by the backend; do not put DB work
// or permission decisions in Proxy.
export function proxy(request) {
  const cookie = request.cookies.get(process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "edu_sphare_session");
  if (cookie?.value) return NextResponse.next();
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/:schoolSlug/student/:path*",
    "/:schoolSlug/teacher/:path*",
    "/:schoolSlug/finance/:path*",
    "/:schoolSlug/admin/:path*",
  ],
};
