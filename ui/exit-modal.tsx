"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitModal({ isOpen, onClose }: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full border border-purple-100 shadow-2xl space-y-4 animate-in scale-in-95">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-black text-lg text-[#2D0F14]">
            Görüşmeyi Sonlandır?
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Asistanla olan sohbetinizi sonlandırmak istediğinize emin misiniz?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
          >
            Görüşmeye Devam Et
          </button>
          <Link
            href="/"
            className="bg-rose-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-rose-700 transition-all text-center block"
          >
            Evet, Çıkış Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
