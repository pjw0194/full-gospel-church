import { supabase } from "@/lib/supabase";
import type { Bulletin } from "@/types";
import { TABLE_BULLETINS, BULLETIN_ARCHIVE_LIMIT } from "@/constants";

export async function getBulletins(limit = BULLETIN_ARCHIVE_LIMIT): Promise<Bulletin[]> {
	const { data } = await supabase
		.from(TABLE_BULLETINS)
		.select("*")
		.order("date", { ascending: false })
		.limit(limit);
	return (data ?? []) as Bulletin[];
}
