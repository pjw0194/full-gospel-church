export default function LatestSermon() {
	return (
		<section className="py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center gap-10">
					{/* 왼쪽: 설교 영상 (유튜브 임베드) */}
					<div className="w-full md:w-3/5 aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
						<iframe
							className="w-full h-full"
							src="https://www.youtube.com/embed/dQw4w9WgXcQ" // 예시 ID
							title="주일 설교"
							allowFullScreen
						/>
					</div>

					{/* 오른쪽: 설교 정보 */}
					<div className="w-full md:w-2/5 space-y-6">
						<span className="text-blue-600 font-bold tracking-widest text-sm uppercase">
							LATEST SERMON
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							두려움을 넘어 믿음으로
						</h2>
						<p className="text-gray-600 leading-relaxed">
							2025년 10월 26일 주일 설교
							<br />
							본문: 이사야 41:10
							<br />
							설교자: 홍길동 담임목사
						</p>
						<button className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-2">
							지난 설교 더보기 &rarr;
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
