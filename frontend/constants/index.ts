// Supabase table names
export const TABLE_NEWS = "church_news" as const;
export const TABLE_BULLETINS = "bulletins" as const;
export const TABLE_HISTORY_ERAS = "church_history_eras" as const;
export const TABLE_HISTORY_EVENTS = "church_history_events" as const;

// Storage bucket names
export const BUCKET_NEWS = "church-news" as const;
export const BUCKET_BULLETINS = "bulletins" as const;

// Pagination
export const NEWS_ITEMS_PER_PAGE = 24; // public news page
export const ADMIN_ITEMS_PER_PAGE = 10; // admin list views
export const BULLETIN_ARCHIVE_LIMIT = 20; // BulletinSection archive
