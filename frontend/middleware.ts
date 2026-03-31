import { NextRequest, NextResponse } from "next/server";

const rateMap = new Map<string, { count: number; reset: number }>();
const API_RATE_LIMIT = 30; // requests per window
const API_RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = rateMap.get(ip);
	if (!entry || now > entry.reset) {
		rateMap.set(ip, { count: 1, reset: now + API_RATE_WINDOW });
		return true;
	}
	entry.count++;
	return entry.count <= API_RATE_LIMIT;
}

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Rate-limit admin API routes
	if (pathname.startsWith("/api/admin")) {
		const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
		if (!checkRateLimit(ip)) {
			return NextResponse.json(
				{ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
				{ status: 429 },
			);
		}
	}

	// Redirect any page path ending with /admin or /admin/... to /admin
	if (/\/.+\/admin(\/.*)?$/.test(pathname)) {
		return NextResponse.redirect(new URL("/admin", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
