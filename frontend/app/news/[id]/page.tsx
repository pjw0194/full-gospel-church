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
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-6">
        <Link
          href="/news"
          className="inline-flex items-center space-x-1.5 text-md text-stone-400 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>교회 근황</span>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6 pb-24">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#333] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-2 text-stone-400 text-sm">
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
          <div className="mb-10 rounded-2xl overflow-hidden border border-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0]}
              alt={post.title}
              className="w-full max-h-130 object-cover"
            />
          </div>
        )}

        {images.length > 1 && (
          <div className="mb-10 space-y-3">
            {/* First image — large */}
            <div className="rounded-2xl overflow-hidden border border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0]}
                alt={post.title}
                className="w-full max-h-120 object-cover"
              />
            </div>
            {/* Rest — grid */}
            {images.length > 1 && (
              <div
                className={`grid gap-3 ${images.length === 2 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"}`}
              >
                {images.slice(1).map((url, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-stone-100 aspect-4/3"
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
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-stone-100">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-md font-medium text-stone-400 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
