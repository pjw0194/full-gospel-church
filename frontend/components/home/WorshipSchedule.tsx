export default function WorshipSchedule() {
	const schedules = [
		{ name: "교역자 기도회", time: "주일) 오전 9:00", location: "교회학교" },
		{ name: "주일예배", time: "주일) 오전 10:45", location: "대성전" },
		{ name: "주제별 성경공부", time: "토요 새벽예배 친교 후", location: "친교실" },
		{ name: "금요성령대망회", time: "금) 저녁 7:00", location: "대성전" },
		{ name: "새벽예배", time: "화-금) 새벽 6:00 / 토) 아침 7:00", location: "대성전" },
	];

	return (
		<section id="worship-schedule" className="py-16 sm:py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6 max-w-4xl">
				<div className="text-center mb-10 sm:mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-stone-900">예배 및 모임 안내</h2>
					<p className="text-emerald-600 font-medium mt-2">Worship Schedule</p>
				</div>

				{/* Desktop: table */}
				<div className="hidden sm:block bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
								<th className="px-6 py-4 font-bold">예배 Worship</th>
								<th className="px-6 py-4 font-bold">일시 Date & Time</th>
								<th className="px-6 py-4 font-bold">장소 Location</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-stone-100">
							{schedules.map((item, idx) => (
								<tr key={idx} className="hover:bg-stone-50 transition-colors">
									<td className="px-6 py-4 font-bold text-stone-800">{item.name}</td>
									<td className="px-6 py-4 text-stone-600">{item.time}</td>
									<td className="px-6 py-4 text-emerald-700 font-medium">{item.location}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Mobile: card list */}
				<div className="sm:hidden bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden divide-y divide-stone-100">
					{schedules.map((item, idx) => (
						<div key={idx} className="px-5 py-4 flex items-start gap-4">
							<div className="flex-1 min-w-0">
								<p className="font-bold text-stone-800">{item.name}</p>
								<p className="text-stone-500 text-sm mt-0.5">{item.time}</p>
							</div>
							<span className="text-emerald-700 text-sm font-medium shrink-0 bg-emerald-50 px-2.5 py-1 rounded-xl">
								{item.location}
							</span>
						</div>
					))}
				</div>

				<p className="text-center text-stone-400 text-sm mt-6">
					* 모든 예배는 정시에 시작됩니다. 기도로 준비하시기 바랍니다.
				</p>
			</div>
		</section>
	);
}
