import { Youtube, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-sm text-gray-400">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="text-center md:text-left">
          <h3 className="mb-2 text-lg font-bold text-white">
            캔사스순복음교회
          </h3>
          <p>1424 S 55th St, Kansas City, KS 66106</p>
          <p>Tel: 913-260-2010 | Email: kansasfgc@gmail.com</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/kansasfgchurch/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:text-white"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="https://www.facebook.com/people/%EC%BA%94%EC%82%AC%EC%8A%A4%EC%88%9C%EB%B3%B5%EC%9D%8C%EA%B5%90%ED%9A%8C/61573776143690/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:text-white"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href="https://www.youtube.com/@kansasfullgospelchurch"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:text-white"
            aria-label="Youtube"
          >
            <Youtube size={18} />
          </a>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs">
        &copy; 2026 Kansas Full Gospel Church. All rights reserved.
      </div>
    </footer>
  );
}
