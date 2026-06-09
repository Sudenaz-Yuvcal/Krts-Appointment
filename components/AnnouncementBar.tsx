"use client";

import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const text =
    "KRTS BEAUTY • SEÇKİN GÜZELLİK AĞI • YENİ ÜYELERE ÖZEL %20 İNDİRİM • LÜKS BAKIM KOMPLEKSLERİ • AYNI GÜN PREMİUM KARGO • ";

  return (
    <div className="w-full bg-[#1A0F11] border-b border-[#4A2328]/30 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-pink-200/80 overflow-hidden relative z-40 select-none">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-4 pr-4">
          <span>{text}</span>
          <Sparkles className="w-3 h-3 text-purple-400 inline" />
          <span>{text}</span>
          <Sparkles className="w-3 h-3 text-purple-400 inline" />
        </div>

        <div className="flex items-center gap-4 pr-4">
          <span>{text}</span>
          <Sparkles className="w-3 h-3 text-purple-400 inline" />
          <span>{text}</span>
          <Sparkles className="w-3 h-3 text-purple-400 inline" />
        </div>
      </div>
    </div>
  );
}
