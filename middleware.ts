import { NextRequest, NextResponse } from "next/server";
import {
  APP_SURFACE_HEADER,
  MARKETING_PRODUCTION_HOST,
  isVitawayAppHost,
} from "@/lib/plus/host";

const APP_PAGE_PREFIXES = [
  "/signin",
  "/register",
  "/forgot-password",
  "/verify-code",
  "/onboarding",
  "/onboarding-quiz",
  "/account-details",
  "/today",
  "/offline",
  "/home",
  "/care",
  "/support",
  "/profile",
  "/log",
  "/health-score",
  "/metrics",
  "/medications",
  "/book-visit",
  "/appointments",
  "/notifications",
  "/plans",
  "/articles",
  "/reminders",
  "/visit-reports",
  "/notes",
  "/meal-plans",
  "/documents",
  "/chat",
  "/coaches",
  "/account",
  "/settings",
  "/learn",
  "/badges",
  "/challenges",
  "/payment",
];
const APP_FILE_PATHS = new Set(["/manifest.webmanifest", "/sw.js"]);

function isAppSurfacePath(pathname: string): boolean {
  if (pathname === "/" || APP_FILE_PATHS.has(pathname)) return true;
  return APP_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function nextWithSurface(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(APP_SURFACE_HEADER, "app");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function rewriteWithSurface(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(APP_SURFACE_HEADER, "app");
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (pathname === "/app" || pathname.startsWith("/app/")) {
    if (isVitawayAppHost(host)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice("/app".length) || "/";
      return NextResponse.redirect(url);
    }

    // For now the PWA lives at www.vitaway.org/app; app.vitaway.org is not live yet.
    return nextWithSurface(request);
  }

  if (isVitawayAppHost(host)) {
    if (isAppSurfacePath(pathname)) {
      const dest = pathname === "/" ? "/app" : `/app${pathname}`;
      return rewriteWithSurface(request, dest);
    }

    if (!pathname.startsWith("/_next") && !pathname.startsWith("/api/")) {
      const url = request.nextUrl.clone();
      url.hostname = MARKETING_PRODUCTION_HOST;
      url.protocol = "https:";
      url.port = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|site.webmanifest|images/|svgs/|paterners/|plus-assets/).*)",
  ],
};
