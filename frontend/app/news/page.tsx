import { supabase, ChurchNews } from "@/lib/supabase";
import {
  Calendar,
  Images,
  Newspaper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import BulletinSection from "@/components/sermons/BulletinSection";

export const revalidate = 60;

const ITEMS_PER_PAGE = 24;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1") || 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const [{ count }, { data: newsList }] = await Promise.all([
    supabase.from("church_news").select("id", { count: "exact", head: true }),
    supabase
      .from("church_news")
      .select("id, title, image_urls, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1),
  ]);

  const posts: ChurchNews[] = (newsList ?? []) as ChurchNews[];
  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  return (
    <main className="animate-in fade-in duration-700">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-emerald-50 pt-40 pb-24">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full translate-x-10 translate-y-16 text-[8rem] font-bold whitespace-nowrap text-emerald-900 opacity-5 select-none sm:text-[12rem] md:text-[16rem]">
          NEWS
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <p className="mb-4 text-sm font-bold tracking-widest text-emerald-600 uppercase">
            Kansas Full Gospel Church
          </p>
          <h1 className="mb-6 text-4xl font-bold text-[#333] md:text-5xl">
            교회 소식
          </h1>
          <div className="mx-auto mb-8 h-1 w-16 rounded-full bg-emerald-500" />
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-stone-500">
            캔사스순복음교회의 주보와 최근 소식을 전해드립니다.
          </p>
        </div>
      </section>

      {/* Bulletin Section */}
      <BulletinSection />

      {/* News Grid */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-stone-900 sm:text-3xl">
              교회 소식
            </h2>
            <p className="text-stone-500">
              캔사스순복음교회의 최근 소식과 이야기입니다.
            </p>
          </div>

          {posts.length === 0 && (
            <div className="py-32 text-center">
              <Newspaper size={48} className="mx-auto mb-6 text-stone-200" />
              <p className="text-xl text-stone-400">
                아직 등록된 소식이 없습니다.
              </p>
              <p className="mt-2 text-base text-stone-300">
                곧 새로운 소식을 전해드리겠습니다.
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
                {posts.map((post) => (
                  <Link href={`/news/${post.id}`} key={post.id}>
                    <article className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        {post.image_urls?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.image_urls[0]}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-stone-50">
                            <Newspaper size={28} className="text-stone-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 sm:p-4">
                        <h2 className="mb-2 line-clamp-2 text-sm leading-snug font-bold text-[#333] transition-colors group-hover:text-emerald-600 sm:text-base">
                          {post.title}
                        </h2>
                        <div className="flex items-center justify-between text-stone-400">
                          <p className="flex items-center gap-1 text-xs">
                            <Calendar size={11} />
                            <span>{formatDate(post.created_at)}</span>
                          </p>
                          {post.image_urls?.length > 1 && (
                            <span className="flex items-center gap-1 text-xs text-stone-300">
                              <Images size={12} /> {post.image_urls.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Link
                    href={`/news?page=${page - 1}`}
                    className={`rounded-xl border p-2 transition-colors ${
                      page <= 1
                        ? "pointer-events-none border-stone-100 text-stone-300"
                        : "border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                    aria-disabled={page <= 1}
                  >
                    <ChevronLeft size={18} />
                  </Link>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/news?page=${p}`}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                          p === page
                            ? "bg-emerald-600 text-white"
                            : "border border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-600"
                        }`}
                      >
                        {p}
                      </Link>
                    ),
                  )}

                  <Link
                    href={`/news?page=${page + 1}`}
                    className={`rounded-xl border p-2 transition-colors ${
                      page >= totalPages
                        ? "pointer-events-none border-stone-100 text-stone-300"
                        : "border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                    aria-disabled={page >= totalPages}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
