"use client";

import { Bot, AlertCircle, PhoneCall } from "lucide-react";

export default function SupportCard() {
  return (
    <div className="flex items-start gap-3.5 max-w-[80%] mr-auto">
      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-md border-t-4 border-t-amber-500 space-y-4 w-full animate-in scale-in-95">
        <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" /> Canlı Destek Çözüm Merkezi
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Sizi bekletmemek adına hemen profesyonel müşteri danışmanlarımıza bağlıyorum.
        </p>
        <a
          href="tel:4440000"
          className="flex items-center justify-center gap-2 w-full bg-amber-600 text-white font-black text-xs py-3 rounded-xl hover:bg-amber-700 transition-all shadow-md"
        >
          <PhoneCall className="w-4 h-4" /> Müşteri Temsilcisini Ara (444 0 000)
        </a>
      </div>
    </div>
  );
}