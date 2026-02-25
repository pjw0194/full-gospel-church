import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function verifyAdminToken(request: Request): Promise<boolean> {
	const token = request.headers.get("Authorization")?.replace("Bearer ", "");
	if (!token) return false;
	const { data: { user } } = await supabaseAdmin.auth.getUser(token);
	return !!user;
}
