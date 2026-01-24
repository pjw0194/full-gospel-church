import { Youtube, Instagram } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 py-12 text-sm">
			<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<h3 className="text-white font-bold text-lg mb-2">
						캔사스 순복음 교회
					</h3>
					<p>1424 S 55th St, Kansas City, KS 66106</p>
					<p>Tel: 913-788-8828 | Email: kansasfgc@gmail.com</p>
				</div>
				<div className="flex space-x-4">
					<a
						href="#"
						className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-110"
						aria-label="Youtube"
					>
						<Youtube size={18} />
					</a>
					<a
						href="#"
						className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-110"
						aria-label="Instagram"
					>
						<Instagram size={18} />
					</a>
				</div>
			</div>
			<div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
				&copy; 2026 Kansas Full Gospel Church. All rights reserved.
			</div>
		</footer>
	);
}
