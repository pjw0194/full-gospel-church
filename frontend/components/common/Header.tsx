import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-center fixed top-0 z-50">
			<div className="w-full max-w-5xl px-4 flex justify-between items-center">
				{/* logo area */}
				<Link
					href="/"
					className="text-xl font-bold text-gray-800 tracking-tight"
				>
					CHURCH <span className="text-emerald-600">LOGO</span>
				</Link>
				{/* 메뉴 영역 (PC 버전) */}
				<nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
					<Link
						href="/about"
						className="hover:text-emerald-600 transition-colors"
					>
						교회소개
					</Link>
					<Link
						href="/sermons"
						className="hover:text-emerald-600 transition-colors"
					>
						예배/설교
					</Link>
					<Link
						href="/location"
						className="hover:text-emerald-600 transition-colors"
					>
						오시는길
					</Link>
				</nav>

				{/* 모바일 메뉴 버튼 (일단 모양만) */}
				<button className="md:hidden text-gray-600">
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</header>
	);
}
