"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Bulletin } from "@/lib/supabase";

interface BulletinModalProps {
	isOpen: boolean;
	onClose: () => void;
	bulletins: Bulletin[];
	initialId?: string;
}

const BulletinModal: React.FC<BulletinModalProps> = ({
	isOpen,
	onClose,
	bulletins,
	initialId,
}) => {
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [prevInitialId, setPrevInitialId] = useState(initialId);

	if (isOpen !== prevIsOpen || initialId !== prevInitialId) {
		setPrevIsOpen(isOpen);
		setPrevInitialId(initialId);
		if (isOpen) {
			const idx = initialId ? bulletins.findIndex((b) => b.id === initialId) : 0;
			setSelectedIdx(idx !== -1 ? idx : 0);
		}
	}

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "unset";
		return () => { document.body.style.overflow = "unset"; };
	}, [isOpen]);

	const current = bulletins[selectedIdx];

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
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
						className="relative z-10 w-full max-w-6xl bg-white rounded-4xl overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[85vh]"
					>
						{/* Header */}
						<div className="p-5 md:p-6 border-b border-stone-100 flex justify-between items-center bg-white shrink-0">
							<div className="flex items-center space-x-3">
								<div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 hidden sm:block">
									<FileText size={24} />
								</div>
								<div>
									<h3 className="text-lg md:text-xl font-bold text-stone-800">
										{current ? `${current.date} ${current.title}` : "주보"}
									</h3>
									<p className="text-[10px] md:text-xs text-stone-400 uppercase tracking-wider">
										Kansas Full Gospel Church
									</p>
								</div>
							</div>
							<button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition text-stone-500">
								<X size={24} />
							</button>
						</div>

						{/* Body */}
						{bulletins.length === 0 ? (
							<div className="flex-1 flex flex-col items-center justify-center text-stone-300 space-y-3">
								<FileText size={48} />
								<p className="text-sm">등록된 주보가 없습니다.</p>
							</div>
						) : (
							<div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-50 min-h-0">
								{/* Left: Scrollable images */}
								<div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 flex flex-col items-center">
									{current?.image_urls?.map((url, idx) => (
										<div key={idx} className="w-full max-w-2xl bg-white shadow-md rounded-2xl overflow-hidden border border-stone-200">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={url}
												alt={`${current.date} ${idx + 1}페이지`}
												className="w-full h-auto"
											/>
										</div>
									))}
									<div className="py-8 text-stone-300 text-xs uppercase tracking-widest">
										End of Bulletin
									</div>
								</div>

								{/* Right: Sidebar */}
								<div className="w-full md:w-72 bg-white border-t md:border-t-0 md:border-l border-stone-100 flex flex-col shrink-0 max-h-52 md:max-h-none">
									<div className="p-4 border-b border-stone-50 bg-stone-50/30 flex items-center justify-between shrink-0">
										<h4 className="font-bold text-stone-700 flex items-center space-x-2">
											<Calendar size={16} className="text-emerald-500" />
											<span>지난 주보 보기</span>
										</h4>
										<span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
											{bulletins.length}
										</span>
									</div>

									<div className="flex-1 overflow-y-auto p-3 space-y-1.5">
										{bulletins.map((item, idx) => (
											<button
												key={item.id}
												onClick={() => setSelectedIdx(idx)}
												className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${
													selectedIdx === idx
														? "bg-emerald-50 border border-emerald-100"
														: "hover:bg-stone-50 border border-transparent"
												}`}
											>
												<div className="flex items-center space-x-3 min-w-0">
													{item.image_urls?.[0] && (
														<div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-200 flex-none">
															{/* eslint-disable-next-line @next/next/no-img-element */}
															<img src={item.image_urls[0]} alt="" className="w-full h-full object-cover" />
														</div>
													)}
													<div className="text-left min-w-0">
														<p className={`text-[10px] font-bold mb-0.5 ${selectedIdx === idx ? "text-emerald-600" : "text-stone-400"}`}>
															{item.date}
														</p>
														<p className={`font-bold text-sm truncate ${selectedIdx === idx ? "text-emerald-900" : "text-stone-700"}`}>
															{item.title}
														</p>
													</div>
												</div>
												{selectedIdx === idx ? (
													<div className="w-2 h-2 bg-emerald-500 rounded-full flex-none ml-2" />
												) : (
													<ChevronRight size={14} className="text-stone-300 group-hover:text-emerald-500 transition flex-none ml-2" />
												)}
											</button>
										))}
									</div>
								</div>
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default BulletinModal;
