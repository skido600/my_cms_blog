import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/authorized/admin", "/authorized/all"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // refreshToken lives 7 days, accessToken only 15 min
  const isLoggedIn =
    Boolean(request.cookies.get("refreshToken")?.value) ||
    Boolean(request.cookies.get("accessToken")?.value);

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isLoginPage = pathname === "/login";

  // not logged in -> cannot open protected pages
  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // logged in -> cannot open the login page
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/authorized/all", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authorized/:path*", "/login"],
};
