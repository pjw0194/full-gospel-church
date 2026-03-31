import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "**.supabase.co",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
			},
		],
	},
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{ key: "X-Frame-Options", value: "DENY" },
				{ key: "X-Content-Type-Options", value: "nosniff" },
				{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
				{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
				{
					key: "Content-Security-Policy",
					value: [
						"default-src 'self'",
						// unsafe-inline: Next.js injects inline scripts/styles for hydration.
						// unsafe-eval: Next.js dev + some prod chunks use eval-based source maps.
						"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
						"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
						"font-src 'self' https://fonts.gstatic.com",
						"img-src 'self' data: blob: https://*.supabase.co https://img.youtube.com https://i.ytimg.com https://drive.google.com https://lh3.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com",
						"media-src 'self' https://www.youtube.com",
						"frame-src https://www.youtube.com https://www.google.com https://maps.google.com",
						"connect-src 'self' https://*.supabase.co https://www.googleapis.com https://maps.googleapis.com",
					].join("; "),
				},
				{
					key: "Strict-Transport-Security",
					value: "max-age=63072000; includeSubDomains; preload",
				},
			],
		},
	],
};

export default nextConfig;
