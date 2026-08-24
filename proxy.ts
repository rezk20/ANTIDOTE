import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Route Guard (Proxy).
 *
 * Performs fast, optimistic cookie-only checks at the edge/node proxy layer.
 * Deep/secure validation with auth.getUser() is performed server-side by the
 * Data Access Layer (lib/dal/auth.ts) and within Server Actions.
 */

// Routes that require an authenticated session
const PROTECTED_PREFIXES = [
  "/home",
  "/dashboard",
  "/today",
  "/tasks",
  "/goals",
  "/freelance",
  "/clients",
  "/projects",
  "/finances",
  "/notes",
  "/brain-dump",
  "/reviews",
  "/settings",
  "/marriage",
  "/relationship",
  "/habits",
  "/routines",
  "/calendar",
  "/analytics",
  "/opportunities",
  "/decisions",
  "/discord-bots",
  "/products",
];

const AUTH_ROUTES = ["/login"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Supabase auth cookie presence (optimistic check)
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      c.name.startsWith("sb-") &&
      (c.name.endsWith("-auth-token") ||
        c.name.endsWith("-auth-token.0") ||
        c.name.endsWith("-auth-token-code-verifier")),
  );

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // 1. Unauthenticated user trying to access a protected route -> redirect to /login
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user visiting /login -> redirect to /home
  if (isAuthRoute && hasAuthCookie) {
    const homeUrl = new URL("/home", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions (svg, png, jpg, etc.)
     * - api routes (handled separately with their own auth checks)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
