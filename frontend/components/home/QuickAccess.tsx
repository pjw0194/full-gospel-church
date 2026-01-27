"use client";

import React, { useState } from "react";
import TransitionLink from "@/components/common/TransitionLink";
import { Clock, MapPin, FileText } from "lucide-react";
import BulletinModal from "@/components/common/BulletinModal";

export default function QuickAccess() {
    const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);

    // Mock data for the latest bulletin (matching the structure required by BulletinModal)
    const latestBulletin = { 
        date: "2026.01.25", 
        title: "주일예배 주보",
        images: [
            "https://images.unsplash.com/photo-1586075010623-26c50dec77b8?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200"
        ]
    };

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
        if (href === "#bulletin-modal") {
            e.preventDefault();
            setIsBulletinModalOpen(true);
            document.body.style.overflow = 'hidden';
            return;
        }

		if (href.startsWith("#")) {
			e.preventDefault();
			const targetId = href.replace("#", "");
			const elem = document.getElementById(targetId);
			if (elem) {
				elem.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}
	};

    const closeBulletinModal = () => {
        setIsBulletinModalOpen(false);
        document.body.style.overflow = 'unset';
    };

	const infoItems = [
		{
			icon: <Clock className="text-emerald-600" size={28} />,
			title: "예배 시간",
			description: "주일예배 10:45",
			link: "#worship-schedule",
		},
		{
			icon: <MapPin className="text-emerald-600" size={28} />,
			title: "오시는 길",
			description: "1424 S 55th St, Kansas City, KS 66106",
			link: "#location-section",
		},
		{
			icon: <FileText className="text-emerald-600" size={28} />,
			title: "주보 보기",
			description: "이번 주 교회 소식",
			link: "#bulletin-modal",
		},
	];

	return (
        <>
            <section className="container mx-auto px-4 relative -mt-20 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 shadow-2xl rounded-2xl overflow-hidden bg-white border border-gray-100">
                    {infoItems.map((item, idx) => (
                        <TransitionLink
                            key={idx}
                            href={item.link}
                            onClick={(e) => handleScroll(e, item.link)}
                            className="flex flex-col items-center justify-center p-10 text-center transition-all duration-300 hover:bg-stone-50 group border-b md:border-b-0 md:border-r last:border-0 border-stone-100 cursor-pointer"
                        >
                            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {item.title}
                            </h3>
                            <p className="text-sm text-stone-500">{item.description}</p>
                        </TransitionLink>
                    ))}
                </div>
            </section>

            <BulletinModal 
                isOpen={isBulletinModalOpen} 
                onClose={closeBulletinModal} 
                bulletins={[latestBulletin]} 
            />
        </>
	);
}
