import React from "react";
import axios from "axios";
import HeroSection from "@/components/home/HeroSection";
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
