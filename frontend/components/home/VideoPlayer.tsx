"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoPlayerProps {
	videoId: string;
	title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);

	if (isPlaying) {
		return (
			<iframe
				className="w-full h-full"
				src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		);
	}

	return (
		<div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
			{/* Thumbnail Image */}
			<Image
				src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
				alt={title}
				fill
				className="object-cover transition duration-700 group-hover:scale-105"
				sizes="(max-width: 768px) 100vw, 50vw"
			/>
			
			{/* Overlay Gradient */}
			<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500" />

			{/* Play Button */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-2xl group-hover:scale-110 transition duration-300 relative">
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-pulse" />
					<div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-emerald-600 pl-1">
						<Play fill="currentColor" size={24} />
					</div>
				</div>
			</div>
		</div>
	);
}
