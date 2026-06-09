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
  Heart,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "./lib/supabase";

interface Product {
  id: number;
  product_name: string;
  brand_name: string;
  brand_id: string;
  price: number;
  stock_count: number;
  category: string;
  image_url: any;
  created_at: string;
  is_active: boolean;
  rating?: number;
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

interface CartItem {
  product_id: number;
  quantity: number;
}

function getProductImageUrl(imageUrl: any): string {
  const fallbackUrl =
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600";

  if (!imageUrl) return fallbackUrl;

  try {
    let rawPath = "";

    if (typeof imageUrl === "string") {
      if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
        const parsed = JSON.parse(imageUrl);
        rawPath =
          Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
      } else if (imageUrl.includes(",")) {
        rawPath = imageUrl.split(",")[0].trim();
      } else {
        rawPath = imageUrl.trim();
      }
    } else if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      rawPath = imageUrl[0];
    } else {
      rawPath = String(imageUrl).trim();
    }

    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      return rawPath;
    }

    if (rawPath) {
      const projectId = "ipbmagxxlvxtdfoajgpu";
      const cleanPath = rawPath.startsWith("/")
        ? rawPath.substring(1)
        : rawPath;

      if (cleanPath.startsWith("brand-logos/")) {
        return `https://${projectId}.supabase.co/storage/v1/object/public/${cleanPath}`;
      }

      return `https://${projectId}.supabase.co/storage/v1/object/public/brand-logos/product-images/${cleanPath}`;
    }

    return fallbackUrl;
  } catch (e) {
    console.error("Resim ayıklanırken hata oluştu:", e);
    return fallbackUrl;
  }
}

