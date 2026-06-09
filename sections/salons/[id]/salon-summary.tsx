"use client";

import { MapPin, Sparkles } from "lucide-react";
import { SalonSummaryProps } from "@/type/salon";


export default function SalonSummary({
  salonName,
  district,
  city,
  address,
  about,
}: SalonSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-950 flex items-center gap-2">
            {salonName}
            <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            {district ? `${district}, ` : ""}
            {city || "Belirtilmedi"}
          </p>
        </div>
      </div>

      {address && (
        <p className="text-xs text-gray-600 bg-purple-50/50 rounded-xl p-3 mt-4 border border-purple-100/50">
          <span className="font-bold text-purple-900 block mb-0.5">Adres:</span>
          {address}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-purple-950 mb-1">Hakkımızda</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{about}</p>
      </div>
    </div>
  );
}
