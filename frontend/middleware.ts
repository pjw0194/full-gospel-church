import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	// Redirect any page path ending with /admin or /admin/... to /admin
	// e.g. /bulletin/admin → /admin, /about/admin/something → /admin
	// /admin itself is excluded by the regex (requires a segment before /admin)
	if (/\/.+\/admin(\/.*)?$/.test(pathname)) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}
	return NextResponse.next();
}

export const config = {
	// Skip API routes, static assets, and Next.js internals
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
