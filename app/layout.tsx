import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KRTS BEAUTY | Seçkin Güzellik Ağı",
  description: "Premium salon randevu, ürün kataloğu ve yönetim platformu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[#0F0A0B] text-slate-100 selection:bg-[#4A2328]/50 min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Navbar />

          <AnnouncementBar />

          <main className="flex-1">{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
