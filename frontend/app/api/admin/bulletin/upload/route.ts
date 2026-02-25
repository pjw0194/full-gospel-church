import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "bulletins";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const password = formData.get("password") as string;
	const file = formData.get("file") as File | null;

	if (password !== process.env.ADMIN_PASSWORD) {
		return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
	}

	if (!file) {
		return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
	}

	const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
	if (!allowedTypes.includes(file.type)) {
		return NextResponse.json({ error: "PNG, JPG, WEBP 파일만 업로드 가능합니다." }, { status: 400 });
	}

	const MAX_SIZE = 10 * 1024 * 1024; // 10MB
	if (file.size > MAX_SIZE) {
		return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
	}

	const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
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
