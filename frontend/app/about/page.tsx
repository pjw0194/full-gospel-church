"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
	History,
	Globe,
	ShieldCheck,
	Zap,
	Sparkles,
	Quote,
	Star,
	Award,
	Calendar,
	User,
	Users,
	UserCheck,
} from "lucide-react";

interface MemberProps {
	name: string;
	role: string;
	image: string;
	isLarge?: boolean;
}

const MemberCard: React.FC<MemberProps> = ({
	name,
	role,
	image,
	isLarge = false,
}) => (
	<div
		className={`flex flex-col items-center group ${isLarge ? "md:scale-110" : ""}`}
	>
		<div
			className={`relative overflow-hidden rounded-full border-4 border-white shadow-lg ${isLarge ? "w-40 h-40 md:w-56 md:h-56" : "w-32 h-32 md:w-40 md:h-40"} mb-5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl`}
		>
			<Image
				src={image}
				alt={name}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 128px, 224px"
			/>
			<div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors" />
		</div>
		<h4
			className={`font-bold text-[#333] ${isLarge ? "text-2xl" : "text-lg"} mb-1`}
		>
			{name}
		</h4>
		<p className="text-emerald-600 text-sm font-medium uppercase tracking-widest">
			{role}
		</p>
	</div>
);

export default function AboutPage() {
	const [activeEra, setActiveEra] = useState(0);

	const leaders = {
		pastor: {
			name: "권세열",
			role: "담임목사",
			image: "/images/members/권세열.jpg",
		},
		activeElder: {
			name: "류상선",
			role: "시무장로",
			image: "/images/members/류상선.jpg",
		},
		honoraryElders: [
			{ name: "김남윤", role: "장로", image: "/images/members/김남윤장로.jpg" },
			{
				name: "Boyce Gunter",
				role: "장로",
				image: "/images/members/BoyceGunter.jpg",
			},
			{ name: "유귀곤", role: "장로", image: "/images/members/유귀곤장로.jpg" },
			{ name: "김창룡", role: "장로", image: "/images/members/김창룡장로.jpg" },
			{ name: "양호석", role: "장로", image: "/images/members/양호석장로.jpg" },
			{ name: "이돈화", role: "장로", image: "/images/members/이돈화장로.jpg" },
			{ name: "임명찬", role: "장로", image: "/images/members/임명찬장로.jpg" },
		],
		retiredElder: {
			name: "이태훈",
			role: "은퇴장로",
			image: "/images/members/이태훈장로.jpg",
		},
		ordainedDeacon: {
			name: "이병우",
			role: "안수집사",
			image: "/images/members/이병우안수집사.jpg",
		},
		ministers: [],
	};

    const pastPastors = [
        { name: '박규봉 목사', period: '창립', isFounder: true },
        { name: '김기철 목사', period: '' },
        { name: '박 여호수아 목사', period: '' },
        { name: '오근 목사', period: '' },
        { name: '송병혁 목사', period: '' },
        { name: '박수영 목사', period: '' },
        { name: '최길현 목사', period: '' },
        { name: '김순종 목사', period: '1986.03.08 - 1991.06' },
        { name: '한바울 목사', period: '1994.01 - 1994.04.30' },
        { name: '김영석 목사', period: '1994.07.06 - 1999.10.10' },
        { name: '박엘리사 목사', period: '1999.10.10 -' },
        { name: '김학근 목사', period: '' },
        { name: '유덕필 목사', period: '' },
        { name: '공영식 목사', period: '' },
        { name: '김경민 목사', period: '2015.07.27 - 2024.01.21' },
    ];

	const historyEras = [
		{
			title: "새로운 도약",
			period: "2024 - 2026",
			icon: <Star size={20} />,
			years: [
				{
					year: "2026",
					events: [
						{
							date: "01.05",
							text: "신년축복 열두광주리 특별새벽기도회 (여의도순복음교회 연합)",
							isMajor: true,
						},
						{ date: "01.03", text: "신년축복 온가족 특별새벽기도회" },
					],
				},
				{
					year: "2025",
					events: [
						{ date: "12.31", text: "송구영신예배 및 윷놀이 대회" },
						{
							date: "12.25",
							text: "2025 캔사스 성탄절 연합예배 참석 (구호성 목사 설교, 권세열 목사 봉헌기도)",
						},
						{
							date: "12.21",
							text: "2025년 캔사스순복음교회 남선교회, 여선교회 총회",
						},
						{
							date: "12.13",
							text: "William Curtis Cady 성도 천국환송예배",
							isMajor: false,
						},
						{
							date: "12.07",
							text: "교회창립 48주년 제직임명감사예배 (명예장로 6명, 안수집사 1명, 권사 5명)",
							isMajor: true,
						},
						{ date: "12.06", text: "12월 온가족 특별새벽기도회" },
						{ date: "11.23", text: "2025 추수감사나눔공모전" },
						{
							date: "11.03",
							text: "2025 추수감사 21일 특별새벽기도회(여의도순복음 연합)",
							isMajor: true,
						},
						{ date: "11.02", text: "조은영 전도사 사역종료" },
						{ date: "11.01", text: "11월 온가족 특별새벽기도회" },
						{ date: "10.31", text: "Holy Win Day 행사" },
						{
							date: "10.20",
							text: "담임목사 북미총회 중중부지방회 모임 참석 (오마하)",
						},
						{ date: "10.19", text: "장은경 전도사 해임" },
						{ date: "10.17", text: "특별 금요예배 (강사: 김문수 목사)" },
						{ date: "10.12", text: "제직임명 인준을 위한 공동의회" },
						{ date: "10.04", text: "10월 온가족 특별새벽기도회" },
						{ date: "09.28", text: "제직임명대상자 추천 및 지원 시작" },
						{ date: "09.14", text: "조한민 목사 해임" },
						{ date: "09.12", text: "특별 금요예배 (강사: 윤사무엘 전도사)" },
						{ date: "09.06", text: "9월 온가족 특별새벽기도회" },
						{
							date: "08.24",
							text: "2025년도 캔사스순복음교회 침례식 (6명)",
							isMajor: true,
						},
						{ date: "08.22", text: "특별 금요예배 (강사: 최재은 선교사)" },
						{ date: "08.17", text: "조문수 권사님 90세 생신잔치" },
						{ date: "08.11", text: "친교실 주방 페인트 작업" },
						{ date: "08.04", text: "성전바닥 카페트 클리닝 작업" },
						{ date: "08.02", text: "8월 온가족 특별새벽기도회" },
						{
							date: "07.15",
							text: "2025 교회학교 VBS (Keepers of the Kingdom)",
							isMajor: true,
						},
						{ date: "07.08", text: "VBS 및 다음세대를 위한 특별새벽기도회" },
						{ date: "07.05", text: "7월 온가족 특별새벽기도회" },
						{ date: "06.28", text: "브랜슨 DAVID 단체관람 (43명 참석)" },
						{ date: "06.07", text: "6월 온가족 특별새벽기도회" },
						{
							date: "05.26",
							text: "제1회 캔사스 최고의 도시어부를 찾아라! (낚시공동체)",
							isMajor: false,
						},
						{ date: "05.18", text: "김메케나 성도 Baby Shower" },
						{ date: "05.17", text: "2025 여선교회 춘계 선교바자회" },
						{ date: "05.16", text: "특별 금요예배 (강사: 사라킴 대표)" },
						{
							date: "05.05",
							text: "제16대 권세열 담임목사 취임감사예배",
							isMajor: true,
						},
						{ date: "05.03", text: "교회학교 봄소풍 및 5월 온가족 특새" },
						{ date: "04.25", text: "알러지 무료 침술 (안경환 원장)" },
						{
							date: "04.20",
							text: "2025 캔사스 부활절 연합예배 및 본교회 예배",
							isMajor: true,
						},
						{ date: "04.13", text: "2025년도 1/4분기 제직회" },
						{ date: "04.11", text: "특별 금요예배 (강사: 연모세 선교사)" },
						{ date: "04.05", text: "4월 온가족 특별새벽기도회" },
						{ date: "03.26", text: "친교실 머그컵 거치대 설치 및 교육관 정비" },
						{
							date: "03.24",
							text: "제50차 북미총회 정기총회 (LA, 담임목사 참석)",
						},
						{ date: "03.16", text: "친교실 머그컵 사용 캠페인 시작" },
						{ date: "03.02", text: "2025 여선교회 정기 헌신예배" },
						{ date: "03.01", text: "2025 춘계대심방 시작", isMajor: true },
						{ date: "02.09", text: "2025 제직교육 시작" },
						{ date: "02.01", text: "캔사스 한인회 신년하례회 본교회 개최" },
						{ date: "01.26", text: "2024년 결산 및 2025년 예산 공동의회" },
						{ date: "01.17", text: "유튜브 온라인 실시간 방송 시작" },
						{ date: "01.02", text: "2025 신년축복 열두광주리 특별새벽기도회" },
						{ date: "01.01", text: "신년축복예배 및 통역기 구입(15EA)" },
					],
				},
				{
					year: "2024",
					events: [
						{
							date: "12.31",
							text: "2025 송구영신예배 및 연말효도잔치",
							isMajor: true,
						},
						{
							date: "12.29",
							text: "2025년도 교역자, 봉사부서 및 기관 담당 임명",
						},
						{ date: "12.25", text: "2024 성탄축하예배" },
						{ date: "12.15", text: "남선교회 총회" },
						{ date: "12.01", text: "크리스마스 트리 설치" },
						{ date: "11.24", text: "2024 추수감사주일 행사" },
						{ date: "11.17", text: "여선교회 헌신예배 및 총회" },
						{ date: "11.10", text: "2024 Veteran's Day 감사행사" },
						{
							date: "11.03",
							text: "추수감사 다니엘 특별새벽기도회",
							isMajor: true,
						},
						{ date: "10.05", text: "2024 가을맞이 바자회" },
						{
							date: "09.15",
							text: "2024 가을맞이 온가족 초청 야외예배 (샤니미션파크)",
							isMajor: true,
						},
						{ date: "07.22", text: "교육관 수리 및 환경작업(페인트)" },
						{
							date: "07.14",
							text: "2024 교회학교 하계 수련회 (캔터키 노아의 방주)",
							isMajor: true,
						},
						{ date: "06.30", text: "장은경 전도사 부임" },
						{ date: "05.05", text: "권세열 담임목사 공식 취임", isMajor: true },
						{
							date: "01.23",
							text: "창립 47주년 및 권세열 목사 사역 시작",
							isMajor: true,
						},
						{ date: "01.21", text: "김경민 목사 사역종료 및 시애틀 발령" },
						{ date: "01.09", text: "권세열 목사 캔사스 도착" },
					],
				},
			],
		},
		{
			title: "성령의 역사",
			period: "2015 - 2023",
			icon: <ShieldCheck size={20} />,
			years: [
				{
					year: "2023",
					events: [
						{ date: "11.12", text: "조한민 목사 부임 (교회학교)" },
						{
							date: "04.14",
							text: "두란노 아버지 학교 캔사스 2기 진행",
							isMajor: true,
						},
						{ date: "04.09", text: "침례식 및 헌아식 (총 6명)" },
					],
				},
				{
					year: "2022",
					events: [
						{ date: "12.04", text: "조은영 전도사 부임" },
						{ date: "10.16", text: "전교인 야외 예배 (Shawnee Mission Park)" },
						{ date: "05.01", text: "이형주 목사 부임" },
						{
							date: "04.22",
							text: "창립 45주년 기념 부흥회 (윤호용 목사)",
							isMajor: true,
						},
					],
				},
				{
					year: "2021",
					events: [
						{ date: "10.31", text: "추수감사 21일 다니엘 기도회" },
						{ date: "06.20", text: "전교인 야외 예배" },
						{ date: "05.29", text: "성전 이전을 위한 바자회", isMajor: true },
					],
				},
				{
					year: "2020",
					events: [
						{
							date: "11.22",
							text: "추수감사절 예배 및 집사 임명 (이병우, 이소피아)",
							isMajor: true,
						},
						{
							date: "07.13",
							text: "성전 이전 및 영적 회복을 위한 40일 기도회",
						},
						{
							date: "03.22",
							text: "코로나19로 인한 온라인 예배 전환",
							isMajor: true,
						},
					],
				},
				{
					year: "2019",
					events: [
						{ date: "11.17", text: "새신자 침례 (이병우, 이소피아, 김예린)" },
						{ date: "08.31", text: "전교인 수련회 (Heartland Retreat Center)" },
						{ date: "02.17", text: "캔사스한글사랑한글학교 봄학기 개강" },
						{ date: "01.06", text: "한순황 전도사 부임" },
					],
				},
				{
					year: "2018",
					events: [
						{
							date: "09.28",
							text: "캔사스 지역 연합 부흥회 (강사: 진유철 목사)",
						},
						{ date: "07.23", text: "멕시코 단기 선교 파송", isMajor: true },
						{ date: "01.01", text: "2018 신년 특별 새벽 예배" },
					],
				},
				{
					year: "2017",
					events: [
						{
							date: "10.01",
							text: "임직식 (명예장로 김남윤, 안수집사 김창룡 등)",
							isMajor: true,
						},
						{ date: "01.23", text: "교회 창립 40주년 기념" },
					],
				},
				{
					year: "2015",
					events: [
						{
							date: "07.26",
							text: "제15대 김경민 담임목사 취임 및 공영식 목사 은퇴",
							isMajor: true,
						},
					],
				},
			],
		},
		{
			title: "믿음의 계승",
			period: "1995 - 2014",
			icon: <Users size={20} />,
			years: [
				{
					year: "2002",
					events: [
						{ date: "01.20", text: "안수집사 류상선 임직", isMajor: true },
					],
				},
				{
					year: "2001",
					events: [
						{ date: "12.02", text: "여전도회와 권사회 분리 및 조직 정비" },
					],
				},
				{
					year: "2000",
					events: [
						{
							date: "02.20",
							text: "캔사스순복음교회와 샘물순복음교회 통합 (박 엘리사 목사 취임)",
							isMajor: true,
						},
						{ date: "02.20", text: "조문수, 김금남, 최광자 권사 취임" },
					],
				},
				{
					year: "1999",
					events: [{ date: "03.07", text: "안수집사 이요한 임직" }],
				},
				{
					year: "1996",
					events: [{ date: "12.01", text: "박한득 권사 본 교회 시무 시작" }],
				},
				{
					year: "1995",
					events: [
						{
							date: "11.08",
							text: "임직식 (안수집사 허생기, 권사 박진양, 최의기)",
						},
					],
				},
			],
		},
		{
			title: "창립과 개척",
			period: "1977 - 1989",
			icon: <History size={20} />,
			years: [
				{
					year: "1989",
					events: [
						{
							date: "10.29",
							text: "현재 성전(1424 S 55th St) 매입 및 입당예배",
							isMajor: true,
						},
						{
							date: "10.01",
							text: "건물 및 사택, 대지 3에이커 매입 ($120,000)",
							isMajor: true,
						},
					],
				},
				{
					year: "1977",
					events: [
						{
							date: "04.01",
							text: "최자실 목사 인도하에 제직회 구성 (서일로 외 7명 임명)",
							isMajor: true,
						},
						{
							date: "01.23",
							text: "박규봉 목사 외 5명으로 캔사스순복음교회 창립예배",
							isMajor: true,
						},
						{
							date: "개척사",
							text: "성전 매입 전까지 12년 동안 8곳의 예배처소(Lexea 순복음, Leaven Worth 등)를 거치며 신앙의 터전을 다짐.",
						},
					],
				},
			],
		},
	];

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
						정통 복음주의를 바탕으로 오순절 성령 운동에 매진해 온 믿음의
						터전입니다.
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
                            <div className="relative w-full aspect-[3/4] rounded-3xl shadow-2xl z-10 overflow-hidden">
                                <Image
                                    src="/images/members/권세열.jpg"
                                    alt="Pastor Greeting"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>
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
									비록 지난 48년의 역사 속에 여러 어려움도 있었으나,
									하나님께서는 늘 우리를 선한 길로 인도하셨습니다. 이제
									여의도순복음교회의 전폭적인 후원과 기도로 더 큰 은혜의 부흥을
									꿈꿉니다.
								</p>
								<p className="font-medium text-emerald-700">
									국적과 나이, 인종을 초월하여 하나님의 사랑 안에서 하나 되는
									예배의 감격에 여러분을 초대합니다.
								</p>
							</div>

							{/* Pastor Profile Details */}
							<div className="pt-8 border-t border-stone-100 grid grid-cols-1 gap-10">
								<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
									<h4 className="text-base font-bold text-emerald-700 uppercase tracking-widest mb-6 flex items-center">
										<Award size={20} className="mr-3" /> Education
									</h4>
									<ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-stone-600">
										<li className="flex items-start">
											<span className="text-emerald-500 mr-2 font-bold">•</span>
											<span>한세대학교 신학과 졸업, 신학사(B.Th.) 취득</span>
										</li>
										<li className="flex items-start">
											<span className="text-emerald-500 mr-2 font-bold">•</span>
											<span>
												한세대학교 영산신학대학원 졸업, 목회학 석사(M.Div.) 취득
											</span>
										</li>
										<li className="flex items-start">
											<span className="text-emerald-500 mr-2 font-bold">•</span>
											<span>
												미국 Georgia Central University 졸업, 목회학 박사(D.
												Min.) 취득
											</span>
										</li>
									</ul>
								</div>
								<div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
									<h4 className="text-base font-bold text-emerald-700 uppercase tracking-widest mb-6 flex items-center">
										<History size={20} className="mr-3" /> Ministry Experience
									</h4>

									{/* Current Role */}
									<div className="mb-6">
										<h5 className="text-sm font-bold text-stone-800 mb-3 pl-2 border-l-4 border-emerald-500">
											Current Role
										</h5>
										<ul className="text-sm text-stone-600 space-y-2">
											<li className="flex items-start">
												<span className="text-emerald-500 mr-2 font-bold">
													•
												</span>
												<span className="font-medium text-emerald-800">
													현) 캔사스순복음교회 16대 담임목사 (2024년 1월 21일 ~
													)
												</span>
											</li>
										</ul>
									</div>

									{/* Previous Experience */}
									<div>
										<h5 className="text-sm font-bold text-stone-800 mb-3 pl-2 border-l-4 border-stone-300">
											Previous Experience
										</h5>
										<ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-stone-600">
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>
													전) 여의도순복음교회 주일, 수요, 금요 찬양인도자
												</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>
													여의도순복음교회 예배부장, 찬양부장, 찬양교구장 역임
												</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>여의도순복음교회 용산대교구 총무목사 역임</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>여의도순복음교회 오산리기도원 총무목사 역임</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>여의도순복음교회 강남성전 총무목사 역임</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>
													여의도순복음교회 용산, 영등포, 관악, 금천대교구 교구장
													역임
												</span>
											</li>
											<li className="flex items-start">
												<span className="text-stone-400 mr-2">•</span>
												<span>
													여의도순복음교회 제3성전, 엘림성전, 시흥성전 사역
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Serving Members Section */}
			<section className="py-24 bg-white overflow-hidden border-t border-stone-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<h2 className="text-3xl font-bold text-[#333] mb-4">
							섬기는 사람들
						</h2>
						<p className="text-stone-500">
							교회의 영적 성장과 행정을 위해 헌신하는 제직들입니다.
						</p>
						<div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full mt-6" />
					</div>

					<div className="space-y-24">
						{/* 담임목사 - 단독 강조 */}
						<div className="flex flex-col items-center">
							<div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-widest uppercase">
								<Star size={14} />
								<span>Senior Pastor</span>
							</div>
							<MemberCard {...leaders.pastor} isLarge={true} />
						</div>

						{/* 장로회 그룹 */}
						<div className="bg-stone-50/50 rounded-[3rem] p-8 md:p-16 border border-stone-100">
							<div className="flex flex-col items-center mb-16">
								<div className="h-px bg-stone-200 w-full max-w-xs mb-6"></div>
								<h3 className="text-2xl font-bold text-stone-800">명예장로</h3>
								<p className="text-stone-400 text-sm mt-1 uppercase tracking-widest font-eng">
									The Elders
								</p>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-16 gap-x-8">
								{/* 시무장로 */}
								<MemberCard {...leaders.activeElder} />

								{/* 명예장로 리스트 */}
								{leaders.honoraryElders.map((elder, idx) => (
									<MemberCard key={idx} {...elder} />
								))}

								{/* 은퇴장로 */}
								<MemberCard {...leaders.retiredElder} />
							</div>
						</div>

						{/* 안수집사 그룹 */}
						<div className="flex flex-col items-center">
							<div className="h-px bg-stone-200 w-full max-w-xs mb-10"></div>
							<h3 className="text-2xl font-bold text-stone-800 mb-12">
								안수집사
							</h3>
							                    <div className="flex justify-center">
							                        <MemberCard {...leaders.ordainedDeacon} />
							                    </div>
							                    </div>
							                </div>
							                </div>
							            </section>
							
							            {/* Past Pastors Section */}
							            <section className="py-24 bg-stone-50 border-y border-stone-100">
							                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							                <div className="text-center mb-16">
							                    <h2 className="text-3xl font-bold text-[#333] mb-4">역대 섬기신 목사님들</h2>
							                    <p className="text-stone-500">교회의 영적 토대를 마련해주신 신실한 주의 종들입니다.</p>
							                </div>
							                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
							                    {pastPastors.map((pastor, idx) => (
							                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center group hover:bg-emerald-600 transition-all duration-300">
							                        <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
							                                                <UserCheck size={24} />
							                                                </div>
							                                                <h4 className="font-bold text-stone-800 mb-1 group-hover:text-white transition-colors">{pastor.name}</h4>
							                                                {pastor.period && (
							                                                    <p className="text-[10px] text-stone-400 font-eng tracking-tighter group-hover:text-emerald-100 transition-colors uppercase">
							                                                        {pastor.period}
							                                                    </p>
							                                                )}
							                                                {pastor.isFounder && (							                        <span className="mt-3 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-emerald-600">
							                            창립 목사
							                        </span>
							                        )}
							                    </div>
							                    ))}
							                </div>
							                </div>
							            </section>
							
										{/* Timeline Section */}			<section className="py-24 bg-stone-50/50">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-[#333] mb-4">교회 연혁</h2>
						<p className="text-stone-500">
							하나님께서 걸음마다 인도하신 은혜의 발자취를 모두 기록하였습니다.
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-3 mb-16">
						{historyEras.map((era, idx) => (
							<button
								key={idx}
								onClick={() => setActiveEra(idx)}
								className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
									activeEra === idx
										? "bg-emerald-600 text-white shadow-lg scale-105"
										: "bg-white text-stone-400 hover:bg-stone-100 border border-stone-100"
								}`}
							>
								{era.icon}
								<span>{era.title}</span>
								<span className="text-[10px] opacity-60 ml-1 font-eng">
									({era.period})
								</span>
							</button>
						))}
					</div>

					<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="bg-white rounded-[3rem] shadow-xl border border-stone-100 overflow-hidden">
							<div className="bg-emerald-600 p-8 md:p-12 text-white">
								<h3 className="text-2xl md:text-3xl font-bold mb-2">
									{historyEras[activeEra].title}
								</h3>
								<p className="opacity-80 font-eng tracking-widest uppercase">
									{historyEras[activeEra].period}
								</p>
							</div>

							<div className="p-8 md:p-12 space-y-12 max-h-250 overflow-y-auto scrollbar-hide">
								{historyEras[activeEra].years.map((yearGroup, yIdx) => (
									<div
										key={yIdx}
										className="relative pl-12 md:pl-20 border-l border-stone-100 pb-4 last:pb-0"
									>
										<div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-emerald-500"></div>
										<div className="space-y-6">
											<h4 className="text-4xl font-bold text-stone-100 font-eng tracking-tighter absolute -left-4 md:-left-8 -top-3 opacity-70 pointer-events-none">
												{yearGroup.year}
											</h4>

											<div className="grid gap-4">
												{yearGroup.events.map((event, eIdx) => (
													<div
														key={eIdx}
														className={`p-4 rounded-2xl transition-all ${event.isMajor ? "bg-emerald-50 border border-emerald-100" : "hover:bg-stone-50"}`}
													>
														<div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
															<span
																className={`text-xs font-bold font-eng inline-block px-2 py-0.5 rounded-md mb-1 md:mb-0 ${event.isMajor ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-400"}`}
															>
																{event.date}
															</span>
															<div className="flex-1">
																<p
																	className={`text-base leading-relaxed ${event.isMajor ? "font-bold text-stone-800" : "text-stone-600"}`}
																>
																	{event.text}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-center text-stone-400 text-sm italic">
								Scroll to see more history
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
												<Image
													src="/images/test-nature.jpg"
													alt="Church Interior"
													fill
													className="object-cover"
												/>
											</div>
											<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">							<div>
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
											권세열 담임목사님의 전폭적인 기도와 후원으로 든든하게
											세워져 갑니다.
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
										<span className="font-bold">913-788-8828</span>
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
