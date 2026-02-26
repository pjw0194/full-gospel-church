export default function NewsLoading() {
  return (
    <main>
      {/* Page Header */}
      <section className="bg-emerald-50 pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none font-bold text-emerald-900 translate-x-10 translate-y-16 select-none text-[8rem] sm:text-[12rem] md:text-[16rem] whitespace-nowrap">
          NEWS
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <p className="text-emerald-600 uppercase tracking-widest text-sm mb-4 font-bold">
            Kansas Full Gospel Church
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#333] mb-6">
            교회 소식
          </h1>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-8" />
          <p className="max-w-xl mx-auto text-stone-500 text-lg leading-relaxed">
            캔사스 순복음 교회의 최근 소식과 이야기를 전해드립니다.
          </p>
        </div>
      </section>

      {/* Loading Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-10 text-stone-400">
            <div className="w-5 h-5 border-2 border-stone-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-sm font-medium">교회 소식 불러오는 중...</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-stone-100 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-stone-100" />
                <div className="p-3 sm:p-4">
                  <div className="h-4 bg-stone-100 rounded-lg mb-2 w-4/5" />
                  <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
