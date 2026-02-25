import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "church-news";

function extractStoragePath(url: string): string | null {
	const marker = `/public/${BUCKET}/`;
	const idx = url.indexOf(marker);
	return idx !== -1 ? url.slice(idx + marker.length) : null;
}

export async function POST(request: NextRequest) {
	const { password, title, content, image_urls } = await request.json();

	if (password !== process.env.ADMIN_PASSWORD) {
		return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
	}

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
	const { password, id } = await request.json();

	if (password !== process.env.ADMIN_PASSWORD) {
		return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
	}

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
