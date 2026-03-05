import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ChurchNews = {
	id: string;
	title: string;
	content: string;
	image_urls: string[];
	created_at: string;
};

export type Bulletin = {
	id: string;
	title: string;
	date: string;
	image_urls: string[];
	created_at: string;
};

export type HistoryEra = {
	id: string;
	title: string;
	period: string;
	icon_name: string;
	sort_order: number;
};

export type HistoryEvent = {
	id: string;
	era_id: string;
	year: string;
	date: string;
	event_text: string;
	is_major: boolean;
	sort_order: number;
};
