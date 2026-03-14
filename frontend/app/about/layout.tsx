import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "교회 소개",
  description:
    "1977년 창립된 캔사스 한인교회 캔사스순복음교회(KSFGC)를 소개합니다. Kansas Full Gospel Church Kansas City의 역사, 담임목사 인사말, 섬기는 분들을 확인하세요.",
  openGraph: {
    title: "교회 소개 | 캔사스순복음교회",
    description:
      "1977년 창립된 캔사스 한인교회 캔사스순복음교회(KSFGC)를 소개합니다. Kansas Full Gospel Church Kansas City의 역사, 담임목사 인사말, 섬기는 분들을 확인하세요.",
    url: "https://ksfgc.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
