import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookie } from "@/lib/auth/middleware";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/auth/error", "/about", "/contact", "/pricing", "/privacy", "/tos", "/for-schools"];

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/admin",
  school_admin: "/school",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromCookie(request);
  const user = session?.user;
  const isAuthenticated = !!user?.id;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    // If logged in and on root, redirect to dashboard
    if (isAuthenticated && pathname === "/") {
      const dashboard = ROLE_DASHBOARDS[user!.role] || "/student";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    // If logged in and on auth pages, redirect to dashboard
    if (isAuthenticated && pathname.startsWith("/auth")) {
      const dashboard = ROLE_DASHBOARDS[user!.role] || "/student";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // Allow API routes, tRPC, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow payment confirmation page
  if (pathname.startsWith("/payment")) {
    return NextResponse.next();
  }

  // Require authentication for all other routes
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/trpc).*)",
  ],
};