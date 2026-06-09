"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Order } from "@/type/profile";

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  const router = useRouter();

  const getOrderStatusDisplay = (status: string) => {
    const s = status?.toLowerCase().trim();
    if (s === "new" || s === "pending" || s === "sipariş verildi" || s === "siparis verildi") {
      return { text: "Sipariş Verildi", styles: "bg-amber-50 text-amber-700 border-amber-200" };
    }
    if (s === "processing" || s === "hazırlanıyor" || s === "hazirlaniyor") {
      return { text: "Hazırlanıyor", styles: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    if (s === "shipped" || s === "kargoya verildi" || s === "kargolandı" || s === "kargolandi") {
      return { text: "Kargoya Verildi", styles: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    if (s === "completed" || s === "delivered" || s === "teslim edildi" || s === "tamamlandı" || s === "tamamlandi") {
      return { text: "Teslim Edildi", styles: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
    return { text: status || "Onaylandı", styles: "bg-slate-50 text-slate-700 border-slate-200" };
  };

  return (
    <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-black uppercase tracking-tight text-purple-950 border-b border-slate-100 pb-3">
        Siparişlerim
      </h3>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold py-4 text-center">Henüz bir siparişiniz bulunmamaktadır.</p>
        ) : (
          orders.map((or) => {
            const statusInfo = getOrderStatusDisplay(or.status);
            return (
              <div
                key={or.id}
                onClick={() => router.push(`/products/${or.product_id}`)}
                className="border border-purple-100 hover:border-purple-300 rounded-xl p-5 flex flex-col gap-3 bg-[#FAF6F8]/50 cursor-pointer transition-all hover:bg-purple-50/40 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-purple-950 text-white px-2 py-0.5 rounded-sm">
                      Sipariş ID: {or.id}
                    </span>
                    <p className="text-[11px] text-slate-400 font-bold">
                      {or.order_date ? new Date(or.order_date).toLocaleDateString("tr-TR") : ""}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${statusInfo.styles}`}>
                    {statusInfo.text}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-purple-950 group-hover:text-purple-700 transition-colors">
                      {or.products?.product_name || `Ürün #${or.product_id}`}{" "}
                      <span className="text-slate-400 font-bold text-[11px]">({or.quantity} Adet)</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Ödeme Kodu: {or.payment_intent_id}</p>
                  </div>
                  <span className="text-xs font-black text-purple-950 shrink-0">{or.total_price} TL</span>
                </div>

                {or.preparation_note && (
                  <div className="flex gap-2 items-start bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 mt-1 text-[11px] text-amber-900 font-medium">
                    <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-[10px] uppercase block tracking-wider text-amber-800">Sipariş Notu</span>
                      {or.preparation_note}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}