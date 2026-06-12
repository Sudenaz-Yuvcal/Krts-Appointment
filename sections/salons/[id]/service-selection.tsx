"use client";
import { Clock, Layers } from "lucide-react";
import { ServiceSelectionProps, ServiceData } from "@/type/salon";

interface ExtendedServiceData extends Omit<ServiceData, "id"> {
  id: string | number;
  image_url?: string | null;
  category?: string | null;
}

interface ExtendedServiceSelectionProps {
  services: ExtendedServiceData[];
  selectedServiceId: string | number | null;
  onSelectService: (id: any) => void;
}

export default function ServiceSelection({
  services,
  selectedServiceId,
  onSelectService,
}: ExtendedServiceSelectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100/70">
      <h2 className="text-sm font-black text-purple-950 mb-4 flex items-center gap-2 uppercase tracking-tight">
        <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          1 
        </span>
        Hizmet Seçimi
      </h2>

      {services.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Bu salona ait aktif bir hizmet bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => {
            const isSelected =
              selectedServiceId !== null &&
              String(selectedServiceId) === String(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectService(service.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-center justify-between group ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/60 shadow-xs ring-2 ring-purple-600/5"
                    : "border-gray-100 bg-gray-50/20 hover:border-purple-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100/50 overflow-hidden shrink-0 flex items-center justify-center">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Layers className="w-4 h-4 text-purple-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    {service.category && (
                      <span className="text-[9px] font-black text-purple-600 uppercase tracking-wider block">
                        {service.category}
                      </span>
                    )}
                    <p className="text-xs font-black text-purple-950 truncate">
                      {service.service_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500 shrink-0" />
                      {service.duration_minutes} Dakika
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-100/50 px-2 py-1 rounded-lg">
                    {Number(service.price).toLocaleString("tr-TR")} ₺
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
