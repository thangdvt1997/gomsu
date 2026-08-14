import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
  // The full Auth.js config (Credentials provider) pulls in bcryptjs, which
  // uses Node-only APIs (setImmediate/process.nextTick) not available on
  // the Edge runtime middleware defaults to -- run this on Node.js instead.
  runtime: "nodejs",
};
