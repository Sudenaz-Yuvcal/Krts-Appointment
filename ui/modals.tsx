"use client";

import Link from "next/link";
import { X, Trash2, CheckCircle } from "lucide-react";
import { ProductType } from "@/type/product";

interface DeleteModalProps {
  isOpen: boolean;
  product: ProductType | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteFavoriteModal({ isOpen, product, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen || !product) return null;
  return (
    <div className="fixed inset-0 bg-[#2D0F14]/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-purple-100 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-purple-950/40 hover:text-purple-900 p-1 rounded-full transition-colors cursor-pointer">
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
            <strong className="text-[#4A1D24] font-extrabold">"{product.name}"</strong> ürününü silmek istediğinize emin misiniz?
          </p>
        </div>
        <div className="flex flex-col gap-2.5 pt-2">
          <button onClick={onConfirm} className="w-full bg-red-600 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-red-700 transition-all shadow-md cursor-pointer">
            Evet, Favorilerden Sil
          </button>
          <button onClick={onClose} className="w-full bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-100 transition-all cursor-pointer">
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
}

export function AddToCartSuccessModal({ isOpen, productName, onClose }: SuccessModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-purple-100 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-black text-[#2D0F14] uppercase tracking-wide">
            Sepete Başarıyla Eklendi
          </h4>
          <p className="text-xs md:text-sm font-medium text-purple-950/60 leading-relaxed px-4">
            <strong className="text-[#4A1D24] font-extrabold">"{productName}"</strong> çantanıza eklendi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button onClick={onClose} className="w-full bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
            Alışverişe Devam Et
          </button>
          <Link href="/cart" className="w-full bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-800 text-center flex items-center justify-center transition-colors shadow-md">
            Sepete Git
          </Link>
        </div>
      </div>
    </div>
  );
}