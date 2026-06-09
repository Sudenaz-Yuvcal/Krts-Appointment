"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Ticket,
  Heart,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ProductType } from "@/type/product";

export default function CartPage() {
  const router = useRouter();

  const {
    cartItems,
    loading,
    discount,
    promoCode,
    setPromoCode,
    applyPromo,
    updateQuantity,
    handleJustDelete,
    handleSaveToFavoritesAndDelete,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
  } = useCart();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [couponErrorModal, setCouponErrorModal] = useState({
    open: false,
    desc: "",
  });

  const triggerDeleteModal = (product: ProductType) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const onQuantityChange = async (
    id: string,
    amount: number,
    currentQty: number,
  ) => {
    try {
      await updateQuantity(id, amount, currentQty, triggerDeleteModal);
    } catch (err: any) {
      setCouponErrorModal({
        open: true,
        desc: err.message || "Bir hata oluştu.",
      });
    }
  };

  const onApplyPromoClick = () => {
    const res = applyPromo();
    if (!res.success) {
      setCouponErrorModal({ open: true, desc: res.message });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setCouponErrorModal({
        open: true,
        desc: "Sepetiniz boş olduğu için ödeme adımına geçemezsiniz.",
      });
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <span className="text-xs font-black tracking-widest text-purple-600 uppercase animate-pulse">
          Sepetiniz Yükleniyor...
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
        <span className="text-[#4A1D24] font-bold">Alışveriş Sepetim</span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase border-b border-purple-200/50 pb-5 text-[#2D0F14]">
          Alışveriş Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-purple-200/60 rounded-3xl flex flex-col items-center justify-center gap-6 bg-white shadow-sm">
            <span className="text-base text-purple-950/60 font-semibold">
              Sepetinizde ürün bulunmamaktadır.
            </span>
            <Link
              href="/products"
              className="bg-[#4A1D24] text-white text-sm font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-purple-800 transition-all shadow-lg"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 border border-purple-100 rounded-3xl bg-white p-6 md:p-8 shadow-sm space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 border-b border-purple-100/70 pb-6 last:border-b-0 last:pb-0 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-6 items-center flex-1 w-full">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="w-28 h-28 bg-[#FBF9FC] rounded-2xl items-center justify-center p-3 overflow-hidden shrink-0 border border-purple-100 shadow-xs relative hover:opacity-80 transition-opacity block"
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="112px"
                        unoptimized
                        className="object-contain mix-blend-multiply p-2"
                      />
                    </Link>

                    <div className="space-y-1.5 flex-1">
                      <span className="text-xs font-black text-purple-500 uppercase tracking-widest block">
                        {item.brand}
                      </span>
                      <Link
                        href={`/products/${item.product_id}`}
                        className="group inline-block"
                      >
                        <h3 className="text-sm md:text-base font-extrabold text-[#2D0F14] tracking-tight leading-snug line-clamp-2 group-hover:text-purple-800 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <div>
                        <p className="text-xs text-purple-950/50 font-bold bg-purple-50 inline-block px-2.5 py-1 rounded-md border border-purple-100/50">
                          Kategori: {item.type}
                        </p>
                      </div>
                      <div className="text-base md:text-lg font-black text-[#4A1D24] pt-1">
                        {(item.price * item.quantity).toLocaleString("tr-TR")}{" "}
                        TL
                        {item.quantity > 1 && (
                          <span className="text-xs text-purple-950/40 font-bold ml-2 block sm:inline">
                            ({item.price.toLocaleString("tr-TR")} TL / adet)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-purple-50 pt-4 sm:pt-0">
                    <button
                      onClick={() => triggerDeleteModal(item)}
                      className="text-purple-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group"
                    >
                      <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </button>
                    <div className="flex items-center gap-4 bg-purple-50/80 px-4 py-2 rounded-2xl border border-purple-100">
                      <button
                        onClick={() =>
                          onQuantityChange(item.id, -1, item.quantity)
                        }
                        className="text-purple-950/70 hover:text-purple-900 transition-colors cursor-pointer p-1"
                      >
                        <Minus className="w-4 h-4 stroke-3" />
                      </button>
                      <span className="text-sm md:text-base font-black w-6 text-center select-none text-[#2D0F14]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onQuantityChange(item.id, 1, item.quantity)
                        }
                        className="text-purple-950/70 hover:text-purple-900 transition-colors cursor-pointer p-1"
                      >
                        <Plus className="w-4 h-4 stroke-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 w-full">
              <div className="border-2 border-purple-100 rounded-3xl bg-white p-6 md:p-8 shadow-md space-y-6">
                <h2 className="text-sm md:text-base font-black tracking-widest uppercase border-b border-purple-100 pb-3 text-[#2D0F14]">
                  Sipariş Özeti
                </h2>
                <div className="space-y-4 text-xs md:text-sm font-bold text-purple-950/80">
                  <div className="flex justify-between items-center">
                    <span>Ara Toplam</span>
                    <span className="text-[#2D0F14] font-extrabold text-sm md:text-base">
                      {subtotal.toLocaleString("tr-TR")} TL
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50/60 p-2.5 rounded-xl border border-green-100">
                      <span>Kupon İndirimi (%20)</span>
                      <span className="font-extrabold text-sm md:text-base">
                        -{discountAmount.toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Kargo Ücreti</span>
                    <span className="text-[#2D0F14] font-extrabold text-sm md:text-base">
                      {shippingFee === 0 ? (
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
                    {finalTotal.toLocaleString("tr-TR")} TL
                  </span>
                </div>

                <div>
                  <div className="flex gap-2 bg-purple-50/50 border border-purple-100 p-2 rounded-2xl">
                    <div className="flex items-center gap-2 pl-2 text-purple-400 shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Kupon Kodu (KRTS20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-transparent text-xs md:text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300 w-full uppercase"
                    />
                    <button
                      onClick={onApplyPromoClick}
                      className="bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-purple-800 transition-colors cursor-pointer shrink-0"
                    >
                      Uygula
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#4A1D24] text-white text-sm font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-purple-800 shadow-xl shadow-purple-900/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] cursor-pointer mt-2"
                >
                  <CreditCard className="w-5 h-5 stroke-[2.5]" /> Ödemeye Geç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-[#2D0F14]/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-purple-100 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-150">
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
                Sepetten Çıkartılsın mı?
              </h3>
              <p className="text-xs md:text-sm font-medium text-purple-950/60 leading-relaxed px-2">
                <strong className="text-[#4A1D24] font-extrabold">
                  "{selectedProduct.name}"
                </strong>{" "}
                sepetinizden kaldırılacaktır. Bu ürünü favorilere saklamak ister
                misiniz?
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={async () => {
                  await handleSaveToFavoritesAndDelete(selectedProduct);
                  setIsDeleteModalOpen(false);
                }}
                className="w-full bg-[#4A1D24] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-purple-800 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" /> Sil ve Favorilere Ekle
              </button>
              <button
                onClick={async () => {
                  await handleJustDelete(selectedProduct);
                  setIsDeleteModalOpen(false);
                }}
                className="w-full bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-wider py-3.5 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
              >
                Sadece Sil
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

      {couponErrorModal.open && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-purple-100 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <X className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm md:text-base font-black text-[#2D0F14] uppercase tracking-wide">
                İşlem Engellendi
              </h4>
              <p className="text-xs md:text-sm font-medium text-purple-950/60 leading-snug">
                {couponErrorModal.desc}
              </p>
            </div>
            <button
              onClick={() => setCouponErrorModal({ open: false, desc: "" })}
              className="w-full bg-[#4A1D24] text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl hover:bg-purple-800 transition-colors cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
