"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, Loader2, Inbox } from "lucide-react";
import { supabase } from "../lib/supabase";

import SalonCard from "@/components/SalonCard";
import FilterSidebar from "@/sections/salons/filter-sidebar";
import { Salon } from "@/type/salon";

const allAvailableServices: string[] = [
  "Kesim",
  "Boya",
  "Kaynak",
  "Makyaj",
  "Cilt Bakımı",
  "Topuz",
];

export default function SalonsPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSalons() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("salons")
          .select("id, salon_name, city, district, about, cover_images");

        if (fetchError) throw fetchError;
        setSalons(data || []);
      } catch (err: any) {
        console.error("Salonlar yüklenirken hata oluştu:", err);
        setError(
          "Salon listesi yüklenemedi. Lütfen daha sonra tekrar deneyin.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchSalons();
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedRegion("all");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
    setSelectedRegion("all");
    setSelectedService("all");
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch = salon.salon_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || salon.city === selectedCity;
    const matchesRegion =
      selectedRegion === "all" || salon.district === selectedRegion;
    const matchesService =
      selectedService === "all" || salon.services?.includes(selectedService);

    return matchesSearch && matchesCity && matchesRegion && matchesService;
  });

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] font-sans relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4A1D24]/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-purple-600 uppercase block">
              KRTS NETWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#2D0F14]">
              ONAYLI{" "}
              <span className="font-black text-purple-700">
                ELITE SALONLAR
              </span>
            </h2>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 bg-[#4A1D24] hover:bg-purple-700 text-white font-black text-xs px-8 py-4 rounded-full transition-all tracking-wider uppercase shadow-lg cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtreleri Yapılandır
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
            <p className="text-xs font-black tracking-widest text-purple-900/60 uppercase">
              Seçkin Salon Ağımız Yükleniyor...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white border border-red-100 rounded-4xl p-8 max-w-xl mx-auto shadow-sm">
            <p className="text-sm font-semibold text-red-950">{error}</p>
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#4A1D24]/5 rounded-4xl p-10 max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 bg-[#FAF5F7] rounded-full flex items-center justify-center mx-auto text-purple-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#2D0F14]">
              Kriterlere Uygun Salon Bulunamadı
            </h3>
            <p className="text-xs text-[#4A1D24]/60 font-medium max-w-sm mx-auto leading-relaxed">
              Aradığınız filtrelere ait onaylı partner portföyü bulunmuyor.
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-black tracking-wider text-purple-700 uppercase hover:underline cursor-pointer"
            >
              Tüm Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </div>

      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        allAvailableServices={allAvailableServices}
      />
    </div>
  );
}
