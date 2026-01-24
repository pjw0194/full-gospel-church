import React from "react";
import axios from "axios";
import HeroSection from "@/components/home/HeroSection";
import QuickAccess from "@/components/home/QuickAccess";
import LatestSermon from "@/components/home/LatestSermon";
import NewsSection from "@/components/home/NewsSection";

interface HelloResponse {
	message: string;
}

const getMessage = async () => {
	const response = await axios.get<HelloResponse>(
		"http://127.0.0.1:8000/api/hello/",
	);
	return response.data;
};

export default async function Home() {
	const data = await getMessage();
	return (
		<main className="flex min-h-screen flex-col">
			<HeroSection />
			<QuickAccess />
			<LatestSermon />
			<NewsSection />
		</main>
	);
}
