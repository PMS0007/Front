import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/bookings"];
const STAFF_ONLY_PATHS = ["/admin"];
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isStaffOnly = STAFF_ONLY_PATHS.some((path) => pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path));

  if ((isProtected || isStaffOnly) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }


  if (isStaffOnly && token && role !== "manager") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/sign-in",
  ],
};