"use client";

import { useEffect, useState } from "react";
import { getDailyVerse, BibleVerse } from "@/data/verses";
import { Sparkles } from "lucide-react";

interface VerseData {
	text: string;
	ref: string;
}

export default function DailyVerse() {
	const [verse, setVerse] = useState<VerseData | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVerse(getDailyVerse());
		}, 0);

		return () => clearTimeout(timer);
	}, []);

	if (!verse) return null;

	return (
		<section className="max-w-5xl mx-auto px-4 py-12">
			<div className="bg-emerald-50/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 text-emerald-900 relative overflow-hidden shadow-xl border border-emerald-100/50">
				<div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
					<Sparkles size={140} />
				</div>

				<div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
					<div className="inline-block px-4 py-1 bg-emerald-100/50 backdrop-blur-md rounded-full text-[10px] tracking-[0.2em] font-bold uppercase text-emerald-700">
						Today&apos;s Word
					</div>

					<h3 className="text-xl md:text-2xl font-bold leading-relaxed text-gray-800">
						&quot;{verse.text}&quot;
					</h3>
					<p className="text-emerald-600 font-medium text-base italic">
						{verse.ref}
					</p>
				</div>
			</div>
		</section>
	);
}
