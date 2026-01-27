import React from "react";
import { Calendar, Video, Clock, BookOpen } from "lucide-react";

export default function ServiceSchedule() {
	const serviceTimes = [
		{
			name: "주일예배",
			time: "오전 10:45",
			location: "대성전",
			icon: <Calendar size={24} />,
		},
		{
			name: "금요성령대망회",
			time: "오후 07:00",
			location: "대성전",
			icon: <Video size={24} />,
		},
		{
			name: "새벽예배",
			time: "화-금 06:00 / 토 07:00",
			location: "대성전",
			icon: <Clock size={24} />,
		},
		{
			name: "주제별 성경공부",
			time: "토요일 새벽예배 후",
			location: "친교실",
			icon: <BookOpen size={24} />,
		},
	];

	return (
		<section className="py-24 bg-white border-b border-stone-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						예배 시간 안내
					</h2>
					<p className="text-stone-500">
						하나님께 드리는 거룩한 예배의 자리에 여러분을 정중히 초대합니다.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{serviceTimes.map((service, idx) => (
						<div
							key={idx}
							className="bg-emerald-50/50 p-8 rounded-4xl border border-emerald-100/50 hover:bg-emerald-50 hover:shadow-md transition-all text-center group"
						>
							<div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
								{service.icon}
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">
								{service.name}
							</h3>
							<p className="text-xl font-bold text-emerald-700 mb-1 tracking-tight">
								{service.time}
							</p>
							<p className="text-sm text-stone-400">{service.location}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
