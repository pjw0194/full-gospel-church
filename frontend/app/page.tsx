import type { Metadata } from "next";
import React from "react";
import HeroSection from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: { absolute: "캔사스순복음교회 | Kansas Full Gospel Church · KSFGC" },
  description:
    "캔사스 순복음교회(KSFGC)는 Kansas City에 위치한 Kansas Korean Church입니다. 한인 교회 캔사스 지역 커뮤니티를 섬기며 주일 예배, 설교 영상, 교회 소식을 제공합니다.",
  openGraph: {
    title: "캔사스순복음교회 | Kansas Full Gospel Church · KSFGC",
    description:
      "캔사스 순복음교회(KSFGC)는 Kansas City에 위치한 Kansas Korean Church입니다. 한인 교회 캔사스 지역 커뮤니티를 섬기며 주일 예배, 설교 영상, 교회 소식을 제공합니다.",
    url: "https://ksfgc.com",
  },
};
import QuickAccess from "@/components/home/QuickAccess";
import LatestSermon from "@/components/home/LatestSermon";
import DailyVerse from "@/components/home/DailyVerse";
import WorshipSchedule from "@/components/home/WorshipSchedule";
import LocationSection from "@/components/home/LocationSection";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <div className="relative z-10 bg-white">
        <QuickAccess />
        <DailyVerse />
        <LatestSermon />
        <WorshipSchedule />
        <LocationSection />
      </div>
    </main>
  );
}
