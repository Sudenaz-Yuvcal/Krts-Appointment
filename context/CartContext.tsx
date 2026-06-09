"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { supabase } from "@/app/lib/supabase";
import { ProductType } from "@/type/product";

interface CartContextType {
  cartItems: ProductType[];
  loading: boolean;
  discount: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  applyPromo: () => { success: boolean; message: string };
  fetchCart: (uid: string) => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (
    id: string,
    amount: number,
    currentQty: number,
    onTriggerDelete: (item: ProductType) => void,
  ) => Promise<void>;
  handleJustDelete: (selectedProduct: ProductType) => Promise<void>;
  handleSaveToFavoritesAndDelete: (
    selectedProduct: ProductType,
  ) => Promise<void>;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getProductImageUrl(imageUrl: any): string {
  const fallbackUrl =
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600";
  if (!imageUrl) return fallbackUrl;
  try {
    let rawPath = "";
    if (typeof imageUrl === "string") {
      if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
        const parsed = JSON.parse(imageUrl);
        rawPath =
          Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
      } else if (imageUrl.includes(",")) {
        rawPath = imageUrl.split(",")[0].trim();
      } else {
        rawPath = imageUrl.trim();
      }
    } else if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      rawPath = imageUrl[0];
    } else {
      rawPath = String(imageUrl).trim();
    }

    if (rawPath.startsWith("http://") || rawPath.startsWith("https://"))
      return rawPath;

    if (rawPath) {
      const projectId = "ipbmagxxlvxtdfoajgpu";
      const cleanPath = rawPath.startsWith("/")
        ? rawPath.substring(1)
        : rawPath;
      if (cleanPath.startsWith("brand-logos/")) {
        return `https://${projectId}.supabase.co/storage/v1/object/public/${cleanPath}`;
      }
      return `https://${projectId}.supabase.co/storage/v1/object/public/brand-logos/product-images/${cleanPath}`;
    }
    return fallbackUrl;
  } catch (e) {
    return fallbackUrl;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const initUserAndCart = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          setUserId(session.user.id);
          await fetchCart(session.user.id);
        }
      } catch (error) {
        console.error("Context sepet yükleme hatası:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initUserAndCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUserId(session.user.id);
        await fetchCart(session.user.id);
      } else {
        setUserId(null);
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchCart = async (uid: string) => {
    if (!uid) return;
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("session_id", uid);

    if (cartError || !cartData || cartData.length === 0) {
      setCartItems([]);
      return;
    }

    const productIds = cartData
      .map((item: any) => Number(item.product_id))
      .filter((id) => !isNaN(id) && id !== 0);

    if (productIds.length === 0) {
      setCartItems([]);
      return;
    }

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    const formattedCart: ProductType[] = cartData
      .map((item: any) => {
        const product = productsData?.find(
          (p: any) => String(p.id) === String(item.product_id),
        );
        if (!product) return null;

        return {
          id: String(item.id),
          product_id: String(item.product_id),
          name: product.product_name || "Bilinmeyen Ürün",
          brand: product.brand_name || "Premium Care",
          price: Number(product.price || 0),
          quantity: Number(item.quantity || 1),
          type: "Standart Boy",
          img: getProductImageUrl(product.image_url),
        };
      })
      .filter((item): item is ProductType => item !== null);

    setCartItems(formattedCart);
  };

  const addToCart = async (productId: string) => {
    if (!userId) throw new Error("Lütfen önce giriş yapın.");

    const existingItem = cartItems.find(
      (item) => item.product_id === productId,
    );

    if (existingItem) {
      if (existingItem.quantity >= 5) {
        throw new Error("Bu üründen en fazla 5 adet ekleyebilirsiniz.");
      }
      await updateQuantity(existingItem.id, 1, existingItem.quantity, () => {});
    } else {
      const { error } = await supabase.from("cart").insert({
        session_id: userId,
        product_id: Number(productId),
        quantity: 1,
      });

      if (!error && userId) {
        await fetchCart(userId);
      }
    }
  };

  const updateQuantity = async (
    id: string,
    amount: number,
    currentQty: number,
    onTriggerDelete: (item: ProductType) => void,
  ) => {
    if (!userId) return;
    const targetItem = cartItems.find((item) => item.id === id);

    if (targetItem && currentQty === 1 && amount === -1) {
      onTriggerDelete(targetItem);
      return;
    }

    const newQty = currentQty + amount;
    if (newQty < 1) return;
    if (amount === 1 && newQty > 5)
      throw new Error("En fazla 5 adet ekleyebilirsiniz.");

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQty })
      .eq("id", Number(id));

    if (!error) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item,
        ),
      );
    }
  };

  const handleJustDelete = async (selectedProduct: ProductType) => {
    if (!userId) return;
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("id", Number(selectedProduct.id));

    if (!error) {
      setCartItems((prev) =>
        prev.filter((item) => item.id !== selectedProduct.id),
      );
    }
  };

  const handleSaveToFavoritesAndDelete = async (
    selectedProduct: ProductType,
  ) => {
    if (!userId) return;
    const { error: favError } = await supabase.from("favorites").insert({
      session_id: userId,
      product_id: Number(selectedProduct.product_id),
    });

    if (!favError || favError.code === "23505") {
      await handleJustDelete(selectedProduct);
    }
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "KRTS20") {
      setDiscount(0.2);
      return { success: true, message: "Kupon başarıyla uygulandı!" };
    }
    return {
      success: false,
      message:
        "Girdiğiniz kupon kodu bulunamadı. Lütfen 'KRTS20' kodunu deneyin.",
    };
  };

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  const discountAmount = subtotal * discount;
  const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 75;
  const finalTotal = subtotal - discountAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        discount,
        promoCode,
        setPromoCode,
        applyPromo,
        fetchCart,
        addToCart,
        updateQuantity,
        handleJustDelete,
        handleSaveToFavoritesAndDelete,
        subtotal,
        discountAmount,
        shippingFee,
        finalTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart bir CartProvider içinde kullanılmalıdır.");
  }
  return context;
}
