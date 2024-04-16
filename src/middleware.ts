import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked async if using await inside
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === "/login" || path === "/register"
    const accessToken = request.cookies.get("accessToken")?.value || ""
    // console.log(accessToken)
     

    if (isPublicPath && accessToken) {
       return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isPublicPath && !accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile",
    "/subscriptions",
    "/update",
    "/playlist",
    "/results",
    "/update-video",
    "/upload-video",
    "/history",
    "/videos",
    "/videos/liked"
  ],
};
