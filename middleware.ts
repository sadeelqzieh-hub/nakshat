import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authUser = request.cookies.get("auth_user")?.value;
  const authRole = request.cookies.get("auth_role")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/client-dashboard") ||
    pathname.startsWith("/company-dashboard") ||
    pathname.startsWith("/designer-dashboard") ||
    pathname.startsWith("/company-home");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!authUser || !authRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/client-dashboard") && authRole !== "client") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (pathname.startsWith("/company-dashboard") || pathname.startsWith("/company-home")) &&
    authRole !== "company"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/designer-dashboard") && authRole !== "designer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client-dashboard/:path*",
    "/company-dashboard/:path*",
    "/company-home/:path*",
    "/designer-dashboard/:path*",
  ],
};