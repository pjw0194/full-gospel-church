import { supabase } from "@/lib/supabase";
import type { HistoryEra, HistoryEvent } from "@/types";
import { TABLE_HISTORY_ERAS, TABLE_HISTORY_EVENTS } from "@/constants";

export async function getHistoryData(): Promise<{
	eras: HistoryEra[];
	events: HistoryEvent[];
}> {
	const [{ data: eras }, { data: events }] = await Promise.all([
		supabase.from(TABLE_HISTORY_ERAS).select("*").order("sort_order", { ascending: true }),
		supabase.from(TABLE_HISTORY_EVENTS).select("*").order("sort_order", { ascending: true }),
	]);

	return {
		eras: (eras ?? []) as HistoryEra[],
		events: (events ?? []) as HistoryEvent[],
	};
}
