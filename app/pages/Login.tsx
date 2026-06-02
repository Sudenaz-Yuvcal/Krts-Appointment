"use client";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex bg-[#FAF6F8] text-[#3D1A20] font-sans overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-end p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#FAF6F8] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-purple-950/10 backdrop-blur-xs" />

        <div className="relative z-10 space-y-3 max-w-md bg-white/80 backdrop-blur-md p-8 rounded-4xl border border-purple-200/50 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-purple-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> GÜVENLİ ERİŞİM
          </div>
          <h1 className="text-3xl font-black tracking-tight text-purple-950 uppercase">
            Güzellik Dünyasına Kaldığınız Yerden Devam Edin.
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 bg-white border border-purple-200/60 rounded-4xl p-8 md:p-10 shadow-xl shadow-purple-950/5">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-black tracking-tight text-purple-950">
               Merhaba
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Hesabınıza giriş yapın ve randevularınızı yönetin.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                  Şifre
                </label>
                <a
                  href="#"
                  className="text-[11px] text-purple-700 font-bold hover:underline"
                >
                  Unuttum?
                </a>
              </div>
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
              GİRİŞ YAP <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="text-purple-700 font-bold hover:underline"
              >
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
