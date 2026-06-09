"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { CartItemType, CheckoutFormData } from "@/type/card";
import SuccessView from "@/components/Checkout";
import AddressForm from "@/sections/checkout/address-form";
import PaymentForm from "@/sections/checkout/payment-form";
import OrderSummary from "@/sections/checkout/order-summary";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }
        setUserId(user.id);

        let response = await supabase
          .from("cart")
          .select(
            "product_id, quantity, products!cart_product_id_fkey(price, product_name)",
          )
          .eq("session_id", user.id);

        if (!response.data || response.data.length === 0) {
          response = await supabase
            .from("cart")
            .select(
              "product_id, quantity, products!cart_product_id_fkey(price, product_name)",
            )
            .eq("user_id", user.id);
        }

        if (response.error) throw response.error;

        if (response.data && response.data.length > 0) {
          const formatted: CartItemType[] = response.data.map((item: any) => {
            let productInfo = item.products;
            if (Array.isArray(productInfo)) {
              productInfo = productInfo[0];
            }

            return {
              product_id: Number(item.product_id),
              price: Number(productInfo?.price) || 0,
              quantity: Number(item.quantity) || 1,
              product_name: productInfo?.product_name || "Bilinmeyen Ürün",
            };
          });

          setCartItems(formatted);
        } else {
          console.warn("Sepette ürün bulunamadı, yönlendiriliyor...");
          router.push("/cart");
        }
      } catch (error: any) {
        console.error(
          "❌ CHECKOUT VERİ TABANI HATASI DETAYLI:",
          error?.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCart();
  }, [router]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingFee = subtotal === 0 ? 0 : subtotal > 2000 ? 0 : 75;
  const finalTotal = subtotal + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || cartItems.length === 0 || subtotal === 0) {
      alert("Sepetiniz boş veya kullanıcı oturumu bulunamadı.");
      return;
    }

    if (
      !formData.address ||
      !formData.cardNumber ||
      !formData.cardCvv ||
      !formData.fullName ||
      !formData.phone ||
      !formData.city
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedPaymentId = `LXR-${new Date().getFullYear()}-${Math.floor(
        10000 + Math.random() * 90000,
      )}`;

      const orderInserts = cartItems.map((item) => ({
        customer_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
        total_price: Number((item.price * item.quantity).toFixed(2)),
        payment_intent_id: generatedPaymentId,
      }));

      const { error: orderError } = await supabase
        .from("product_orders")
        .insert(orderInserts);

      if (orderError) throw orderError;

      await supabase.from("cart").delete().eq("session_id", userId);
      await supabase.from("cart").delete().eq("user_id", userId);

      setOrderResult({
        success: true,
        orderNumber: generatedPaymentId,
      });
    } catch (err: any) {
      console.error("Sipariş kayıt hatası:", err.message);
      alert(`Sipariş kaydedilirken bir hata oluştu: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <span className="text-xs font-black tracking-widest text-purple-600 uppercase animate-pulse">
          Güvenli Ödeme Sayfası Yükleniyor...
        </span>
      </div>
    );
  }

  if (orderResult?.success) {
    return <SuccessView orderNumber={orderResult.orderNumber} />;
  }

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-black px-6 md:px-16 lg:px-24 py-10 font-sans antialiased relative">
      <div className="flex items-center gap-2 text-sm text-[#2D0F14]/50 mb-8 border-t border-purple-200/40 pt-6">
        <Link href="/" className="hover:text-purple-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-[#2D0F14]/30" />
        <Link href="/cart" className="hover:text-purple-900 transition-colors">
          Sepetim
        </Link>
        <ChevronRight className="w-4 h-4 text-[#2D0F14]/30" />
        <span className="text-[#4A1D24] font-bold">Güvenli Ödeme</span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-purple-200/50 pb-5">
          <Link
            href="/cart"
            className="text-[#2D0F14]/60 hover:text-[#2D0F14] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D0F14]">
            Ödeme Adımı
          </h1>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start"
        >
          <div className="lg:col-span-2 space-y-6">
            <AddressForm formData={formData} onChange={handleInputChange} />
            <PaymentForm formData={formData} onChange={handleInputChange} />
          </div>

          <div className="w-full">
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
              isSubmitting={isSubmitting}
              cartItemsCount={cartItems.length}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
