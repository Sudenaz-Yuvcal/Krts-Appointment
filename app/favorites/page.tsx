"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { ProductType } from "@/type/product";
import FavoritesList from "@/sections/favorites/favorites-list";
import {
  DeleteFavoriteModal,
  AddToCartSuccessModal,
} from "@/ui/modals";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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
    const fetchUserAndFavorites = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUserId(user.id);
        await fetchFavorites(user.id);
      } catch (error) {
        console.error("Favoriler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, []);

  const fetchFavorites = async (uid: string) => {
    const { data: favData, error: favError } = await supabase
      .from("favorites")
      .select("id, product_id")
      .eq("session_id", uid);

    if (favError) {
      console.error("Favori ID'leri çekilemedi:", favError.message || favError);
      setFavorites([]);
      return;
    }

    if (!favData || favData.length === 0) {
      setFavorites([]);
      return;
    }

    const productIds = favData.map((item) => item.product_id);

    const { data: productsData, error: prodError } = await supabase
      .from("products")
      .select("id, product_name, price, image_url, stock_count")
      .in("id", productIds);

    if (prodError) {
      console.error(
        "Ürün detayları çekilemedi:",
        prodError.message || prodError,
      );
      return;
    }

    if (productsData) {
      const formattedFavs: ProductType[] = favData
        .map((favItem) => {
          const linkedProduct = productsData.find(
            (p) => String(p.id) === String(favItem.product_id),
          );
          if (!linkedProduct) return null;

          const pName = linkedProduct.product_name || "Bilinmeyen Ürün";

          let detectedBrand = "Lüks Marka";
          const lowerName = pName.toLowerCase();
          if (lowerName.includes("kérastase")) detectedBrand = "Kérastase";
          else if (
            lowerName.includes("l'oréal") ||
            lowerName.includes("loreal")
          )
            detectedBrand = "L'Oréal Professionnel";
          else if (lowerName.includes("matrix")) detectedBrand = "Matrix";

          let finalImg =
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80";
          const rawImg = linkedProduct.image_url;

          if (rawImg && typeof rawImg === "string") {
            let cleaned = rawImg.replace(/[\{\}\[\]"']/g, "").trim();
            if (cleaned.includes(",")) cleaned = cleaned.split(",")[0].trim();
            if (cleaned.startsWith("http")) finalImg = cleaned;
          } else if (rawImg && Array.isArray(rawImg) && rawImg.length > 0) {
            finalImg = rawImg[0];
          }

          return {
            id: favItem.id,
            product_id: favItem.product_id,
            name: pName,
            brand: detectedBrand,
            price: linkedProduct.price || 0,
            rating: 4.8,
            stockCount: linkedProduct.stock_count ?? 0,
            img: finalImg,
          };
        })
        .filter(
          (item): item is ProductType =>
            item !== null && item.name !== "Bilinmeyen Ürün",
        );

      setFavorites(formattedFavs);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct && userId) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", selectedProduct.id);
      if (!error) {
        setFavorites((prev) =>
          prev.filter((item) => item.id !== selectedProduct.id),
        );
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        console.error("Favori silinirken hata oluştu:", error.message);
      }
    }
  };

  const handleAddToCart = async (product: ProductType) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Sepete eklemek için lütfen giriş yapın.");
        router.push("/login");
        return;
      }

      const { data: existingCartItem, error: fetchError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("session_id", user.id)
        .eq("product_id", product.product_id)
        .maybeSingle();

      if (fetchError) {
        console.error("Sepet kontrol hatası:", fetchError);
        return;
      }

      if (existingCartItem) {
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCartItem.quantity + 1 })
          .eq("id", existingCartItem.id);

        if (updateError) {
          console.error("Sepet güncelleme hatası:", updateError);
          return;
        }
      } else {
        const { error: insertError } = await supabase.from("cart").insert({
          session_id: user.id,
          product_id: product.product_id,
          quantity: 1,
        });

        if (insertError) {
          console.error("Sepete ekleme hatası:", insertError);
          return;
        }
      }

      setSuccessModal({ open: true, productName: product.name });
    } catch (err) {
      console.error("Beklenmedik sepet lojik hatası:", err);
    }
  };

  const handleOpenDeleteModal = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <span className="text-xs font-black tracking-widest text-purple-600 uppercase animate-pulse">
          Favori Listeniz Hazırlanıyor...
        </span>
      </div>
    );
  }

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

        <FavoritesList
          favorites={favorites}
          onOpenDeleteModal={handleOpenDeleteModal}
          onAddToCart={handleAddToCart}
        />
      </div>

      <DeleteFavoriteModal
        isOpen={isDeleteModalOpen}
        product={selectedProduct}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddToCartSuccessModal
        isOpen={successModal.open}
        productName={successModal.productName}
        onClose={() => setSuccessModal({ open: false, productName: "" })}
      />
    </div>
  );
}
