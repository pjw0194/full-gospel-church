export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 py-12 text-sm">
			<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<h3 className="text-white font-bold text-lg mb-2">
						캔사스 순복음 교회
					</h3>
					<p>1234 Church Rd, Lawrence, KS 66044</p>
					<p>Tel: 123-456-7890 | Email: info@kansaschurch.com</p>
				</div>
				<div className="flex gap-4">
					<a href="#" className="hover:text-white transition">
						Youtube
					</a>
					<a href="#" className="hover:text-white transition">
						Instagram
					</a>
					{/* 관리자 페이지 링크는 눈에 띄지 않게 처리 */}
					<a
						href="http://localhost:8000/admin"
						target="_blank"
						className="hover:text-white transition opacity-50"
					>
						Admin
					</a>
				</div>
			</div>
			<div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
				&copy; 2025 Kansas Full Gospel Church. All rights reserved.
			</div>
		</footer>
	);
}
