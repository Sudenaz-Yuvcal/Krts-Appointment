"use client";
import { use, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Star,
  Sparkles,
  Camera,
  Award,
  Clock,
  HeartHandshake,
} from "lucide-react";

export default function SalonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const salonData = {
    name: "Fiem Kuaför & Güzellik Salonu",
    title: "KRTS Gold Verified Partner Portfolio",
    phone: "0532 123 45 67",
    region: "İstanbul / Beşiktaş",
    status:
      "Profiliniz eksiksiz ve arama listelerinde en üst sırada gösteriliyor.",
    about:
      "Salonumuz, saç renklendirme, mikro kaynak ve kreatif kesim alanlarında uzman kadrosuyla modern, yenilikçi ve konforlu bir hizmet sunmaktadır. 12 yılı aşkın tecrübemiz ve uluslararası sertifikalı stilistlerimizle premium saç tasarımlarına imza atıyoruz.",
    address: "Nispetiye Mahallesi, Aytar Caddesi No:12 Kat:2",
    rating: 4.9,
    reviewCount: 142,
    bannerImg:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200",

    gallery: [
      {
        id: "1",
        title: "Blonde Balayage Signature",
        url: "https://images.unsplash.com/photo-1620331702844-b2b0094d21f1?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "2",
        title: "Micro Hair Extensions",
        url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "3",
        title: "Creative Shag Cut",
        url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "4",
        title: "Bridal Premium Styling",
        url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600",
      },
    ],
  };

  const services: string[] = [
    "Kreatif Saç Kesimi",
    "Renklendirme & Ombre",
    "Mikro Saç Kaynak",
    "Profesyonel Fön",
  ];

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] font-sans selection:bg-purple-200">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/salons">
            <button className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-purple-700 hover:text-white bg-white hover:bg-[#4A1D24] border border-[#4A1D24]/10 rounded-xl py-3 px-5 transition-all cursor-pointer shadow-xs">
              <ArrowLeft className="w-4 h-4" /> LİSTEYE GERİ DÖN
            </button>
          </Link>
          <span className="text-[10px] font-black tracking-[0.2em] bg-purple-100 text-purple-800 px-3 py-1.5 rounded-md uppercase">
            PREMIUM SALON PROFILI
          </span>
        </div>

        <div
          className="w-full h-80 md:h-110 bg-cover bg-center border border-[#4A1D24]/10 rounded-[40px] p-8 md:p-12 flex flex-col justify-end relative shadow-2xl overflow-hidden"
          style={{ backgroundImage: `url(${salonData.bannerImg})` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md border border-purple-100 px-4 py-2.5 rounded-xl text-xs font-black text-purple-900 flex items-center gap-1.5 z-10 shadow-md">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{" "}
            {salonData.rating} PUAN{" "}
            <span className="text-purple-900/40 font-bold">
              ({salonData.reviewCount} Yorum)
            </span>
          </div>

          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase drop-shadow-sm">
              {salonData.name}
            </h2>
            <p className="text-xs md:text-sm text-purple-200 font-bold tracking-widest uppercase flex items-center gap-2 opacity-90 drop-shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />{" "}
              {salonData.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-[#4A1D24]/5 p-6 rounded-[28px] space-y-3 shadow-xs">
              <span className="text-[10px] font-black tracking-[0.2em] text-purple-900/40 block uppercase">
                Canlı Rezervasyon Durumu
              </span>
              <div className="p-4 bg-emerald-50 border border-emerald-500/20 rounded-2xl">
                <p className="text-xs font-bold text-emerald-700 leading-relaxed flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5 animate-pulse" />
                  {salonData.status}
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#4A1D24]/5 p-6 rounded-[28px] space-y-5 shadow-xs">
              <h4 className="text-xs font-black tracking-[0.2em] text-purple-700 uppercase border-b border-[#4A1D24]/5 pb-2">
                İletişim & Konum
              </h4>

              <div className="space-y-1">
                <span className="text-[10px] text-purple-900/40 font-bold block uppercase">
                  Telefon
                </span>
                <a
                  href={`tel:${salonData.phone}`}
                  className="text-xs font-black text-[#2D0F14] hover:text-purple-700 hover:underline flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-500" />{" "}
                  {salonData.phone}
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-purple-900/40 font-bold block uppercase">
                  Bölge
                </span>
                <div className="text-xs font-bold text-[#2D0F14] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />{" "}
                  {salonData.region}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-purple-900/40 font-bold block uppercase">
                  Açık Adres
                </span>
                <div className="text-xs font-medium text-[#4A1D24]/70 leading-relaxed">
                  {salonData.address}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-[#4A1D24]/5 p-6 rounded-[28px] space-y-4 shadow-xs">
              <h3 className="text-xs font-black tracking-[0.2em] text-purple-900/40 uppercase">
                Salon Hakkında
              </h3>
              <p className="text-sm text-[#2D0F14] font-medium leading-relaxed">
                {salonData.about}
              </p>
            </div>

            <div className="bg-white border border-purple-200 p-8 rounded-4xl space-y-6 shadow-xl shadow-purple-950/5">
              <div>
                <h3 className="text-xl font-black text-[#2D0F14] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" /> HIZLI RANDEVU
                  OLUŞTUR
                </h3>
                <p className="text-xs text-[#4A1D24]/50 font-medium mt-1">
                  İstediğiniz uzmanlık alanını belirleyerek asistan rezervasyon
                  ekranına geçiş yapın.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <button
                    key={index}
                    className="p-4 bg-[#FAF5F7] hover:bg-purple-700 border border-[#4A1D24]/10 hover:border-transparent rounded-xl text-left text-xs font-bold text-[#4A1D24] hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    {service}
                  </button>
                ))}
              </div>

              <button className="w-full bg-[#4A1D24] hover:bg-purple-700 text-white font-black text-xs py-4.5 rounded-2xl transition-all text-center tracking-[0.2em] uppercase cursor-pointer shadow-lg">
                Randevu Saatini Seç ➔
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#4A1D24]/5 p-8 rounded-[40px] space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#4A1D24]/5 pb-4 gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-purple-700 text-[10px] font-black tracking-[0.25em] uppercase">
                <Camera className="w-3.5 h-3.5" /> SALON SANAT KATALOGU
              </div>
              <h3 className="text-2xl font-black text-[#2D0F14] tracking-tight">
                Öne Çıkan Salon Çalışmaları
              </h3>
            </div>
            <span className="text-xs font-bold text-[#4A1D24]/60">
              Görsellere tıklayarak büyütebilirsiniz
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {salonData.gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="group relative h-64 bg-cover bg-center rounded-2xl overflow-hidden cursor-zoom-in border border-[#4A1D24]/10 transition-transform duration-300 hover:scale-[1.02] shadow-xs"
                style={{ backgroundImage: `url(${img.url})` }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-[10px] font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#4A1D24] text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-3 p-4 border-b md:border-b-0 md:border-r border-white/10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-purple-300">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black tracking-wider uppercase">
                Sertifikalı Uzman Kadro
              </h4>
              <p className="text-xs text-purple-200/70 font-medium leading-relaxed">
                Bu salonda çalışan tüm stilistler uluslararası renklendirme ve
                anatomi akademisi mezunudur.
              </p>
            </div>

            <div className="space-y-3 p-4 border-b md:border-b-0 md:border-r border-white/10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-purple-300">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black tracking-wider uppercase">
                Zaman Optimizasyonu
              </h4>
              <p className="text-xs text-purple-200/70 font-medium leading-relaxed">
                KRTS Akıllı Rezervasyon entegrasyonu sayesinde bekleme süreniz
                sıfıra indirgenir.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-purple-300">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black tracking-wider uppercase">
                %100 Hijyen & Güven
              </h4>
              <p className="text-xs text-purple-200/70 font-medium leading-relaxed">
                Tüm ekipmanlar her işlem sonrası medikal dereceli UV
                sterilizatörlerde dezenfekte edilmektedir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={selectedImage}
              alt="Salon Çalışması Büyük"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
