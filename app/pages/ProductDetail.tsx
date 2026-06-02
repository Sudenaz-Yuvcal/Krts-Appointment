"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Sparkles,
  Check,
  Tag,
  Plus,
  Minus,
  X,
  ArrowRight,
} from "lucide-react";

const DETAILED_PRODUCT = {
  id: "1",
  name: "Kérastase Elixir Ultime Lüks Onarıcı Saç Yağı",
  brand: "Kérastase",
  price: "1,450 TL",
  type: "Saç Bakımı & İksir",
  desc: "Yıpranmış ve mat saç telleri için özel olarak formüle edilmiş, kutsal marula, havyar özleri ve saf argan yağı içeren durulanmayan lüks bakım iksiri. Saçınıza ağırlık yapmadan anında yüksek parlaklık, ipeksi yumuşaklık ve 230 dereceye kadar ısı koruması sağlar.",
  images: [
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800",
  ],
};

const SUGGESTED_PRODUCTS = [
  {
    id: "2",
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    price: "650 TL",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Garnier Ambre Solaire Anti-Age SPF50+",
    brand: "Garnier",
    price: "520 TL",
    img: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "L'Oréal Paris Revitalift Filler Serum",
    brand: "L'Oréal",
    price: "790 TL",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    name: "Chanel Rouge Allure Velvet Mat Ruj",
    brand: "Chanel",
    price: "2,100 TL",
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedImage, setSelectedImage] = useState<string>(
    DETAILED_PRODUCT.images[0],
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] px-6 md:px-16 py-10 space-y-16 flex-1 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="relative z-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-black text-purple-900/50 hover:text-[#4A1D24] transition-colors uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Kataloğa Geri Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        <div className="lg:col-span-6 flex gap-4 w-full h-125">
          <div className="flex flex-col justify-between h-full gap-3 w-32 shrink-0">
            {DETAILED_PRODUCT.images.slice(0, 3).map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-full flex-1 aspect-square bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer relative ${
                  selectedImage === img
                    ? "border-purple-600 shadow-md scale-[1.02]"
                    : "border-purple-100 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 h-full bg-linear-to-b from-white to-purple-50/20 border border-purple-100/60 rounded-4xl relative overflow-hidden group shadow-xl shadow-purple-900/5">
            <img
              src={selectedImage}
              alt={DETAILED_PRODUCT.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-6 right-6 p-3.5 bg-white/80 backdrop-blur-md border border-purple-100 rounded-full text-purple-900/60 shadow-md cursor-pointer hover:scale-110 transition-all z-10"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-pink-600 text-pink-600" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#4A1D24] text-white uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              <Sparkles className="w-3 h-3 text-pink-300" />{" "}
              {DETAILED_PRODUCT.type}
            </span>
            <div className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] pt-2">
              {DETAILED_PRODUCT.brand}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2D0F14] tracking-tight leading-none">
              {DETAILED_PRODUCT.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-950/60">
            <div className="flex text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
            <span>4.9 / 5.0 — 124 Elit İnceleme</span>
          </div>

          <p className="text-sm text-[#4A1D24]/80 font-medium leading-relaxed max-w-xl">
            {DETAILED_PRODUCT.desc}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-2xl py-3 px-6 w-fit shadow-lg shadow-purple-900/5">
              <span className="text-[9px] text-purple-900/50 block uppercase font-black tracking-widest leading-none mb-1">
                Premium Yatırım Değeri
              </span>
              <span className="text-2xl font-black text-[#2D0F14] tracking-tight leading-none">
                {DETAILED_PRODUCT.price}
              </span>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200/60 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-bold text-purple-950">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              Sihirbaz İndirimi Aktif! Sepette %15 indirim için{" "}
              <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black select-all">
                KRTS15
              </span>{" "}
              kodunu kullanın.
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center justify-between border-2 border-purple-200/80 bg-white rounded-2xl p-2 w-36 h-14 shadow-xs">
              <button
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                className="w-9 h-9 rounded-xl hover:bg-purple-50 flex items-center justify-center text-purple-900/70 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-[#2D0F14] text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-xl hover:bg-purple-50 flex items-center justify-center text-purple-900/70 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 h-14 text-xs font-black bg-[#4A1D24] hover:bg-purple-700 text-white rounded-2xl transition-all shadow-xl shadow-purple-950/10 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer transform active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" /> Sepete Ekle
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5F7] border border-purple-200 w-full max-w-md rounded-4xl shadow-2xl p-6 relative overflow-hidden text-[#4A1D24] text-center space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-100 shadow-sm hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-7 h-7 stroke-3" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight text-[#2D0F14]">
                Sepete Eklendi!
              </h3>
              <p className="text-xs text-[#4A1D24]/70 max-w-xs mx-auto font-medium">
                <span className="font-bold text-purple-600">
                  {DETAILED_PRODUCT.name}
                </span>{" "}
                başarıyla sepetinize eklendi.
              </p>
              <div className="inline-block bg-purple-50 text-purple-700 font-black text-[11px] px-3 py-1 rounded-lg mt-2">
                Adet: {quantity} • Toplam: {(1450 * quantity).toLocaleString()}{" "}
                TL
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/cart"
                className="w-full h-13 bg-[#4A1D24] text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all shadow-md uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Sepete Git <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full h-13 bg-white border border-purple-200 text-[#4A1D24] text-xs font-black rounded-xl hover:bg-purple-50 transition-all uppercase tracking-widest cursor-pointer"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-purple-200/60 pt-14 space-y-8 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.25em] text-purple-600 uppercase block">
            KRTS EDITORIAL SUGGESTIONS
          </span>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#2D0F14]">
            BUNLARI DA <span className="font-black">SEVEBİLİRSİNİZ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {SUGGESTED_PRODUCTS.map((item) => (
            <Link
              href={`/products/${item.id}`}
              key={item.id}
              className="group cursor-pointer"
            >
              <div className="bg-white border border-[#4A1D24]/5 rounded-4xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/5 flex flex-col justify-between h-full">
                <div>
                  <div className="w-full aspect-square bg-[#FAF5F7] border border-[#4A1D24]/5 rounded-2xl flex items-center justify-center p-4 mb-4 overflow-hidden relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                    />
                  </div>
                  <div className="text-[9px] font-black text-purple-600 uppercase tracking-widest px-1">
                    {item.brand}
                  </div>
                  <h3 className="text-xs font-bold text-[#2D0F14] line-clamp-2 mt-1 group-hover:text-purple-700 transition-colors leading-snug px-1 h-9">
                    {item.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-purple-50 mt-4 px-1">
                  <span className="text-sm font-black text-[#2D0F14]">
                    {item.price}
                  </span>
                  <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-3 py-2 rounded-xl group-hover:bg-[#4A1D24] group-hover:text-white transition-all">
                    İNCELE ➔
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
