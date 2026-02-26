import { supabase, ChurchNews } from "@/lib/supabase";
import { Calendar, Images, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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
    supabase
      .from("church_news")
      .select("id", { count: "exact", head: true }),
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
      <section className="bg-emerald-50 pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none font-bold text-emerald-900 translate-x-10 translate-y-16 select-none text-[8rem] sm:text-[12rem] md:text-[16rem] whitespace-nowrap">
          NEWS
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <p className="text-emerald-600 uppercase tracking-widest text-sm mb-4 font-bold">
            Kansas Full Gospel Church
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#333] mb-6">
            교회 소식
          </h1>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-8" />
          <p className="max-w-xl mx-auto text-stone-500 text-lg leading-relaxed">
            캔사스 순복음 교회의 최근 소식과 이야기를 전해드립니다.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 && (
            <div className="text-center py-32">
              <Newspaper size={48} className="mx-auto text-stone-200 mb-6" />
              <p className="text-stone-400 text-xl">
                아직 등록된 소식이 없습니다.
              </p>
              <p className="text-stone-300 text-base mt-2">
                곧 새로운 소식을 전해드리겠습니다.
              </p>
            </div>
          )}

          {posts.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {posts.map((post) => (
                  <Link href={`/news/${post.id}`} key={post.id}>
                    <article className="group bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        {post.image_urls?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.image_urls[0]}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-50 flex items-center justify-center">
                            <Newspaper size={28} className="text-stone-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 sm:p-4">
                        <h2 className="font-bold text-[#333] text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h2>
                        <div className="flex items-center justify-between text-stone-400">
                          <p className="text-xs flex items-center gap-1">
                            <Calendar size={11} />
                            <span>{formatDate(post.created_at)}</span>
                          </p>
                          {post.image_urls?.length > 1 && (
                            <span className="flex gap-1 items-center text-xs text-stone-300">
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
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Link
                    href={`/news?page=${page - 1}`}
                    className={`p-2 rounded-xl border transition-colors ${
                      page <= 1
                        ? "border-stone-100 text-stone-300 pointer-events-none"
                        : "border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                    aria-disabled={page <= 1}
                  >
                    <ChevronLeft size={18} />
                  </Link>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/news?page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        p === page
                          ? "bg-emerald-600 text-white"
                          : "border border-stone-200 text-stone-500 hover:border-emerald-400 hover:text-emerald-600"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}

                  <Link
                    href={`/news?page=${page + 1}`}
                    className={`p-2 rounded-xl border transition-colors ${
                      page >= totalPages
                        ? "border-stone-100 text-stone-300 pointer-events-none"
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
