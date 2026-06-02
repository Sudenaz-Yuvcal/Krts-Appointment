import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0F0A0B] px-6 md:px-16 py-12 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-[#4A2328] to-[#2D1619] border border-pink-500/20 rounded-lg flex items-center justify-center text-white font-black text-sm">
              K
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              KRTS
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Premium salon randevu, seçkin ürün kataloğu ve lüks güzellik
            ekosistemi.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-pink-500 mb-4">
            Keşfet
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link
                href="/salons"
                className="hover:text-white transition-colors"
              >
                Salonlar
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Premium Ürünler
              </Link>
            </li>
            <li>
              <Link
                href="/brands"
                className="hover:text-white transition-colors"
              >
                Markalar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-pink-500 mb-4">
            Kurumsal
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-pink-500 mb-4">
            İşletmeler
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link
                href="/business-login"
                className="hover:text-white transition-colors"
              >
                Marka/Salon Girişi
              </Link>
            </li>
            <li>
              <Link href="/join" className="hover:text-white transition-colors">
                Aramıza Katılın
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <div>© 2026 KRTS BEAUTY NET. TÜM HAKLARI SAKLIDIR.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">
            Gizlilik Sözleşmesi
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Kullanım Şartları
          </a>
        </div>
      </div>
    </footer>
  );
}
