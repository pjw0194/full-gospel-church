import React from "react";
import { MapPin, Phone } from "lucide-react";

const LocationSection: React.FC = () => {
	return (
		<div id="location-section" className="scroll-mt-24 py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						오시는 길
					</h2>
					<p className="text-emerald-600 font-medium mt-2">
						Location & Contact
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
					{/* Map Area */}
					<div className="lg:col-span-2">
						<div className="w-full h-full min-h-100 bg-stone-100 rounded-3xl overflow-hidden shadow-xl border border-stone-200 relative group">
							<iframe
								src="https://maps.google.com/maps?q=1424%20S%2055th%20St,%20Kansas%20City,%20KS%2066106&t=&z=15&ie=UTF8&iwloc=&output=embed"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen={true}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Google Maps"
							></iframe>
						</div>
					</div>

					{/* Info Sidebar */}
					<div className="flex flex-col h-full">
						<div className="bg-emerald-900 text-white p-8 md:p-10 rounded-3xl shadow-xl h-full flex flex-col justify-center relative overflow-hidden">
							{/* Decorative circle */}
							<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-800 rounded-full opacity-50 blur-3xl"></div>

							<h3 className="text-2xl font-bold mb-8 relative z-10">
								연락처 및 주소
							</h3>
							<div className="space-y-8 relative z-10">
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-emerald-800 rounded-2xl">
										<MapPin className="text-emerald-400" size={24} />
									</div>
									<div>
										<p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">
											Address
										</p>
										<p className="font-medium text-lg text-white/90">
											1424 S 55th St,
											<br />
											Kansas City, KS 66106
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-emerald-800 rounded-2xl">
										<Phone className="text-emerald-400" size={24} />
									</div>
									<div>
										<p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">
											Phone
										</p>
										<p className="font-medium text-lg text-white/90">
											(913) 788-8828
										</p>
									</div>
								</div>
								<div className="pt-8 border-t border-white/10 mt-4">
									<p className="text-emerald-100/70 text-sm leading-relaxed">
										캔사스순복음교회는 캔사스시티 지역에 위치하고 있습니다. 방문
										시 궁금한 점이 있으시면 언제든 전화로 문의해 주세요.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocationSection;
