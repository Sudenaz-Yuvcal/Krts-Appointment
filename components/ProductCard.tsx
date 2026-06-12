"use client";

import Link from "next/link";
import { Trash2, Star, ShoppingBag } from "lucide-react";
import { ProductType } from "@/type/product";

interface ProductCardProps {
  product: ProductType;
  onOpenDeleteModal: (product: ProductType) => void;
  onAddToCart: (product: ProductType) => void;
}

export default function ProductCard({
  product,
  onOpenDeleteModal,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-white border border-purple-100/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative group w-full max-w-sm transition-all hover:shadow-md">
      <button
        onClick={() => onOpenDeleteModal(product)}
        className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 border border-purple-100 rounded-xl text-purple-300 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer shadow-xs group/bin"
      >
        <Trash2 className="w-4 h-4 transition-transform group-hover/bin:scale-110" />
      </button>

      <Link href={`/products/${product.product_id}`} className="space-y-4 cursor-pointer block z-10 group">
        <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center p-6 overflow-hidden relative border border-purple-50">
          <img
            src={product.img}
            alt={product.name}
            className="max-h-[90%] max-w-[90%] object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80";
            }}
          />

          {product.stockCount === 0 ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
              <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                Tükendi
              </span>
            </div>
          ) : product.stockCount > 0 && product.stockCount < 5 ? (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md animate-bounce flex items-center gap-1">
                🔥 Tükeniyor, Acele Et!
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-black text-purple-500 uppercase tracking-widest block">
            {product.brand}
          </span>
          <h3 className="text-sm md:text-base font-extrabold text-[#2D0F14] tracking-tight line-clamp-2 leading-snug min-h-12 group-hover:text-purple-800 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-amber-400 pt-0.5">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="text-[#2D0F14] font-black text-xs">{product.rating}</span>
          </div>
        </div>
      </Link>

      <div className="pt-4 border-t border-purple-50 flex items-center justify-between gap-3 mt-6 z-20">
        <span className="text-base md:text-lg font-black text-[#4A1D24]">
          {product.price.toLocaleString("tr-TR")} TL
        </span>
        <button
          disabled={product.stockCount === 0}
          onClick={() => onAddToCart(product)}
          className="flex items-center gap-2 bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl hover:bg-purple-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
        >
          <ShoppingBag className="w-4 h-4" /> Sepete At
        </button>
      </div>
    </div>
  );
}