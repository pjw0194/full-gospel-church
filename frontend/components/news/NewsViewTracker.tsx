"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

function hasViewed(key: string): boolean {
  try {
    return !!localStorage.getItem(key);
  } catch {
    return false;
  }
}

function markAsViewed(key: string): void {
  try {
    localStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

export default function NewsViewTracker({ id }: { id: string }) {
  useEffect(() => {
    const key = `viewed_news_${id}`;
    if (hasViewed(key)) return;
    markAsViewed(key);
    void (async () => {
      try {
        await supabase.rpc("increment_view_count", { table_name: "church_news", row_id: id });
      } catch {
        // silently ignore — view count is non-critical
      }
    })();
  }, [id]);

  return null;
}
