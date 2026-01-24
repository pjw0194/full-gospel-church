import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
		],
	},
};

export default nextConfig;
