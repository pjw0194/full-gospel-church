"use client";

import { useState, useRef } from "react";
import {
	Lock, PlusCircle, Trash2, CheckCircle, AlertCircle,
	ChevronLeft, ImagePlus, X, Loader2,
} from "lucide-react";
import { supabase, Bulletin } from "@/lib/supabase";
import TransitionLink from "@/components/common/TransitionLink";

type ImageItem = {
	key: string;
	preview: string;
	url: string;
	uploading: boolean;
	error: string;
};

function formatDate(dateStr: string) {
	return dateStr.replace(/-/g, ".");
}

export default function BulletinAdminPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);

	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [imageItems, setImageItems] = useState<ImageItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [bulletins, setBulletins] = useState<Bulletin[]>([]);
	const [bulletinsLoaded, setBulletinsLoaded] = useState(false);

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setAuthLoading(true);
		setAuthError("");
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error || !data.session) {
				setAuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
			} else {
				setToken(data.session.access_token);
				setIsAuthenticated(true);
				loadBulletins();
			}
		} catch {
			setAuthError("서버 연결에 실패했습니다.");
		} finally {
			setAuthLoading(false);
		}
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setIsAuthenticated(false);
		setToken("");
		setEmail("");
		setPassword("");
	};

	const loadBulletins = async () => {
		const { data } = await supabase
			.from("bulletins")
			.select("*")
			.order("created_at", { ascending: false });
		setBulletins(data ?? []);
		setBulletinsLoaded(true);
	};

	const uploadFile = async (file: File) => {
		const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const preview = URL.createObjectURL(file);
		setImageItems((prev) => [...prev, { key, preview, url: "", uploading: true, error: "" }]);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/admin/bulletin/upload", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});
			const json = await res.json();
			if (!res.ok) {
				setImageItems((prev) => prev.map((item) =>
					item.key === key ? { ...item, uploading: false, error: json.error ?? "업로드 실패" } : item
				));
			} else {
				setImageItems((prev) => prev.map((item) =>
					item.key === key ? { ...item, uploading: false, url: json.url } : item
				));
			}
		} catch {
			setImageItems((prev) => prev.map((item) =>
				item.key === key ? { ...item, uploading: false, error: "서버 연결 실패" } : item
			));
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		Array.from(e.target.files ?? []).forEach(uploadFile);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
	const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const allowed = ["image/png", "image/jpeg", "image/webp"];
		Array.from(e.dataTransfer.files).filter((f) => allowed.includes(f.type)).forEach(uploadFile);
	};

	const handleRemoveImage = async (key: string) => {
		const item = imageItems.find((i) => i.key === key);
		if (!item) return;
		setImageItems((prev) => prev.filter((i) => i.key !== key));
		if (item.url) {
			fetch("/api/admin/upload", {
				method: "DELETE",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ url: item.url }),
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const image_urls = imageItems.filter((i) => i.url).map((i) => i.url);
		if (!image_urls.length) {
			setSubmitMessage({ type: "error", text: "이미지를 업로드해주세요." });
			return;
		}
		setSubmitLoading(true);
		setSubmitMessage(null);
		try {
			const res = await fetch("/api/admin/bulletin", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, date: formatDate(date), image_urls }),
			});
			const json = await res.json();
			if (!res.ok) {
				setSubmitMessage({ type: "error", text: json.error ?? "오류가 발생했습니다." });
			} else {
				setSubmitMessage({ type: "success", text: "주보가 등록되었습니다!" });
				setTitle("");
				setDate("");
				setImageItems([]);
				loadBulletins();
			}
		} catch {
			setSubmitMessage({ type: "error", text: "서버 연결에 실패했습니다." });
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("이 주보를 삭제하시겠습니까?")) return;
		const res = await fetch("/api/admin/bulletin", {
			method: "DELETE",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ id }),
		});
		if (res.ok) {
			setBulletins((prev) => prev.filter((b) => b.id !== id));
		} else {
			alert("삭제 중 오류가 발생했습니다.");
		}
	};

	const isAnyUploading = imageItems.some((i) => i.uploading);

	if (!isAuthenticated) {
		return (
			<main className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-3xl shadow-xl p-10 border border-stone-100">
						<div className="flex flex-col items-center mb-8">
							<div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
								<Lock className="text-emerald-600" size={28} />
							</div>
							<h1 className="text-2xl font-bold text-[#333]">관리자 확인</h1>
							<p className="text-stone-400 text-sm mt-2">주보 관리자 페이지입니다.</p>
						</div>
						<form onSubmit={handleAuth} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-stone-600 mb-2">이메일</label>
								<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
									placeholder="관리자 이메일을 입력하세요" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-stone-600 mb-2">비밀번호</label>
								<input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
									placeholder="관리자 비밀번호를 입력하세요" required />
							</div>
							{authError && (
								<p className="flex items-center space-x-1 text-red-500 text-sm">
									<AlertCircle size={14} /><span>{authError}</span>
								</p>
							)}
							<button type="submit" disabled={authLoading}
								className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50">
								{authLoading ? "확인 중..." : "입장하기"}
							</button>
						</form>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-stone-50">
			<div className="max-w-2xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-10">
					<div>
						<h1 className="text-3xl font-bold text-[#333]">주보 관리</h1>
						<p className="text-stone-400 text-sm mt-1">주보 이미지를 업로드하거나 삭제할 수 있습니다.</p>
					</div>
					<div className="flex items-center space-x-3">
						<button
							onClick={handleLogout}
							className="text-sm text-stone-400 hover:text-red-500 transition"
						>
							로그아웃
						</button>
						<TransitionLink href="/" className="flex items-center space-x-1 text-sm text-stone-500 hover:text-emerald-600 transition">
							<ChevronLeft size={16} /><span>홈으로</span>
						</TransitionLink>
					</div>
				</div>

				{/* Upload Form */}
				<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 mb-8">
					<h2 className="text-lg font-bold text-[#333] mb-6 flex items-center space-x-2">
						<PlusCircle size={20} className="text-emerald-600" />
						<span>새 주보 등록</span>
					</h2>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">제목 *</label>
							<input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
								className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
								placeholder="예: 주일예배 주보" required />
						</div>

						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">날짜 *</label>
							<input type="date" value={date} onChange={(e) => setDate(e.target.value)}
								className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
								required />
						</div>

						{/* Image Upload */}
						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">
								이미지 * <span className="text-stone-300 font-normal">(여러 장 가능 · 페이지 순서대로)</span>
							</label>

							{imageItems.length > 0 && (
								<div className="grid grid-cols-3 gap-3 mb-3">
									{imageItems.map((item, idx) => (
										<div key={item.key} className="relative rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-100">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={item.preview} alt="" className="w-full h-full object-cover" />
											<div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
												{idx + 1}p
											</div>
											{item.uploading && (
												<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
													<Loader2 size={20} className="text-white animate-spin" />
												</div>
											)}
											{item.error && (
												<div className="absolute inset-0 bg-red-900/60 flex items-center justify-center p-2">
													<AlertCircle size={18} className="text-white" />
												</div>
											)}
											{!item.uploading && !item.error && (
												<div className="absolute bottom-1 right-1 bg-emerald-600/80 rounded-full p-0.5">
													<CheckCircle size={12} className="text-white" />
												</div>
											)}
											<button type="button" onClick={() => handleRemoveImage(item.key)}
												className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition">
												<X size={12} />
											</button>
										</div>
									))}
								</div>
							)}

							<div
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => fileInputRef.current?.click()}
								className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
									isDragging ? "border-emerald-400 bg-emerald-50 scale-[1.01]" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50"
								}`}
							>
								<ImagePlus size={24} className={`mb-1.5 transition-colors ${isDragging ? "text-emerald-500" : "text-stone-300"}`} />
								<span className={`text-sm font-medium transition-colors ${isDragging ? "text-emerald-600" : "text-stone-400"}`}>
									{isDragging ? "여기에 놓으세요" : "클릭하거나 드래그로 추가"}
								</span>
								<span className="text-xs text-stone-300 mt-0.5">PNG, JPG, WEBP · 여러 장 가능</span>
								<input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp"
									multiple className="hidden" onChange={handleImageChange} />
							</div>
						</div>

						{submitMessage && (
							<div className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-2xl ${
								submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
							}`}>
								{submitMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
								<span>{submitMessage.text}</span>
							</div>
						)}

						<button type="submit" disabled={submitLoading || isAnyUploading}
							className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50">
							{isAnyUploading ? "이미지 업로드 중..." : submitLoading ? "등록 중..." : "주보 등록하기"}
						</button>
					</form>
				</div>

				{/* Existing Bulletins */}
				<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
					<h2 className="text-lg font-bold text-[#333] mb-6">등록된 주보</h2>

					{!bulletinsLoaded && <p className="text-stone-400 text-sm text-center py-8">불러오는 중...</p>}
					{bulletinsLoaded && bulletins.length === 0 && (
						<p className="text-stone-300 text-sm text-center py-8">등록된 주보가 없습니다.</p>
					)}

					<div className="space-y-3">
						{bulletins.map((b) => (
							<div key={b.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
								<div className="flex items-center space-x-3 min-w-0">
									{b.image_urls?.[0] && (
										<div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 flex-none">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={b.image_urls[0]} alt="" className="w-full h-full object-cover" />
										</div>
									)}
									<div className="min-w-0">
										<p className="font-bold text-[#333] truncate">{b.title}</p>
										<p className="text-stone-400 text-xs mt-0.5">{b.date}</p>
										{b.image_urls?.length > 1 && (
											<p className="text-emerald-500 text-xs mt-0.5">{b.image_urls.length}페이지</p>
										)}
									</div>
								</div>
								<button onClick={() => handleDelete(b.id)}
									className="text-stone-300 hover:text-red-500 transition p-1 ml-4 flex-none">
									<Trash2 size={16} />
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
