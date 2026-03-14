import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageTransition from "@/components/common/PageTransition";
import TransitionProvider from "@/components/common/TransitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | 캔사스순복음교회",
    default: "캔사스순복음교회 | Kansas Full Gospel Church",
  },
  description:
    "캔사스시티 한인교회 캔사스순복음교회(KSFGC)에 오신 것을 환영합니다. Kansas Full Gospel Church는 1977년 창립된 순복음 Kansas Korean Church로 한국어·영어 예배를 드립니다.",
  openGraph: {
    title: "캔사스순복음교회 | Kansas Full Gospel Church",
    description:
      "캔사스시티 한인교회 캔사스순복음교회(KSFGC)에 오신 것을 환영합니다. Kansas Full Gospel Church는 1977년 창립된 순복음 Kansas Korean Church로 한국어·영어 예배를 드립니다.",
    url: "https://ksfgc.com",
    siteName: "캔사스순복음교회 | KSFGC",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "ieUtDJoHHZfOM8FWMY-vIH3DRmc30TTKbLTVdXHYbqk",
  },
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
