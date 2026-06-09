"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface SuccessViewProps {
  orderNumber: string;
}

export default function SuccessView({ orderNumber }: SuccessViewProps) {
  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-md w-full bg-white border border-purple-100 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-green-500 border border-green-100">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#2D0F14] uppercase tracking-tight">
            Siparişiniz Alındı!
          </h1>
          <p className="text-sm font-medium text-purple-950/60 leading-relaxed px-4">
            Sipariş detaylarınız veritabanımıza işlendi ve sepetiniz temizlendi.
          </p>
        </div>

        <div className="bg-[#FBF9FC] border border-purple-100 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold text-purple-950/40 uppercase tracking-widest block mb-1">
            Sipariş Numarası
          </span>
          <span className="text-lg font-black text-[#4A1D24] tracking-wider select-all">
            {orderNumber}
          </span>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-[#4A1D24] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-purple-800 transition-all shadow-lg block text-center"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}