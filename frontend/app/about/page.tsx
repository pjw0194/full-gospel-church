import React from "react";
import { History, Globe, ShieldCheck, Zap, Sparkles, Quote } from "lucide-react";

export default function AboutPage() {
	return (
		<main className="animate-in fade-in duration-700">
			{/* Page Header */}
			<section className="bg-emerald-50 pt-40 pb-24 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none font-bold text-emerald-900 -translate-x-10 translate-y-20 select-none text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] whitespace-nowrap">
					SINCE 1977
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<p className="text-emerald-600 uppercase tracking-widest text-sm mb-4">
						Kansas Full Gospel Church
					</p>
					<h1 className="text-4xl md:text-5xl font-bold text-[#333] mb-6">
						교회 소개
					</h1>
					<div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-8" />
					<p className="max-w-2xl mx-auto text-stone-500 text-lg leading-relaxed">
						캔사스 지역에서 가장 오래된 한인교회로서,
						<br />
						정통 복음주의를 바탕으로 오순절 성령 운동에 매진해 온 믿음의 터전입니다.
					</p>
				</div>
			</section>

			{/* Greeting Section */}
			<section className="py-24 bg-white overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
						<div className="relative">
							<div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full -z-10 animate-pulse" />
							<div className="absolute -bottom-10 -right-10 w-60 h-60 bg-stone-50 rounded-full -z-10" />
							<img
								src="https://images.unsplash.com/photo-1544717297-fa95b9ee9623?auto=format&fit=crop&q=80&w=1000"
								alt="Pastor Greeting"
								className="rounded-3xl shadow-2xl z-10 relative"
							/>
							<div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg z-20 border border-emerald-100">
								<p className="text-stone-400 text-sm mb-1">Senior Pastor</p>
								<p className="text-xl font-bold text-[#333]">권세열 담임목사</p>
							</div>
						</div>

						<div className="space-y-8">
							<div className="inline-flex items-center space-x-2 text-emerald-600 font-bold">
								<Quote size={20} className="fill-current" />
								<span className="text-lg">담임목사 인사말</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-[#333] leading-tight">
								하나님의 은혜와 성령의 능력이
								<br />
								함께하는 캔사스순복음교회
							</h2>
							<div className="space-y-6 text-stone-600 text-lg leading-relaxed">
								<p>
									안녕하십니까? 캔사스순복음교회 홈페이지를 방문해주신 여러분을
									주님의 이름으로 축복합니다.
								</p>
								<p>
									우리 교회는 2024년 1월, 여의도순복음교회에서 19년간 전문적인
									훈련을 받은 권세열 목사가 이영훈 목사님의 파송을 받아 부임한
									이후, 기도를 통한 영적 도약과 새로운 성장을 이루고 있습니다.
								</p>
								<p>
									비록 지난 48년의 역사 속에 여러 어려움도 있었으나, 하나님께서는
									늘 우리를 선한 길로 인도하셨습니다. 이제 여의도순복음교회의
									전폭적인 후원과 기도로 더 큰 은혜의 부흥을 꿈꿉니다.
								</p>
								<p className="font-medium text-emerald-700">
									국적과 나이, 인종을 초월하여 하나님의 사랑 안에서 하나 되는
									예배의 감격에 여러분을 초대합니다.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* History & Identity Grid */}
			<section className="py-24 bg-[#F9F9F9]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-[#333] mb-4">
							교회 발자취와 소속
						</h2>
						<div className="w-12 h-1 bg-emerald-200 mx-auto rounded-full" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						{/* 48 Years History */}
						<div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all group">
							<div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
								<History className="w-8 h-8" />
							</div>
							<h3 className="text-xl font-bold text-[#333] mb-4">
								48년의 믿음의 역사
							</h3>
							<p className="text-stone-500 leading-relaxed text-sm">
								1977년 1월 23일 창립된 캔사스 주에서 가장 오래된 한인교회입니다.
								수많은 부흥의 현장에서 지역 사회에 선한 영향력을 전해왔습니다.
							</p>
						</div>

						{/* Affiliation */}
						<div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all group">
							<div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors">
								<Globe className="w-8 h-8" />
							</div>
							<h3 className="text-xl font-bold text-[#333] mb-4">
								글로벌 선교 네트워크
							</h3>
							<p className="text-stone-500 leading-relaxed text-sm">
								여의도순복음교회 산하 순복음 북미 총회 소속으로, 미국 내 150여
								교회 및 320여 명의 목회자와 함께하는 견고한 네트워크에 소속되어
								있습니다.
							</p>
						</div>

						{/* Spirit Movement */}
						<div className="bg-white p-10 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all group">
							<div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-white transition-colors">
								<Zap className="w-8 h-8" />
							</div>
							<h3 className="text-xl font-bold text-[#333] mb-4">
								오순절 성령 운동
							</h3>
							<p className="text-stone-500 leading-relaxed text-sm">
								정통 복음주의를 바탕으로 성령의 강력한 역사를 체험하는
								교회입니다. 기도와 성령 운동을 통해 성도들의 삶에 실제적인
								변화와 치유를 추구합니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Vision Point Section */}
			<section className="py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-stone-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
						<div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
							<img
								src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=1000"
								alt="Church Interior"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div>
								<div className="flex items-center space-x-3 text-emerald-400 mb-6">
									<Sparkles size={24} />
									<span className="tracking-widest uppercase font-bold">
										New Vision
									</span>
								</div>
								<h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
									새로운 부흥의 시대를
									<br />
									함께 열어갑니다.
								</h2>
								<div className="space-y-6">
									<div className="flex space-x-4">
										<div className="flex-none mt-1">
											<ShieldCheck className="text-emerald-400" />
										</div>
										<p className="text-stone-300">
											이영훈 담임목사님의 전폭적인 기도와 후원으로 든든하게 세워져
											갑니다.
										</p>
									</div>
									<div className="flex space-x-4">
										<div className="flex-none mt-1">
											<ShieldCheck className="text-emerald-400" />
										</div>
										<p className="text-stone-300">
											기도운동과 성령운동을 통해 영적으로 도약하는 공동체입니다.
										</p>
									</div>
									<div className="flex space-x-4">
										<div className="flex-none mt-1">
											<ShieldCheck className="text-emerald-400" />
										</div>
										<p className="text-stone-300">
											모든 세대와 인종이 하나 되어 구원의 감격을 나누는 예배를
											지향합니다.
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20">
								<h4 className="text-xl font-bold mb-6 flex items-center space-x-2">
									<span>신앙 상담 및 방문 안내</span>
								</h4>
								<p className="text-stone-300 mb-8 leading-relaxed">
									캔사스순복음교회는 언제나 여러분에게 열려 있습니다. 고민이
									있거나 믿음의 길을 찾고 계신다면 주저 말고 연락해 주세요.
								</p>
								<div className="space-y-4">
									<div className="flex justify-between items-center py-3 border-b border-white/10">
										<span className="text-stone-400 text-sm">상담 및 문의</span>
										<span className="font-bold">913-912-2591</span>
									</div>
									<div className="flex justify-between items-center py-3 border-b border-white/10">
										<span className="text-stone-400 text-sm">카카오톡</span>
										<span className="font-bold">ksfgc_church</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
