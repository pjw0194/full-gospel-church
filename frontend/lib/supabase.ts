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
