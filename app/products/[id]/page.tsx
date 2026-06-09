"use client";
import { useState, useEffect, use } from "react";
import Link from "next/navigation";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Star,
  ArrowLeft,
  Heart,
  Tag,
  Plus,
  Minus,
  X,
  ArrowRight,
  Loader2,
  Check,
  MessageSquare,
  User,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface ProductType {
  id: number;
  product_name: string;
  brand_name: string | null;
  brand_id: string | null;
  price: number;
  stock_count: number;
  category: string | null;
  image_url: string | null; 
  is_active: boolean;
}

interface ReviewType {
  id: number;
  rating: number;
  comment: string;
  reply_comment: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [productImages, setProductImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const { data: mainProduct, error: prodError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (prodError || !mainProduct) {
          console.error("Ürün bulunamadı:", prodError);
          return;
        }

        setProduct(mainProduct);

        const defaultFallback =
          "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800";

        if (mainProduct.image_url && mainProduct.image_url.trim() !== "") {
          const urlsArray = mainProduct.image_url
            .split(",")
            .map((url: string) => url.trim())
            .filter((url: string) => url !== "");

          setProductImages(urlsArray);
          setSelectedImage(urlsArray[0] || defaultFallback); 
        } else {
          setProductImages([defaultFallback]);
          setSelectedImage(defaultFallback);
        }

        const { data: recommendations } = await supabase
          .from("products")
          .select("*")
          .neq("id", productId)
          .gt("stock_count", 0)
          .limit(4);

        if (recommendations) setSuggestedProducts(recommendations);

        const { data: reviewData } = await supabase
          .from("reviews")
          .select(
            `
            id, rating, comment, reply_comment, created_at,
            profiles ( full_name, avatar_url )
          `,
          )
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (reviewData) setReviews(reviewData as any);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);

          const { data: favData } = await supabase
            .from("favorites")
            .select("id")
            .eq("session_id", user.id)
            .eq("product_id", productId)
            .maybeSingle();

          if (favData) setIsFavorite(true);

          const { data: orderData } = await supabase
            .from("order_items")
            .select("id")
            .eq("session_id", user.id)
            .eq("product_id", productId)
            .limit(1);

          if (orderData && orderData.length > 0) {
            setHasPurchased(true);
          }
        }
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductData();
  }, [productId]);

  const toggleFavorite = async () => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("session_id", userId)
        .eq("product_id", productId);

      if (!error) setIsFavorite(false);
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ session_id: userId, product_id: productId });

      if (!error) setIsFavorite(true);
    }
  };
  const handleAddToCart = async () => {
    if (!product) {
      showLocalToast("Ürün bilgileri yükleniyor, lütfen bekleyin...");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showLocalToast("Lütfen önce giriş yapın.");
        router.push("/login");
        return;
      }

      const { data: existingCartItem, error: checkError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("session_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingCartItem) {
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingCartItem.quantity + quantity })
          .eq("id", existingCartItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("cart").insert({
          session_id: user.id,
          product_id: product.id,
          quantity: quantity, 
        });

        if (insertError) throw insertError;
      }

      setIsModalOpen(true);
      showLocalToast("Ürün başarıyla sepete eklendi!");

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      console.error(err);
      showLocalToast(
        `Sepete eklenirken hata oluştu: ${err.message || "Veri tipi uyuşmazlığı"}`,
      );
    }
  };
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !product) return;
    if (!newComment.trim()) {
      showLocalToast("Lütfen bir yorum metni yazın.");
      return;
    }

    setSubmittingReview(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          session_id: userId,
          product_id: productId,
          brand_id: product.brand_id,
          rating: newRating,
          comment: newComment,
        })
        .select(
          `
          id, rating, comment, reply_comment, created_at,
          profiles ( full_name, avatar_url )
        `,
        )
        .single();

      if (error) throw error;

      showLocalToast("Yorumunuz başarıyla eklendi!");
      setReviews((prev) => [data as any, ...prev]);
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      console.error(err);
      showLocalToast("Yorum eklenirken bir hata oluştu.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5F7] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-xs font-bold text-purple-900/60 uppercase tracking-widest">
          Premium İçerik Yükleniyor...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF5F7] flex flex-col items-center justify-center gap-4 text-center p-6">
        <h2 className="text-xl font-black text-[#2D0F14]">Ürün Bulunamadı</h2>
        <LinkNext
          href="/products"
          className="bg-[#4A1D24] text-white text-xs font-black px-6 py-3 rounded-xl uppercase tracking-wider"
        >
          Kataloğa Dön
        </LinkNext>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] px-6 md:px-16 py-10 space-y-16 flex-1 relative overflow-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D0F14] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5F7] border border-purple-200 w-full max-w-sm rounded-4xl shadow-2xl p-6 text-center space-y-5 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-100 shadow-sm hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#2D0F14] tracking-tight">
                Oturum Açmanız Gerekiyor
              </h3>
              <p className="text-xs text-[#4A1D24]/70 font-medium leading-relaxed">
                Sepete ürün eklemek veya favorilerinize kaydetmek için lütfen
                üye girişi yapın.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-[#4A1D24] text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all uppercase tracking-widest shadow-md"
            >
              Giriş Sayfasına Git
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="relative z-10">
        <LinkNext
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-black text-purple-900/50 hover:text-[#4A1D24] transition-colors uppercase tracking-wider group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Kataloğa Geri Dön
        </LinkNext>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        <div className="lg:col-span-6 flex gap-4 w-full h-125">
          <div className="flex flex-col justify-start h-full gap-3 w-24 shrink-0">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-full aspect-square bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer relative ${
                  selectedImage === img
                    ? "border-purple-600 shadow-md scale-[1.02]"
                    : "border-purple-100 opacity-85 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Ürün Görseli ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 h-full bg-linear-to-b from-white to-purple-50/20 border border-purple-100/60 rounded-4xl relative overflow-hidden group shadow-xl shadow-purple-900/5">
            <img
              src={selectedImage}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-6 right-6 p-3.5 bg-white/80 backdrop-blur-md border border-purple-100 rounded-full text-purple-900/60 shadow-md cursor-pointer hover:scale-110 transition-all z-10"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorite ? "fill-pink-600 text-pink-600" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-[#4A1D24] text-white uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              PREMIUM SELECTION
            </span>
            <div className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] pt-2">
              {product.brand_name || product.category || "Kozmetik & Bakım"}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#2D0F14] tracking-tight leading-tight">
              {product.product_name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-950/60">
            <div className="flex text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
            <span>4.9 / 5.0 — Elit Müşteri Puanı</span>
          </div>

          <p className="text-sm text-[#4A1D24]/80 font-medium leading-relaxed max-w-xl">
            Salon kalitesinde profesyonel bakım deneyimi. Yoğun formülü
            sayesinde uzun süreli kullanım sunar ve bariyerinizi en üst düzeyde
            destekler.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/60 backdrop-blur-md border border-white rounded-2xl py-3 px-6 w-fit shadow-lg shadow-purple-900/5">
              <span className="text-[9px] text-purple-900/50 block uppercase font-black tracking-widest leading-none mb-1">
                Yatırım Değeri
              </span>
              <span className="text-2xl font-black text-[#2D0F14] tracking-tight leading-none">
                {Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                }).format(product.price)}
              </span>
            </div>

            {product.stock_count > 0 && product.stock_count <= 5 && (
              <span className="text-rose-600 text-xs font-black animate-pulse bg-rose-50 px-3 py-2 rounded-xl border border-rose-100">
                🔥 Tükeniyor, Acele Et!
              </span>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-200/60 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-bold text-purple-950">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              Sihirbaz İndirimi Aktif! Sepette %20 indirim için{" "}
              <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-black select-all">
                KRTS20
              </span>{" "}
              kodunu kullanın.
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center justify-between border-2 border-purple-200/80 bg-white rounded-2xl p-2 w-36 h-14 shadow-xs">
              <button
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                className="w-9 h-9 rounded-xl hover:bg-purple-50 flex items-center justify-center text-purple-900/70 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-[#2D0F14] text-base">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((prev) => {
                    const maxLimit = Math.min(product.stock_count, 5);
                    if (prev >= maxLimit) {
                      showLocalToast(
                        "Maksimum limit veya stok sınırına ulaştınız.",
                      );
                      return maxLimit;
                    }
                    return prev + 1;
                  })
                }
                className="w-9 h-9 rounded-xl hover:bg-purple-50 flex items-center justify-center text-purple-900/70 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_count === 0}
              className="flex-1 h-14 text-xs font-black bg-[#4A1D24] hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-xl shadow-purple-950/10 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer transform active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />{" "}
              {product.stock_count > 0 ? "Sepete Ekle" : "Stokta Yok"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF5F7] border border-purple-200 w-full max-w-md rounded-4xl shadow-2xl p-6 relative overflow-hidden text-[#4A1D24] text-center space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-purple-100 shadow-sm hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="w-7 h-7 stroke-3" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight text-[#2D0F14]">
                Sepete Eklendi!
              </h3>
              <p className="text-xs text-[#4A1D24]/70 max-w-xs mx-auto font-medium">
                <span className="font-bold text-purple-600">
                  {product.product_name}
                </span>{" "}
                başarıyla sepetinize eklendi.
              </p>
              <div className="inline-block bg-purple-50 text-purple-700 font-black text-[11px] px-3 py-1 rounded-lg mt-2">
                Adet: {quantity} • Toplam:{" "}
                {Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                }).format(product.price * quantity)}
              </div>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <LinkNext
                href="/cart"
                className="w-full h-13 bg-[#4A1D24] text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all shadow-md uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Sepete Git <ArrowRight className="w-4 h-4" />
              </LinkNext>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full h-13 bg-white border border-purple-200 text-[#4A1D24] text-xs font-black rounded-xl hover:bg-purple-50 transition-all uppercase tracking-widest cursor-pointer"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-purple-200/60 pt-14 space-y-8 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.25em] text-purple-600 uppercase block">
            Müşteri Deneyimleri
          </span>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#2D0F14]">
            ÜRÜN <span className="font-black">YORUMLARI</span> ({reviews.length}
            )
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-white border border-purple-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2D0F14]">
              Yorumunu Paylaş
            </h3>

            {hasPurchased ? (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Puanınız
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer transition-transform active:scale-90"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Yorumunuz
                  </label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Bu harika ürün hakkındaki deneyimlerini yaz..."
                    className="w-full text-xs font-medium p-3 bg-[#FAF5F7] border border-purple-100 rounded-xl focus:outline-hidden focus:border-purple-600 transition-colors resize-none text-[#4A1D24]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full h-11 bg-[#4A1D24] hover:bg-purple-700 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Yorumu Yayınla"
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl text-center">
                <MessageSquare className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                <p className="text-[11px] font-bold text-amber-900 leading-normal">
                  Sadece bu ürünü satın alan ayrıcalıklı müşterilerimiz yorum
                  yapabilir.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white border border-purple-100 rounded-3xl p-8 text-center text-xs font-bold text-slate-400">
                Bu ürün için henüz yorum yapılmamış. İlk yorumu sen yap!
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-purple-100 rounded-3xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center text-purple-900 font-black text-xs uppercase overflow-hidden border border-purple-100">
                        {rev.profiles?.avatar_url ? (
                          <img
                            src={rev.profiles.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          rev.profiles?.full_name?.charAt(0) || "K"
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#2D0F14]">
                          {rev.profiles?.full_name || "Seçkin Müşteri"}
                        </h4>
                        <div className="flex text-amber-400 gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${idx < rev.rating ? "fill-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(rev.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-[#4A1D24]/90 pl-12 leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.reply_comment && (
                    <div className="bg-purple-50/60 border-l-2 border-purple-400 ml-12 p-3 rounded-r-xl space-y-1">
                      <div className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                        Salon Yönetimi Yanıtı
                      </div>
                      <p className="text-xs font-medium text-purple-950/80">
                        {rev.reply_comment}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-purple-200/60 pt-14 space-y-8 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.25em] text-purple-600 uppercase block">
            KRTS EDITORIAL SUGGESTIONS
          </span>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#2D0F14]">
            BUNLARI DA <span className="font-black">SEVEBİLİRSİNİZ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestedProducts.map((item) => {
            let suggestedImg =
              "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600";
            if (item.image_url && item.image_url.trim() !== "") {
              suggestedImg = item.image_url.split(",")[0].trim();
            }

            return (
              <LinkNext
                href={`/products/${item.id}`}
                key={item.id}
                className="group cursor-pointer"
              >
                <div className="bg-white border border-[#4A1D24]/5 rounded-4xl p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/5 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-full aspect-square bg-[#FAF5F7] border border-[#4A1D24]/5 rounded-2xl flex items-center justify-center p-4 mb-4 overflow-hidden relative">
                      <img
                        src={suggestedImg}
                        alt={item.product_name}
                        className="max-h-full max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                    </div>
                    <div className="text-[9px] font-black text-purple-600 uppercase tracking-widest px-1">
                      {item.brand_name || "PREMIUM CARE"}
                    </div>
                    <h3 className="text-xs font-bold text-[#2D0F14] line-clamp-2 mt-1 group-hover:text-purple-700 transition-colors leading-snug px-1 h-9">
                      {item.product_name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-purple-50 mt-4 px-1">
                    <span className="text-sm font-black text-[#2D0F14]">
                      {Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(item.price)}
                    </span>
                    <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-3 py-2 rounded-xl group-hover:bg-[#4A1D24] group-hover:text-white transition-all">
                      İNCELE ➔
                    </span>
                  </div>
                </div>
              </LinkNext>
            );
          })}
        </div>
      </div>
    </div>
  );
}
