import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminToken } from "@/lib/supabase-server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TITLE = 200;
const MAX_IMAGES = 10;

export async function POST(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { title, date, image_urls } = await request.json();

	if (!title?.trim() || !date?.trim() || !image_urls?.length) {
		return NextResponse.json({ error: "제목, 날짜, 이미지를 모두 입력해주세요." }, { status: 400 });
	}
	if (title.trim().length > MAX_TITLE) {
		return NextResponse.json({ error: "제목이 너무 깁니다." }, { status: 400 });
	}
	if (!Array.isArray(image_urls) || image_urls.length > MAX_IMAGES) {
		return NextResponse.json({ error: "이미지 수가 초과되었습니다." }, { status: 400 });
	}

	const { data, error } = await supabaseAdmin
		.from("bulletins")
		.insert({ title: title.trim(), date: date.trim(), image_urls })
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { id, title, date, image_urls } = await request.json();

	if (!id || !UUID_RE.test(id)) {
		return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
	}
	if (!title?.trim() || !date?.trim()) {
		return NextResponse.json({ error: "제목과 날짜를 입력해주세요." }, { status: 400 });
	}
	if (title.trim().length > MAX_TITLE) {
		return NextResponse.json({ error: "제목이 너무 깁니다." }, { status: 400 });
	}
	if (image_urls && (!Array.isArray(image_urls) || image_urls.length > MAX_IMAGES)) {
		return NextResponse.json({ error: "이미지 수가 초과되었습니다." }, { status: 400 });
	}

	const { data, error } = await supabaseAdmin
		.from("bulletins")
		.update({ title: title.trim(), date: date.trim(), image_urls: image_urls ?? [] })
		.eq("id", id)
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: "수정 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { id } = await request.json();

	if (!id || !UUID_RE.test(id)) {
		return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
	}

	const { error } = await supabaseAdmin.from("bulletins").delete().eq("id", id);

	if (error) {
		return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
