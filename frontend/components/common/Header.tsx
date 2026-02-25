"use client";

import { useState } from "react";
import TransitionLink from "@/components/common/TransitionLink";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/about", label: "교회소개" },
    { href: "/sermons", label: "예배/설교" },
    { href: "/news", label: "교회소식" },
  ];

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
          {navItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-emerald-600 font-bold"
                  : "hover:text-emerald-600"
              }`}
            >
              {item.label}
            </TransitionLink>
          ))}
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
        {navItems.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={`text-lg font-medium transition-colors ${
              isActive(item.href)
                ? "text-emerald-600 font-bold"
                : "text-gray-800 hover:text-emerald-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </TransitionLink>
        ))}
      </div>
    </header>
  );
}
