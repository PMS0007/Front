import { NextRequest, NextResponse } from "next/server";

/** Control board & staff areas — only hotel employees */
const STAFF_ONLY_PATHS = ["/staff", "/staff-management", "/bookings"];

/** Auth pages — redirect away if already logged in */
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/sign-in", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isHotelStaff = request.cookies.get("is_hotel_staff")?.value === "true";
  const { pathname } = request.nextUrl;

  const isStaffOnly = STAFF_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAuthOnly = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // No token → cannot open staff/control routes via URL
  if (isStaffOnly && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token but not employee → block control board
  if (isStaffOnly && token && !isHotelStaff) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Already logged in on auth pages
  if (isAuthOnly && token) {
    if (isHotelStaff) {
      return NextResponse.redirect(new URL("/staff", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/staff",
    "/staff/:path*",
    "/staff-management",
    "/staff-management/:path*",
    "/bookings",
    "/bookings/:path*",
    "/auth/login",
    "/auth/sign-in",
    "/auth/register",
  ],
};
