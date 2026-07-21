import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/auth/error", "/about", "/contact", "/pricing", "/privacy", "/tos", "/for-schools"];

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/admin",
  school_admin: "/school",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isAuthenticated = !!session?.user?.id;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    // If logged in and on auth pages, redirect to dashboard
    if (isAuthenticated && pathname.startsWith("/auth")) {
      const role = (session.user as any)?.role as string;
      const dashboard = ROLE_DASHBOARDS[role] || "/student";
      return NextResponse.redirect(new URL(dashboard, req.url));
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
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based dashboard redirect: if user hits "/" while logged in, send to their dashboard
  if (pathname === "/") {
    const role = (session.user as any)?.role as string;
    const dashboard = ROLE_DASHBOARDS[role] || "/student";
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon.ico (static files)
     * - api/trpc (tRPC handles its own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/trpc).*)",
  ],
};
