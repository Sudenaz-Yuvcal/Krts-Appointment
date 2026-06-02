"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Trash2,
  ShoppingBag,
  Heart,
  Star,
  X,
  CheckCircle,
} from "lucide-react";

const INITIAL_FAVORITES = [
  {
    id: "1",
    name: "Elixir Ultime Lüks Saç Onarıcı Yağ",
    brand: "Kérastase",
    price: 1450,
    rating: 4.8,
    inStock: true,
    img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Niacinamide Serum %10 + Zinc %1",
    brand: "The Ordinary",
    price: 650,
    rating: 4.5,
    inStock: true,
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Rouge Allure Velvet Mat Ruj",
    brand: "Chanel",
    price: 2100,
    rating: 5.0,
    inStock: false,
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
  },
];

interface ProductType {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  inStock: boolean;
  img: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ProductType[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    productName: string;
  }>({
    open: false,
    productName: "",
  });

  useEffect(() => {
    const savedFavs = localStorage.getItem("luxury_favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    } else {
      setFavorites(INITIAL_FAVORITES);
      localStorage.setItem(
        "luxury_favorites",
        JSON.stringify(INITIAL_FAVORITES),
      );
    }
  }, []);

  const saveFavoritesToStorage = (updatedFavs: ProductType[]) => {
    setFavorites(updatedFavs);
    localStorage.setItem("luxury_favorites", JSON.stringify(updatedFavs));
  };

  const triggerDeleteModal = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      const updated = favorites.filter(
        (item) => item.id !== selectedProduct.id,
      );
      saveFavoritesToStorage(updated);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleAddToCart = (product: ProductType) => {
    const currentCart = localStorage.getItem("luxury_cart");
    let cartList = currentCart ? JSON.parse(currentCart) : [];

    const existingIndex = cartList.findIndex(
      (item: any) => item.id === product.id,
    );

    if (existingIndex > -1) {
      cartList[existingIndex].quantity += 1;
    } else {
      cartList.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: 1,
        type: product.id === "1" ? "100 ml" : "30 ml", 
        img: product.img,
      });
    }

    localStorage.setItem("luxury_cart", JSON.stringify(cartList));

    setSuccessModal({ open: true, productName: product.name });
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-black px-6 md:px-16 lg:px-24 py-10 font-sans antialiased relative">
      <div className="flex items-center gap-2 text-sm text-[#2D0F14]/50 mb-8 border-t border-purple-200/40 pt-6">
        <Link href="/" className="hover:text-purple-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-[#2D0F14]/30" />
        <span className="text-[#4A1D24] font-bold">Favorilerim</span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-baseline justify-between border-b border-purple-200/50 pb-5">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D0F14] flex items-center gap-3">
            <Heart className="w-6 h-6 fill-pink-600 text-pink-600 animate-pulse" />{" "}
            Favorilerim
          </h1>
          <span className="text-xs md:text-sm text-purple-950/50 font-bold">
            Toplam{" "}
            <span className="text-[#4A1D24] font-black text-sm md:text-base">
              {favorites.length}
            </span>{" "}
            lüks ürün beğenildi
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-purple-200/60 rounded-3xl flex flex-col items-center justify-center gap-6 bg-white shadow-sm">
            <Heart className="w-12 h-12 text-purple-200" />
            <span className="text-base text-purple-950/60 font-semibold">
              Henüz favori listenize ürün eklemediniz.
            </span>
            <Link
              href="/products"
              className="bg-[#4A1D24] text-white text-sm font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-purple-800 transition-all shadow-lg"
            >
              Kataloğu İncele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center justify-center">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-purple-100/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative group w-full max-w-sm transition-all hover:shadow-md border-purple-100/70"
              >
                <button
                  onClick={() => triggerDeleteModal(product)}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 border border-purple-100 rounded-xl text-purple-300 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer shadow-xs group/bin"
                >
                  <Trash2 className="w-4 h-4 transition-transform group-hover/bin:scale-110" />
                </button>

                <div className="space-y-4">
                  <div className="w-full aspect-square bg-[#FBF9FC] rounded-2xl flex items-center justify-center p-6 overflow-hidden relative border border-purple-50">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="max-h-[90%] max-w-[90%] object-contain mix-blend-multiply group-hover:scale-103 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <span className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center text-xs font-black text-red-500 uppercase tracking-widest">
                        Tükendi
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-purple-500 uppercase tracking-widest block">
                      {product.brand}
                    </span>
                    <h3 className="text-sm md:text-base font-extrabold text-[#2D0F14] tracking-tight line-clamp-2 leading-snug min-h-12">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-amber-400 pt-0.5">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-[#2D0F14] font-black text-xs">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-50 flex items-center justify-between gap-3 mt-6">
                  <span className="text-base md:text-lg font-black text-[#4A1D24]">
                    {product.price.toLocaleString("tr-TR")} TL
                  </span>
                  <button
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl hover:bg-purple-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" /> Sepete At
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-[#2D0F14]/40 backdrop-blur-md flex items-center justify-center z-100 px-4">
          <div className="bg-white border border-purple-100 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-purple-950/40 hover:text-purple-900 p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-base md:text-lg font-black text-[#2D0F14] uppercase tracking-tight">
                Favorilerden Kaldırılsın mı?
              </h3>
              <p className="text-xs md:text-sm font-medium text-purple-950/60 leading-relaxed px-2">
                <strong className="text-[#4A1D24] font-extrabold">
                  "{selectedProduct.name}"
                </strong>{" "}
                ürününü favori listenizden silmek istediğinize emin misiniz?
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-red-700 transition-all shadow-md cursor-pointer"
              >
                Evet, Favorilerden Sil
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-100 transition-all cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal.open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-110 px-4">
          <div className="bg-white border border-purple-100 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-[#2D0F14] uppercase tracking-wide">
                Sepete Başarıyla Eklendi
              </h4>
              <p className="text-xs md:text-sm font-medium text-purple-950/60 leading-relaxed px-4">
                <strong className="text-[#4A1D24] font-extrabold">
                  "{successModal.productName}"
                </strong>{" "}
                çantanıza eklendi. Sipariş özetinizi görmek için sepetinize
                gidebilirsiniz.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() =>
                  setSuccessModal({ open: false, productName: "" })
                }
                className="w-full bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Alışverişe Devam Et
              </button>
              <Link
                href="/cart"
                className="w-full bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-800 text-center flex items-center justify-center transition-colors shadow-md shadow-purple-900/10"
              >
                Sepete Git
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
