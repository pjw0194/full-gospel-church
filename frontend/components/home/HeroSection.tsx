import TransitionLink from "@/components/common/TransitionLink";
import Image from "next/image";

export default function HeroSection() {
	return (
		<section className="sticky top-0 z-0 h-[70vh] w-full flex items-center justify-center bg-gray-900 text-white overflow-hidden">
			{/* 배경 이미지 (실제로는 Image 컴포넌트나 video 태그 사용) */}
			<div className="absolute inset-0 bg-black/50 z-0">
				{/* Placeholder for Background Image/Video */}
				<Image
					src="/images/test-nature.jpg"
					alt="nature"
					fill
					className="object-cover"
					priority
					quality={75}
				/>
				<div className="absolute inset-0 bg-black/60 z-10" />
			</div>

			{/* Content */}
			<div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
				<h2 className="text-xl md:text-2xl font-light mb-4 tracking-wider text-gray-200">
					KANSAS FULL GOSPEL CHURCH
				</h2>
				<h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
					하나님과 함께 걷는
					<br />
					행복한 믿음의 공동체
				</h1>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<TransitionLink
						href="/about"
						className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
					>
						교회 소개
					</TransitionLink>
					<TransitionLink
						href="/worship"
						className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
					>
						예배 안내
					</TransitionLink>
				</div>
			</div>
			{/* Scroll indicator */}
			<div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden md:block">
				<div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
			</div>
		</section>
	);
}
