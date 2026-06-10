"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Settings,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

const USER_COLUMN = "session_id";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [cartCount, setCartCount] = useState<number>(0);
  const [hasFavorites, setHasFavorites] = useState<boolean>(false);

  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateCounts = async (currentUserId?: string) => {
    const activeUid = currentUserId || user?.id;

    if (activeUid) {
      try {
        const convertedUid = String(activeUid).trim();

        const { data: cartData, error: cartError } = await supabase
          .from("cart")
          .select("quantity")
          .eq(USER_COLUMN, convertedUid);

        if (!cartError && cartData) {
          const totalItems = cartData.reduce((acc, item) => {
            const qty = Number(item.quantity);
            return acc + (isNaN(qty) ? 0 : qty);
          }, 0);

          setCartCount(totalItems);
        }

        const { data: favData, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq(USER_COLUMN, convertedUid);

        if (!favError && favData) {
          setHasFavorites(favData.length > 0);
        }
      } catch (err) {
        console.error("Sayaçlar güncellenirken hata:", err);
      }
    } else {
      if (typeof window !== "undefined") {
        const localCart = JSON.parse(localStorage.getItem("krts_cart") || "[]");
        const localFavs = JSON.parse(
          localStorage.getItem("krts_favorites") || "[]",
        );

        const totalLocalItems = localCart.reduce((acc: number, item: any) => {
          const qty = Number(item.quantity || 1);
          return acc + (isNaN(qty) ? 0 : qty);
        }, 0);

        setCartCount(totalLocalItems);
        setHasFavorites(localFavs.length > 0);
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setFullName(session.user.user_metadata?.full_name || "Kullanıcı");
        updateCounts(session.user.id);
      } else {
        updateCounts();
      }
      setAuthLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setFullName(session.user.user_metadata?.full_name || "Kullanıcı");
        updateCounts(session.user.id);
      } else {
        setUser(null);
        setFullName("");
        setCartCount(0);
        setHasFavorites(false);
        updateCounts();
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleInstantRefresh = () => {
      updateCounts();
    };

    let navbarChannel: any;

    navbarChannel = supabase
      .channel("navbar-global-realtime")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "cart" },
        handleInstantRefresh,
      )
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "favorites" },
        handleInstantRefresh,
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          handleInstantRefresh();
        }
      });

    window.addEventListener("storage", handleInstantRefresh);
    window.addEventListener("cartUpdated", handleInstantRefresh);
    window.addEventListener("favUpdated", handleInstantRefresh);

    return () => {
      if (navbarChannel) supabase.removeChannel(navbarChannel);
      window.removeEventListener("storage", handleInstantRefresh);
      window.removeEventListener("cartUpdated", handleInstantRefresh);
      window.removeEventListener("favUpdated", handleInstantRefresh);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      const forbiddenPaths = ["/login", "/register", "/business-login"];
      if (forbiddenPaths.includes(pathname)) {
        router.push("/");
      }
    }
  }, [user, pathname, authLoading, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <nav className="border-b border-purple-200/60 bg-[#E8DCEB]/95 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-16 py-5 flex justify-between items-center transition-all duration-300 shadow-sm text-[#2D0F14]">
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-purple-300/10 shadow-md transition-transform group-hover:scale-105">
              <Image
                src="/randevu-icon.jpeg"
                alt="Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight group-hover:text-purple-800 transition-colors">
                KRTS
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-start gap-8 flex-1 ml-16">
          <Link
            href="/salons"
            className="text-xs font-black text-purple-950/80 hover:text-[#4A1D24] transition-colors uppercase tracking-wider shrink-0 border-b-2 border-transparent hover:border-[#4A1D24] pb-1"
          >
            Salonlar
          </Link>
          <Link
            href="/products"
            className="text-xs font-black text-purple-950/80 hover:text-[#4A1D24] transition-colors uppercase tracking-wider shrink-0 border-b-2 border-transparent hover:border-[#4A1D24] pb-1"
          >
            Ürünler
          </Link>
        </div>

        <div className="flex items-center justify-end gap-6">
          {!user && (
            <Link href="/gateway" className="hidden lg:block">
              <button className="text-[10px] font-black bg-[#4A1D24] hover:bg-purple-700 text-white px-5 py-3 rounded-full transition-all shadow-md flex items-center gap-2 uppercase tracking-widest cursor-pointer group hover:scale-[1.02]">
                <Image
                  src="/randevu-icon.jpeg"
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-full group-hover:rotate-6 transition-transform opacity-80"
                />
                İşletmeler & Markalar İçin
              </button>
            </Link>
          )}

          <Link
            href="/favorites"
            className="text-purple-950/80 hover:text-[#4A1D24] transition-colors p-2 group relative flex items-center justify-center"
            aria-label="Favoriler"
          >
            <Heart className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-red-500" />
            {hasFavorites && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#E8DCEB] z-10 animate-pulse" />
            )}
          </Link>

          <Link
            href="/cart"
            className="text-purple-950/80 hover:text-[#4A1D24] transition-colors p-2 group relative flex items-center justify-center"
            aria-label="Sepetim"
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-purple-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-purple-700 text-white text-[10px] font-black min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-sm border border-[#E8DCEB] z-10 select-none animate-scaleIn">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="text-purple-950/80 hover:text-[#4A1D24] transition-colors p-1 group block"
              aria-label="Giriş Yap"
            >
              <User className="w-5 h-5 transition-transform text-purple-900 group-hover:text-purple-700 group-hover:scale-110" />
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-purple-950 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md hover:bg-purple-900 group"
              >
                <div className="w-5 h-5 bg-purple-800 rounded-full flex items-center justify-center font-black text-[10px] text-purple-200 uppercase">
                  {fullName.charAt(0)}
                </div>
                <span className="max-w-25 truncate">{fullName}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-purple-300 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-purple-200/70 rounded-2xl shadow-xl py-2 text-[#2D0F14]">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider">
                      Müşteri Hesabı
                    </p>
                    <p className="text-xs font-bold text-purple-950 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-950 transition-all"
                  >
                    <Settings className="w-4 h-4 text-purple-600" /> Hesabım
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-purple-100 w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-purple-950 uppercase">
                Oturumu Kapat?
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                KRTS dünyasından çıkış yapmak istediğinize emin misiniz?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl transition-all"
              >
                Evet, Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
