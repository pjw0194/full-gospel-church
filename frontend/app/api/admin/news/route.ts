import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminToken } from "@/lib/supabase-server";

const BUCKET = "church-news";

function extractStoragePath(url: string): string | null {
	const marker = `/public/${BUCKET}/`;
	const idx = url.indexOf(marker);
	return idx !== -1 ? url.slice(idx + marker.length) : null;
}

export async function POST(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { title, content, image_urls } = await request.json();

	if (!title?.trim() || !content?.trim()) {
		return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
	}

	const { data, error } = await supabaseAdmin
		.from("church_news")
		.insert({
			title: title.trim(),
			content: content.trim(),
			image_urls: image_urls ?? [],
		})
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: "게시 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { id } = await request.json();

	// Fetch post's images before deleting
	const { data: post } = await supabaseAdmin
		.from("church_news")
		.select("image_urls")
		.eq("id", id)
		.single();

	// Delete images from storage
	if (post?.image_urls?.length) {
		const paths = (post.image_urls as string[])
			.map(extractStoragePath)
			.filter((p): p is string => p !== null);
		if (paths.length) {
			await supabaseAdmin.storage.from(BUCKET).remove(paths);
		}
	}

	const { error } = await supabaseAdmin.from("church_news").delete().eq("id", id);

	if (error) {
		return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
