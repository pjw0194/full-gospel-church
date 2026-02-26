import { getSermonList } from "@/lib/youtube";
import Link from "next/link";
import Image from "next/image";
import ServiceSchedule from "@/components/sermons/ServiceSchedule";
import BulletinSection from "@/components/sermons/BulletinSection";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SermonsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const pageToken =
    typeof resolvedParams.pageToken === "string"
      ? resolvedParams.pageToken
      : undefined;

  const { sermons, nextPageToken, prevPageToken } =
    await getSermonList(pageToken);

  return (
    <main className="bg-white min-h-screen">
      {/* Header Section — consistent with About / News */}
      <section className="bg-emerald-50 pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none font-bold text-emerald-900 -translate-x-10 translate-y-20 select-none text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] whitespace-nowrap">
          WORSHIP
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-emerald-600 uppercase tracking-widest text-sm mb-4 font-bold">
            Worship & Sermon
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#333] mb-6">
            예배 / 설교
          </h1>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-8" />
          <p className="max-w-xl mx-auto text-stone-500 text-lg leading-relaxed">
            하나님께 드리는 거룩한 예배와
            <br />
            은혜로운 말씀의 자리에 초대합니다.
          </p>
        </div>
      </section>

      {/* 1. Service Info Section */}
      <ServiceSchedule />

      {/* 2. Bulletin Section */}
      <BulletinSection />

      {/* 3. Video Gallery Section */}
      <section
        id="video-archive"
        className="py-20 bg-white scroll-mt-24 px-3 sm:px-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                설교 영상 아카이브
              </h2>
              <p className="text-stone-500">
                지난 주일의 감동을 다시 한번 나누어 보세요.
              </p>
            </div>
            <Link
              href="https://www.youtube.com/@kansasfullgospelchurch"
              target="_blank"
              className="text-emerald-600 font-bold text-sm hover:underline shrink-0"
            >
              유튜브 채널 바로가기
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${sermon.id}`}
                    title={sermon.title}
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <p className="text-emerald-600 text-sm font-medium mb-1.5">
                    {sermon.date}
                  </p>
                  <h2 className="text-lg font-bold text-stone-900 mb-3 line-clamp-2">
                    {sermon.title}
                  </h2>
                  <p className="text-stone-500 text-sm whitespace-pre-wrap line-clamp-3">
                    {sermon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center flex justify-center gap-4">
            {prevPageToken && (
              <Link
                href={`/sermons?pageToken=${prevPageToken}#video-archive`}
                className="px-8 py-3.5 border-2 border-stone-100 bg-white text-stone-600 font-bold rounded-2xl hover:bg-stone-50 transition-colors shadow-sm"
              >
                이전 영상
              </Link>
            )}
            {nextPageToken && (
              <Link
                href={`/sermons?pageToken=${nextPageToken}#video-archive`}
                className="px-8 py-3.5 border-2 border-transparent bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                다음 영상
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Praise Section */}
      <section className="py-20 bg-emerald-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1">
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">
                Praise & Worship
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-5 leading-tight">
                영과 진리로 드리는
                <br />
                뜨거운 찬양의 제사
              </h2>
              <p className="text-stone-500 leading-relaxed mb-8">
                캔사스순복음교회 찬양팀은 매 예배마다 하나님의 임재를 구하며
                기쁨으로 찬양합니다. 함께 목소리 높여 주님을 높이는 감격의
                현장에 함께하세요.
              </p>
              <div className="flex space-x-4">
                <div className="text-center p-4 bg-white rounded-2xl flex-1 border border-emerald-100 shadow-sm">
                  <p className="text-2xl font-bold text-emerald-600 mb-1">
                    Spirit
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                    In Spirit
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl flex-1 border border-emerald-100 shadow-sm">
                  <p className="text-2xl font-bold text-emerald-600 mb-1">
                    Truth
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                    In Truth
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-1 aspect-video md:aspect-[4/3]">
                <Image
                  src="/images/test-nature.jpg"
                  alt="Praise Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
