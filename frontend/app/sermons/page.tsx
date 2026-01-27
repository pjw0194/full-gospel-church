import { getSermonList } from "@/lib/youtube";
import Link from "next/link";
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

	const { sermons, nextPageToken, prevPageToken } = await getSermonList(pageToken);

	return (
		<main className="bg-white min-h-screen">
            {/* Header Section */}
            <section className="bg-stone-50 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Worship & Sermon</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">예배 / 설교</h1>
                    <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>
            </section>

            {/* 1. Service Info Section */}
            <ServiceSchedule />

            {/* 2. Bulletin Section */}
            <BulletinSection />

            {/* 3. Video Gallery Section */}
            <section id="video-archive" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">설교 영상 아카이브</h2>
                            <p className="text-stone-500">지난 주일의 감동을 다시 한번 나누어 보세요.</p>
                        </div>
                        <Link 
                            href="https://www.youtube.com/@kansasfullgospelchurch" 
                            target="_blank"
                            className="hidden sm:block text-emerald-600 font-bold text-sm hover:underline"
                        >
                            유튜브 채널 바로가기
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sermons.map((sermon) => (
                            <div
                                key={sermon.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                            >
                                <div className="aspect-video">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${sermon.id}`}
                                        title={sermon.title}
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-6">
                                    <p className="text-emerald-600 text-sm font-medium mb-2">
                                        {sermon.date}
                                    </p>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                                        {sermon.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
                                        {sermon.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center flex justify-center gap-4">
                        {prevPageToken && (
                            <Link
                                href={`/sermons?pageToken=${prevPageToken}#video-archive`}
                                className="px-10 py-4 border-2 border-stone-100 bg-white text-stone-600 font-bold rounded-2xl hover:bg-stone-50 transition-colors shadow-sm"
                            >
                                이전 영상
                            </Link>
                        )}
                        {nextPageToken && (
                            <Link
                                href={`/sermons?pageToken=${nextPageToken}#video-archive`}
                                className="px-10 py-4 border-2 border-transparent bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                다음 영상
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Praise Section */}
            <section className="py-24 bg-emerald-50/30">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">Praise & Worship</span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                                영과 진리로 드리는<br />뜨거운 찬양의 제사
                            </h2>
                            <p className="text-stone-500 leading-relaxed mb-8">
                                캔사스순복음교회 찬양팀은 매 예배마다 하나님의 임재를 구하며 기쁨으로 찬양합니다. 
                                함께 목소리 높여 주님을 높이는 감격의 현장에 함께하세요.
                            </p>
                            <div className="flex space-x-4">
                                <div className="text-center p-4 bg-white rounded-2xl flex-1 border border-emerald-100 shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 mb-1">Spirit</p>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">In Spirit</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-2xl flex-1 border border-emerald-100 shadow-sm">
                                    <p className="text-2xl font-bold text-emerald-600 mb-1">Truth</p>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">In Truth</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
                                {/* Using a placeholder image for Praise Team as per design */}
                                <img 
                                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
                                    alt="Praise Team" 
                                    className="w-full h-full object-cover"
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