import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (!isProtectedPath) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Cookie: `token=${token}` },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { user } = await res.json();

  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};