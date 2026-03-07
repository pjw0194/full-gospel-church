import { supabase } from "@/lib/supabase";
import type { ChurchNews } from "@/types";
import { TABLE_NEWS, NEWS_ITEMS_PER_PAGE } from "@/constants";

export async function getNewsList(page = 1): Promise<{
	posts: ChurchNews[];
	totalPages: number;
}> {
	const offset = (page - 1) * NEWS_ITEMS_PER_PAGE;

	const [{ count }, { data }] = await Promise.all([
		supabase.from(TABLE_NEWS).select("id", { count: "exact", head: true }),
		supabase
			.from(TABLE_NEWS)
			.select("id, title, image_urls, created_at")
			.order("created_at", { ascending: false })
			.range(offset, offset + NEWS_ITEMS_PER_PAGE - 1),
	]);

	return {
		posts: (data ?? []) as ChurchNews[],
		totalPages: Math.ceil((count ?? 0) / NEWS_ITEMS_PER_PAGE),
	};
}

export async function getNewsPost(id: string): Promise<ChurchNews | null> {
	const { data } = await supabase
		.from(TABLE_NEWS)
		.select("*")
		.eq("id", id)
		.single();
	return data as ChurchNews | null;
}
