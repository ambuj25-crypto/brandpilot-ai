import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Fail gracefully if Supabase env vars are not yet configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "[middleware] Supabase env vars missing — skipping auth checks. " +
      "Copy .env.example to .env.local and add your project credentials."
    );
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Protect /dashboard and any nested routes
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, redirect away from auth pages
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
