import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Checking if user is accessing admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Redirect non-logged in users or non-admins to home
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Config matches all routes starting with /admin
export const config = {
  matcher: ["/admin/:path*"],
};
