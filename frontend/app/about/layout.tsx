import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "교회 소개 | 캔사스순복음교회",
  description: "캔사스 지역 가장 오래된 한인교회로서 1977년 창립된 캔사스순복음교회를 소개합니다. 담임목사 인사말, 교회 역사, 섬기는 분들을 확인하세요.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
