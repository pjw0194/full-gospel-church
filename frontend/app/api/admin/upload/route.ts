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

	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) {
		return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
	}

	const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
	if (!allowedTypes.includes(file.type)) {
		return NextResponse.json({ error: "JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다." }, { status: 400 });
	}

	const MAX_SIZE = 10 * 1024 * 1024; // 10MB
	if (file.size > MAX_SIZE) {
		return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
	}

	const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
	const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
	const bytes = await file.arrayBuffer();

	const { error } = await supabaseAdmin.storage
		.from(BUCKET)
		.upload(fileName, bytes, { contentType: file.type, upsert: false });

	if (error) {
		return NextResponse.json({ error: "이미지 업로드에 실패했습니다." }, { status: 500 });
	}

	const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
	return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { url } = await request.json();

	const path = extractStoragePath(url);
	if (!path) {
		return NextResponse.json({ error: "잘못된 URL입니다." }, { status: 400 });
	}

	const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
	if (error) {
		return NextResponse.json({ error: "이미지 삭제에 실패했습니다." }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
