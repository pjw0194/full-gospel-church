import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminToken } from "@/lib/supabase-server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { title, period, icon_name, sort_order } = await request.json();

	if (!title?.trim() || !period?.trim() || !icon_name?.trim()) {
		return NextResponse.json({ error: "이름, 기간, 아이콘을 모두 입력해주세요." }, { status: 400 });
	}

	// Get max sort_order if not provided
	let order = typeof sort_order === "number" ? sort_order : null;
	if (order === null) {
		const { data } = await supabaseAdmin
			.from("church_history_eras")
			.select("sort_order")
			.order("sort_order", { ascending: false })
			.limit(1);
		order = data?.[0] ? data[0].sort_order + 1 : 0;
	}

	const { data, error } = await supabaseAdmin
		.from("church_history_eras")
		.insert({ title: title.trim(), period: period.trim(), icon_name: icon_name.trim(), sort_order: order })
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

	const { id, title, period, icon_name, sort_order } = await request.json();

	if (!id || !UUID_RE.test(id)) {
		return NextResponse.json({ error: "잘못된 ID입니다." }, { status: 400 });
	}
	if (!title?.trim() || !period?.trim() || !icon_name?.trim()) {
		return NextResponse.json({ error: "이름, 기간, 아이콘을 모두 입력해주세요." }, { status: 400 });
	}

	const update: Record<string, unknown> = {
		title: title.trim(),
		period: period.trim(),
		icon_name: icon_name.trim(),
	};
	if (typeof sort_order === "number") update.sort_order = sort_order;

	const { data, error } = await supabaseAdmin
		.from("church_history_eras")
		.update(update)
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

	// CASCADE delete will also remove all child events (set in migration)
	const { error } = await supabaseAdmin
		.from("church_history_eras")
		.delete()
		.eq("id", id);

	if (error) {
		return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
