import { getLatestSermon } from "@/utils/youtube";

export default async function LatestSermon() {
	const sermon = await getLatestSermon();

	// Fallback data if fetch fails
	const data = sermon || {
		id: "BYt9TwDeVBE",
		title: "무엇을? 어떻게? 전할 것인가?(복음의 핵심)",
		date: "2026-1-23",
		description: "본문: 사도행전 13장 17절~23절\n설교자: 권세열 목사",
	};

	return (
		<section className="py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center gap-10">
					{/* 왼쪽: 설교 영상 (유튜브 임베드) */}
					<div className="w-full md:w-3/5 aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
						<iframe
							className="w-full h-full"
							src={`https://www.youtube.com/embed/${data.id}`}
							title="주일 설교"
							allowFullScreen
						/>
					</div>

					{/* 오른쪽: 설교 정보 */}
					<div className="w-full md:w-2/5 space-y-6">
						<span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">
							LATEST SERMON
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 line-clamp-2">
							{data.title}
						</h2>
						<p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
							{data.date} 설교
							<br />
							<span className="block mt-2">{data.description}</span>
						</p>
						<button className="text-emerald-600 font-semibold hover:text-emerald-800 transition flex items-center gap-2">
							지난 설교 더보기 &rarr;
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
