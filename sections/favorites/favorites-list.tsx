"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/type/product";

interface FavoritesListProps {
  favorites: ProductType[];
  onOpenDeleteModal: (product: ProductType) => void;
  onAddToCart: (product: ProductType) => void;
}

export default function FavoritesList({
  favorites,
  onOpenDeleteModal,
  onAddToCart,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center justify-center">
      {favorites.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenDeleteModal={onOpenDeleteModal}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}