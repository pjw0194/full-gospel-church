import { getSermonList } from "@/lib/youtube";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const pageToken = searchParams.get("pageToken") ?? undefined;
	const size = parseInt(searchParams.get("size") ?? "9", 10);

	const data = await getSermonList(pageToken, size);
	return Response.json(data);
}
