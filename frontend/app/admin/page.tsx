"use client";

import { useState, useRef, useEffect } from "react";
import {
  Lock,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ImagePlus,
  X,
  Loader2,
  Newspaper,
  BookOpen,
  History,
  Edit3,
  Star,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import {
  supabase,
  Bulletin,
  ChurchNews,
  HistoryEra,
  HistoryEvent,
} from "@/lib/supabase";
import TransitionLink from "@/components/common/TransitionLink";

type Tab = "bulletin" | "news" | "history";

type ImageItem = {
  key: string;
  preview: string;
  url: string;
  uploading: boolean;
  error: string;
  isExisting?: boolean; // true = pre-existing image loaded for editing (don't delete on UI remove)
};

const ADMIN_LIMIT = 10;

function formatBulletinDate(dateStr: string) {
  return dateStr.replace(/-/g, ".");
}

function bulletinDateToInput(dateStr: string) {
  return dateStr.replace(/\./g, "-");
}

function formatNewsDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function convertDriveUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
}

// ============================================================
// Bulletin Tab
// ============================================================
function BulletinTab({ token }: { token: string }) {
  const [date, setDate] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [bulletinsLoaded, setBulletinsLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadBulletins(true);
  }, []);

  const loadBulletins = async (reset: boolean) => {
    const newOffset = reset ? 0 : currentOffset + ADMIN_LIMIT;
    if (reset) setBulletinsLoaded(false);
    else setLoadingMore(true);

    const { data } = await supabase
      .from("bulletins")
      .select("*")
      .order("date", { ascending: false })
      .range(newOffset, newOffset + ADMIN_LIMIT - 1);

    const fetched = data ?? [];
    if (reset) {
      setBulletins(fetched);
      setCurrentOffset(0);
      setBulletinsLoaded(true);
    } else {
      setBulletins((prev) => [...prev, ...fetched]);
      setCurrentOffset(newOffset);
      setLoadingMore(false);
    }
    setHasMore(fetched.length === ADMIN_LIMIT);
  };

  const handleStartEdit = (b: Bulletin) => {
    setEditingId(b.id);
    setDate(bulletinDateToInput(b.date));
    setImageUrl1(b.image_urls[0] ?? "");
    setImageUrl2(b.image_urls[1] ?? "");
    setSubmitMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate("");
    setImageUrl1("");
    setImageUrl2("");
    setSubmitMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const image_urls = [imageUrl1, imageUrl2]
      .filter(Boolean)
      .map(convertDriveUrl);
    if (!image_urls.length) {
      setSubmitMessage({ type: "error", text: "이미지 URL을 입력해주세요." });
      return;
    }
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/admin/bulletin", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: "주일예배 주보",
          date: formatBulletinDate(date),
          image_urls,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitMessage({
          type: "error",
          text: json.error ?? "오류가 발생했습니다.",
        });
      } else {
        setSubmitMessage({
          type: "success",
          text: editingId ? "주보가 수정되었습니다!" : "주보가 등록되었습니다!",
        });
        setDate("");
        setImageUrl1("");
        setImageUrl2("");
        setEditingId(null);
        loadBulletins(true);
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setBulletins((prev) => prev.filter((b) => b.id !== id));
      if (editingId === id) handleCancelEdit();
    } else {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center space-x-2 text-lg font-bold text-[#333]">
            {editingId ? (
              <Edit3 size={20} className="text-emerald-600" />
            ) : (
              <PlusCircle size={20} className="text-emerald-600" />
            )}
            <span>{editingId ? "주보 수정" : "새 주보 등록"}</span>
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-stone-400 transition hover:text-stone-600"
            >
              취소
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              날짜 *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              이미지 URL 1 *{" "}
              <span className="font-normal text-stone-300">
                (첫 번째 페이지)
              </span>
            </label>
            <input
              type="url"
              value={imageUrl1}
              onChange={(e) => setImageUrl1(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="https://lh3.googleusercontent.com/d/..."
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              이미지 URL 2{" "}
              <span className="font-normal text-stone-300">
                (두 번째 페이지 · 선택)
              </span>
            </label>
            <input
              type="url"
              value={imageUrl2}
              onChange={(e) => setImageUrl2(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="https://lh3.googleusercontent.com/d/..."
            />
          </div>
          {submitMessage && (
            <div
              className={`flex items-center space-x-2 rounded-2xl px-4 py-3 text-sm ${submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
            >
              {submitMessage.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{submitMessage.text}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitLoading
              ? editingId
                ? "수정 중..."
                : "등록 중..."
              : editingId
                ? "주보 저장하기"
                : "주보 등록하기"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-[#333]">등록된 주보</h2>
        {!bulletinsLoaded && (
          <p className="py-8 text-center text-sm text-stone-400">
            불러오는 중...
          </p>
        )}
        {bulletinsLoaded && bulletins.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-300">
            등록된 주보가 없습니다.
          </p>
        )}
        <div className="space-y-3">
          {bulletins.map((b) => (
            <div
              key={b.id}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${editingId === b.id ? "border-emerald-200 bg-emerald-50" : "border-stone-100 bg-stone-50"}`}
            >
              <div className="flex min-w-0 items-center space-x-3">
                {b.image_urls?.[0] && (
                  <div className="h-12 w-12 flex-none overflow-hidden rounded-xl border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image_urls[0]}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#333]">{b.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{b.date}</p>
                  {b.image_urls?.length > 1 && (
                    <p className="mt-0.5 text-xs text-emerald-500">
                      {b.image_urls.length}페이지
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-4 flex flex-none items-center space-x-1">
                <button
                  onClick={() => handleStartEdit(b)}
                  className={`p-1.5 transition ${editingId === b.id ? "text-emerald-500" : "text-stone-300 hover:text-emerald-500"}`}
                  title="수정"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-stone-300 transition hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={() => loadBulletins(false)}
              disabled={loadingMore}
              className="mx-auto flex items-center space-x-2 rounded-2xl border border-stone-200 px-6 py-2.5 text-sm font-bold text-stone-500 transition hover:bg-stone-50 disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              <span>{loadingMore ? "불러오는 중..." : "더보기"}</span>
            </button>
          </div>
        )}
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
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<ChurchNews[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts(true);
  }, []);

  const loadPosts = async (reset: boolean) => {
    const newOffset = reset ? 0 : currentOffset + ADMIN_LIMIT;
    if (reset) setPostsLoaded(false);
    else setLoadingMore(true);

    const { data } = await supabase
      .from("church_news")
      .select("*")
      .order("created_at", { ascending: false })
      .range(newOffset, newOffset + ADMIN_LIMIT - 1);

    const fetched = data ?? [];
    if (reset) {
      setPosts(fetched);
      setCurrentOffset(0);
      setPostsLoaded(true);
    } else {
      setPosts((prev) => [...prev, ...fetched]);
      setCurrentOffset(newOffset);
      setLoadingMore(false);
    }
    setHasMore(fetched.length === ADMIN_LIMIT);
  };

  const handleStartEdit = (post: ChurchNews) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImageItems(
      (post.image_urls ?? []).map((url) => ({
        key: url,
        preview: url,
        url,
        uploading: false,
        error: "",
        isExisting: true,
      })),
    );
    setSubmitMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageItems([]);
    setSubmitMessage(null);
  };

  const uploadFile = async (file: File) => {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const preview = URL.createObjectURL(file);
    setImageItems((prev) => [
      ...prev,
      { key, preview, url: "", uploading: true, error: "" },
    ]);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      setImageItems((prev) =>
        prev.map((item) =>
          item.key === key
            ? {
                ...item,
                uploading: false,
                url: res.ok ? json.url : "",
                error: res.ok ? "" : (json.error ?? "업로드 실패"),
              }
            : item,
        ),
      );
    } catch {
      setImageItems((prev) =>
        prev.map((item) =>
          item.key === key
            ? { ...item, uploading: false, error: "서버 연결 실패" }
            : item,
        ),
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(uploadFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files)
      .filter((f) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(f.type),
      )
      .forEach(uploadFile);
  };

  const handleRemoveImage = (key: string) => {
    const item = imageItems.find((i) => i.key === key);
    if (!item) return;
    setImageItems((prev) => prev.filter((i) => i.key !== key));
    if (item.url && !item.isExisting) {
      fetch("/api/admin/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title,
          content,
          image_urls,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitMessage({
          type: "error",
          text: json.error ?? "오류가 발생했습니다.",
        });
      } else {
        setSubmitMessage({
          type: "success",
          text: editingId
            ? "게시물이 수정되었습니다!"
            : "게시물이 등록되었습니다!",
        });
        setTitle("");
        setContent("");
        setImageItems([]);
        setEditingId(null);
        loadPosts(true);
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) handleCancelEdit();
    } else {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const isAnyUploading = imageItems.some((i) => i.uploading);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center space-x-2 text-lg font-bold text-[#333]">
            {editingId ? (
              <Edit3 size={20} className="text-emerald-600" />
            ) : (
              <PlusCircle size={20} className="text-emerald-600" />
            )}
            <span>{editingId ? "소식 수정" : "새 소식 작성"}</span>
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-stone-400 transition hover:text-stone-600"
            >
              취소
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="소식 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              내용 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="소식 내용을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              이미지{" "}
              <span className="font-normal text-stone-300">
                (선택 · 여러 장 가능)
              </span>
            </label>
            {imageItems.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-3">
                {imageItems.map((item) => (
                  <div
                    key={item.key}
                    className="relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {item.uploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 bg-black/50">
                        <Loader2
                          size={20}
                          className="animate-spin text-white"
                        />
                        <span className="text-[10px] text-white">
                          업로드 중
                        </span>
                      </div>
                    )}
                    {item.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 p-2">
                        <AlertCircle size={18} className="mb-1 text-white" />
                        <span className="text-center text-[10px] text-white">
                          {item.error}
                        </span>
                      </div>
                    )}
                    {!item.uploading && !item.error && (
                      <div className="absolute bottom-1.5 left-1.5 rounded-full bg-emerald-600/80 p-0.5">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(item.key)}
                      className="absolute top-1.5 right-1.5 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
                    >
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
              className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${isDragging ? "scale-[1.01] border-emerald-400 bg-emerald-50" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50"}`}
            >
              <ImagePlus
                size={24}
                className={`mb-1.5 transition-colors ${isDragging ? "text-emerald-500" : "text-stone-300"}`}
              />
              <span
                className={`text-sm font-medium transition-colors ${isDragging ? "text-emerald-600" : "text-stone-400"}`}
              >
                {isDragging ? "여기에 놓으세요" : "클릭하거나 드래그로 추가"}
              </span>
              <span className="mt-0.5 text-xs text-stone-300">
                JPG, PNG, GIF, WEBP · 여러 장 가능
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          {submitMessage && (
            <div
              className={`flex items-center space-x-2 rounded-2xl px-4 py-3 text-sm ${submitMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
            >
              {submitMessage.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{submitMessage.text}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={submitLoading || isAnyUploading}
            className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isAnyUploading
              ? "이미지 업로드 중..."
              : submitLoading
                ? editingId
                  ? "수정 중..."
                  : "게시 중..."
                : editingId
                  ? "소식 저장하기"
                  : "소식 게시하기"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-[#333]">기존 게시물</h2>
        {!postsLoaded && (
          <p className="py-8 text-center text-sm text-stone-400">
            불러오는 중...
          </p>
        )}
        {postsLoaded && posts.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-300">
            등록된 게시물이 없습니다.
          </p>
        )}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`flex items-start justify-between rounded-2xl border p-5 transition ${editingId === post.id ? "border-emerald-200 bg-emerald-50" : "border-stone-100 bg-stone-50"}`}
            >
              <div className="mr-4 flex min-w-0 flex-1 items-start space-x-4">
                {post.image_urls?.[0] && (
                  <div className="h-14 w-14 flex-none overflow-hidden rounded-xl border border-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image_urls[0]}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#333]">{post.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    {formatNewsDate(post.created_at)}
                  </p>
                  {post.image_urls?.length > 1 && (
                    <p className="mt-1 text-xs text-emerald-500">
                      이미지 {post.image_urls.length}장
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-none items-center space-x-1">
                <button
                  onClick={() => handleStartEdit(post)}
                  className={`p-1.5 transition ${editingId === post.id ? "text-emerald-500" : "text-stone-300 hover:text-emerald-500"}`}
                  title="수정"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-stone-300 transition hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={() => loadPosts(false)}
              disabled={loadingMore}
              className="mx-auto flex items-center space-x-2 rounded-2xl border border-stone-200 px-6 py-2.5 text-sm font-bold text-stone-500 transition hover:bg-stone-50 disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              <span>{loadingMore ? "불러오는 중..." : "더보기"}</span>
            </button>
          </div>
        )}
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

  // Event add form
  const [selectedEraId, setSelectedEraId] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [eventText, setEventText] = useState("");
  const [isMajor, setIsMajor] = useState(false);
  const [eventSubmitLoading, setEventSubmitLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [filterEraId, setFilterEraId] = useState("all");

  // Event inline edit
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editEventYear, setEditEventYear] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventText, setEditEventText] = useState("");
  const [editEventIsMajor, setEditEventIsMajor] = useState(false);
  const [editEventLoading, setEditEventLoading] = useState(false);
  const [editEventMessage, setEditEventMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Era management panel
  const [erasPanelOpen, setErasPanelOpen] = useState(false);
  const [eraFormMode, setEraFormMode] = useState<"add" | "edit">("add");
  const [editingEraId, setEditingEraId] = useState("");
  const [eraTitle, setEraTitle] = useState("");
  const [eraPeriod, setEraPeriod] = useState("");
  const [eraIconName, setEraIconName] = useState("Star");
  const [eraSortOrder, setEraSortOrder] = useState("");
  const [eraSubmitLoading, setEraSubmitLoading] = useState(false);
  const [eraMessage, setEraMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [{ data: erasData }, { data: eventsData }] = await Promise.all([
      supabase
        .from("church_history_eras")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("church_history_events")
        .select("*")
        .order("sort_order", { ascending: true }),
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          era_id: selectedEraId,
          year,
          date,
          event_text: eventText,
          is_major: isMajor,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEventMessage({
          type: "error",
          text: json.error ?? "오류가 발생했습니다.",
        });
      } else {
        setEventMessage({ type: "success", text: "연혁이 추가되었습니다!" });
        setYear("");
        setDate("");
        setEventText("");
        setIsMajor(false);
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      if (editingEventId === id) setEditingEventId(null);
    } else {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleStartEventEdit = (ev: HistoryEvent) => {
    setEditingEventId(ev.id);
    setEditEventYear(ev.year);
    setEditEventDate(ev.date);
    setEditEventText(ev.event_text);
    setEditEventIsMajor(ev.is_major);
    setEditEventMessage(null);
  };

  const handleCancelEventEdit = () => {
    setEditingEventId(null);
    setEditEventYear("");
    setEditEventDate("");
    setEditEventText("");
    setEditEventIsMajor(false);
    setEditEventMessage(null);
  };

  const handleEventEdit = async (id: string) => {
    setEditEventLoading(true);
    setEditEventMessage(null);
    try {
      const res = await fetch("/api/admin/history", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          year: editEventYear,
          date: editEventDate,
          event_text: editEventText,
          is_major: editEventIsMajor,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditEventMessage({
          type: "error",
          text: json.error ?? "오류가 발생했습니다.",
        });
      } else {
        setEvents((prev) => prev.map((ev) => (ev.id === id ? json.data : ev)));
        handleCancelEventEdit();
      }
    } catch {
      setEditEventMessage({ type: "error", text: "서버 연결에 실패했습니다." });
    } finally {
      setEditEventLoading(false);
    }
  };

  // ---- Era handlers ----
  const openAddEra = () => {
    setEraFormMode("add");
    setEditingEraId("");
    setEraTitle("");
    setEraPeriod("");
    setEraIconName("Star");
    setEraSortOrder("");
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
      title: eraTitle,
      period: eraPeriod,
      icon_name: eraIconName,
      ...(eraSortOrder !== "" && { sort_order: Number(eraSortOrder) }),
    };
    if (eraFormMode === "edit") body.id = editingEraId;
    try {
      const res = await fetch("/api/admin/history/era", {
        method: eraFormMode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setEraMessage({
          type: "error",
          text: json.error ?? "오류가 발생했습니다.",
        });
      } else {
        setEraMessage({
          type: "success",
          text:
            eraFormMode === "add"
              ? "시대가 추가되었습니다!"
              : "시대가 수정되었습니다!",
        });
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
    const msg =
      eventCount > 0
        ? `"${era.title}" 시대를 삭제하면 연결된 연혁 항목 ${eventCount}개도 함께 삭제됩니다. 계속하시겠습니까?`
        : `"${era.title}" 시대를 삭제하시겠습니까?`;
    if (!confirm(msg)) return;
    const res = await fetch("/api/admin/history/era", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

  const filteredEvents =
    filterEraId === "all"
      ? events
      : events.filter((ev) => ev.era_id === filterEraId);

  const groupedByEraAndYear = eras
    .map((era) => {
      const eraEvents = filteredEvents.filter((ev) => ev.era_id === era.id);
      const yearMap = new Map<string, HistoryEvent[]>();
      for (const ev of eraEvents) {
        if (!yearMap.has(ev.year)) yearMap.set(ev.year, []);
        yearMap.get(ev.year)!.push(ev);
      }
      const years = Array.from(yearMap.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([y, evs]) => ({
          year: y,
          // Sort events within each year by date descending (matches about/page.tsx)
          events: [...evs].sort((a, b) => b.date.localeCompare(a.date)),
        }));
      return { era, years };
    })
    .filter((g) => g.years.length > 0 || filterEraId === "all");

  return (
    <div className="space-y-8">
      {/* ---- Era Management Panel ---- */}
      <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setErasPanelOpen((v) => !v)}
          className="flex w-full items-center justify-between p-8 text-left transition hover:bg-stone-50"
        >
          <div className="flex items-center space-x-2">
            <Edit3 size={20} className="text-emerald-600" />
            <span className="text-lg font-bold text-[#333]">
              시대(Era) 관리
            </span>
            <span className="ml-1 text-xs font-normal text-stone-400">
              추가 · 수정 · 삭제
            </span>
          </div>
          {erasPanelOpen ? (
            <ChevronUp size={18} className="text-stone-400" />
          ) : (
            <ChevronDown size={18} className="text-stone-400" />
          )}
        </button>

        {erasPanelOpen && (
          <div className="space-y-6 border-t border-stone-100 p-8">
            <div className="space-y-2">
              {!loaded && (
                <p className="py-4 text-center text-sm text-stone-400">
                  불러오는 중...
                </p>
              )}
              {loaded && eras.length === 0 && (
                <p className="py-4 text-center text-sm text-stone-300">
                  등록된 시대가 없습니다.
                </p>
              )}
              {eras.map((era) => (
                <div
                  key={era.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition ${editingEraId === era.id ? "border-emerald-200 bg-emerald-50" : "border-stone-100 bg-stone-50"}`}
                >
                  <div className="flex min-w-0 items-center space-x-3">
                    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-600">
                      {era.sort_order}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#333]">
                        {era.title}
                      </p>
                      <p className="text-xs text-stone-400">
                        {era.period} · 아이콘: {era.icon_name}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex flex-none items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => openEditEra(era)}
                      className="p-1.5 text-stone-400 transition hover:text-emerald-600"
                      title="수정"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEraDelete(era)}
                      className="p-1.5 text-stone-300 transition hover:text-red-500"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-700">
                  {eraFormMode === "add"
                    ? "새 시대 추가"
                    : `"${eraTitle}" 수정 중`}
                </h3>
                {eraFormMode === "edit" && (
                  <button
                    type="button"
                    onClick={openAddEra}
                    className="text-xs text-stone-400 transition hover:text-stone-600"
                  >
                    취소
                  </button>
                )}
              </div>
              <form onSubmit={handleEraSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">
                      시대 이름 *
                    </label>
                    <input
                      type="text"
                      value={eraTitle}
                      onChange={(e) => setEraTitle(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200 px-4 py-2.5 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="예: 새로운 도약"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">
                      기간 *
                    </label>
                    <input
                      type="text"
                      value={eraPeriod}
                      onChange={(e) => setEraPeriod(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200 px-4 py-2.5 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="예: 2024 - 2026"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">
                      아이콘 *
                    </label>
                    <select
                      value={eraIconName}
                      onChange={(e) => setEraIconName(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      required
                    >
                      {ERA_ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">
                      정렬 순서
                    </label>
                    <input
                      type="number"
                      value={eraSortOrder}
                      onChange={(e) => setEraSortOrder(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200 px-4 py-2.5 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                      placeholder="미입력 시 자동"
                      min={0}
                    />
                  </div>
                </div>
                {eraMessage && (
                  <div
                    className={`flex items-center space-x-2 rounded-2xl px-4 py-3 text-sm ${eraMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                  >
                    {eraMessage.type === "success" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{eraMessage.text}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={eraSubmitLoading}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>
                    {eraSubmitLoading
                      ? "저장 중..."
                      : eraFormMode === "add"
                        ? "시대 추가"
                        : "시대 저장"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ---- Event Add Form ---- */}
      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center space-x-2 text-lg font-bold text-[#333]">
          <PlusCircle size={20} className="text-emerald-600" />
          <span>연혁 항목 추가</span>
        </h2>
        <form onSubmit={handleEventSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">
                시대 *
              </label>
              <select
                value={selectedEraId}
                onChange={(e) => setSelectedEraId(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                required
              >
                {eras.map((era) => (
                  <option key={era.id} value={era.id}>
                    {era.title} ({era.period})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">
                연도 *
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                placeholder="예: 2025"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-600">
                날짜 *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                placeholder="예: 03.01"
                required
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex cursor-pointer items-center space-x-3">
                <div
                  className={`relative h-6 w-12 rounded-full transition-colors ${isMajor ? "bg-emerald-500" : "bg-stone-200"}`}
                  onClick={() => setIsMajor((v) => !v)}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isMajor ? "translate-x-7" : "translate-x-1"}`}
                  />
                </div>
                <span className="text-sm font-medium text-stone-600">
                  주요 이벤트
                </span>
                {isMajor && <Star size={14} className="text-emerald-500" />}
              </label>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-600">
              내용 *
            </label>
            <textarea
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              placeholder="연혁 내용을 입력하세요"
              required
            />
          </div>
          {eventMessage && (
            <div
              className={`flex items-center space-x-2 rounded-2xl px-4 py-3 text-sm ${eventMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
            >
              {eventMessage.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{eventMessage.text}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={eventSubmitLoading}
            className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {eventSubmitLoading ? "추가 중..." : "연혁 추가하기"}
          </button>
        </form>
      </div>

      {/* ---- Event list ---- */}
      <div className="rounded-3xl border border-stone-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#333]">연혁 목록</h2>
          <select
            value={filterEraId}
            onChange={(e) => setFilterEraId(e.target.value)}
            className="rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          >
            <option value="all">전체 시대</option>
            {eras.map((era) => (
              <option key={era.id} value={era.id}>
                {era.title}
              </option>
            ))}
          </select>
        </div>
        {!loaded && (
          <p className="py-8 text-center text-sm text-stone-400">
            불러오는 중...
          </p>
        )}
        {loaded && filteredEvents.length === 0 && (
          <p className="py-8 text-center text-sm text-stone-300">
            연혁이 없습니다.
          </p>
        )}

        <div className="space-y-8">
          {groupedByEraAndYear.map(({ era, years }) => (
            <div key={era.id}>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-px flex-1 bg-stone-100" />
                <span className="px-2 text-xs font-bold tracking-widest text-emerald-600 uppercase">
                  {era.title}
                </span>
                <span className="text-xs text-stone-400">{era.period}</span>
                <div className="h-px flex-1 bg-stone-100" />
              </div>
              <div className="space-y-6">
                {years.map(({ year: y, events: yEvents }) => (
                  <div key={y}>
                    <p className="mb-2 text-sm font-bold text-stone-400">
                      {y}년
                    </p>
                    <div className="space-y-2">
                      {yEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`rounded-2xl border transition ${ev.is_major ? "border-emerald-100 bg-emerald-50" : "border-stone-100 bg-stone-50"} ${editingEventId === ev.id ? "ring-2 ring-emerald-300" : ""}`}
                        >
                          {editingEventId === ev.id ? (
                            // Inline edit form
                            <div className="space-y-3 p-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-stone-500">
                                    연도
                                  </label>
                                  <input
                                    type="text"
                                    value={editEventYear}
                                    onChange={(e) =>
                                      setEditEventYear(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                    placeholder="예: 2025"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs font-medium text-stone-500">
                                    날짜
                                  </label>
                                  <input
                                    type="text"
                                    value={editEventDate}
                                    onChange={(e) =>
                                      setEditEventDate(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                    placeholder="예: 03.01"
                                  />
                                </div>
                              </div>
                              <textarea
                                value={editEventText}
                                onChange={(e) =>
                                  setEditEventText(e.target.value)
                                }
                                rows={2}
                                className="w-full resize-none rounded-xl border border-stone-200 px-3 py-2 text-sm text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                placeholder="연혁 내용"
                              />
                              <label className="flex cursor-pointer items-center space-x-2">
                                <div
                                  className={`relative h-5 w-10 rounded-full transition-colors ${editEventIsMajor ? "bg-emerald-500" : "bg-stone-200"}`}
                                  onClick={() => setEditEventIsMajor((v) => !v)}
                                >
                                  <div
                                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${editEventIsMajor ? "translate-x-5" : "translate-x-0.5"}`}
                                  />
                                </div>
                                <span className="text-xs font-medium text-stone-600">
                                  주요 이벤트
                                </span>
                              </label>
                              {editEventMessage && (
                                <div
                                  className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs ${editEventMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
                                >
                                  {editEventMessage.type === "success" ? (
                                    <CheckCircle size={12} />
                                  ) : (
                                    <AlertCircle size={12} />
                                  )}
                                  <span>{editEventMessage.text}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleEventEdit(ev.id)}
                                  disabled={editEventLoading}
                                  className="flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  <Save size={12} />
                                  <span>
                                    {editEventLoading ? "저장 중..." : "저장"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEventEdit}
                                  className="rounded-xl border border-stone-200 px-4 py-1.5 text-xs font-bold text-stone-500 transition hover:bg-stone-50"
                                >
                                  취소
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEventDelete(ev.id)}
                                  className="ml-auto rounded-xl border border-red-100 px-4 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-50"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Regular display
                            <div className="flex items-start justify-between p-3">
                              <div className="mr-2 flex min-w-0 flex-1 items-start space-x-3">
                                <span
                                  className={`mt-0.5 inline-block flex-none rounded-md px-2 py-0.5 text-xs font-bold ${ev.is_major ? "bg-emerald-600 text-white" : "bg-stone-200 text-stone-500"}`}
                                >
                                  {ev.date}
                                </span>
                                <p
                                  className={`text-sm leading-relaxed ${ev.is_major ? "font-bold text-stone-800" : "text-stone-600"}`}
                                >
                                  {ev.event_text}
                                </p>
                              </div>
                              <div className="flex flex-none items-center space-x-1">
                                <button
                                  onClick={() => handleStartEventEdit(ev)}
                                  className="p-1 text-stone-300 transition hover:text-emerald-500"
                                  title="수정"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  onClick={() => handleEventDelete(ev.id)}
                                  className="p-1 text-stone-300 transition hover:text-red-500"
                                  title="삭제"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          )}
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
      <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-stone-100 bg-white p-10 shadow-xl">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <Lock className="text-emerald-600" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-[#333]">관리자 로그인</h1>
              <p className="mt-2 text-sm text-stone-400">
                캔사스순복음교회 통합 관리자 페이지입니다.
              </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  placeholder="관리자 이메일을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-600">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-[#333] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  placeholder="관리자 비밀번호를 입력하세요"
                  required
                />
              </div>
              {authError && (
                <p className="flex items-center space-x-1 text-sm text-red-500">
                  <AlertCircle size={14} />
                  <span>{authError}</span>
                </p>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {authLoading ? "확인 중..." : "입장하기"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <TransitionLink
                href="/"
                className="text-sm text-stone-400 transition hover:text-emerald-600"
              >
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
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333]">통합 관리자</h1>
            <p className="mt-1 text-sm text-stone-400">
              캔사스순복음교회 콘텐츠를 관리합니다.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="text-sm text-stone-400 transition hover:text-red-500"
            >
              로그아웃
            </button>
            <TransitionLink
              href="/"
              className="flex items-center space-x-1 text-sm text-stone-500 transition hover:text-emerald-600"
            >
              <ChevronLeft size={16} />
              <span>홈으로</span>
            </TransitionLink>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-2 rounded-2xl border border-stone-100 bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center space-x-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow"
                  : "text-stone-400 hover:bg-stone-50 hover:text-stone-600"
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
