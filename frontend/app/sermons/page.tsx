import { getSermonList } from "@/lib/youtube";
import Link from "next/link";

interface Props {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SermonsPage({ searchParams }: Props) {
	const resolvedParams = await searchParams;
	const pageToken =
		typeof resolvedParams.pageToken === "string"
			? resolvedParams.pageToken
			: undefined;

	const { sermons, nextPageToken, prevPageToken } = await getSermonList(pageToken);

	return (
		<main className="py-20">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold mb-10">설교 목록</h1>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{sermons.map((sermon) => (
						<div
							key={sermon.id}
							className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
						>
							<div className="aspect-video">
								<iframe
									className="w-full h-full"
									src={`https://www.youtube.com/embed/${sermon.id}`}
									title={sermon.title}
									allowFullScreen
								/>
							</div>
							<div className="p-6">
								<p className="text-emerald-600 text-sm font-medium mb-2">
									{sermon.date}
								</p>
								<h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
									{sermon.title}
								</h2>
								<p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
									{sermon.description}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-12 flex justify-center gap-4">
					{prevPageToken && (
						<Link
							href={`/sermons?pageToken=${prevPageToken}`}
							className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
						>
							이전 페이지
						</Link>
					)}
					{nextPageToken && (
						<Link
							href={`/sermons?pageToken=${nextPageToken}`}
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
						>
							다음 페이지
						</Link>
					)}
				</div>
			</div>
		</main>
	);
}
