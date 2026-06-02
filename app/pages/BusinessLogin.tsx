"use client";
import { useState } from "react";
import {
  Building,
  Upload,
  Sparkles,
  TrendingUp,
  Users,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Percent,
} from "lucide-react";

export default function BusinessHub() {
  const [view, setView] = useState<"login" | "register">("login");

  const [duration, setDuration] = useState<"1year" | "2year">("2year");

  const pricing = {
    "1year": {
      label: "1 Yıllık Standart Lisans",
      total: "₺7.188",
      monthly: "₺599",
      badge: "Standart Erişim",
    },
    "2year": {
      label: "2 Yıllık Avantajlı Lisans",
      total: "₺11.976",
      monthly: "₺499",
      badge: "%17 Ek Tasarruf + Premium Rozet",
    },
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden">
      <div className="w-full lg:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-between border-r border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-12 max-w-xl relative z-10 my-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
              K
            </div>
            <span className="font-black text-xs tracking-[0.25em] text-slate-700 uppercase">
              KRTS SALON PARTNER
            </span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full text-[10px] font-bold text-purple-600 tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> Akıllı Salon Yönetim Ağı
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[1.1] text-slate-900">
              Koltuk doluluğunuzu{" "}
              <span className="text-purple-600">optimize edin.</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Müşterilerinizin sıraya gireceği pürüzsüz bir randevu deneyimi,
              akıllı envanter takibi ve dijital ciro asistanı. Karmaşık
              sistemleri unutun; her şey tek bir akıcı panelde.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-4">
            <div className="p-4 bg-purple-50/50 border border-purple-100/60 rounded-2xl space-y-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="text-lg font-black text-slate-900">+42%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Net Ciro Artışı
              </div>
            </div>
            <div className="p-4 bg-purple-50/50 border border-purple-100/60 rounded-2xl space-y-1">
              <Users className="w-4 h-4 text-purple-600" />
              <div className="text-lg font-black text-slate-900">0 Dakika</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Bekleme & Çakışma
              </div>
            </div>
          </div>
        </div>

        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-8 relative z-10">
          KRTS SECURE CLOUD NETWORK  2026 Enterprise
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:py-20 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl max-w-xs mx-auto lg:mx-0 shadow-xs">
            <button
              type="button"
              onClick={() => setView("login")}
              className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "login" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setView("register")}
              className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "register" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
            >
              Kayıt Ol
            </button>
          </div>

          {view === "login" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Yönetici Girişi
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Hesabınıza erişerek ajandanızı canlı takip edin.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="isim@salon.com"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Şifre
                    </label>
                    <a
                      href="#"
                      className="text-[11px] text-purple-600 font-bold hover:underline"
                    >
                      Şifremi Unuttum
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 transition-colors shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  PANELDEN OTURUM AÇ <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  İşletmenizi Kaydedin
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tek bir lisansla tüm premium özelliklere sınırsız erişin.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1">
                    <Percent className="w-3 h-3 text-purple-600" /> LİSANS
                    SÜRESİ SEÇİNİZ
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {pricing[duration].badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDuration("1year")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${duration === "1year" ? "bg-purple-50/50 border-purple-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                  >
                    <span className="text-[11px] font-black text-slate-700">
                      1 YILLIK
                    </span>
                    <span className="text-xs font-black text-purple-600 mt-1">
                      {pricing["1year"].monthly}/ay
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDuration("2year")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${duration === "2year" ? "bg-purple-50 border-purple-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-[8px] px-1.5 py-0.5 uppercase rounded-bl-lg tracking-tight">
                      Popüler
                    </div>
                    <span className="text-[11px] font-black text-slate-700">
                      2 YILLIK
                    </span>
                    <span className="text-xs font-black text-purple-600 mt-1">
                      {pricing["2year"].monthly}/ay
                    </span>
                  </button>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-600 font-medium">
                    {duration === "2year" ? (
                      <span>
                        Toplam Tutar:{" "}
                        <strong className="text-purple-600 font-bold">
                          {pricing["2year"].total}
                        </strong>{" "}
                        (24 Ay Boyunca Sabit Fiyat Garantisi)
                      </span>
                    ) : (
                      <span>
                        Toplam Tutar:{" "}
                        <strong className="text-slate-700 font-bold">
                          {pricing["1year"].total}
                        </strong>{" "}
                        (12 Ay Geçerli Standart Tarife)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form
                className="space-y-3.5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Yönetici Ad Soyad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Fiem Style"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Salon Kurumsal Adı
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Fiem Kuaför"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      İş Telefonu
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="0532..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      E-Posta
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="salon@fiem.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    Salon Profil Resmi
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-purple-400 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-purple-600 transition-all cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-purple-600" />
                    <span>Logo veya Görsel Yükleyin</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    Güçlü Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer mt-2"
                >
                  LİSANSI BAŞLAT VE KUR <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
