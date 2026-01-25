export interface SermonData {
	id: string;
	title: string;
	date: string;
	description: string;
}

export interface BibleVerse {
	text: string;
	ref: string; // Bible verse
}

export interface YouTubeEntry {
	"yt:videoId": string;
	title: string;
	published: string;
	"media:group": {
		"media:description"?: string;
	};
}

export interface YouTubeSnippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	resourceId: {
		kind: string;
		videoId: string;
	};
}

export interface YouTubePlaylistItem {
	kind: string;
	etag: string;
	id: string;
	snippet: YouTubeSnippet;
}

export interface YouTubeApiResponse {
	kind: string;
	etag: string;
	nextPageToken?: string;
	prevPageToken?: string;
	items: YouTubePlaylistItem[];
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
}

export interface SermonListResponse {
	sermons: SermonData[];
	nextPageToken?: string;
	prevPageToken?: string;
}