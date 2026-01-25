"use client";

import { useState } from "react";
import TransitionLink from "@/components/common/TransitionLink";
import { Menu, X } from "lucide-react";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-center fixed top-0 z-50">
			<div className="w-full max-w-5xl px-4 flex justify-between items-center">
				{/* logo area */}
				<TransitionLink
					href="/"
					className="flex flex-col items-start leading-none"
					onClick={() => setIsMenuOpen(false)}
				>
					<span className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
						캔사스 <span className="text-emerald-600">순복음 교회</span>
					</span>
					<span className="text-[9px] md:text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1">
						Kansas Full Gospel Korean Church
					</span>
				</TransitionLink>
				{/* 메뉴 영역 (PC 버전) */}
				<nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
					<TransitionLink
						href="/about"
						className="hover:text-emerald-600 transition-colors"
					>
						교회소개
					</TransitionLink>
					<TransitionLink
						href="/sermons"
						className="hover:text-emerald-600 transition-colors"
					>
						예배/설교
					</TransitionLink>
					<TransitionLink
						href="/location"
						className="hover:text-emerald-600 transition-colors"
					>
						오시는길
					</TransitionLink>
				</nav>

				{/* 모바일 메뉴 버튼 */}
				<button
					className="md:hidden text-gray-600 hover:text-emerald-600 transition"
					onClick={toggleMenu}
					aria-label="Toggle menu"
				>
					{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* 모바일 메뉴 오버레이 */}
			<div
				className={`absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden flex flex-col items-center py-6 space-y-6 transition-all duration-300 ease-in-out transform origin-top ${
					isMenuOpen
						? "opacity-100 translate-y-0 visible"
						: "opacity-0 -translate-y-5 invisible"
				}`}
			>
				<TransitionLink
					href="/about"
					className="text-gray-800 font-medium hover:text-emerald-600 text-lg"
					onClick={() => setIsMenuOpen(false)}
				>
					교회소개
				</TransitionLink>
				<TransitionLink
					href="/sermons"
					className="text-gray-800 font-medium hover:text-emerald-600 text-lg"
					onClick={() => setIsMenuOpen(false)}
				>
					예배/설교
				</TransitionLink>
				<TransitionLink
					href="/location"
					className="text-gray-800 font-medium hover:text-emerald-600 text-lg"
					onClick={() => setIsMenuOpen(false)}
				>
					오시는길
				</TransitionLink>
			</div>
		</header>
	);
}
