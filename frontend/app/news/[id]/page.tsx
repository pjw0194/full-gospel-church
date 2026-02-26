import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, Images } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: post } = await supabase
    .from("church_news")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const images: string[] = post.image_urls ?? [];

  return (
    <main className="min-h-screen bg-white animate-in fade-in duration-500">
      {/* Back button bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-emerald-600 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={18} />
          <span>교회 소식</span>
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-stone-400 text-sm flex-wrap">
            <Calendar size={14} />
            <span>{formatDate(post.created_at)}</span>
            {images.length > 0 && (
              <>
                <span className="text-stone-200">·</span>
                <Images size={14} />
                <span>사진 {images.length}장</span>
              </>
            )}
          </div>
        </header>

        {/* Image gallery */}
        {images.length === 1 && (
          <div className="mb-8 sm:mb-10 rounded-2xl overflow-hidden border border-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={post.title}
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        )}

        {images.length > 1 && (
          <div className="mb-8 sm:mb-10 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0]}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
            <div
              className={`grid gap-2 sm:gap-3 ${
                images.length === 2 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {images.slice(1).map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-stone-100 aspect-[4/3]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${post.title} ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Bottom nav */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-stone-100">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft size={18} />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
