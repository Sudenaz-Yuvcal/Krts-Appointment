"use client";
import { useState, useEffect } from "react";
import {
  Building,
  Sparkles,
  TrendingUp,
  Users,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Percent,
  CreditCard,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

interface PackagePlan {
  id: string;
  name: string;
  months: number;
  monthly_price: number;
  discount_badge: string;
  is_popular: boolean;
}

export default function BusinessHub() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<"form" | "plan">("form");
  const [loading, setLoading] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  const [plans, setPlans] = useState<PackagePlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [phone, setPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from("package_plans")
          .select("id, name, months, monthly_price, discount_badge, is_popular")
          .order("months", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setPlans(data);
          const popularPlan = data.find((p) => p.is_popular) || data[0];
          setSelectedPlanId(popularPlan.id);
        }
      } catch (err) {
        console.error("Paket planları çekilirken hata oluştu:", err);
      }
    }
    fetchPlans();
  }, []);

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
      if (!data.session)
        throw new Error("Oturum başlatılamadı, token alınamadı.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Profil bilgileri doğrulanamadı.");
      }

      const tokenParams = `?access_token=${encodeURIComponent(data.session.access_token)}&refresh_token=${encodeURIComponent(data.session.refresh_token)}`;
      let baseUrl = "http://localhost:5173/";

      if (profile.role === "admin") {
        baseUrl = "http://localhost:5173/admin/dashboard";
      } else if (profile.role === "brand") {
        baseUrl = "http://localhost:5173/brand/dashboard";
      } else if (profile.role === "salon" || profile.role === "hairdresser") {
        baseUrl = "http://localhost:5173/dashboard";
      } else {
        await supabase.auth.signOut();
        throw new Error("Tanımsız rol yetkisi.");
      }

      setMessage({
        type: "success",
        text: "Giriş Başarılı! Panelinize yönlendiriliyorsunuz...",
      });

      setTimeout(() => {
        window.location.href = `${baseUrl}${tokenParams}`;
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Giriş yapılırken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: { full_name: fullName, role: "salon" },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: authData.user.id, role: "salon" }]);

      if (profileError) throw profileError;

      const { error: salonError } = await supabase.from("salons").insert({
        salon_id: authData.user.id,
        salon_name: salonName,
        opening_time: "09:00",
        closing_time: "22:00",
        cover_images: [],
      });

      if (salonError) throw salonError;

      setRegisteredUserId(authData.user.id);
      setRegisterStep("plan");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Kayıt işlemi başarısız oldu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredUserId || !selectedPlanId) return;

    setLoading(true);
    setMessage(null);

    try {
      const { error: updateError } = await supabase
        .from("salons")
        .update({
          package_plan_id: selectedPlanId,
        })
        .eq("salon_id", registeredUserId);

      if (updateError) throw updateError;

      setMessage({
        type: "success",
        text: "Lisans ödemeniz alındı ve kurulum tamamlandı! Şimdi giriş yapabilirsiniz.",
      });

      setRegisterStep("form");
      setView("login");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Lisans kaydı güncellenirken hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  const activePlanDetails = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Sol Panel */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-between border-r border-slate-200 relative overflow-hidden">
        {/* Geri gelen Mor Blur efekti */}
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
              <Sparkles className="w-3 h-3" /> Akıllı İşletme Yönetim Ağı
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[1.1] text-slate-900">
              İşletmenizi tek merkezden{" "}
              <span className="text-purple-600">optimize edin.</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Müşterilerinizin sıraya gireceği pürüzsüz bir randevu deneyimi,
              akıllı envanter takibi ve dijital ciro asistanı.
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
          KRTS SECURE CLOUD NETWORK 2026 Enterprise
        </div>
      </div>

      {/* Sağ Panel (Formlar) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:py-20 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {registerStep === "form" && (
            <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl max-w-xs mx-auto lg:mx-0 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setMessage(null);
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "login" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("register");
                  setMessage(null);
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "register" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
              >
                Kayıt Ol
              </button>
            </div>
          )}

          {message && (
            <div
              className={`p-4 rounded-xl text-xs font-bold border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {message.text}
            </div>
          )}

          {view === "login" ? (
            /* --- GİRİŞ EKRANI --- */
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Sistem Girişi
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Panelinize canlı bağlanın.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    E-Posta
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="isim@isletme.com"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-purple-500"
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
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-4 rounded-xl shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  {loading ? "OTURUM AÇILIYOR..." : "SİSTEMDEN OTURUM AÇ"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : registerStep === "form" ? (
            /* --- KAYIT ADIM 1: FORM BİLGİLERİ --- */
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  İşletmenizi Kaydedin
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Salon profilinizi oluşturmak için bilgileri girin.
                </p>
              </div>

              <form className="space-y-3.5" onSubmit={handleRegisterFormSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Yönetici Ad Soyad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ad Soyad"
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
                        required
                        value={salonName}
                        onChange={(e) => setSalonName(e.target.value)}
                        placeholder="FİEM Kuaför"
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
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0546..."
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
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="info@fiemkuafor.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    Güçlü Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase mt-2 cursor-pointer"
                >
                  {loading ? "İŞLEM ALINIYOR..." : "DEVAM ET VE LİSANS SEÇ"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* --- KAYIT ADIM 2: VERİTABANINDAN 3 PAKET LİSTELEME --- */
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Lisans Paketinizi Seçin
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Kaydınızı tamamlamak için kurumsal lisans sürenizi onaylayın.
                </p>
              </div>

              <form onSubmit={handlePlanSelectionSubmit} className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1">
                      <Percent className="w-3 h-3 text-purple-600" /> SÜRE
                      SEÇENEKLERİ
                    </span>
                    {activePlanDetails?.discount_badge && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        {activePlanDetails.discount_badge}
                      </span>
                    )}
                  </div>

                  {/* 3 paket gelirse 3'lü kolon düzeni */}
                  <div
                    className={`grid gap-2 ${plans.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
                  >
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${selectedPlanId === plan.id ? "bg-purple-50 border-purple-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                      >
                        {plan.is_popular && (
                          <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-[7px] px-1.5 py-0.5 uppercase rounded-bl-lg tracking-tight">
                            Popüler
                          </div>
                        )}
                        <span className="text-[10px] font-black text-slate-700 uppercase wrap-break-words pr-2">
                          {plan.name}
                        </span>
                        <span className="text-xs font-black text-purple-600 mt-2">
                          ₺{plan.monthly_price}/ay
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Dinamik Hesaplanan Tutar */}
                  {activePlanDetails && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-600 font-medium">
                        Toplam Tutar:{" "}
                        <strong className="text-purple-600 font-bold">
                          ₺
                          {(
                            activePlanDetails.monthly_price *
                            activePlanDetails.months
                          ).toLocaleString("tr-TR")}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buton hala yeşil kalıyor, çünkü ödeme/onay butonu */}
                <button
                  type="submit"
                  disabled={loading || !selectedPlanId}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-4 rounded-xl shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />{" "}
                  {loading
                    ? "LİSANS ONAYLANIYOR..."
                    : "ÖDEME YAP VE LİSANSI TAMAMLA"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
