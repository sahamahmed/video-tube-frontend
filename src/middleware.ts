import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked async if using await inside
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === "/login" || path === "/register" 
    const isProtectedPath = !isPublicPath && path !== "/";
    const accessToken = request.cookies.get("accessToken")?.value || ""
    // console.log(accessToken)
     

    if (isPublicPath && accessToken) {
       return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedPath && !accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
