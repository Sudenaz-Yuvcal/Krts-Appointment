"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, CheckCircle2, Check, Copy } from "lucide-react";

interface ResultCardProps {
  detectedLocation: string;
  detectedService: string;
}

export default function ResultCard({
  detectedLocation,
  detectedService,
}: ResultCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("KRTS20");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Kupon kopyalanamadı:", err);
    }
  };

  return (
    <div className="flex items-start gap-3.5 max-w-[80%] mr-auto">
      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-purple-200 p-5 rounded-2xl shadow-md border-t-4 border-t-purple-600 space-y-4 w-full animate-in scale-in-95 duration-300">
        <div className="text-center p-3 bg-purple-50/50 rounded-xl border border-dashed border-purple-200">
          <p className="text-[10px] font-black uppercase text-purple-600 tracking-wider">
            Sohbete Özel %15 Kuponunuz
          </p>
          <button
            type="button"
            onClick={copyToClipboard}
            className="mt-1 flex items-center justify-center gap-2 mx-auto font-black text-lg text-[#2D0F14] hover:text-purple-700 transition-colors cursor-pointer"
          >
            <span>KRTS20</span>
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Eşleşen En İyi Salonlar
          </div>
          <h4 className="font-black text-sm text-[#2D0F14]">
            MAISON DE BEAUTÉ KRTS
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold">
            📍 Konum: {detectedLocation || "Belirtilmedi"}
          </p>
          <p className="text-[11px] text-purple-600 font-bold">
            ✨ Hizmet: {detectedService || "Belirtilmedi"}
          </p>
        </div>

        <Link
          href={`/salons?service=${encodeURIComponent(detectedService)}&location=${encodeURIComponent(detectedLocation)}`}
          className="block w-full bg-[#4A1D24] text-white text-xs font-black py-3.5 rounded-xl hover:bg-purple-700 transition-all shadow-md uppercase tracking-wider text-center"
        >
          Müsait Salonları & Saatleri Gör
        </Link>
      </div>
    </div>
  );
}
