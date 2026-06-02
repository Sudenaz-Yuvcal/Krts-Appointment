import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Heart,
  ShoppingCart,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b border-purple-200/60 bg-[#E8DCEB]/95 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-16 py-5 flex justify-between items-center transition-all duration-300 shadow-sm">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-purple-300/10 shadow-md shadow-purple-900/10 transition-transform group-hover:scale-105">
          <Image
            src="/randevu-icon.jpeg"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-[#2D0F14] group-hover:text-purple-800 transition-colors">
            KRTS
          </span>
          <span className="text-[10px] font-black tracking-[0.25em] text-purple-700 block -mt-1 uppercase">
            Beauty Net
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-5">
        <Link
          href="/salons"
          className="text-xs font-black text-purple-950/80 hover:text-[#4A1D24] transition-colors uppercase tracking-wider"
        >
          Salonlar
        </Link>

        <Link
          href="/products"
          className="text-xs font-black text-purple-950/80 hover:text-[#4A1D24] transition-colors flex items-center gap-1.5 group/item uppercase tracking-wider"
        >
          Ürünler
        </Link>

        <Link
          href="/login"
          className="text-xs font-black text-purple-950/80 hover:text-[#4A1D24] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
        >
          <User className="w-4 h-4 text-purple-700" />
        </Link>

        <Link
          href="/favorites"
          className="text-purple-950/80 hover:text-[#4A1D24] transition-colors p-1 group"
          aria-label="Favoriler"
        >
          <Heart className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:text-pink-600" />
        </Link>

        <Link
          href="/cart"
          className="text-purple-950/80 hover:text-[#4A1D24] transition-colors p-1 group"
          aria-label="Sepetim"
        >
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:text-purple-700" />
        </Link>

        <Link href="/business-login" className="ml-1">
          <button className="text-[10px] font-black bg-[#4A1D24] hover:bg-purple-700 text-white px-5 py-3 rounded-full transition-all shadow-md shadow-purple-900/10 flex items-center gap-2 uppercase tracking-widest cursor-pointer group hover:scale-[1.02]">
            <LayoutDashboard className="w-4 h-4 text-purple-300 group-hover:rotate-6 transition-transform" />
            İşletmeler & Markalar İçin
          </button>
        </Link>
      </div>
    </nav>
  );
}
