import { NextResponse, type NextRequest } from "next/server";

// Default: April 25, 2026 at 8:00 PM Nicaragua Time (CST = UTC-6)
// Override via NEXT_PUBLIC_UNLOCK_DATE env variable
const UNLOCK_DATE = new Date(process.env.NEXT_PUBLIC_UNLOCK_DATE || "2026-04-26T02:00:00.000Z");

function isContentLocked(request: NextRequest): boolean {
  const isProduction = process.env.ENVIRONMENT === "production";
  const hasPreviewCookie = request.cookies.get("preview")?.value === "true";

  return isProduction && !hasPreviewCookie && new Date() < UNLOCK_DATE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and Next.js internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Allow the auth API endpoint
  if (pathname === "/api/auth") {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("authenticated")?.value === "true";
  const locked = isContentLocked(request);

  // --- LOCKED: countdown is the only page anyone can see ---
  if (locked) {
    if (pathname === "/countdown") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/countdown", request.url));
  }

  // --- UNLOCKED: normal auth flow ---

  // Redirect /countdown away — it's no longer relevant
  if (pathname === "/countdown") {
    const destination = isAuthenticated ? "/home" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Login page: redirect authenticated users to /home
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
