export default function QuickAccess() {
	const items = [
		{ title: "예배 시간", desc: "주일 대예배 11:00 AM", icon: "🕒" },
		{ title: "오시는 길", desc: "캔사스 000번지", icon: "📍" }, // 구글맵 링크 연결
		{ title: "주보 보기", desc: "이번 주 소식 다운로드", icon: "📄" },
		{ title: "온라인 헌금", desc: "마음을 드리는 곳", icon: "🙏" },
	];

	return (
		<section className="py-16 bg-white relative -mt-10 z-20 container mx-auto px-4 rounded-2xl">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{items.map((item, idx) => (
					<div
						key={idx}
						className="bg-white p-8 rounded-xl shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100 text-center"
					>
						<div className="text-4xl mb-4">{item.icon}</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2">
							{item.title}
						</h3>
						<p className="text-gray-500 text-sm">{item.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
}
