import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromCookie } from "./utils/Helper";

export function middleware(req: NextRequest) {
  // const token = getTokenFromCookie();
  // console.log("req", req);
  const token = req.cookies.get("token")?.value;
  // If no token, redirect to login
  const { pathname } = req.nextUrl;
  const authPages = ["/login", "/register", "/forgotppassword", "/resetpassword", "/verification"];

  if (authPages.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Otherwise, allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // run on everything except these
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
