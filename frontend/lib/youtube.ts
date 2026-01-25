import { XMLParser } from "fast-xml-parser";
import {
	SermonData,
	SermonListResponse,
	YouTubeApiResponse,
	YouTubeEntry,
	YouTubePlaylistItem,
} from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const PLAYLIST_ID = "PLJ1pbNfyrkV5YJu7Erl6OmGUJFpyPbOR8";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const BASE_URL = "https://www.googleapis.com/youtube/v3/playlistItems";

export async function getLatestSermon(): Promise<SermonData | null> {
	try {
		const response = await fetch(RSS_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
		const xmlText = await response.text();

		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
		});
		const result = parser.parse(xmlText);

		const entry: YouTubeEntry = result.feed.entry[0]; // Get the first (latest) video

		if (!entry) return null;

		const videoId = entry["yt:videoId"];
		const fullTitle = entry.title;
		const rawDescription = entry["media:group"]["media:description"] || "";
		const publishedAt = entry.published;

		const { title, date, description } = parseSermonData(
			fullTitle,
			rawDescription,
			publishedAt,
		);

		return {
			id: videoId,
			title,
			date,
			description,
		};
	} catch (error) {
		console.error("Failed to fetch latest sermon:", error);
		return null;
	}
}

export async function getSermonList(
	pageToken?: string,
): Promise<SermonListResponse> {
	if (!API_KEY) {
		console.error("YouTube API Key is Missing");
		return { sermons: [] };
	}

	try {
		const url = new URL(BASE_URL);
		url.searchParams.append("part", "snippet");
		url.searchParams.append("playlistId", PLAYLIST_ID);
		url.searchParams.append("maxResults", "12"); // Fetch 12 items per page
		url.searchParams.append("key", API_KEY);
		if (pageToken) url.searchParams.append("pageToken", pageToken);

		const response = await fetch(url.toString(), {
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			console.error(`Youtube API Error: ${response.status}`);
			return { sermons: [] };
		}

		const data: YouTubeApiResponse = await response.json();
		const items = data.items || [];

		const sermons = items
			.map((item: YouTubePlaylistItem) => {
				const snippet = item.snippet;

				// Skip deleted or private videos
				if (
					!snippet.resourceId ||
					snippet.title === "Deleted video" ||
					snippet.title === "Private video"
				) {
					return null;
				}
				const videoId = snippet.resourceId.videoId;
				const fullTitle = snippet.title;
				const rawDescription = snippet.description;
				const publishedAt = snippet.publishedAt;

				const { title, date, description } = parseSermonData(
					fullTitle,
					rawDescription,
					publishedAt,
				);

				return {
					id: videoId,
					title,
					date,
					description,
				};
			})
			.filter((sermon): sermon is SermonData => sermon !== null);

		return {
			sermons,
			nextPageToken: data.nextPageToken,
			prevPageToken: data.prevPageToken,
		};
	} catch (error) {
		console.error("Failed to fetch sermon list:", error);
		return { sermons: [] };
	}
}

function parseSermonData(
	fullTitle: string,
	rawDescription: string,
	publishedAt: string,
) {
	const parts = fullTitle.split("|").map((s) => s.trim());
	let title = fullTitle;
	let description = rawDescription;

	const formatKoDate = (dateObj: Date) => {
		return dateObj.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	let date = formatKoDate(new Date(publishedAt));

	const publishedDate = new Date(publishedAt);
	// Videos before 2025-04-28 do not follow the strict 5-part format
	const isLegacy = publishedDate < new Date("2025-04-28");

	if (parts.length >= 2) {
		// Assume first part is date. Try to format it if it's a valid date string.
		const titleDate = new Date(parts[0].replace(/\./g, "-"));
		if (!isNaN(titleDate.getTime())) {
			date = formatKoDate(titleDate);
		} else {
			date = parts[0];
		}

		if (!isLegacy && parts.length >= 5) {
			// Format: Date | Service Type | Title | Verse | Preacher
			title = parts[2];
			description = `본문: ${parts[3]} / 설교자: ${parts[4]}`;
		} else {
			// Fallback & Legacy: Remove date from title
			title = parts.slice(1).join(" | ");

			// Truncate long descriptions
			if (description.length > 100) {
				description = description.substring(0, 100) + "...";
			}
		}
	} else {
		// If title doesn't have pipes, truncate description as well
		if (description.length > 100) {
			description = description.substring(0, 100) + "...";
		}
	}

	return { title, date, description };
}
