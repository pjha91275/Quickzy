import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Guard admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Redirect unauthorized to home
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Routes to protect
export const config = {
  matcher: ["/admin/:path*"],
};
