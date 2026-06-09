"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SalonCardProps } from "@/type/salon";



export default function SalonCard({ salon }: SalonCardProps) {
  const salonImg =
    salon.cover_images && salon.cover_images.length > 0
      ? salon.cover_images[0]
      : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600";

  return (
    <Link
      href={`/salons/${salon.id}`}
      className="group bg-white border border-[#4A1D24]/5 rounded-4xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-500 flex flex-col justify-between"
    >
      <div
        className="h-60 bg-cover bg-center relative p-6 flex items-end overflow-hidden border-b border-[#4A1D24]/5"
        style={{ backgroundImage: `url(${salonImg})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-purple-700 text-[10px] font-black tracking-[0.2em] uppercase">
            <MapPin className="w-3 h-3" /> {salon.city?.toUpperCase()} / {salon.district?.toUpperCase()}
          </div>
          <h3 className="text-2xl font-black text-[#2D0F14] group-hover:text-purple-700 transition-colors tracking-tight">
            {salon.salon_name}
          </h3>
          <p className="text-xs text-[#4A1D24]/60 font-medium leading-relaxed line-clamp-2">
            {salon.about}
          </p>

          {salon.services && salon.services.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {salon.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="bg-purple-50 text-purple-700 text-[9px] font-bold px-2.5 py-1 rounded-md border border-purple-200/50"
                >
                  {srv}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-[#4A1D24]/5 mt-4">
          <span className="text-emerald-600 text-[9px] font-black tracking-[0.15em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> RANDEVU AKTİF
          </span>
          <span className="text-xs font-bold text-[#4A1D24] group-hover:text-purple-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
            İNCELE <ArrowRight className="w-4 h-4 text-purple-600" />
          </span>
        </div>
      </div>
    </Link>
  );
}