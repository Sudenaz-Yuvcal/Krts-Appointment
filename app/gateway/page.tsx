"use client";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Store,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function B2BGateway() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Arka Plan Estetik Dokunuşları */}
      <div className="absolute top-0 left-1/4 w-120 h-120 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-120 h-120 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Kısım - Geri Dönüş ve Logo */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-12 relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-950 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
            K
          </div>
          <span className="font-black text-xs tracking-widest text-slate-400 uppercase">
            KRTS NETWORK
          </span>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative z-10 space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex bg-purple-50 border border-purple-100 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-purple-700 uppercase mx-auto">
            <Sparkles className="w-3 h-3 inline-block mr-1 align-middle -mt-0.5" />{" "}
            KURUMSAL İŞ ORTAKLIĞI GİRİŞİ
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Merhaba, KRTS Dünyasına Hoş Geldiniz!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            Yönetim panelinize erişmek veya yeni bir kurumsal ortaklık başvurusu
            yapmak için lütfen aşağıdan profilinizi seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <button
            onClick={() => router.push("/brand")}
            className="flex flex-col items-center justify-between p-8 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-4xl transition-all cursor-pointer group text-center shadow-xs hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">
                Kozmetik Markasıyım
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-2">
                Sisteme ürün tedarik etmek, salon siparişlerini ve 
                stoklarınızı akıllı panelle yönetmek için.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Marka Paneline Git <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* GÜZELLİK SALONU SEÇENEĞİ */}
          <button
            onClick={() => router.push("/business-login")}
            className="flex flex-col items-center justify-between p-8 bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-300 rounded-4xl transition-all cursor-pointer group text-center shadow-xs hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-white text-purple-700 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <Store className="w-7 h-7" />
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide group-hover:text-purple-700 transition-colors">
                Güzellik Salonuyum
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-2">
                Müşteri randevularını yönetmek, salon operasyonlarını ve toptan
                ürün siparişlerini yürütmek için.
              </p>
            </div>
            <div className="mt-6 text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              Salon Paneline Git <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>

      {/* Alt Bilgi */}
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-8 relative z-10">
        © 2026 KRTS Güzellik ve Yazılım Teknolojileri A.Ş.
      </p>
    </div>
  );
}
