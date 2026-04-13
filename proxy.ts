import { NextRequest, NextResponse } from "next/server";

function getDashboardByRole(role?: string) {
  if (role === "company") return "/company-home";
  if (role === "designer") return "/designer-dashboard";
  if (role === "client") return "/client-dashboard";
  return "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authUser = request.cookies.get("auth_user")?.value;
  const authRole = request.cookies.get("auth_role")?.value;

  const isLoggedIn = !!authUser && !!authRole;

  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  const isCompanyPage =
    pathname.startsWith("/company-home") ||
    pathname.startsWith("/company-dashboard");

  const isDesignerPage = pathname.startsWith("/designer-dashboard");
  const isClientPage = pathname.startsWith("/client-dashboard");

  if (isLoggedIn && isPublicPage) {
    return NextResponse.redirect(
      new URL(getDashboardByRole(authRole), request.url)
    );
  }

  if (!isLoggedIn && (isCompanyPage || isDesignerPage || isClientPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isCompanyPage && authRole !== "company") {
    return NextResponse.redirect(
      new URL(getDashboardByRole(authRole), request.url)
    );
  }

  if (isLoggedIn && isDesignerPage && authRole !== "designer") {
    return NextResponse.redirect(
      new URL(getDashboardByRole(authRole), request.url)
    );
  }

  if (isLoggedIn && isClientPage && authRole !== "client") {
    return NextResponse.redirect(
      new URL(getDashboardByRole(authRole), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/company-home/:path*",
    "/company-dashboard/:path*",
    "/designer-dashboard/:path*",
    "/client-dashboard/:path*",
  ],
};