import { XMLParser } from "fast-xml-parser";

const PLAYLIST_ID = "PLJ1pbNfyrkV6vrkC1WUidsomfE4AkOJzl";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

export interface SermonData {
	id: string;
	title: string;
	date: string;
	description: string;
}

export async function getLatestSermon(): Promise<SermonData | null> {
	try {
		const response = await fetch(RSS_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
		const xmlText = await response.text();

		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
		});
		const result = parser.parse(xmlText);

		const entry = result.feed.entry[0]; // Get the first (latest) video

		if (!entry) return null;

		const videoId = entry["yt:videoId"];
		const fullTitle = entry.title;
        const parts = fullTitle.split("|").map((s: string) => s.trim());
        
        // Default to raw title if format doesn't match
        let title = fullTitle;
        let description = "";
        let date = new Date(entry.published).toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

        // Parse format: Date | Service Type | Title | Verse | Preacher
        if (parts.length >= 5) {
             title = parts[2]; // Title is the 3rd part
             const verse = parts[3];
             const preacher = parts[4];
             // Override date from title if available (1st part)
             date = parts[0]; 
             
             description = `본문: ${verse}\n설교자: ${preacher}`;
        } else if (entry["media:group"]["media:description"]) {
             // Fallback to YouTube description if title format is different
             description = entry["media:group"]["media:description"];
        }

		return {
			id: videoId,
			title: title,
			date: date,
			description: description,
		};
	} catch (error) {
		console.error("Failed to fetch latest sermon:", error);
		return null;
	}
}
