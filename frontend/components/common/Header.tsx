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
      href: "https://www.facebook.com/people/%EC%BA%94%EC%82%AC%EC%8A%A4%EC%88%9C%EB%B3%B5%EC%9D%8C%EA%B5%90%ED%9A%8C/61573776143690/",
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
    <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-center border-b border-stone-100 bg-white">
      <div className="flex w-full max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <TransitionLink
          href="/"
          className="flex flex-col items-start leading-none"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="text-lg font-bold tracking-tight text-stone-800 md:text-xl">
            캔사스<span className="text-emerald-600">순복음교회</span>
          </span>
          <span className="mt-1 text-[9px] font-medium tracking-tighter text-stone-400 uppercase md:text-[10px]">
            Kansas Full Gospel Korean Church
          </span>
        </TransitionLink>

        {/* PC 내비게이션 */}
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex space-x-8 text-sm font-medium text-stone-600">
            {navItems.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "font-bold text-emerald-600"
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
                className="text-stone-400 transition-colors hover:text-emerald-600"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="text-stone-600 transition hover:text-emerald-600 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      <div
        className={`absolute top-16 left-0 flex w-full origin-top transform flex-col items-center space-y-6 border-b border-stone-100 bg-white py-6 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-5 opacity-0"
        }`}
      >
        {navItems.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={`text-lg font-medium transition-colors ${
              isActive(item.href)
                ? "font-bold text-emerald-600"
                : "text-stone-800 hover:text-emerald-600"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </TransitionLink>
        ))}
        <div className="flex w-full items-center justify-center gap-5 border-t border-stone-100 pt-5">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-stone-400 transition-colors hover:text-emerald-600"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
