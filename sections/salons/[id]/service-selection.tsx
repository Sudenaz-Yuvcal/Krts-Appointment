"use client";
import { Clock } from "lucide-react";
import {  ServiceSelectionProps } from "@/type/salon";

export default function ServiceSelection({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceSelectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
      <h2 className="text-sm font-bold text-purple-950 mb-4 flex items-center gap-2">
        <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
          1
        </span>
        Hizmet Seçin
      </h2>
      {services.length === 0 ? (
        <p className="text-xs text-gray-500 italic">
          Bu salona ait aktif hizmet bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/60 shadow-xs"
                    : "border-gray-100 bg-gray-50/30 hover:border-purple-200"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-xs font-bold text-purple-950">
                      {service.service_name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />{" "}
                      {service.duration_minutes} Dakika
                    </p>
                  </div>
                  <span className="text-xs font-black text-purple-700 shrink-0">
                    {service.price} TL
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
