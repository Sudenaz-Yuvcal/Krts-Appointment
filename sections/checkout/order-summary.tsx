"use client";

import { ShoppingBag } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  finalTotal: number;
  isSubmitting: boolean;
  cartItemsCount: number;
}

export default function OrderSummary({
  subtotal,
  shippingFee,
  finalTotal,
  isSubmitting,
  cartItemsCount,
}: OrderSummaryProps) {
  return (
    <div className="border-2 border-purple-100 rounded-3xl bg-white p-6 md:p-8 shadow-md space-y-6 sticky top-6">
      <h2 className="text-sm md:text-base font-black tracking-widest uppercase border-b border-purple-100 pb-3 text-[#2D0F14]">
        Sipariş Özeti
      </h2>

      <div className="space-y-4 text-xs md:text-sm font-bold text-purple-950/80">
        <div className="flex justify-between items-center">
          <span>Ara Toplam</span>
          <span className="text-[#2D0F14] font-extrabold text-sm md:text-base">
            {subtotal > 0 ? `${subtotal.toLocaleString("tr-TR")} TL` : "0 TL"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Kargo Ücreti</span>
          <span className="text-[#2D0F14] font-extrabold text-sm md:text-base">
            {subtotal === 0 ? (
              "0 TL"
            ) : shippingFee === 0 ? (
              <span className="text-green-600 uppercase font-black text-xs tracking-wider bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                Bedava
              </span>
            ) : (
              `${shippingFee} TL`
            )}
          </span>
        </div>
      </div>

      <div className="border-t border-purple-100 pt-4 flex justify-between items-center">
        <span className="text-xs md:text-sm font-black uppercase text-[#2D0F14] tracking-wide">
          Genel Toplam
        </span>
        <span className="text-xl md:text-2xl font-black text-[#4A1D24] tracking-tight">
          {finalTotal > 0 ? `${finalTotal.toLocaleString("tr-TR")} TL` : "0 TL"}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || cartItemsCount === 0 || subtotal === 0}
        className="w-full bg-[#4A1D24] text-white text-sm font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-900/10 hover:bg-purple-900 disabled:bg-purple-200 disabled:text-purple-400/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5 stroke-2" />
        {isSubmitting ? "Sipariş İşleniyor..." : "Siparişi Onayla ve Öde"}
      </button>
    </div>
  );
}
