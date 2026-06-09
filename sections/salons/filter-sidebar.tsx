"use client";

import { SlidersHorizontal, X, Search } from "lucide-react";
import { citiesAndDistricts, allCities } from "@/app/constants/locations";
interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedService: string;
  setSelectedService: (val: string) => void;
  selectedCity: string;
  onCityChange: (val: string) => void;
  selectedRegion: string;
  setSelectedRegion: (val: string) => void;
  allAvailableServices: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  selectedService,
  setSelectedService,
  selectedCity,
  onCityChange,
  selectedRegion,
  setSelectedRegion,
  allAvailableServices,
}: FilterSidebarProps) {
  if (!isOpen) return null;

  const availableDistricts = citiesAndDistricts[selectedCity] || [];

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40" />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#4A1D24]/10 shadow-2xl z-50 p-8 flex flex-col justify-between">
        <div className="space-y-8 overflow-y-auto pr-2">
          <div className="flex items-center justify-between border-b border-[#4A1D24]/5 pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-700" />
              <h3 className="text-sm font-black tracking-widest uppercase text-[#2D0F14]">
                Filtre Paneli
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#FAF5F7] rounded-full flex items-center justify-center text-[#4A1D24]/60 hover:bg-[#4A1D24] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                Salon İsmiyle Ara
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  placeholder="Örn: Salon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold text-[#4A1D24]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                İstenen Hizmet
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24]"
              >
                <option value="all">TÜM HİZMETLER</option>
                {allAvailableServices.map((service) => (
                  <option key={service} value={service}>
                    {service.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                Şehir
              </label>
              <select
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24]"
              >
                <option value="all">TÜM TÜRKİYE</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>
                    {city.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                İlçe
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                disabled={selectedCity === "all" || availableDistricts.length === 0}
                className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24] disabled:opacity-40"
              >
                <option value="all">TÜM İLÇELER</option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#4A1D24] hover:bg-purple-700 text-white font-black text-xs py-4 rounded-xl tracking-widest uppercase transition-all mt-6 shadow-md cursor-pointer"
        >
          Sonuçları Listele ➔
        </button>
      </div>
    </>
  );
}