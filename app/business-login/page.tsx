"use client";
import { useState, useEffect } from "react";
import {
  Building,
  Sparkles,
  Users,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Percent,
  CreditCard,
  Globe,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

interface PackagePlan {
  id: string;
  months: number;
  monthly_price: number;
  discount_badge: string;
  is_popular: boolean;
  name: string;
}

export default function BusinessHub() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<"form" | "plan">("form");
  const [duration, setDuration] = useState<"1year" | "2year">("2year");
  const [loading, setLoading] = useState(false);
  const [registeredBrandId, setRegisteredBrandId] = useState<string | null>(
    null,
  );
  const [dbPlans, setDbPlans] = useState<{ [key: string]: PackagePlan }>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [sector, setSector] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const pricing = {
    "1year": {
      label: "1 Yıllık Standart Marka Lisansı",
      total: "₺14.388",
      monthly: "₺1.199",
      badge: "Standart Erişim",
    },
    "2year": {
      label: "2 Yıllık Avantajlı Marka Lisansı",
      total: "₺23.976",
      monthly: "₺999",
      badge: "%17 Ek Tasarruf + Premium Partner",
    },
  };

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from("package_plans")
          .select(
            "id, months, monthly_price, discount_badge, is_popular, name",
          );

        if (error) throw error;

        if (data) {
          const plansMap: { [key: string]: PackagePlan } = {};
          data.forEach((plan) => {
            if (plan.months === 12) plansMap["1year"] = plan;
            if (plan.months === 24) plansMap["2year"] = plan;
          });
          setDbPlans(plansMap);
        }
      } catch (err) {
        console.error("Planlar yüklenirken hata oluştu:", err);
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
      if (!data.session) throw new Error("Oturum başlatılamadı.");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Profil yetkileri doğrulanamadı.");
      }

      const tokenParams = `?access_token=${encodeURIComponent(data.session.access_token)}&refresh_token=${encodeURIComponent(data.session.refresh_token)}`;

      let baseUrl = "http://localhost:5173/";
      if (profile.role === "admin") {
        baseUrl = "http://localhost:5173/admin/dashboard";
      } else if (profile.role === "brand") {
        baseUrl = "http://localhost:5173/brand/dashboard";
      } else {
        baseUrl = "http://localhost:5173/dashboard";
      }

      setMessage({
        type: "success",
        text: "Giriş Başarılı! Marka Paneline yönlendiriliyorsunuz...",
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
          data: {
            full_name: fullName,
            display_name: fullName,
            name: fullName,
            role: "brand",
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          role: "brand",
          full_name: fullName,
        },
      ]);

      if (profileError) throw profileError;

      const { error: brandError } = await supabase.from("brands").insert([
        {
          id: authData.user.id,
          brand_name: brandName,
          authorized_name: fullName,
          phone: phone,
          email: registerEmail,
        },
      ]);

      if (brandError) throw brandError;

      setRegisteredBrandId(authData.user.id);
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
    if (!registeredBrandId) return;

    const selectedPlanId = dbPlans[duration]?.id;

    if (!selectedPlanId) {
      setMessage({
        type: "error",
        text: "Seçilen pakete ait sistem ID'si bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error: planError } = await supabase
        .from("brands")
        .update({
          subscription_plan: duration,
        })
        .eq("id", registeredBrandId);

      if (planError) throw planError;

      setMessage({
        type: "success",
        text: "Marka lisans kaydınız ve ödemeniz onaylandı! Giriş yapabilirsiniz.",
      });

      setRegisterStep("form");
      setView("login");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Paket tanımlanırken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden">
      <div className="w-full lg:w-1/2 p-8 md:p-16 bg-white flex flex-col justify-between border-r border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-12 max-w-xl relative z-10 my-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
              M
            </div>
            <span className="font-black text-xs tracking-[0.25em] text-slate-700 uppercase">
              KRTS BRAND PARTNER
            </span>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> Marka & Tedarik Yönetim Ağı
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[1.1] text-slate-900">
              Markanızı salonlarla{" "}
              <span className="text-emerald-600">buluşturun.</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Güzellik salonlarına doğrudan ulaşın, ürün ve envanter ağınızı
              yönetin, sipariş ve pazar payınızı akıllı analizlerle büyütün.
            </p>
          </div>
        </div>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-8 relative z-10">
          KRTS SECURE CLOUD NETWORK 2026 Enterprise
        </div>
      </div>

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
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "login" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("register");
                  setMessage(null);
                }}
                className={`py-2 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${view === "register" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-800"}`}
              >
                Marka Kaydı
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
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Marka Girişi
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Marka yönetim merkezinize bağlanın.
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
                      placeholder="brand@sirket.com"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-emerald-500"
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
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-4 rounded-xl shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  {loading ? "OTURUM AÇILIYOR..." : "MARKA PANELİNE GİR"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : registerStep === "form" ? (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Markanızı Kaydedin
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  B2B yönetim ağında yerinizi almak için bilgileri doldurun.
                </p>
              </div>

              <form className="space-y-3.5" onSubmit={handleRegisterFormSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Marka Adı
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Natura Kozmetik"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Sektör
                    </label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Kozmetik / Saç Bakım"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Yetkili Ad Soyad
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ahmet Yılmaz"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Web Sitesi
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="www.naturakozmetik.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0532..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
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
                        placeholder="b2b@sirket.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase mt-2 cursor-pointer"
                >
                  {loading ? "İŞLEM ALINIYOR..." : "DEVAM ET VE PLAN SEÇ"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Kurumsal Planınızı Seçin
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  B2B erişim paketinizi onaylayarak kurulumu bitirin.
                </p>
              </div>

              <form onSubmit={handlePlanSelectionSubmit} className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase flex items-center gap-1">
                      <Percent className="w-3 h-3 text-emerald-600" /> MARKA B2B
                      PAKETLERI
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {pricing[duration].badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDuration("1year")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${duration === "1year" ? "bg-emerald-50/50 border-emerald-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                    >
                      <span className="text-[11px] font-black text-slate-700">
                        1 YILLIK PLAN
                      </span>
                      <span className="text-xs font-black text-emerald-600 mt-1">
                        {pricing["1year"].monthly}/ay
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDuration("2year")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${duration === "2year" ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[8px] px-1.5 py-0.5 uppercase rounded-bl-lg tracking-tight">
                        Popüler
                      </div>
                      <span className="text-[11px] font-black text-slate-700">
                        2 YILLIK PLAN
                      </span>
                      <span className="text-xs font-black text-emerald-600 mt-1">
                        {pricing["2year"].monthly}/ay
                      </span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    <div className="text-[11px] text-slate-600 font-medium">
                      Toplam Ödeme:{" "}
                      <strong className="text-emerald-600 font-bold">
                        {pricing[duration].total}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-4 rounded-xl shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer relative overflow-hidden"
                >
                  <CreditCard className="w-4 h-4" />{" "}
                  {loading
                    ? "PLAN AKTİF EDİLİYOR..."
                    : "ÖDEMEYİ TAMAMLA VE MARKA AKTİF ET"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
