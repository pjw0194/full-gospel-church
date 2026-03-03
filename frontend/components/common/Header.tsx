"use client";

import { useState } from "react";
import TransitionLink from "@/components/common/TransitionLink";
import { Menu, X, Youtube, Instagram, Facebook } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/about", label: "교회소개" },
    { href: "/sermons", label: "예배/설교" },
    { href: "/news", label: "교회소식" },
  ];

  const socialLinks = [
    {
      href: "https://www.instagram.com/kansasfgchurch/",
      label: "Instagram",
      Icon: Instagram,
    },
    {
      href: "https://www.facebook.com/kansasfgc",
      label: "Facebook",
      Icon: Facebook,
    },
    {
      href: "https://www.youtube.com/@kansasfullgospelchurch",
      label: "Youtube",
      Icon: Youtube,
    },
  ];

  return (
    <header className="w-full h-16 bg-white border-b border-stone-100 flex items-center justify-center fixed top-0 z-50">
      <div className="w-full max-w-5xl px-4 flex justify-between items-center">
        {/* Logo */}
        <TransitionLink
          href="/"
          className="flex flex-col items-start leading-none"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-lg md:text-xl font-bold text-stone-800 tracking-tight">
            캔사스 <span className="text-emerald-600">순복음 교회</span>
          </span>
          <span className="text-[9px] md:text-[10px] text-stone-400 font-medium uppercase tracking-tighter mt-1">
            Kansas Full Gospel Korean Church
          </span>
        </TransitionLink>

        {/* PC 내비게이션 */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex space-x-8 text-sm font-medium text-stone-600">
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
          <div className="flex items-center gap-3 border-l border-stone-200 pl-8">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-stone-400 hover:text-emerald-600 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="md:hidden text-stone-600 hover:text-emerald-600 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      <div
        className={`absolute top-16 left-0 w-full bg-white border-b border-stone-100 shadow-lg md:hidden flex flex-col items-center py-6 space-y-6 transition-all duration-300 ease-in-out transform origin-top ${
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
                : "text-stone-800 hover:text-emerald-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </TransitionLink>
        ))}
        <div className="flex items-center gap-5 pt-5 border-t border-stone-100 w-full justify-center">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-stone-400 hover:text-emerald-600 transition-colors"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
