import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold text-emerald-600">404</p>
      <h2 className="mb-4 text-2xl font-bold text-stone-800">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="mb-8 text-stone-500">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
