// components/home/NewsSection.tsx
export default function NewsSection() {
	// 나중에 Django API에서 가져올 데이터
	const news = [
		{ tag: "공지", title: "가을 부흥 성회 안내", date: "2025.10.20" },
		{ tag: "소식", title: "청년부 수련회 사진", date: "2025.10.18" },
		{ tag: "모임", title: "10월 구역장 모임 안내", date: "2025.10.15" },
	];

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-end mb-10">
					<div>
						<h2 className="text-3xl font-bold text-gray-900">교회 소식</h2>
						<p className="text-gray-500 mt-2">
							캔사스 순복음 교회의 이야기를 전합니다.
						</p>
					</div>
					<a
						href="/news"
						className="text-sm text-gray-500 hover:text-emerald-600"
					>
						전체보기 +
					</a>
				</div>

				{/* 그리드 레이아웃 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{news.map((item, idx) => (
						<div key={idx} className="group cursor-pointer">
							{/* 썸네일 영역 */}
							<div className="h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
								{/* 이미지 들어갈 곳 */}
								<div className="w-full h-full bg-gray-300 group-hover:scale-105 transition duration-500" />
							</div>
							<span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
								{item.tag}
							</span>
							<h3 className="text-xl font-bold text-gray-900 mt-2 group-hover:text-emerald-600 transition">
								{item.title}
							</h3>
							<p className="text-gray-400 text-sm mt-1">{item.date}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
