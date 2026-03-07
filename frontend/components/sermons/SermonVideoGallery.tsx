"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SermonData } from "@/types";

const DESKTOP_SIZE = 9;
const MOBILE_SIZE = 4;

export default function SermonVideoGallery() {
	const [pageSize, setPageSize] = useState<number | null>(null);
	const [page, setPage] = useState(1);
	const [sermons, setSermons] = useState<SermonData[]>([]);
	const [loading, setLoading] = useState(true);
	const [maxReachablePage, setMaxReachablePage] = useState(1);
	const [isLastPage, setIsLastPage] = useState(false);
	const tokenCache = useRef<Map<number, string | null>>(new Map([[1, null]]));
	const lastPageSize = useRef<number | null>(null);

	// Detect viewport size on mount and on resize
	useEffect(() => {
		const detect = () => (window.innerWidth < 640 ? MOBILE_SIZE : DESKTOP_SIZE);
		setPageSize(detect());

		const onResize = () => {
			const newSize = detect();
			setPageSize((prev) => (prev !== newSize ? newSize : prev));
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	// Fetch sermons when page or pageSize changes
	useEffect(() => {
		if (pageSize === null) return;

		// Reset token cache when page size changes (mobile ↔ desktop)
		if (lastPageSize.current !== null && lastPageSize.current !== pageSize) {
			tokenCache.current = new Map([[1, null]]);
			setMaxReachablePage(1);
			setIsLastPage(false);
			lastPageSize.current = pageSize;
			setPage(1);
			return; // setPage(1) re-triggers this effect
		}
		lastPageSize.current = pageSize;

		const token = tokenCache.current.get(page);
		if (token === undefined) return; // page not yet reachable

		setLoading(true);
		const params = new URLSearchParams({ size: String(pageSize) });
		if (token) params.set("pageToken", token);

		fetch(`/api/sermons?${params}`)
			.then((r) => r.json())
			.then((data) => {
				setSermons(data.sermons ?? []);
				if (data.nextPageToken) {
					if (!tokenCache.current.has(page + 1)) {
						tokenCache.current.set(page + 1, data.nextPageToken);
						setMaxReachablePage((prev) => Math.max(prev, page + 1));
					}
					setIsLastPage(false);
				} else {
					setIsLastPage(true);
				}
			})
			.finally(() => setLoading(false));
	}, [page, pageSize]);

	const goToPage = (p: number) => {
		if (p < 1 || p > maxReachablePage) return;
		setPage(p);
		document.getElementById("video-archive")?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const getPageRange = () => {
		const start = Math.max(1, Math.min(page - 2, maxReachablePage - 4));
		const end = Math.min(maxReachablePage, start + 4);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const skeletonCount = pageSize ?? DESKTOP_SIZE;

	return (
		<>
			{loading ? (
				<>
					<div className="flex flex-col gap-3 sm:hidden">
						{Array.from({ length: skeletonCount }).map((_, i) => (
							<div key={i} className="h-20 bg-stone-100 rounded-2xl animate-pulse" />
						))}
					</div>
					<div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: skeletonCount }).map((_, i) => (
							<div key={i} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
						))}
					</div>
				</>
			) : (
				<>
					{/* Mobile: horizontal cards */}
					<div className="flex flex-col gap-3 sm:hidden">
						{sermons.map((sermon) => (
							<a
								key={sermon.id}
								href={`https://www.youtube.com/watch?v=${sermon.id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex gap-3 bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-md transition-shadow"
							>
								<div className="w-28 h-20 flex-shrink-0 bg-stone-100">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={`https://img.youtube.com/vi/${sermon.id}/mqdefault.jpg`}
										alt={sermon.title}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex-1 py-3 pr-3 flex flex-col justify-center min-w-0">
									<p className="text-emerald-600 text-xs font-medium mb-0.5">{sermon.date}</p>
									<h3 className="text-sm font-bold text-stone-900 line-clamp-2 mb-1">{sermon.title}</h3>
									<p className="text-stone-400 text-xs line-clamp-1">{sermon.description}</p>
								</div>
							</a>
						))}
					</div>

					{/* Desktop: grid with iframes */}
					<div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
						{sermons.map((sermon) => (
							<div
								key={sermon.id}
								className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100 hover:shadow-md transition-shadow"
							>
								<div className="aspect-video">
									<iframe
										className="w-full h-full"
										src={`https://www.youtube.com/embed/${sermon.id}`}
										title={sermon.title}
										allowFullScreen
									/>
								</div>
								<div className="p-5">
									<p className="text-emerald-600 text-sm font-medium mb-1.5">{sermon.date}</p>
									<h2 className="text-lg font-bold text-stone-900 mb-3 line-clamp-2">{sermon.title}</h2>
									<p className="text-stone-500 text-sm whitespace-pre-wrap line-clamp-3">{sermon.description}</p>
								</div>
							</div>
						))}
					</div>
				</>
			)}

			{/* Pagination */}
			<div className="mt-10 flex justify-center items-center gap-1.5">
				<button
					onClick={() => goToPage(page - 1)}
					disabled={page === 1 || loading}
					className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
				>
					<ChevronLeft size={18} />
				</button>

				{getPageRange().map((p) => (
					<button
						key={p}
						onClick={() => goToPage(p)}
						disabled={loading}
						className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-sm transition-colors ${
							p === page
								? "bg-emerald-600 text-white"
								: "border border-stone-200 text-stone-600 hover:bg-stone-50"
						}`}
					>
						{p}
					</button>
				))}

				{/* Ellipsis hint when there may be more pages */}
				{!isLastPage && (
					<span className="w-9 h-9 flex items-center justify-center text-stone-400 text-sm">
						...
					</span>
				)}

				<button
					onClick={() => goToPage(page + 1)}
					disabled={(page >= maxReachablePage && isLastPage) || loading}
					className="w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
				>
					<ChevronRight size={18} />
				</button>
			</div>
		</>
	);
}
