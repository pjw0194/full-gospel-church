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
};

export default nextConfig;
