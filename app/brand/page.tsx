"use client";
import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  Mail,
  Lock,
  ArrowRight,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function BrandHub() {
  const [view, setView] = useState<"login" | "register">("login");
  // 2 Aşamalı Kayıt Akışı: 'form' (Bilgiler) -> 'plan' (Paket Seçimi)
  const [registerStep, setRegisterStep] = useState<"form" | "plan">("form");
  const [duration, setDuration] = useState<"1year" | "2year">("2year");
  const [loading, setLoading] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const pricing = {
    "1year": {
      label: "1 Yıllık Marka Lisansı",
      total: "₺14.388",
      monthly: "₺1.199",
      badge: "Standart Dağıtım",
    },
    "2year": {
      label: "2 Yıllık İş Ortaklığı Lisansı",
      total: "₺21.576",
      monthly: "₺899",
      badge: "%25 Tasarruf + Öne Çıkan Marka",
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      if (!data.session) throw new Error("Oturum başlatılamadı.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Profil doğrulanamadı.");
      }

      if (profile.role !== "brand") {
        await supabase.auth.signOut();
        throw new Error("Bu panel sadece kayıtlı Marka hesaplarına açıktır.");
      }

      setMessage({
        type: "success",
        text: "Giriş Başarılı! Marka Paneline aktarılıyorsunuz...",
      });

      const tokenParams = `?access_token=${encodeURIComponent(data.session.access_token)}&refresh_token=${encodeURIComponent(data.session.refresh_token)}`;
      setTimeout(() => {
        window.location.href = `http://localhost:5173/brand/dashboard${tokenParams}`;
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  // ADIM 1: Hesap Bilgilerini Kaydetme ve Kullanıcı Oluşturma
  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Supabase Auth üzerinde kullanıcıyı oluşturuyoruz
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: { full_name: fullName, role: "brand" },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

      // 2. PROFILES tablosuna sadece ID ve ROLE basıyoruz (İstediğin gibi)
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          role: "brand",
        },
      ]);

      if (profileError) throw profileError;

      // 3. BRANDS tablosuna markanın ilk detaylarını kaydediyoruz
      // (Kolon isimlerini kendi veritabanına göre id, brand_name, authorized_name, phone şeklinde kontrol edebilirsin)
      const { error: brandError } = await supabase.from("brands").insert([
        {
          id: authData.user.id, // profiles ile bağlamak için uuid'yi buraya da basıyoruz
          brand_name: brandName, // Marka İsmi
          authorized_name: fullName, // Yetkili Ad Soyad
          phone: phone, // Telefon
          email: registerEmail, // E-Posta
        },
      ]);

      if (brandError) throw brandError;

      // Başarılıysa kullanıcının ID'sini sakla ve 2. Adıma (Paket seçimi) geçir
      setRegisteredUserId(authData.user.id);
      setRegisterStep("plan");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Kayıt başarısız." });
    } finally {
      setLoading(false);
    }
  };

  // ADIM 2: Paket Seçimini Tamamlama ve BRANDS Tablosuna Gönderme
  const handlePlanSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredUserId) return;

    setLoading(true);
    setMessage(null);

    try {
      // Seçilen paketi bu sefer profiles yerine BRANDS tablosuna güncelliyoruz
      const { error: planError } = await supabase
        .from("brands")
        .update({
          subscription_plan: duration, // '1year' veya '2year' değerini brands tablosuna yazar
        })
        .eq("id", registeredUserId);

      if (planError) throw planError;

      setMessage({
        type: "success",
        text: "Harika! Marka profiliniz ve lisans seçiminiz başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.",
      });

      // Formları ve adımları sıfırlayıp giriş ekranına yönlendiriyoruz
      setRegisterStep("form");
      setView("login");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Plan seçimi kaydedilemedi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Sol Görsel & Bilgi Alanı */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-between border-r border-slate-200 relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-12 max-w-xl my-auto relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
              B
            </div>
            <span className="font-black text-xs tracking-[0.25em] text-slate-600 uppercase">
              KRTS BRAND PARTNER
            </span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> Kozmetik & Ürün Dağıtım Ağı
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[1.1] text-slate-900">
              Binlerce salona doğrudan{" "}
              <span className="text-emerald-600">ulaşın.</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Markanızı, sistemimizi kullanan tüm güzellik merkezlerine ve
              kuaförlere entegre edin. Siparişleri anlık takip edin, ürün
              stoklarınızı akıllı panelle yönetin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-4">
            <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl space-y-1 shadow-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div className="text-lg font-black text-slate-900">B2B</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Direct To Salon
              </div>
            </div>
            <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl space-y-1 shadow-sm">
              <Users className="w-4 h-4 text-emerald-600" />
              <div className="text-lg font-black text-slate-900">Anlık</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Stok & Sipariş Takibi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Form Alanı */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:py-20 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Giriş / Kayıt Tab Seçimi - Sadece ilk adımdayken görünür */}
          {registerStep === "form" && (
            <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl max-w-xs mx-auto lg:mx-0 shadow-sm">
              <button
                onClick={() => {
                  setView("login");
                  setMessage(null);
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "login" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  setView("register");
                  setMessage(null);
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "register" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Kayıt Ol
              </button>
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-xl text-xs font-bold border shadow-sm ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {message.text}
            </div>
          )}

          {/* GİRİŞ GÖRÜNÜMÜ */}
          {view === "login" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Marka Yönetim Paneli
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Kurumsal marka hesabınızla giriş yapın.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    E-Posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="partner@marka.com"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  {loading ? "GİRİŞ YAPILIYOR..." : "MARKA SİSTEMİNE BAĞLAN"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* KAYIT GÖRÜNÜMÜ (2 ADIMLI) */
            <div className="space-y-6">
              {/* ADIM 1: KAYIT BİLGİ FORMU */}
              {registerStep === "form" ? (
                <>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Marka Başvurusu
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Ağımıza katılarak profilinizi oluşturun.
                    </p>
                  </div>

                  <form
                    className="space-y-3.5"
                    onSubmit={handleRegisterFormSubmit}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                          Yetkili Ad Soyad
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ahmet Yılmaz"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                          Marka Adı
                        </label>
                        <input
                          type="text"
                          required
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="L'Oréal Pro"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0532..."
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                          E-Posta
                        </label>
                        <input
                          type="email"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="b2b@marka.com"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                        Şifre
                      </label>
                      <input
                        type="password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? "PROFİL AÇILIYOR..." : "DEVAM ET VE PAKET SEÇ"}{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                /* ADIM 2: KAYIT SONRASI LİSANS/PAKET SEÇİM EKRANI */
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Hesap Başarıyla Oluşturuldu
                      </span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">
                      Lisans Paketini Seç
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      B2B dağıtım ağınızı aktifleştirmek için size uygun süreyi
                      seçin.
                    </p>
                  </div>

                  <form
                    className="space-y-6"
                    onSubmit={handlePlanSelectionSubmit}
                  >
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-emerald-600" />{" "}
                          LİSANSLAMA MODELİ
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {pricing[duration].badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDuration("1year")}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${duration === "1year" ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}
                        >
                          <span className="text-[11px] font-black text-slate-700">
                            1 YILLIK LİSANS
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-emerald-600">
                              {pricing["1year"].monthly}/ay
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">
                              Toplam: {pricing["1year"].total}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDuration("2year")}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden ${duration === "2year" ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}
                        >
                          <span className="text-[11px] font-black text-slate-700">
                            2 YILLIK ORTAKLIK
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-emerald-600">
                              {pricing["2year"].monthly}/ay
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">
                              Toplam: {pricing["2year"].total}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md hover:shadow-lg uppercase tracking-widest cursor-pointer"
                    >
                      {loading
                        ? "LİSANS KAYDEDİLİYOR..."
                        : "BAŞVURUYU VE PAKETİ TAMAMLA"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
