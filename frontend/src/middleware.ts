import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("auth_token")?.value;
  const userDataCookie = request.cookies.get("user_data")?.value;

  let userRoles: string[] = [];
  if (userDataCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userDataCookie));
      userRoles = parsed.roles || [];
    } catch {
      // Unparsed cookie safety
    }
  }

  const isAuth = !!authToken;

  // 1. ADMIN PORTAL PROTECTION
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // If already logged in as admin, redirect to /admin dashboard
      if (isAuth && userRoles.includes("admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Protected Admin Routes:
    if (!isAuth) {
      const adminLogin = new URL("/admin/login", request.url);
      adminLogin.searchParams.set("redirect", pathname);
      return NextResponse.redirect(adminLogin);
    }

    if (!userRoles.includes("admin")) {
      return NextResponse.redirect(
        new URL("/unauthorized?required=admin", request.url)
      );
    }
  }

  // 2. STAFF PORTAL PROTECTION
  if (pathname.startsWith("/staff")) {
    if (pathname === "/staff/login") {
      // If already logged in as staff or admin, redirect to staff orders
      if (isAuth && (userRoles.includes("staff") || userRoles.includes("admin"))) {
        return NextResponse.redirect(new URL("/staff/orders", request.url));
      }
      return NextResponse.next();
    }

    // Protected Staff Routes:
    if (!isAuth) {
      const staffLogin = new URL("/staff/login", request.url);
      staffLogin.searchParams.set("redirect", pathname);
      return NextResponse.redirect(staffLogin);
    }

    const hasStaffAccess =
      userRoles.includes("staff") || userRoles.includes("admin");
    if (!hasStaffAccess) {
      return NextResponse.redirect(
        new URL("/unauthorized?required=staff", request.url)
      );
    }
  }

  // 3. CUSTOMER / USER AUTH
  if (pathname === "/login" || pathname === "/register") {
    // Only redirect if user has valid token and NO redirect query param
    const hasRedirectParam = request.nextUrl.searchParams.has("redirect");
    if (isAuth && userDataCookie && !hasRedirectParam) {
      if (userRoles.includes("admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (userRoles.includes("staff")) {
        return NextResponse.redirect(new URL("/staff/orders", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
  }

  // 4. DASHBOARD PROTECTION
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
