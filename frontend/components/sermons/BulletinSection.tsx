"use client";

import React, { useState } from 'react';
import { ZoomIn, Download, Calendar, ChevronRight } from 'lucide-react';
import BulletinModal from '@/components/common/BulletinModal';

export default function BulletinSection() {
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  // Mock data for bulletins as per design request
  const bulletins = [
    { 
        date: "2026.01.25", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1586075010623-26c50dec77b8?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    { 
        date: "2026.01.18", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    { 
        date: "2026.01.11", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    { 
        date: "2026.01.04", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1586075010623-26c50dec77b8?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    { 
        date: "2025.12.28", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?auto=format&fit=crop&q=80&w=1200"
        ]
    },
    { 
        date: "2025.12.21", 
        title: "주일예배 주보", 
        images: [
            "https://images.unsplash.com/photo-1512418490979-92798ccc13b0?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1200"
        ]
    },
  ];

  const handleOpenModal = (date?: string) => {
    setSelectedDate(date);
    setIsBulletinModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBulletinModal = () => {
    setIsBulletinModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section id="bulletin-section" className="py-24 bg-stone-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">주간 주보</h2>
              <p className="text-stone-500">매주 발행되는 교회의 소식을 확인하세요.</p>
            </div>
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>LATEST: {bulletins[0].date}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Latest Bulletin Card */}
            <div className="lg:col-span-7">
              <div className="group relative bg-stone-900 rounded-[3rem] overflow-hidden shadow-xl aspect-[16/10] flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                  <img src={bulletins[0].images[0]} alt="Bulletin preview" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 text-center p-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{bulletins[0].date} 주보</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => handleOpenModal(bulletins[0].date)}
                      className="bg-white text-stone-900 px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-emerald-50 transition-colors"
                    >
                      <ZoomIn size={20} />
                      <span>크게 보기</span>
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-white/20 transition-colors">
                      <Download size={20} />
                      <span>다운로드</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Bulletins List */}
            <div className="lg:col-span-5 bg-white rounded-[3rem] p-8 border border-stone-100 shadow-sm flex flex-col">
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                지난 주보 아카이브
                <Calendar size={20} className="text-stone-300" />
              </h4>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-[400px]">
                {bulletins.slice(1).map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleOpenModal(item.date)}
                    className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-xs text-stone-400 font-eng mb-0.5">{item.date}</p>
                      <p className="font-bold text-stone-700">{item.title}</p>
                    </div>
                    <ChevronRight size={18} className="text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulletin Viewer Modal */}
      <BulletinModal 
        isOpen={isBulletinModalOpen} 
        onClose={closeBulletinModal} 
        bulletins={bulletins}
        initialDate={selectedDate}
      />
    </>
  );
}
