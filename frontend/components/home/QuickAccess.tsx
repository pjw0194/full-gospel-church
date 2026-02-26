"use client";

import React, { useState, useEffect } from "react";
import TransitionLink from "@/components/common/TransitionLink";
import { Clock, MapPin, FileText } from "lucide-react";
import BulletinModal from "@/components/common/BulletinModal";
import { supabase, Bulletin } from "@/lib/supabase";

export default function QuickAccess() {
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);

  useEffect(() => {
    supabase
      .from("bulletins")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => setBulletins(data ?? []));
  }, []);
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href === "#bulletin-modal") {
      e.preventDefault();
      setIsBulletinModalOpen(true);
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
      <section className="container mx-auto px-4 sm:px-6 relative -mt-10 sm:-mt-14 md:-mt-20 z-20">
        <div className="grid grid-cols-3 shadow-2xl rounded-2xl overflow-hidden bg-white border border-stone-100">
          {infoItems.map((item, idx) => (
            <TransitionLink
              key={idx}
              href={item.link}
              onClick={(e) => handleScroll(e, item.link)}
              className="flex flex-col items-center justify-center gap-2 px-3 py-5 sm:px-6 md:p-10 text-center transition-all duration-300 hover:bg-stone-50 group border-r last:border-0 border-stone-100 cursor-pointer"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300 mb-1">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-stone-800 sm:mb-1">
                  {item.title}
                </h3>
                <p className="hidden sm:block text-sm text-stone-500">{item.description}</p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </section>

      <BulletinModal
        isOpen={isBulletinModalOpen}
        onClose={closeBulletinModal}
        bulletins={bulletins}
      />
    </>
  );
}
