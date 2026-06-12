"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Phone,
  MapPin,
  KeyRound,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function UserRegister() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register"); 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!fullName || !phone || !email || !password || !city || !district) {
      setErrorMessage("Lütfen tüm alanları eksiksiz doldurun.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: "customer",
            city: city,
            district: district,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        setStep("verify");
      }
    } catch (err: any) {
      console.error("Kayıt hatası detayı:", err);
      const errMsg = err.message || "";

      if (errMsg.includes("already registered") || err.status === 400) {
        setErrorMessage("Bu e-posta adresiyle daha önce bir hesap başlatılmış. Eğer kod bekliyorsanız formu doldurmaya devam edebilirsiniz veya zaten üyeyseniz giriş yapın.");
        setStep("verify");
      } else if (errMsg.includes("Password should be")) {
        setErrorMessage("Şifreniz en az 6 karakterden oluşmalıdır.");
      } else {
        setErrorMessage(
          errMsg || "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!verificationCode) {
      setErrorMessage("Lütfen gelen doğrulama kodunu girin.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: "signup",
      });

      if (error) throw error;

      if (data?.user) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Doğrulama hatası:", err);
      setErrorMessage(
        err.message || "Girdiğiniz kod hatalı veya süresi dolmuş."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF6F8] text-[#3D1A20] font-sans overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-start pt-24 p-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1000')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-purple-950/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-purple-950/10 backdrop-blur-xs" />

        <div className="relative z-10 space-y-4 max-w-md bg-white/85 backdrop-blur-md p-8 rounded-4xl border border-purple-200/50 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-purple-700 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> KRTS NETWORK
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight uppercase text-purple-950">
            Güzellik Rutininizi Şansa Bırakmayın.
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-6 bg-white border border-purple-200/60 rounded-4xl p-8 md:p-10 shadow-xl shadow-purple-950/5">
          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-emerald-950">
                Harika! Hesabınız Onaylandı
              </h3>
              <p className="text-xs text-emerald-800/80 font-medium">
                Giriş sayfasına yönlendiriliyorsunuz, lütfen bekleyin...
              </p>
            </div>
          ) : step === "register" ? (
            <>
              <div className="space-y-1 text-center lg:text-left">
                <h2 className="text-2xl font-black tracking-tight text-purple-950">
                  Hemen Hesap Oluştur
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Profilinizi açın, randevu akışınızı başlatın.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleRegister}>
                {errorMessage && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-900 text-xs font-semibold p-3.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                    Adınız Soyadınız
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Fatma Özkan"
                      className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                    Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05362565524"
                      className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                    Şehir
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-3.5 pl-12 pr-4 text-xs font-semibold text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Şehir Seçiniz</option>
                      <option value="Bursa">Bursa</option>
                      <option value="İstanbul">İstanbul</option>
                      <option value="Ankara">Ankara</option>
                      <option value="İzmir">İzmir</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                    İlçe
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Örn: Osmangazi"
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
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="fatmaozkan@gmail.com"
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
                  className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  {loading ? (
                    <>
                      KAYIT AÇILIYOR...{" "}
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      KAYIT OL <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
            </>
          ) : (
            <>
              <div className="space-y-1 text-center lg:text-left">
                <h2 className="text-2xl font-black tracking-tight text-purple-950">
                  E-postanızı Doğrulayın
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  <span className="font-bold text-purple-950">{email}</span>{" "}
                  adresine gönderilen doğrulama kodunu aşağıya girin.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleVerifyCode}>
                {errorMessage && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-900 text-xs font-semibold p-3.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-wider text-purple-900/60 uppercase">
                    Doğrulama Kodu
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Kodunuzu buraya yazın"
                      className="w-full bg-[#FAF6F8] tracking-widest text-center border border-purple-100 rounded-xl py-4 px-4 text-base font-black text-purple-950 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black text-xs py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-widest uppercase cursor-pointer"
                >
                  {loading ? (
                    <>
                      KOD ONAYLANIYOR...{" "}
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      KODU ONAYLA <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  onClick={() => setStep("register")}
                  className="text-xs text-purple-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  ← Bilgileri Düzenle / Geri Dön
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}