import React from "react";
import axios from "axios";
import HeroSection from "@/components/home/HeroSection";
import QuickAccess from "@/components/home/QuickAccess";
import LatestSermon from "@/components/home/LatestSermon";
import NewsSection from "@/components/home/NewsSection";
import DailyVerse from "@/components/home/DailyVerse";

interface HelloResponse {
	message: string;
}

export default async function Home() {
	return (
		<main className="flex min-h-screen flex-col">
			<HeroSection />
			<QuickAccess />
			<DailyVerse />
			<LatestSermon />
			<NewsSection />
		</main>
	);
}
