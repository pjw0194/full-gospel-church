"use client";

import React, { useState, useEffect } from 'react';
import { X, Download, ChevronRight, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bulletin {
  date: string;
  title: string;
  images: string[];
}

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  bulletins: Bulletin[];
  initialDate?: string;
}

const BulletinModal: React.FC<BulletinModalProps> = ({ isOpen, onClose, bulletins, initialDate }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        const idx = bulletins.findIndex(b => b.date === initialDate);
        if (idx !== -1) setSelectedIdx(idx);
        else setSelectedIdx(0);
      } else {
        setSelectedIdx(0);
      }
    }
  }, [isOpen, initialDate, bulletins]);

  const currentBulletin = bulletins[selectedIdx];

  return (
    <AnimatePresence>
      {isOpen && currentBulletin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[85vh]"
          >
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 hidden sm:block">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-stone-800">{currentBulletin.date} 주보</h3>
                  <p className="text-[10px] md:text-xs text-stone-400 uppercase font-eng tracking-wider">Kansas Full Gospel Church</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="hidden sm:flex px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors items-center space-x-2">
                  <Download size={16} />
                  <span>다운로드</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Modal Body - Two Column Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-50">
              
              {/* Left: Main Content (Scrollable Bulletin Images) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 flex flex-col items-center">
                {currentBulletin.images.map((img, idx) => (
                  <div key={idx} className="w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden border border-stone-200">
                    <img src={img} alt={`${currentBulletin.date} Page ${idx + 1}`} className="w-full h-auto" />
                  </div>
                ))}
                
                {/* End of content indicator */}
                <div className="py-10 text-stone-300 text-sm font-eng uppercase tracking-widest">
                  End of Bulletin
                </div>
              </div>
              
              {/* Right: Sidebar (Archives List) */}
              <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-stone-100 flex flex-col">
                <div className="p-5 border-b border-stone-50 bg-stone-50/30 flex items-center justify-between">
                  <h4 className="font-bold text-stone-700 flex items-center space-x-2">
                    <Calendar size={18} className="text-emerald-500" />
                    <span>지난 주보 보기</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{bulletins.length} Items</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {bulletins.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                        selectedIdx === idx 
                        ? 'bg-emerald-50 border-emerald-100 border' 
                        : 'hover:bg-stone-50 border border-transparent'
                      }`}
                    >
                      <div className="text-left">
                        <p className={`text-[10px] font-eng mb-0.5 ${selectedIdx === idx ? 'text-emerald-600 font-bold' : 'text-stone-400'}`}>
                          {item.date}
                        </p>
                        <p className={`font-bold text-sm ${selectedIdx === idx ? 'text-emerald-900' : 'text-stone-700'}`}>
                          {item.title}
                        </p>
                      </div>
                      {selectedIdx === idx ? (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      ) : (
                        <ChevronRight size={16} className="text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Download button (only visible on small screens when sidebar is at bottom) */}
                <div className="p-4 bg-stone-50 sm:hidden">
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2">
                    <Download size={18} />
                    <span>전체 주보 다운로드</span>
                  </button>
                </div>
              </div>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulletinModal;
