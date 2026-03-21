"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Star, ShieldCheck, Users, History } from "lucide-react";
import { supabase, HistoryEra, HistoryEvent } from "@/lib/supabase";

const iconMap: Record<string, React.ReactNode> = {
  Star: <Star size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
  Users: <Users size={20} />,
  History: <History size={20} />,
};

interface HistoryYearGroup {
  year: string;
  events: { id: string; date: string; text: string; isMajor: boolean }[];
}

interface HistoryEraDisplay {
  id: string;
  title: string;
  period: string;
  icon: React.ReactNode;
  years: HistoryYearGroup[];
}

export default function ChurchHistorySection() {
  const [activeEra, setActiveEra] = useState(0);
  const [historyEras, setHistoryEras] = useState<HistoryEraDisplay[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const [{ data: eras }, { data: events }] = await Promise.all([
        supabase
          .from("church_history_eras")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("church_history_events")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      if (!eras || !events) {
        setHistoryLoading(false);
        return;
      }

      const eraList = (eras as HistoryEra[]).map((era) => {
        const eraEvents = (events as HistoryEvent[]).filter(
          (e) => e.era_id === era.id,
        );
        // Group by year, preserving order
        const yearMap = new Map<string, HistoryYearGroup>();
        for (const ev of eraEvents) {
          if (!yearMap.has(ev.year)) {
            yearMap.set(ev.year, { year: ev.year, events: [] });
          }
          yearMap.get(ev.year)!.events.push({
            id: ev.id,
            date: ev.date,
            text: ev.event_text,
            isMajor: ev.is_major,
          });
        }
        // Sort years descending (newest year first)
        const years = Array.from(yearMap.values()).sort((a, b) =>
          b.year.localeCompare(a.year),
        );
        // Sort events within each year by date descending (e.g. "12.25" → "01.23")
        years.forEach((yg) => {
          yg.events.sort((a, b) => b.date.localeCompare(a.date));
        });
        return {
          id: era.id,
          title: era.title,
          period: era.period,
          icon: iconMap[era.icon_name] ?? <Star size={20} />,
          years,
        };
      });

      setHistoryEras(eraList);
      setHistoryLoading(false);
    }
    loadHistory();
  }, []);

  return (
    <section className="bg-stone-50/50 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#333]">교회 연혁</h2>
          <p className="text-stone-500">
            하나님께서 걸음마다 인도하신 은혜의 발자취를 모두 기록하였습니다.
          </p>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-24 text-stone-300">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-16 flex flex-wrap justify-center gap-3">
              {historyEras.map((era, idx) => (
                <button
                  key={era.id}
                  onClick={() => setActiveEra(idx)}
                  className={`flex items-center space-x-2 rounded-2xl px-6 py-3 font-bold transition-all ${
                    activeEra === idx
                      ? "scale-105 bg-emerald-600 text-white shadow-lg"
                      : "border border-stone-100 bg-white text-stone-400 hover:bg-stone-100"
                  }`}
                >
                  {era.icon}
                  <span>{era.title}</span>
                  <span className="font-eng ml-1 text-[10px] opacity-60">
                    ({era.period})
                  </span>
                </button>
              ))}
            </div>

            {historyEras[activeEra] && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="overflow-hidden rounded-[3rem] border border-stone-100 bg-white shadow-xl">
                  <div className="bg-emerald-600 p-8 text-white md:p-12">
                    <h3 className="mb-2 text-2xl font-bold md:text-3xl">
                      {historyEras[activeEra].title}
                    </h3>
                    <p className="font-eng tracking-widest uppercase opacity-80">
                      {historyEras[activeEra].period}
                    </p>
                  </div>

                  <div className="scrollbar-hide max-h-250 space-y-12 overflow-y-auto p-8 md:p-12">
                    {historyEras[activeEra].years.map((yearGroup, yIdx) => (
                      <div
                        key={yIdx}
                        className="relative border-l border-stone-100 pb-4 pl-12 last:pb-0 md:pl-20"
                      >
                        <div className="absolute top-0 -left-1 h-2 w-2 rounded-full bg-emerald-500"></div>
                        <div className="space-y-6">
                          <h4 className="font-eng pointer-events-none absolute -top-3 -left-4 text-4xl font-bold tracking-tighter text-stone-100 opacity-70 md:-left-8">
                            {yearGroup.year}
                          </h4>

                          <div className="grid gap-4">
                            {yearGroup.events.map((event) => (
                              <div
                                key={event.id}
                                className={`rounded-2xl p-4 transition-all ${event.isMajor ? "border border-emerald-100 bg-emerald-50" : "hover:bg-stone-50"}`}
                              >
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                                  <span
                                    className={`font-eng mb-1 inline-block rounded-md px-2 py-0.5 text-xs font-bold md:mb-0 ${event.isMajor ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-400"}`}
                                  >
                                    {event.date}
                                  </span>
                                  <div className="flex-1">
                                    <p
                                      className={`text-base leading-relaxed ${event.isMajor ? "font-bold text-stone-800" : "text-stone-600"}`}
                                    >
                                      {event.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center border-t border-stone-100 bg-stone-50 p-6 text-sm text-stone-400 italic">
                    Scroll to see more history
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
