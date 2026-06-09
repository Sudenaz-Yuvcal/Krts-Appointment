"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronRight,
  Star,
  RotateCcw,
  ChevronDown,
  Check,
  Heart,
  X,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface DatabaseProduct {
  id: number;
  salon_id: number;
  product_name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

interface EnrichedProduct extends DatabaseProduct {
  brand: string;
  type: string;
  skinType: string;
  effect: string;
  rating: number;
  oldPrice?: number;
  discount?: string;
}

const SORT_OPTIONS = [
  { value: "default", label: "Önerilen Sıralama" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
];

export default function ProductsPage() {
  const [dbProducts, setDbProducts] = useState<DatabaseProduct[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(6000);

  const [sortBy, setSortBy] = useState<string>("default");
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  const [favoriteModal, setFavoriteModal] = useState<{
    open: boolean;
    productName: string;
  }>({
    open: false,
    productName: "",
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*");

        if (prodError) throw prodError;
        setDbProducts(productsData || []);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);

          const { data: favsData, error: favError } = await supabase
            .from("favorites")
            .select("product_id")
            .eq("session_id", user.id);

          if (!favError && favsData) {
            setFavorites(favsData.map((f) => f.product_id));
          }
        }
      } catch (err) {
        console.error("Veri yüklenirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, []);

  const enrichedProducts = useMemo<EnrichedProduct[]>(() => {
    return dbProducts.map((prod) => {
      const nameLower = prod.product_name.toLowerCase();

      let brand = "Diğer";
      if (nameLower.includes("kérastase")) brand = "Kérastase";
      else if (nameLower.includes("the ordinary")) brand = "The Ordinary";
      else if (nameLower.includes("chanel")) brand = "Chanel";
      else if (nameLower.includes("l'oréal")) brand = "L'Oréal Paris";
      else if (nameLower.includes("dior")) brand = "Dior";
      else if (nameLower.includes("garnier")) brand = "Garnier";

      let type = "Cilt Bakımı";
      if (
        nameLower.includes("yağ") ||
        nameLower.includes("şampuan") ||
        nameLower.includes("maske")
      )
        type = "Saç Bakımı";
      else if (
        nameLower.includes("ruj") ||
        nameLower.includes("oil") ||
        nameLower.includes("lip")
      )
        type = "Makyaj";
      else if (nameLower.includes("parfüm") || nameLower.includes("edp"))
        type = "Parfüm";

      let skinType = "Tüm Ciltler";
      if (type === "Saç Bakımı") skinType = "Tüm Saçlar";
      else if (nameLower.includes("niacinamide")) skinType = "Yağlı & Karma";
      else if (nameLower.includes("filler") || nameLower.includes("revitalift"))
        skinType = "Kuru & Olgun";
      else if (nameLower.includes("hyaluronic")) skinType = "Kuru & Hassas";

      let effect = "Yoğun Nemlendirme";
      if (nameLower.includes("elixir") || nameLower.includes("bain"))
        effect = "Parlaklık & Onarım";
      if (nameLower.includes("niacinamide")) effect = "Gözenek Sıkılaştırma";
      if (nameLower.includes("filler") || nameLower.includes("night repair"))
        effect = "Anti-Aging";
      if (nameLower.includes("c vitamini") || nameLower.includes("aydınlatıcı"))
        effect = "Aydınlatıcı";
      if (type === "Parfüm") effect = "Kalıcı Koku";
      if (nameLower.includes("ruj")) effect = "Renk Verici";

      const rating = 4.0 + (prod.id % 11) * 0.1;
      const hasDiscount = prod.id % 4 === 0;
      const oldPrice = hasDiscount ? Math.round(prod.price * 1.2) : undefined;
      const discount = hasDiscount ? "-16%" : undefined;

      return {
        ...prod,
        brand,
        type,
        skinType,
        effect,
        rating,
        oldPrice,
        discount,
      };
    });
  }, [dbProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFavorite = async (
    e: React.MouseEvent,
    product: EnrichedProduct,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Favorilere eklemek için lütfen giriş yapın.");
      return;
    }

    const isAlreadyFav = favorites.includes(product.id);

    if (isAlreadyFav) {
      setFavorites((prev) => prev.filter((id) => id !== product.id));

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("session_id", userId)
        .eq("product_id", product.id);

      if (error) {
        setFavorites((prev) => [...prev, product.id]);
        console.error("Favori silinirken hata oluştu:", error);
      }
    } else {
      setFavorites((prev) => [...prev, product.id]);
      setFavoriteModal({ open: true, productName: product.product_name });

      const { error } = await supabase
        .from("favorites")
        .insert({ session_id: userId, product_id: product.id });

      if (error) {
        setFavorites((prev) => prev.filter((id) => id !== product.id));
        setFavoriteModal({ open: false, productName: "" });
        console.error("Favori eklenirken hata oluştu:", error);
      }
    }
  };

  const handleSkinTypeChange = (type: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
    setCurrentPage(1);
  };

  const handleEffectChange = (effect: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effect)
        ? prev.filter((e) => e !== effect)
        : [...prev, effect],
    );
    setCurrentPage(1);
  };

  const handleReset = () => {
    setActiveCategory("Tümü");
    setSelectedSkinTypes([]);
    setSelectedEffects([]);
    setMaxPrice(6000);
    setSortBy("default");
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = enrichedProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "Tümü" || product.type === activeCategory;
      const matchesSkin =
        selectedSkinTypes.length === 0 ||
        selectedSkinTypes.includes(product.skinType);
      const matchesEffect =
        selectedEffects.length === 0 ||
        selectedEffects.includes(product.effect);
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesSkin && matchesEffect && matchesPrice;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    enrichedProducts,
    activeCategory,
    selectedSkinTypes,
    selectedEffects,
    maxPrice,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Sıralama";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
        <p className="text-xs font-bold text-black/40 uppercase tracking-widest">
          Katalog Yükleniyor...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-black px-4 md:px-16 py-6 font-sans antialiased">
      <div className="flex items-center gap-1.5 text-[11px] text-black/40 mb-6 border-t border-black/5 pt-4">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-black/30" />
        <span className="text-black font-semibold">Premium Kozmetik</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative">
        <aside className="border border-black/5 rounded-2xl p-5 bg-white lg:sticky lg:top-24 max-h-[calc(100vh-110px)] overflow-y-auto shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h2 className="text-sm font-extrabold text-black tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black" /> Filtreler
            </h2>
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-black/40 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Sıfırla
            </button>
          </div>

          <div className="space-y-1.5 border-b border-black/5 pb-4 text-xs text-black/60 font-medium">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2">
              Kategori
            </h3>
            {["Tümü", "Cilt Bakımı", "Saç Bakımı", "Makyaj", "Parfüm"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between w-full hover:text-black transition-all py-1.5 px-2 rounded-lg ${activeCategory === cat ? "text-black bg-black/5 font-bold" : "hover:bg-black/2"}`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3 h-3 text-black/30" />
                </button>
              ),
            )}
          </div>

          <div className="border-b border-black/5 pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-black text-black uppercase tracking-wider">
                Maksimum Fiyat
              </h3>
              <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-md">
                {maxPrice.toLocaleString("tr-TR")} TL
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="50"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-black h-1 bg-black/10 rounded-lg cursor-pointer appearance-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-black/40 mt-2">
              <span>500 TL</span>
              <span>6.000 TL</span>
            </div>
          </div>

          <div className="border-b border-black/5 pb-4">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2">
              Cilt & Saç Tipi
            </h3>
            <div className="space-y-1 text-xs text-black/70">
              {[
                "Tüm Ciltler",
                "Yağlı & Karma",
                "Kuru & Olgun",
                "Kuru & Hassas",
                "Tüm Saçlar",
              ].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-1 rounded-md hover:bg-black/1 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkinTypes.includes(type)}
                    onChange={() => handleSkinTypeChange(type)}
                    className="accent-black w-3.5 h-3.5 rounded border-black/20 cursor-pointer"
                  />
                  <span
                    className={
                      selectedSkinTypes.includes(type)
                        ? "text-black font-bold"
                        : ""
                    }
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pb-1">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2">
              Hedeflenen Etki
            </h3>
            <div className="space-y-1 text-xs text-black/70">
              {[
                "Anti-Aging",
                "Gözenek Sıkılaştırma",
                "Yoğun Nemlendirme",
                "Parlaklık & Onarım",
                "Aydınlatıcı",
                "Kalıcı Koku",
              ].map((effect) => (
                <label
                  key={effect}
                  className="flex items-center gap-2.5 cursor-pointer select-none py-1 px-1 rounded-md hover:bg-black/1 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEffects.includes(effect)}
                    onChange={() => handleEffectChange(effect)}
                    className="accent-black w-3.5 h-3.5 rounded border-black/20 cursor-pointer"
                  />
                  <span
                    className={
                      selectedEffects.includes(effect)
                        ? "text-black font-bold"
                        : ""
                    }
                  >
                    {effect}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center border-b border-black/5 pb-3">
            <h1 className="text-lg font-black text-black tracking-tight uppercase">
              Katalog ({activeCategory})
            </h1>

            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-white border border-black/10 hover:border-black rounded-xl px-4 py-2 text-xs font-bold text-black/80 shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-black/40 transition-transform duration-300 ${isSortOpen ? "rotate-180 text-black" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-black/5 rounded-xl shadow-xl z-50 py-1.5">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 text-xs font-semibold cursor-pointer ${sortBy === option.value ? "bg-black/3 text-black font-bold" : "text-black/60 hover:bg-black/1"}`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <Check className="w-3.5 h-3.5 text-black" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-black/10 rounded-2xl flex flex-col items-center justify-center gap-4">
              <span className="text-xs text-black/40 font-medium">
                Bu kriterlere uygun ürün bulunamadı.
              </span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-black/80 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {currentProducts.map((product) => {
                const isFav = favorites.includes(product.id);

                let displayImage =
                  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600";

                if (product.image_url && product.image_url.trim() !== "") {
                  const urlsArray = product.image_url
                    .split(",")
                    .map((url) => url.trim())
                    .filter((url) => url !== "");

                  if (urlsArray.length > 0) {
                    displayImage = urlsArray[0];
                  }
                }

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between h-full bg-white border border-black/5 rounded-2xl p-3 transition-all duration-300 hover:shadow-md"
                  >
                    <div>
                      <div className="w-full aspect-4/5 overflow-hidden relative mb-4 rounded-xl bg-slate-50 border border-black/5">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full h-full block"
                        >
                          <img
                            src={displayImage}
                            alt={product.product_name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>

                        {product.discount && (
                          <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
                            {product.discount}
                          </span>
                        )}

                        <button
                          onClick={(e) => toggleFavorite(e, product)}
                          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-xs rounded-full border border-black/5 shadow-xs hover:bg-white transition-all duration-200 cursor-pointer group/fav"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFav
                                ? "fill-red-500 text-red-500"
                                : "text-black/60 group-hover/fav:text-red-500"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-1 px-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-black/40 tracking-wider">
                            {product.brand}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[11px] font-bold text-black/80">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <Link href={`/products/${product.id}`}>
                          <h3 className="text-xs font-bold text-black/80 line-clamp-2 min-h-8 hover:text-black transition-colors">
                            {product.product_name}
                          </h3>
                        </Link>

                        <div className="flex gap-1.5 items-center pt-1">
                          <span className="text-[11px] bg-black/5 text-black/60 px-1.5 py-0.5 rounded-sm font-medium">
                            {product.skinType}
                          </span>
                          <span className="text-[11px] bg-black/5 text-black/60 px-1.5 py-0.5 rounded-sm font-medium line-clamp-1">
                            {product.effect}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between px-1">
                      <div className="flex flex-col">
                        {product.oldPrice && (
                          <span className="text-[10px] text-black/30 line-through font-semibold">
                            {product.oldPrice.toLocaleString("tr-TR")} TL
                          </span>
                        )}
                        <span className="text-sm font-black text-black">
                          {product.price.toLocaleString("tr-TR")} TL
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="bg-black text-white text-[11px] font-extrabold px-3 py-2 rounded-xl hover:bg-black/80 transition-colors uppercase tracking-wider"
                      >
                        İncele
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="border-t border-black/5 pt-6 mt-12 flex justify-between items-center text-xs font-bold">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="border border-black/10 rounded-xl px-4 py-2.5 text-black hover:bg-black/5 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
              >
                &larr; Önceki
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${currentPage === pageNum ? "bg-black text-white shadow-sm scale-105" : "text-black/50 hover:bg-black/5"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="border border-black/10 rounded-xl px-4 py-2.5 text-black hover:bg-black/5 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Sonraki &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {favoriteModal.open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-150 px-4">
          <div className="bg-white border border-black/5 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-150 relative">
            <button
              onClick={() => setFavoriteModal({ open: false, productName: "" })}
              className="absolute top-4 right-4 text-black/40 hover:text-black p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <Heart className="w-7 h-7 fill-red-500 text-red-500" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-black text-black uppercase tracking-wide">
                Favorilerinize Eklendi
              </h4>
              <p className="text-xs md:text-sm font-medium text-black/60 leading-relaxed px-4">
                <strong className="text-black font-extrabold">
                  "{favoriteModal.productName}"
                </strong>{" "}
                istek listenize başarıyla kaydedildi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() =>
                  setFavoriteModal({ open: false, productName: "" })
                }
                className="w-full bg-black/5 text-black text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-black/10 transition-colors cursor-pointer"
              >
                Kataloğa Dön
              </button>
              <Link
                href="/favorites"
                className="w-full bg-black text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-black/80 text-center flex items-center justify-center gap-2 transition-colors shadow-md shadow-black/10"
              >
                <ShoppingBag className="w-4 h-4" /> Favorilerime Git
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
