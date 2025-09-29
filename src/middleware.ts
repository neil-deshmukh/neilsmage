import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Clone headers so we can mutate them
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // return all cookies the browser sent
          return request.cookies.getAll();
        },
        setAll(cookies) {
          // write the changed/updated cookies back to the response
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          // also mirror them into the request headers so RSCs see the new values
          cookies.forEach(({ name, value }) =>
            requestHeaders.set("cookie", `${name}=${value}`)
          );
        },
      },
    }
  );

  // Secure: always asks Supabase Auth server for the current user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isAuthPage = ["/signin", "/signup"].includes(request.nextUrl.pathname);
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  // 1. Protected route & not logged in  →  redirect to /login
  if (isProtected && (!user || error)) {
    const loginUrl = new URL("/signin", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth page & already logged in  →  send to /dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
