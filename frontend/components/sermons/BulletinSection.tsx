"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ZoomIn, Calendar, ChevronRight, FileText } from "lucide-react";
import BulletinModal from "@/components/common/BulletinModal";
import { supabase, Bulletin } from "@/lib/supabase";

export default function BulletinSection() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("bulletins")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data }) => {
        setBulletins(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (id?: string) => {
    setSelectedId(id);
    setIsBulletinModalOpen(true);
  };

  const latest = bulletins[0];

  return (
    <>
      <section
        id="bulletin-section"
        className="py-24 bg-stone-50 scroll-mt-24 px-3 sm:px-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start md:flex-row justify-between items- mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                주간 주보
              </h2>
              <p className="text-stone-500">
                매주 발행되는 교회의 소식을 확인하세요.
              </p>
            </div>
            {latest && (
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>LATEST: {latest.date}</span>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!loading && bulletins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-stone-300 space-y-4">
              <FileText size={56} />
              <p className="text-lg font-medium">등록된 주보가 없습니다.</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-32">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && bulletins.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Latest Bulletin Card */}
              <div className="lg:col-span-7">
                <div className="group relative bg-stone-900 rounded-[3rem] overflow-hidden shadow-xl aspect-[16/10] flex items-center justify-center">
                  {latest.image_urls?.[0] && (
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                      <Image
                        src={latest.image_urls[0]}
                        alt="주보 미리보기"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  )}
                  <div className="relative z-10 text-center p-8">
                    <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest mb-3">
                      Latest Bulletin
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                      {latest.date} {latest.title}
                    </h3>
                    <button
                      onClick={() => handleOpenModal(latest.id)}
                      className="bg-white text-stone-900 px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-50 transition-colors mx-auto"
                    >
                      <ZoomIn size={20} />
                      <span>크게 보기</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Archive List */}
              <div className="lg:col-span-5 bg-white rounded-[3rem] p-8 border border-stone-100 shadow-sm flex flex-col">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                  지난 주보 아카이브
                  <Calendar size={20} className="text-stone-300" />
                </h4>

                {bulletins.length === 1 ? (
                  <p className="text-stone-300 text-sm text-center py-8">
                    지난 주보가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-96">
                    {bulletins.slice(1).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleOpenModal(item.id)}
                        className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {item.image_urls?.[0] && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 flex-none">
                              <Image
                                src={item.image_urls[0]}
                                alt={item.title}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div className="text-left min-w-0">
                            <p className="text-xs text-stone-400 mb-0.5">
                              {item.date}
                            </p>
                            <p className="font-bold text-stone-700 truncate">
                              {item.title}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-none ml-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <BulletinModal
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
        bulletins={bulletins}
        initialId={selectedId}
      />
    </>
  );
}
