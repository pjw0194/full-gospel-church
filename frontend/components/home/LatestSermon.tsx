import { getLatestSermon } from "@/lib/youtube";
import TransitionLink from "@/components/common/TransitionLink";

export default async function LatestSermon() {
	const sermon = await getLatestSermon();

	const data = sermon || {
		id: "BYt9TwDeVBE",
		title: "무엇을? 어떻게? 전할 것인가?(복음의 핵심)",
		date: "2026-1-23",
		description: "본문: 사도행전 13장 17절~23절\n설교자: 권세열 목사",
	};

	return (
		<section className="py-16 sm:py-20 bg-stone-50">
			<div className="container mx-auto px-4 sm:px-6">
				<div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
					{/* 설교 영상 */}
					<div className="w-full md:w-3/5 aspect-video bg-black rounded-2xl shadow-xl overflow-hidden">
						<iframe
							className="w-full h-full"
							src={`https://www.youtube.com/embed/${data.id}`}
							title="주일 설교"
							allowFullScreen
						/>
					</div>

					{/* 설교 정보 */}
					<div className="w-full md:w-2/5 space-y-4 sm:space-y-6">
						<span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">
							LATEST SERMON
						</span>
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 line-clamp-2">
							{data.title}
						</h2>
						<p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
							{data.date} 설교
							<br />
							<span className="block mt-2">{data.description}</span>
						</p>
						<TransitionLink
							href="/sermons#video-archive"
							className="text-emerald-600 font-semibold hover:text-emerald-800 transition flex items-center gap-2"
						>
							지난 설교 더보기 &rarr;
						</TransitionLink>
					</div>
				</div>
			</div>
		</section>
	);
}
