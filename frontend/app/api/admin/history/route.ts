import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, verifyAdminToken } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { era_id, year, date, event_text, is_major } = await request.json();

	if (!era_id || !year?.trim() || !date?.trim() || !event_text?.trim()) {
		return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
	}

	// Get max sort_order for this era+year combination
	const { data: existing } = await supabaseAdmin
		.from("church_history_events")
		.select("sort_order")
		.eq("era_id", era_id)
		.eq("year", year.trim())
		.order("sort_order", { ascending: false })
		.limit(1);

	const nextOrder = existing?.[0] ? existing[0].sort_order + 1 : 0;

	const { data, error } = await supabaseAdmin
		.from("church_history_events")
		.insert({
			era_id,
			year: year.trim(),
			date: date.trim(),
			event_text: event_text.trim(),
			is_major: !!is_major,
			sort_order: nextOrder,
		})
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { id } = await request.json();

	const { error } = await supabaseAdmin
		.from("church_history_events")
		.delete()
		.eq("id", id);

	if (error) {
		return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
	if (!(await verifyAdminToken(request))) {
		return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
	}

	const { id, year, date, event_text, is_major } = await request.json();

	if (!id || !year?.trim() || !date?.trim() || !event_text?.trim()) {
		return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
	}

	const { data, error } = await supabaseAdmin
		.from("church_history_events")
		.update({
			year: year.trim(),
			date: date.trim(),
			event_text: event_text.trim(),
			is_major: !!is_major,
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: "수정 중 오류가 발생했습니다." }, { status: 500 });
	}

	return NextResponse.json({ data });
}
