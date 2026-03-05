"use client";

import { useState, useRef, useEffect } from "react";
import {
	Lock, PlusCircle, Trash2, CheckCircle, AlertCircle,
	ChevronLeft, ImagePlus, X, Loader2, Newspaper, BookOpen, History,
	Edit3, Star, ChevronDown, ChevronUp, Save,
} from "lucide-react";
import { supabase, Bulletin, ChurchNews, HistoryEra, HistoryEvent } from "@/lib/supabase";
import TransitionLink from "@/components/common/TransitionLink";

type Tab = "bulletin" | "news" | "history";

type ImageItem = {
	key: string;
	preview: string;
	url: string;
	uploading: boolean;
	error: string;
};

function formatBulletinDate(dateStr: string) {
	return dateStr.replace(/-/g, ".");
}

function formatNewsDate(dateStr: string) {
	const d = new Date(dateStr);
	return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// ============================================================
// Bulletin Tab
// ============================================================
function BulletinTab({ token }: { token: string }) {
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [imageItems, setImageItems] = useState<ImageItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [bulletins, setBulletins] = useState<Bulletin[]>([]);
	const [bulletinsLoaded, setBulletinsLoaded] = useState(false);

	useEffect(() => { loadBulletins(); }, []);

	const loadBulletins = async () => {
		const { data } = await supabase.from("bulletins").select("*").order("date", { ascending: false });
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
			setImageItems((prev) => prev.map((item) =>
				item.key === key
					? { ...item, uploading: false, url: res.ok ? json.url : "", error: res.ok ? "" : (json.error ?? "업로드 실패") }
					: item
			));
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
		Array.from(e.dataTransfer.files).filter((f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type)).forEach(uploadFile);
	};

	const handleRemoveImage = (key: string) => {
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
		if (!image_urls.length) { setSubmitMessage({ type: "error", text: "이미지를 업로드해주세요." }); return; }
		setSubmitLoading(true);
		setSubmitMessage(null);
		try {
			const res = await fetch("/api/admin/bulletin", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, date: formatBulletinDate(date), image_urls }),
			});
			const json = await res.json();
			if (!res.ok) {
				setSubmitMessage({ type: "error", text: json.error ?? "오류가 발생했습니다." });
			} else {
				setSubmitMessage({ type: "success", text: "주보가 등록되었습니다!" });
				setTitle(""); setDate(""); setImageItems([]);
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
		if (res.ok) setBulletins((prev) => prev.filter((b) => b.id !== id));
		else alert("삭제 중 오류가 발생했습니다.");
	};

	const isAnyUploading = imageItems.some((i) => i.uploading);

	return (
		<div className="space-y-8">
			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
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
							className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]" required />
					</div>
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
										<div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{idx + 1}p</div>
										{item.uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 size={20} className="text-white animate-spin" /></div>}
										{item.error && <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center p-2"><AlertCircle size={18} className="text-white" /></div>}
										{!item.uploading && !item.error && <div className="absolute bottom-1 right-1 bg-emerald-600/80 rounded-full p-0.5"><CheckCircle size={12} className="text-white" /></div>}
										<button type="button" onClick={() => handleRemoveImage(item.key)}
											className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition"><X size={12} /></button>
									</div>
								))}
							</div>
						)}
						<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging ? "border-emerald-400 bg-emerald-50 scale-[1.01]" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
							<ImagePlus size={24} className={`mb-1.5 transition-colors ${isDragging ? "text-emerald-500" : "text-stone-300"}`} />
							<span className={`text-sm font-medium transition-colors ${isDragging ? "text-emerald-600" : "text-stone-400"}`}>{isDragging ? "여기에 놓으세요" : "클릭하거나 드래그로 추가"}</span>
							<span className="text-xs text-stone-300 mt-0.5">PNG, JPG, WEBP · 여러 장 가능</span>
							<input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={handleImageChange} />
						</div>
					</div>
					{submitMessage && (
						<div className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-2xl ${submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
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

			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
				<h2 className="text-lg font-bold text-[#333] mb-6">등록된 주보</h2>
				{!bulletinsLoaded && <p className="text-stone-400 text-sm text-center py-8">불러오는 중...</p>}
				{bulletinsLoaded && bulletins.length === 0 && <p className="text-stone-300 text-sm text-center py-8">등록된 주보가 없습니다.</p>}
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
									{b.image_urls?.length > 1 && <p className="text-emerald-500 text-xs mt-0.5">{b.image_urls.length}페이지</p>}
								</div>
							</div>
							<button onClick={() => handleDelete(b.id)} className="text-stone-300 hover:text-red-500 transition p-1 ml-4 flex-none"><Trash2 size={16} /></button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// News Tab
// ============================================================
function NewsTab({ token }: { token: string }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageItems, setImageItems] = useState<ImageItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [posts, setPosts] = useState<ChurchNews[]>([]);
	const [postsLoaded, setPostsLoaded] = useState(false);

	useEffect(() => { loadPosts(); }, []);

	const loadPosts = async () => {
		const { data } = await supabase.from("church_news").select("*").order("created_at", { ascending: false });
		setPosts(data ?? []);
		setPostsLoaded(true);
	};

	const uploadFile = async (file: File) => {
		const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const preview = URL.createObjectURL(file);
		setImageItems((prev) => [...prev, { key, preview, url: "", uploading: true, error: "" }]);
		const formData = new FormData();
		formData.append("file", file);
		try {
			const res = await fetch("/api/admin/upload", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});
			const json = await res.json();
			setImageItems((prev) => prev.map((item) =>
				item.key === key
					? { ...item, uploading: false, url: res.ok ? json.url : "", error: res.ok ? "" : (json.error ?? "업로드 실패") }
					: item
			));
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
		Array.from(e.dataTransfer.files).filter((f) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(f.type)).forEach(uploadFile);
	};

	const handleRemoveImage = (key: string) => {
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
		setSubmitLoading(true);
		setSubmitMessage(null);
		const image_urls = imageItems.filter((i) => i.url).map((i) => i.url);
		try {
			const res = await fetch("/api/admin/news", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ title, content, image_urls }),
			});
			const json = await res.json();
			if (!res.ok) {
				setSubmitMessage({ type: "error", text: json.error ?? "오류가 발생했습니다." });
			} else {
				setSubmitMessage({ type: "success", text: "게시물이 등록되었습니다!" });
				setTitle(""); setContent(""); setImageItems([]);
				loadPosts();
			}
		} catch {
			setSubmitMessage({ type: "error", text: "서버 연결에 실패했습니다." });
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("이 게시물을 삭제하시겠습니까?")) return;
		const res = await fetch("/api/admin/news", {
			method: "DELETE",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ id }),
		});
		if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
		else alert("삭제 중 오류가 발생했습니다.");
	};

	const isAnyUploading = imageItems.some((i) => i.uploading);

	return (
		<div className="space-y-8">
			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
				<h2 className="text-lg font-bold text-[#333] mb-6 flex items-center space-x-2">
					<PlusCircle size={20} className="text-emerald-600" />
					<span>새 소식 작성</span>
				</h2>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-stone-600 mb-2">제목 *</label>
						<input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
							placeholder="소식 제목을 입력하세요" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-stone-600 mb-2">내용 *</label>
						<textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6}
							className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] resize-none"
							placeholder="소식 내용을 입력하세요" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-stone-600 mb-2">
							이미지 <span className="text-stone-300 font-normal">(선택 · 여러 장 가능)</span>
						</label>
						{imageItems.length > 0 && (
							<div className="grid grid-cols-3 gap-3 mb-3">
								{imageItems.map((item) => (
									<div key={item.key} className="relative rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-100">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={item.preview} alt="" className="w-full h-full object-cover" />
										{item.uploading && <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-1"><Loader2 size={20} className="text-white animate-spin" /><span className="text-white text-[10px]">업로드 중</span></div>}
										{item.error && <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center p-2"><AlertCircle size={18} className="text-white mb-1" /><span className="text-white text-[10px] text-center">{item.error}</span></div>}
										{!item.uploading && !item.error && <div className="absolute bottom-1.5 left-1.5 bg-emerald-600/80 rounded-full p-0.5"><CheckCircle size={12} className="text-white" /></div>}
										<button type="button" onClick={() => handleRemoveImage(item.key)}
											className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition"><X size={12} /></button>
									</div>
								))}
							</div>
						)}
						<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragging ? "border-emerald-400 bg-emerald-50 scale-[1.01]" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50"}`}>
							<ImagePlus size={24} className={`mb-1.5 transition-colors ${isDragging ? "text-emerald-500" : "text-stone-300"}`} />
							<span className={`text-sm font-medium transition-colors ${isDragging ? "text-emerald-600" : "text-stone-400"}`}>{isDragging ? "여기에 놓으세요" : "클릭하거나 드래그로 추가"}</span>
							<span className="text-xs text-stone-300 mt-0.5">JPG, PNG, GIF, WEBP · 여러 장 가능</span>
							<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple className="hidden" onChange={handleImageChange} />
						</div>
					</div>
					{submitMessage && (
						<div className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-2xl ${submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
							{submitMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
							<span>{submitMessage.text}</span>
						</div>
					)}
					<button type="submit" disabled={submitLoading || isAnyUploading}
						className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50">
						{isAnyUploading ? "이미지 업로드 중..." : submitLoading ? "게시 중..." : "소식 게시하기"}
					</button>
				</form>
			</div>

			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
				<h2 className="text-lg font-bold text-[#333] mb-6">기존 게시물</h2>
				{!postsLoaded && <p className="text-stone-400 text-sm text-center py-8">불러오는 중...</p>}
				{postsLoaded && posts.length === 0 && <p className="text-stone-300 text-sm text-center py-8">등록된 게시물이 없습니다.</p>}
				<div className="space-y-4">
					{posts.map((post) => (
						<div key={post.id} className="flex items-start justify-between p-5 bg-stone-50 rounded-2xl border border-stone-100">
							<div className="flex items-start space-x-4 flex-1 min-w-0 mr-4">
								{post.image_urls?.[0] && (
									<div className="flex-none w-14 h-14 rounded-xl overflow-hidden border border-stone-200">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={post.image_urls[0]} alt="" className="w-full h-full object-cover" />
									</div>
								)}
								<div className="min-w-0">
									<p className="font-bold text-[#333] truncate">{post.title}</p>
									<p className="text-stone-400 text-xs mt-0.5">{formatNewsDate(post.created_at)}</p>
									{post.image_urls?.length > 1 && <p className="text-emerald-500 text-xs mt-1">이미지 {post.image_urls.length}장</p>}
								</div>
							</div>
							<button onClick={() => handleDelete(post.id)} className="flex-none text-stone-300 hover:text-red-500 transition p-1"><Trash2 size={18} /></button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// History Tab
// ============================================================

const ERA_ICON_OPTIONS = [
	{ value: "Star", label: "Star (별)" },
	{ value: "ShieldCheck", label: "ShieldCheck (방패)" },
	{ value: "Users", label: "Users (사람들)" },
	{ value: "History", label: "History (역사)" },
	{ value: "Globe", label: "Globe (지구)" },
	{ value: "Zap", label: "Zap (번개)" },
	{ value: "Sparkles", label: "Sparkles (반짝임)" },
	{ value: "Award", label: "Award (어워드)" },
	{ value: "BookOpen", label: "BookOpen (책)" },
];

function HistoryTab({ token }: { token: string }) {
	const [eras, setEras] = useState<HistoryEra[]>([]);
	const [events, setEvents] = useState<HistoryEvent[]>([]);
	const [loaded, setLoaded] = useState(false);

	// Event form
	const [selectedEraId, setSelectedEraId] = useState("");
	const [year, setYear] = useState("");
	const [date, setDate] = useState("");
	const [eventText, setEventText] = useState("");
	const [isMajor, setIsMajor] = useState(false);
	const [eventSubmitLoading, setEventSubmitLoading] = useState(false);
	const [eventMessage, setEventMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
	const [filterEraId, setFilterEraId] = useState("all");

	// Era management panel
	const [erasPanelOpen, setErasPanelOpen] = useState(false);
	const [eraFormMode, setEraFormMode] = useState<"add" | "edit">("add");
	const [editingEraId, setEditingEraId] = useState("");
	const [eraTitle, setEraTitle] = useState("");
	const [eraPeriod, setEraPeriod] = useState("");
	const [eraIconName, setEraIconName] = useState("Star");
	const [eraSortOrder, setEraSortOrder] = useState("");
	const [eraSubmitLoading, setEraSubmitLoading] = useState(false);
	const [eraMessage, setEraMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	useEffect(() => { loadData(); }, []);

	const loadData = async () => {
		const [{ data: erasData }, { data: eventsData }] = await Promise.all([
			supabase.from("church_history_eras").select("*").order("sort_order", { ascending: true }),
			supabase.from("church_history_events").select("*").order("sort_order", { ascending: true }),
		]);
		const eraList = erasData ?? [];
		setEras(eraList);
		setEvents(eventsData ?? []);
		if (eraList.length > 0 && !selectedEraId) setSelectedEraId(eraList[0].id);
		setLoaded(true);
	};

	// ---- Event handlers ----
	const handleEventSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setEventSubmitLoading(true);
		setEventMessage(null);
		try {
			const res = await fetch("/api/admin/history", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ era_id: selectedEraId, year, date, event_text: eventText, is_major: isMajor }),
			});
			const json = await res.json();
			if (!res.ok) {
				setEventMessage({ type: "error", text: json.error ?? "오류가 발생했습니다." });
			} else {
				setEventMessage({ type: "success", text: "연혁이 추가되었습니다!" });
				setYear(""); setDate(""); setEventText(""); setIsMajor(false);
				loadData();
			}
		} catch {
			setEventMessage({ type: "error", text: "서버 연결에 실패했습니다." });
		} finally {
			setEventSubmitLoading(false);
		}
	};

	const handleEventDelete = async (id: string) => {
		if (!confirm("이 연혁 항목을 삭제하시겠습니까?")) return;
		const res = await fetch("/api/admin/history", {
			method: "DELETE",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ id }),
		});
		if (res.ok) setEvents((prev) => prev.filter((ev) => ev.id !== id));
		else alert("삭제 중 오류가 발생했습니다.");
	};

	// ---- Era handlers ----
	const openAddEra = () => {
		setEraFormMode("add");
		setEditingEraId("");
		setEraTitle(""); setEraPeriod(""); setEraIconName("Star"); setEraSortOrder("");
		setEraMessage(null);
	};

	const openEditEra = (era: HistoryEra) => {
		setEraFormMode("edit");
		setEditingEraId(era.id);
		setEraTitle(era.title);
		setEraPeriod(era.period);
		setEraIconName(era.icon_name);
		setEraSortOrder(String(era.sort_order));
		setEraMessage(null);
	};

	const handleEraSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setEraSubmitLoading(true);
		setEraMessage(null);
		const body: Record<string, unknown> = {
			title: eraTitle, period: eraPeriod, icon_name: eraIconName,
			...(eraSortOrder !== "" && { sort_order: Number(eraSortOrder) }),
		};
		if (eraFormMode === "edit") body.id = editingEraId;
		try {
			const res = await fetch("/api/admin/history/era", {
				method: eraFormMode === "add" ? "POST" : "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(body),
			});
			const json = await res.json();
			if (!res.ok) {
				setEraMessage({ type: "error", text: json.error ?? "오류가 발생했습니다." });
			} else {
				setEraMessage({ type: "success", text: eraFormMode === "add" ? "시대가 추가되었습니다!" : "시대가 수정되었습니다!" });
				openAddEra();
				loadData();
			}
		} catch {
			setEraMessage({ type: "error", text: "서버 연결에 실패했습니다." });
		} finally {
			setEraSubmitLoading(false);
		}
	};

	const handleEraDelete = async (era: HistoryEra) => {
		const eventCount = events.filter((ev) => ev.era_id === era.id).length;
		const msg = eventCount > 0
			? `"${era.title}" 시대를 삭제하면 연결된 연혁 항목 ${eventCount}개도 함께 삭제됩니다. 계속하시겠습니까?`
			: `"${era.title}" 시대를 삭제하시겠습니까?`;
		if (!confirm(msg)) return;
		const res = await fetch("/api/admin/history/era", {
			method: "DELETE",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ id: era.id }),
		});
		if (res.ok) {
			setEras((prev) => prev.filter((e) => e.id !== era.id));
			setEvents((prev) => prev.filter((ev) => ev.era_id !== era.id));
			if (editingEraId === era.id) openAddEra();
		} else {
			alert("삭제 중 오류가 발생했습니다.");
		}
	};

	const filteredEvents = filterEraId === "all"
		? events
		: events.filter((ev) => ev.era_id === filterEraId);

	const groupedByEraAndYear = eras.map((era) => {
		const eraEvents = filteredEvents.filter((ev) => ev.era_id === era.id);
		const yearMap = new Map<string, HistoryEvent[]>();
		for (const ev of eraEvents) {
			if (!yearMap.has(ev.year)) yearMap.set(ev.year, []);
			yearMap.get(ev.year)!.push(ev);
		}
		const years = Array.from(yearMap.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.map(([y, evs]) => ({ year: y, events: evs }));
		return { era, years };
	}).filter((g) => g.years.length > 0 || filterEraId === "all");

	return (
		<div className="space-y-8">
			{/* ---- Era Management Panel ---- */}
			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
				<button
					type="button"
					onClick={() => setErasPanelOpen((v) => !v)}
					className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50 transition"
				>
					<div className="flex items-center space-x-2">
						<Edit3 size={20} className="text-emerald-600" />
						<span className="text-lg font-bold text-[#333]">시대(Era) 관리</span>
						<span className="text-xs text-stone-400 font-normal ml-1">추가 · 수정 · 삭제</span>
					</div>
					{erasPanelOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
				</button>

				{erasPanelOpen && (
					<div className="border-t border-stone-100 p-8 space-y-6">
						{/* Era list */}
						<div className="space-y-2">
							{!loaded && <p className="text-stone-400 text-sm text-center py-4">불러오는 중...</p>}
							{loaded && eras.length === 0 && <p className="text-stone-300 text-sm text-center py-4">등록된 시대가 없습니다.</p>}
							{eras.map((era) => (
								<div key={era.id} className={`flex items-center justify-between p-4 rounded-2xl border transition ${editingEraId === era.id ? "border-emerald-200 bg-emerald-50" : "border-stone-100 bg-stone-50"}`}>
									<div className="flex items-center space-x-3 min-w-0">
										<div className="flex-none w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
											{era.sort_order}
										</div>
										<div className="min-w-0">
											<p className="font-bold text-[#333] text-sm">{era.title}</p>
											<p className="text-stone-400 text-xs">{era.period} · 아이콘: {era.icon_name}</p>
										</div>
									</div>
									<div className="flex items-center space-x-1 flex-none ml-3">
										<button
											type="button"
											onClick={() => openEditEra(era)}
											className="p-1.5 text-stone-400 hover:text-emerald-600 transition"
											title="수정"
										>
											<Edit3 size={14} />
										</button>
										<button
											type="button"
											onClick={() => handleEraDelete(era)}
											className="p-1.5 text-stone-300 hover:text-red-500 transition"
											title="삭제"
										>
											<Trash2 size={14} />
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Add / Edit form */}
						<div className="border-t border-stone-100 pt-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-bold text-stone-700">
									{eraFormMode === "add" ? "새 시대 추가" : `"${eraTitle}" 수정 중`}
								</h3>
								{eraFormMode === "edit" && (
									<button type="button" onClick={openAddEra} className="text-xs text-stone-400 hover:text-stone-600 transition">
										취소
									</button>
								)}
							</div>
							<form onSubmit={handleEraSubmit} className="space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-xs font-medium text-stone-600 mb-1.5">시대 이름 *</label>
										<input type="text" value={eraTitle} onChange={(e) => setEraTitle(e.target.value)}
											className="w-full px-4 py-2.5 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] text-sm"
											placeholder="예: 새로운 도약" required />
									</div>
									<div>
										<label className="block text-xs font-medium text-stone-600 mb-1.5">기간 *</label>
										<input type="text" value={eraPeriod} onChange={(e) => setEraPeriod(e.target.value)}
											className="w-full px-4 py-2.5 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] text-sm"
											placeholder="예: 2024 - 2026" required />
									</div>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-xs font-medium text-stone-600 mb-1.5">아이콘 *</label>
										<select value={eraIconName} onChange={(e) => setEraIconName(e.target.value)}
											className="w-full px-4 py-2.5 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] bg-white text-sm" required>
											{ERA_ICON_OPTIONS.map((opt) => (
												<option key={opt.value} value={opt.value}>{opt.label}</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-xs font-medium text-stone-600 mb-1.5">정렬 순서</label>
										<input type="number" value={eraSortOrder} onChange={(e) => setEraSortOrder(e.target.value)}
											className="w-full px-4 py-2.5 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] text-sm"
											placeholder="미입력 시 자동" min={0} />
									</div>
								</div>
								{eraMessage && (
									<div className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-2xl ${eraMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
										{eraMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
										<span>{eraMessage.text}</span>
									</div>
								)}
								<button type="submit" disabled={eraSubmitLoading}
									className="flex items-center justify-center space-x-2 w-full bg-emerald-600 text-white py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 text-sm">
									<Save size={15} />
									<span>{eraSubmitLoading ? "저장 중..." : eraFormMode === "add" ? "시대 추가" : "시대 저장"}</span>
								</button>
							</form>
						</div>
					</div>
				)}
			</div>

			{/* ---- Event Add Form ---- */}
			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
				<h2 className="text-lg font-bold text-[#333] mb-6 flex items-center space-x-2">
					<PlusCircle size={20} className="text-emerald-600" />
					<span>연혁 항목 추가</span>
				</h2>
				<form onSubmit={handleEventSubmit} className="space-y-5">
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">시대 *</label>
							<select value={selectedEraId} onChange={(e) => setSelectedEraId(e.target.value)}
								className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] bg-white" required>
								{eras.map((era) => (
									<option key={era.id} value={era.id}>{era.title} ({era.period})</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">연도 *</label>
							<input type="text" value={year} onChange={(e) => setYear(e.target.value)}
								className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
								placeholder="예: 2025" required />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-stone-600 mb-2">날짜 *</label>
							<input type="text" value={date} onChange={(e) => setDate(e.target.value)}
								className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333]"
								placeholder="예: 03.01" required />
						</div>
						<div className="flex items-end pb-0.5">
							<label className="flex items-center space-x-3 cursor-pointer">
								<div className={`relative w-12 h-6 rounded-full transition-colors ${isMajor ? "bg-emerald-500" : "bg-stone-200"}`}
									onClick={() => setIsMajor((v) => !v)}>
									<div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isMajor ? "translate-x-7" : "translate-x-1"}`} />
								</div>
								<span className="text-sm font-medium text-stone-600">주요 이벤트</span>
								{isMajor && <Star size={14} className="text-emerald-500" />}
							</label>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-stone-600 mb-2">내용 *</label>
						<textarea value={eventText} onChange={(e) => setEventText(e.target.value)} rows={3}
							className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] resize-none"
							placeholder="연혁 내용을 입력하세요" required />
					</div>
					{eventMessage && (
						<div className={`flex items-center space-x-2 text-sm px-4 py-3 rounded-2xl ${eventMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
							{eventMessage.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
							<span>{eventMessage.text}</span>
						</div>
					)}
					<button type="submit" disabled={eventSubmitLoading}
						className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-50">
						{eventSubmitLoading ? "추가 중..." : "연혁 추가하기"}
					</button>
				</form>
			</div>

			{/* ---- Event list ---- */}
			<div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
				<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
					<h2 className="text-lg font-bold text-[#333]">연혁 목록</h2>
					<select value={filterEraId} onChange={(e) => setFilterEraId(e.target.value)}
						className="px-4 py-2 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-[#333] bg-white">
						<option value="all">전체 시대</option>
						{eras.map((era) => <option key={era.id} value={era.id}>{era.title}</option>)}
					</select>
				</div>
				{!loaded && <p className="text-stone-400 text-sm text-center py-8">불러오는 중...</p>}
				{loaded && filteredEvents.length === 0 && <p className="text-stone-300 text-sm text-center py-8">연혁이 없습니다.</p>}

				<div className="space-y-8">
					{groupedByEraAndYear.map(({ era, years }) => (
						<div key={era.id}>
							<div className="mb-4 flex items-center space-x-2">
								<div className="h-px flex-1 bg-stone-100" />
								<span className="text-xs font-bold tracking-widest text-emerald-600 uppercase px-2">{era.title}</span>
								<span className="text-xs text-stone-400">{era.period}</span>
								<div className="h-px flex-1 bg-stone-100" />
							</div>
							<div className="space-y-6">
								{years.map(({ year: y, events: yEvents }) => (
									<div key={y}>
										<p className="text-sm font-bold text-stone-400 mb-2">{y}년</p>
										<div className="space-y-2">
											{yEvents.map((ev) => (
												<div key={ev.id} className={`flex items-start justify-between p-3 rounded-2xl border ${ev.is_major ? "border-emerald-100 bg-emerald-50" : "border-stone-100 bg-stone-50"}`}>
													<div className="flex items-start space-x-3 flex-1 min-w-0 mr-3">
														<span className={`flex-none mt-0.5 inline-block rounded-md px-2 py-0.5 text-xs font-bold ${ev.is_major ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-500"}`}>
															{ev.date}
														</span>
														<p className={`text-sm leading-relaxed ${ev.is_major ? "font-bold text-stone-800" : "text-stone-600"}`}>{ev.event_text}</p>
													</div>
													<button onClick={() => handleEventDelete(ev.id)} className="flex-none text-stone-300 hover:text-red-500 transition p-1 mt-0.5">
														<Trash2 size={14} />
													</button>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Main Admin Page
// ============================================================
export default function AdminPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authError, setAuthError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<Tab>("bulletin");

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

	const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
		{ id: "bulletin", label: "주보 관리", icon: <BookOpen size={16} /> },
		{ id: "news", label: "교회소식 관리", icon: <Newspaper size={16} /> },
		{ id: "history", label: "교회연혁 관리", icon: <History size={16} /> },
	];

	if (!isAuthenticated) {
		return (
			<main className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-3xl shadow-xl p-10 border border-stone-100">
						<div className="flex flex-col items-center mb-8">
							<div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
								<Lock className="text-emerald-600" size={28} />
							</div>
							<h1 className="text-2xl font-bold text-[#333]">관리자 로그인</h1>
							<p className="text-stone-400 text-sm mt-2">캔사스순복음교회 통합 관리자 페이지입니다.</p>
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
						<div className="mt-6 text-center">
							<TransitionLink href="/" className="text-sm text-stone-400 hover:text-emerald-600 transition">
								← 홈으로 돌아가기
							</TransitionLink>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-stone-50">
			<div className="max-w-4xl mx-auto px-4 py-12">
				{/* Header */}
				<div className="flex items-center justify-between mb-10">
					<div>
						<h1 className="text-3xl font-bold text-[#333]">통합 관리자</h1>
						<p className="text-stone-400 text-sm mt-1">캔사스순복음교회 콘텐츠를 관리합니다.</p>
					</div>
					<div className="flex items-center space-x-3">
						<button onClick={handleLogout} className="text-sm text-stone-400 hover:text-red-500 transition">
							로그아웃
						</button>
						<TransitionLink href="/" className="flex items-center space-x-1 text-sm text-stone-500 hover:text-emerald-600 transition">
							<ChevronLeft size={16} /><span>홈으로</span>
						</TransitionLink>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex space-x-2 mb-8 bg-white rounded-2xl p-1.5 border border-stone-100 shadow-sm">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
								activeTab === tab.id
									? "bg-emerald-600 text-white shadow"
									: "text-stone-400 hover:text-stone-600 hover:bg-stone-50"
							}`}
						>
							{tab.icon}
							<span className="hidden sm:inline">{tab.label}</span>
							<span className="sm:hidden">{tab.label.split(" ")[0]}</span>
						</button>
					))}
				</div>

				{/* Tab content */}
				{activeTab === "bulletin" && <BulletinTab token={token} />}
				{activeTab === "news" && <NewsTab token={token} />}
				{activeTab === "history" && <HistoryTab token={token} />}
			</div>
		</main>
	);
}