export default function Home() {
  const [currentBg, setCurrentBg] = useState<number>(0);
  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  const bgImages: string[] = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1521590832167-7bcbfea5733f?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?auto=format&fit=crop&q=80&w=1600",
  ];

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
    const initHomeData = async () => {
      try {
        setIsLoadingProducts(true);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select(
            "id, product_name, brand_name, price, stock_count, image_url, is_active",
          )
          .eq("is_active", true)
          .order("price", { ascending: false })
          .limit(4);

        if (!prodError && productsData) {
          const formattedProducts = productsData.map((p) => ({
            ...p,
            rating: 4.8,
          })) as Product[];
          setPremiumProducts(formattedProducts);
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);

          const { data: favData } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("session_id", user.id);

          if (favData) setFavorites(favData.map((f) => Number(f.product_id)));

          const { data: cartData } = await supabase
            .from("cart")
            .select("product_id, quantity")
            .eq("session_id", user.id);

          if (cartData) {
            setCartItems(
              cartData.map((c) => ({
                product_id: Number(c.product_id),
                quantity: Number(c.quantity || 1),
              })),
            );
          }
        }
      } catch (err) {
        console.error("Veriler yüklenirken bir hata oluştu:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    initHomeData();
  }, []);

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

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlider((prev) => (prev + 1) % sliderCampaigns.length);
    }, 6000);
    return () => clearInterval(sliderTimer);
  }, [sliderCampaigns.length]);

  const toggleFavorite = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Favorilere eklemek için lütfen giriş yapın.");
      return;
    }

    const isFav = favorites.includes(id);

    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("session_id", userId)
        .eq("product_id", id);

      if (!error) {
        setFavorites((prev) => prev.filter((favId) => favId !== id));
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ session_id: userId, product_id: id });

      if (!error) {
        setFavorites((prev) => [...prev, id]);
      }
    }
  };

  const updateCartQuantity = async (
    e: React.MouseEvent,
    productId: number,
    currentQty: number,
    adjustment: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Sepet işlemleri için lütfen giriş yapın.");
      return;
    }

    const newQuantity = currentQty + adjustment;

    if (newQuantity <= 0) {
      const confirmDelete = window.confirm(
        "Ürünü sepetten çıkarmak istediğinize emin misiniz?",
      );

      if (!confirmDelete) return;

      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("session_id", userId)
        .eq("product_id", productId);

      if (!error) {
        setCartItems((prev) =>
          prev.filter((item) => item.product_id !== productId),
        );
      }
    } else {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("session_id", userId)
        .eq("product_id", productId);

      if (!error) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        );
      }
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Sepete ürün eklemek için lütfen giriş yapın.");
      return;
    }

    const { error } = await supabase
      .from("cart")
      .insert({ session_id: userId, product_id: id, quantity: 1 });

    if (!error) {
      setCartItems((prev) => [...prev, { product_id: id, quantity: 1 }]);
    }
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

        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-full aspect-4/5 bg-purple-900/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {premiumProducts.map((product) => {
              const isFavorite = favorites.includes(product.id);

              const cartItem = cartItems.find(
                (item) => item.product_id === product.id,
              );
              const isAdded = !!cartItem;
              const quantity = cartItem ? cartItem.quantity : 0;

              const finalImageUrl = getProductImageUrl(product.image_url);

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
                        src={finalImageUrl}
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs shadow-sm flex items-center justify-center transition-all hover:scale-110 z-30 group/fav cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 ${
                          isFavorite
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-[#4A1D24]/60 group-hover/fav:text-red-500"
                        }`}
                      />
                    </button>

                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] font-black text-[#2D0F14] flex items-center gap-1 z-20 border border-black/5 uppercase tracking-wider">
                      <Star className="w-2.5 h-2.5 fill-current text-amber-400" />{" "}
                      {product.rating}
                    </span>

                    <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      {isAdded ? (
                        <div className="w-full bg-white rounded-xl shadow-xl border border-purple-200 p-1 flex items-center justify-between gap-1">
                          <button
                            onClick={(e) =>
                              updateCartQuantity(e, product.id, quantity, -1)
                            }
                            className="w-9 h-9 bg-[#4A1D24]/5 hover:bg-[#4A1D24]/10 rounded-lg flex items-center justify-center text-[#4A1D24] transition-colors active:scale-90 cursor-pointer"
                          >
                            {quantity === 1 ? (
                              <Trash2 className="w-4 h-4 text-red-600" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                          </button>

                          <span className="font-black text-xs text-[#2D0F14] select-none">
                            {quantity} ADET
                          </span>

                          <button
                            onClick={(e) =>
                              updateCartQuantity(e, product.id, quantity, 1)
                            }
                            className="w-9 h-9 bg-[#4A1D24] hover:bg-purple-700 rounded-lg flex items-center justify-center text-white transition-colors active:scale-90 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="w-full py-3 rounded-xl font-black text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xl transition-all active:scale-95 cursor-pointer bg-[#4A1D24] text-white hover:bg-purple-700"
                        >
                          SEPETE HIZLI EKLE <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 px-1">
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                      PREMIUM CARE
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-sm font-bold text-[#2D0F14] hover:underline line-clamp-1 leading-tight tracking-tight">
                        {product.product_name}
                      </h3>
                    </Link>

                    <div className="text-[11px] font-medium text-[#4A1D24]/40">
                      Kozmetik & Bakım
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#4A1D24]/5 mt-2">
                      <span className="text-sm font-black text-[#2D0F14]">
                        {Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(product.price)}
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
        )}
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
              e.stopPropagation();
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
              e.stopPropagation();
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
              Mağazamızda sergilenen tüm lüks bakım kompleksleri direkt
              distribütör onaylıdır.
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
              Seçeceğiniz tüm kozmetik og bakım ekipmanları aynı gün kargolanır.
            </p>
          </div>
        </div>
      </section>

      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showBubble && (
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
                %20 indirim kuponunuzu
              </span>{" "}
              alın.
            </p>
          </div>
        )}

        <Link href="/bubble" className="block">
          <button
            className={`relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(74,29,36,0.15)] cursor-pointer group transition-all duration-500 border border-purple-100 ${
              isHovered
                ? "scale-110 shadow-[0_20px_40px_rgba(147,51,234,0.25)]"
                : ""
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping [animation-duration:2s]" />
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center p-1 bg-white relative z-10">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150"
                alt="KRTS AI"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20">
              <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
            </span>
          </button>
        </Link>

        <Link href="/bubble" className="block">
          <button
            className={`bg-[#4A1D24] text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg transition-all duration-300 transform cursor-pointer ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            Sihirbazı Başlat ➔
          </button>
        </Link>
      </div>
    </div>
  );
}
