"use client";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function UserRegister() {
  return (
    <div className="min-h-screen w-full flex bg-[#FAF6F8] text-[#3D1A20] font-sans overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-end p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1000')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#FAF6F8] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-purple-950/10 backdrop-blur-xs" />

        <div className="relative z-10 space-y-4 max-w-md bg-white/80 backdrop-blur-md p-8 rounded-4xl border border-purple-200/50 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-purple-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> KRTS NETWORK
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight uppercase text-purple-950">
            Güzellik Rutininizi Şansa Bırakmayın.
          </h1>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs font-bold text-purple-900/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> En elit
              kuaförlerden anında onaylı randevu
            </p>
            <p className="flex items-center gap-2 text-xs font-bold text-purple-900/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stilistlerin
              gerçek portfolyo ve çalışmalarını inceleme
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 bg-white border border-purple-200/60 rounded-4xl p-8 md:p-10 shadow-xl shadow-purple-950/5">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-black tracking-tight text-purple-950">
              Hemen Hesap Oluştur
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Profilinizi açın, randevu akışınızı anında başlatın.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                Adınız Soyadınız
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Sudenaz Yılmaz"
                  className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  placeholder="isim@domain.com"
                  className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                Şifre Belirleyin
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
            >
              KAYIT OL <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Zaten üye misiniz?{" "}
              <Link
                href="/login"
                className="text-purple-700 font-bold hover:underline"
              >
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
