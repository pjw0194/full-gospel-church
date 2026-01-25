import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageTransition from "@/components/common/PageTransition";
import TransitionProvider from "@/components/common/TransitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "캔사스 순복음 교회",
	description: "환영합니다.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={inter.className}>
				<TransitionProvider>
					<Header />
					<div className="pt-16">
						<PageTransition>{children}</PageTransition>
					</div>
					<Footer />
				</TransitionProvider>
			</body>
		</html>
	);
}
