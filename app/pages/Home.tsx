"use client";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  X,
  Scissors,
  Sparkle,
  CheckCircle2,
  Copy,
  Check,
  Heart,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  img: string;
  brand: string;
}

interface CampaignSlider {
  id: number;
  title: string;
  subtitle: string;
  discountTag: string;
  imgUrl: string;
  productLink: string;
  bgColor: string;
}

export default function Home() {
  const [currentBg, setCurrentBg] = useState<number>(0);
  const [currentSlider, setCurrentSlider] = useState<number>(0);

 
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);


  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedToCartId, setAddedToCartId] = useState<number | null>(null);

  const bgImages: string[] = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1521590832167-7bcbfea5733f?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?auto=format&fit=crop&q=80&w=1600",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  useEffect(() => {
    const bubbleTimer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);
    return () => clearTimeout(bubbleTimer);
  }, []);

  const sliderCampaigns: CampaignSlider[] = [
    {
      id: 1,
      title: "L'ORÉAL PARIS",
      subtitle:
        "Moleküler Hyaluronic Acid serisiyle cildinize anında dolgunluk ve yoğun nem kazandırın.",
      discountTag: "%40 İNDİRİM",
      imgUrl:
        "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800",
      productLink: "/products",
      bgColor: "from-[#2D1619]",
    },
    {
      id: 2,
      title: "GARNIER AMBRE SOLAIRE",
      subtitle:
        "Gelişmiş UV korumalı, görünmez hafif dokulu günlük güneş kremleriyle cildinizi garantileyin.",
      discountTag: "%25 İNDİRİM",
      imgUrl:
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800",
      productLink: "/products",
      bgColor: "from-[#1A2E26]",
    },
    {
      id: 3,
      title: "THE ORDINARY NIACINAMIDE",
      subtitle:
        "Gözenek sıkılaştırıcı ve cilt bariyeri dengeleyici kült serumlarda KRTS üyelerine özel fiyatlar.",
      discountTag: "NET FİYAT",
      imgUrl:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      productLink: "/products",
      bgColor: "from-[#25182E]",
    },
  ];

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlider((prev) => (prev + 1) % sliderCampaigns.length);
    }, 6000);
    return () => clearInterval(sliderTimer);
  }, [sliderCampaigns.length]);

  const premiumProducts: Product[] = [
    {
      id: 1,
      brand: "The Ordinary",
      name: "Niacinamide 10% + Zinc 1%",
      category: "Cilt Serumu",
      price: "650 TL",
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      brand: "Garnier",
      name: "Ambre Solaire Anti-Age Super UV SPF50+",
      category: "Güneş Koruması",
      price: "520 TL",
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      brand: "L'Oréal Paris",
      name: "Revitalift Filler Serum",
      category: "Yoğun Nemlendirici",
      price: "790 TL",
      rating: 4.7,
      img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 4,
      brand: "Maison de Beauté",
      name: "Pure Silk Hair Complex",
      category: "Saç Terapisi",
      price: "1.250 TL",
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const openWizard = () => {
    setWizardStep(1);
    setSelectedService("");
    setIsCopied(false);
    setIsWizardOpen(true);
    setShowBubble(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("KRTS15");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  const handleAddToCart = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCartId(id);
    setTimeout(() => setAddedToCartId(null), 2000);
  };

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] font-sans selection:bg-purple-200 selection:text-purple-900 flex-1 relative">
      <header className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden border-b border-purple-200">
        <div className="absolute inset-0 bg-linear-to-tr from-[#E8DCEB]/75 via-fuchsia-100/40 to-[#FAF5F7]/85 backdrop-blur-xs -z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-[150px] -z-10" />

        <div className="relative z-10 w-full max-w-7xl">
          <div className="relative border border-white/40 rounded-[40px] p-8 md:p-16 shadow-2xl overflow-hidden min-h-137.5 flex items-center">
            <div className="absolute inset-0 z-0">
              {bgImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${currentBg === index ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xs z-10" />
            <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent z-15 pointer-events-none" />

            <div className="relative z-20 text-left max-w-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              <div className="inline-flex items-center gap-2 bg-black/30 border border-white/20 px-4 py-2 rounded-full text-white text-xs font-bold mb-6 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-pink-300" /> KRTS
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-none text-white tracking-tight drop-shadow-md">
                KUSURSUZ
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-200 via-fuchsia-100 to-white">
                  ESTETİK AKIŞI
                </span>
              </h1>
              <p className="mt-6 text-slate-100 max-w-lg text-sm md:text-base leading-relaxed font-semibold drop-shadow-sm">
                Kusursuz bir güzellik deneyimi için seçkin salonları keşfedin,
                profesyonel bakım ürünlerine ulaşın og estetik dünyasının en
                özel fırsatlarını inceleyin.
              </p>
              <Link
                href="/salons"
                className="inline-flex items-center gap-2 mt-8 bg-white text-[#2D0F14] hover:bg-pink-50 px-8 py-4 rounded-2xl font-black text-sm tracking-wider transition-all shadow-xl hover:scale-105"
              >
                SALONLARI KEŞFET <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4A1D24]/10 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.25em] text-purple-600 uppercase block">
              KRTS BOUTIQUE SELECTION
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2D0F14]">
              HAFTANIN EN ÇOK <span className="font-black">SATANLARI</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {premiumProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);
            const isAdded = addedToCartId === product.id;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between"
              >
                <div className="w-full aspect-4/5 overflow-hidden relative mb-4 rounded-2xl bg-[#F6F3F4]">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-full h-full block"
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    onClick={(e) => toggleFavorite(e, product.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs shadow-sm flex items-center justify-center transition-all hover:scale-110 z-30 group/fav cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-300 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-[#4A1D24]/60 group-hover/fav:text-red-500"}`}
                    />
                  </button>

                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] font-black text-[#2D0F14] flex items-center gap-1 z-20 border border-black/5 uppercase tracking-wider">
                    <Star className="w-2.5 h-2.5 fill-current text-amber-400" />{" "}
                    {product.rating}
                  </span>

                  <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className={`w-full py-3 rounded-xl font-black text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xl transition-all active:scale-98 cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-[#4A1D24] text-white hover:bg-purple-700"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          SEPETE EKLENDİ <Check className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          SEPETE HIZLI EKLE <Plus className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                    {product.brand}
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-sm font-bold text-[#2D0F14] hover:underline line-clamp-1 leading-tight tracking-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="text-[11px] font-medium text-[#4A1D24]/40">
                    {product.category}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#4A1D24]/5 mt-2">
                    <span className="text-sm font-black text-[#2D0F14]">
                      {product.price}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-[10px] font-black text-purple-600 tracking-wider uppercase hover:text-purple-900 transition-colors"
                    >
                      İNCELE ➔
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="w-full h-80 md:h-100 bg-[#845061] rounded-4xl flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-purple-950/20 group border border-white">
          {sliderCampaigns.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.productLink}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8 bg-linear-to-br ${slide.bgColor} ${currentSlider === index ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95 pointer-events-none"}`}
            >
              <div className="max-w-md space-y-4 relative z-20 text-white text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-pink-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg">
                  {slide.discountTag}
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none text-white">
                  {slide.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs md:max-w-sm">
                  {slide.subtitle}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase bg-white text-[#140E10] px-6 py-3 rounded-full group-hover:bg-pink-500 group-hover:text-white transition-colors shadow-md">
                    KOLEKSİYONU KEŞFET <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-48 md:h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={slide.imgUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-[#140E10]/80 via-transparent to-transparent" />
              </div>
            </Link>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentSlider(
                (prev) =>
                  (prev - 1 + sliderCampaigns.length) % sliderCampaigns.length,
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentSlider((prev) => (prev + 1) % sliderCampaigns.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="bg-white border-t border-[#4A1D24]/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-3 md:border-r border-[#4A1D24]/10 md:pr-8">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black tracking-tight">
              Orijinal Ürün Garantisi
            </h4>
            <p className="text-xs text-[#4A1D24]/60 font-medium leading-relaxed">
              Mağazamızda sergilenen tüm lüks bakım complexes direkt distribütör
              onaylıdır.
            </p>
          </div>
          <div className="space-y-3 md:border-r border-[#4A1D24]/10 md:pr-8">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mx-auto md:mx-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black tracking-tight">
              Elit Salon Seçkisi
            </h4>
            <p className="text-xs text-[#4A1D24]/60 font-medium leading-relaxed">
              KRTS ağına sadece yüksek hijyen ve premium hizmet sunan salonlar
              kabul edilir.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mx-auto md:mx-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-black tracking-tight">
              Aynı Gün Premium Kargo
            </h4>
            <p className="text-xs text-[#4A1D24]/60 font-medium leading-relaxed">
              Seçeceğiniz tüm kozmetik ve bakım ekipmanları aynı gün kargolanır.
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showBubble && !isWizardOpen && (
          <div className="bg-white/95 backdrop-blur-md border border-purple-200 text-[#4A1D24] p-4 rounded-2xl rounded-br-none shadow-2xl max-w-xs relative animate-bounce">
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 text-[#4A1D24]/40 hover:text-[#4A1D24] cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 mb-1 text-[9px] font-black tracking-widest text-purple-600 uppercase">
              <Sparkles className="w-3 h-3 fill-purple-200" /> KRTS AI CONCIERGE
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              Hızlı randevu sihirbazı ile size en uygun salonları listeleyin ve{" "}
              <span className="font-bold text-purple-600">
                %15 indirim kuponunuzu
              </span>{" "}
              alın.
            </p>
          </div>
        )}

        <button
          onClick={openWizard}
          className={`relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(74,29,36,0.15)] cursor-pointer group transition-all duration-500 border border-purple-100 ${isHovered ? "scale-110 shadow-[0_20px_40px_rgba(147,51,234,0.25)]" : ""}`}
        >
          <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping [animation-duration:2s]" />
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center p-1 bg-white relative z-10">
            <img
              src="/randevu-icon.jpeg"
              alt="KRTS AI"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20">
            <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
          </span>
        </button>

        <button
          onClick={openWizard}
          className={`bg-[#4A1D24] text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg transition-all duration-300 transform cursor-pointer ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
        >
          Sihirbazı Başlat ➔
        </button>
      </div>

      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF5F7] border border-purple-200 w-full max-w-md rounded-4xl shadow-2xl p-6 relative overflow-hidden text-[#4A1D24]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setIsWizardOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-100 shadow-sm hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-purple-600 uppercase mb-4">
              <Sparkles className="w-4 h-4 fill-purple-200 animate-spin [animation-duration:8s]" />{" "}
              KRTS SMART SIHIRBAZ ({wizardStep}/2)
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-black tracking-tight leading-tight">
                  Nasıl bir hizmet almak istersiniz? ✨
                </h3>
                <p className="text-xs text-[#4A1D24]/70 font-medium">
                  İhtiyacınız olan bakım kategorisini seçin:
                </p>
                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {[
                    {
                      name: "Saç Tasarımı & Kesim",
                      icon: <Scissors className="w-4 h-4" />,
                    },
                    {
                      name: "Medikal Cilt Bakımı",
                      icon: <Sparkle className="w-4 h-4" />,
                    },
                    {
                      name: "Kalıcı Makyaj & Kirpik",
                      icon: <Star className="w-4 h-4" />,
                    },
                  ].map((service) => (
                    <button
                      key={service.name}
                      onClick={() => {
                        setSelectedService(service.name);
                        setWizardStep(2);
                      }}
                      className="flex items-center gap-3 bg-white border border-purple-100 p-4 rounded-xl font-bold text-sm text-left hover:border-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700">
                        {service.icon}
                      </div>
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-5 text-center py-2 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight">
                    Kuponunuz Tanımlandı! 🎉
                  </h3>
                  <p className="text-xs text-[#4A1D24]/70 max-w-xs mx-auto font-medium">
                    Seçtiğiniz{" "}
                    <span className="font-bold text-purple-600">
                      "{selectedService}"
                    </span>{" "}
                    kategorisindeki tüm elit salonlarda geçerli %15 indirim
                    kodunuz:
                  </p>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`w-full max-w-xs mx-auto border-2 border-dashed p-4 rounded-2xl flex items-center justify-between bg-white relative overflow-hidden transition-all group cursor-pointer ${
                    isCopied
                      ? "border-emerald-500 bg-emerald-50/20"
                      : "border-purple-300 hover:border-purple-600"
                  }`}
                >
                  <div className="text-left">
                    <span className="text-[9px] font-black text-purple-500 block uppercase tracking-widest">
                      İndirim Kodu
                    </span>
                    <span className="text-xl font-black tracking-widest text-[#2D0F14]">
                      KRTS15
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-black px-3 py-2 rounded-xl transition-all ${
                      isCopied
                        ? "bg-emerald-600 text-white"
                        : "bg-[#4A1D24] text-white group-hover:bg-purple-700"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        Kopyalandı <Check className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Kopyala <Copy className="w-3.5 h-3.5" />
                      </>
                    )}
                  </div>
                </button>

                <div className="bg-white border border-purple-100 p-4 rounded-2xl text-left shadow-md flex items-center justify-between mt-4">
                  <div>
                    <h4 className="font-black text-sm text-[#2D0F14]">
                      MAISON DE BEAUTÉ KRTS
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Seçilen Hizmet: {selectedService}
                    </p>
                    <p className="text-[10px] text-purple-600 font-bold mt-0.5">
                      Puan: 4.9/5 (En Yüksek Derece)
                    </p>
                  </div>
                  <Link
                    href={`/salons?service=${encodeURIComponent(selectedService)}`}
                    className="bg-[#4A1D24] text-white text-[10px] font-black px-4 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-md uppercase tracking-wider text-center"
                  >
                    Salonları Gör
                  </Link>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="text-xs font-bold text-purple-600 underline cursor-pointer"
                  >
                    ← Hizmeti Değiştir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
