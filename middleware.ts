import { NextRequest, NextResponse } from "next/server";

/** Control board — only hotel staff/employees */
const STAFF_ONLY_PATHS = ["/staff"];

/** Paths that require any authenticated user (if you add guest-only private pages later) */
const PROTECTED_PATHS: string[] = [];

/** Auth pages — redirect away if already logged in */
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/sign-in", "/auth/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isHotelStaff = request.cookies.get("is_hotel_staff")?.value === "true";
  const { pathname } = request.nextUrl;

  const isStaffOnly = STAFF_ONLY_PATHS.some((path) => pathname.startsWith(path));
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path));

  // Unauthenticated → login (cannot open /staff or other protected routes via URL)
  if ((isProtected || isStaffOnly) && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but not staff → cannot open control board via slash/URL
  if (isStaffOnly && token && !isHotelStaff) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Already logged in → leave auth pages
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
    "/staff/:path*",
    "/auth/login",
    "/auth/sign-in",
    "/auth/register",
  ],
};
