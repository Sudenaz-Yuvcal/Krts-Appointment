"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase"; 

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("E-posta adresi veya şifre hatalı.");
        } else {
          throw new Error(error.message);
        }
      }

      if (data?.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Giriş yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF6F8] text-[#3D1A20] font-sans overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-start pt-24 p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-purple-950/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-purple-950/10 backdrop-blur-xs" />

        <div className="relative z-10 space-y-3 max-w-md bg-white/85 backdrop-blur-md p-8 rounded-4xl border border-purple-200/50 shadow-xl transition-all duration-300 hover:scale-[1.01]">
          <div className="inline-flex items-center gap-2 bg-purple-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> GÜVENLİ ERİŞİM
          </div>
          <h1 className="text-3xl font-black tracking-tight text-purple-950 uppercase leading-tight">
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

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  İŞLEM YAPILIYOR <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  GİRİŞ YAP <ArrowRight className="w-4 h-4" />
                </>
              )}
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
