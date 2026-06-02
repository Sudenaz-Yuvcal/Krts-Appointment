"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { citiesAndDistricts, allCities } from "../constants/locations";
interface Salon {
  id: string;
  name: string;
  city: string;
  region: string;
  rating: number;
  services: string[];
  text: string;
  img: string;
}

const initialSalons: Salon[] = [
  {
    id: "fiem-kuafor",
    name: "Fiem Kuaför & Güzellik",
    city: "İstanbul",
    region: "Beşiktaş",
    rating: 4.9,
    services: ["Kesim", "Boyaç", "Kaynak"],
    text: "Saç renklendirme, mikro kaynak ve kreatif kesim uzman kadrosu.",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "melis-estetik",
    name: "Melis Estetik & Tasarım",
    city: "İstanbul",
    region: "Kadıköy",
    rating: 4.5,
    services: ["Makyaj", "Cilt Bakımı"],
    text: "Profesyonel makyaj, cilt bakımı ve modern saç tasarımları.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "asli-hair",
    name: "Aslı Saç Tasarım Stüdyosu",
    city: "İstanbul",
    region: "Beşiktaş",
    rating: 4.2,
    services: ["Kesim", "Topuz"],
    text: "Kreatif topuz, gelin saçı ve saç botoksu kalitesi.",
    img: "https://images.unsplash.com/photo-1605497746444-ac9da58d440f?auto=format&fit=crop&q=80&w=600",
  },
];

const allAvailableServices: string[] = [
  "Kesim",
  "Boyaç",
  "Kaynak",
  "Makyaj",
  "Cilt Bakımı",
  "Topuz",
];

export default function SalonsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedRegion("all");
  };

  const availableDistricts: string[] = citiesAndDistricts[selectedCity] || [];

  const filteredSalons = initialSalons.filter((salon) => {
    const matchesSearch = salon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || salon.city === selectedCity;
    const matchesRegion =
      selectedRegion === "all" || salon.region === selectedRegion;
    const matchesRating = salon.rating >= minRating;
    const matchesService =
      selectedService === "all" || salon.services.includes(selectedService);
    return (
      matchesSearch &&
      matchesCity &&
      matchesRegion &&
      matchesRating &&
      matchesService
    );
  });

  return (
    <div className="bg-[#FAF5F7] min-h-screen text-[#4A1D24] font-sans relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#4A1D24]/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.25em] text-purple-600 uppercase block">
              KRTS NETWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#2D0F14]">
              ONAYLI{" "}
              <span className="font-black text-purple-700">
                SEÇKİN SALONLAR
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSalons.map((salon) => (
            <Link
              href={`/salons/${salon.id}`}
              key={salon.id}
              className="group bg-white border border-[#4A1D24]/5 rounded-4xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-500 flex flex-col justify-between"
            >
              <div
                className="h-60 bg-cover bg-center relative p-6 flex items-end overflow-hidden border-b border-[#4A1D24]/5"
                style={{ backgroundImage: `url(${salon.img})` }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-black text-purple-900 shadow-sm">
                  <Star className="w-3 h-3 fill-purple-600 text-purple-600 inline mr-1" />{" "}
                  {salon.rating}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-700 text-[10px] font-black tracking-[0.2em] uppercase">
                    <MapPin className="w-3 h-3" /> {salon.city.toUpperCase()} /{" "}
                    {salon.region.toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-black text-[#2D0F14] group-hover:text-purple-700 transition-colors tracking-tight">
                    {salon.name}
                  </h3>
                  <p className="text-xs text-[#4A1D24]/60 font-medium leading-relaxed line-clamp-2">
                    {salon.text}
                  </p>

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
                </div>

                <div className="flex justify-between items-center pt-5 border-t border-[#4A1D24]/5 mt-4">
                  <span className="text-emerald-600 text-[9px] font-black tracking-[0.15em] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                    RANDEVU AKTİF
                  </span>
                  <span className="text-xs font-bold text-[#4A1D24] group-hover:text-purple-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    İNCELE <ArrowRight className="w-4 h-4 text-purple-600" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity"
          />

          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#4A1D24]/10 shadow-2xl z-50 p-8 flex flex-col justify-between animate-slideLeft">
            <div className="space-y-8 overflow-y-auto pr-2">
              <div className="flex items-center justify-between border-b border-[#4A1D24]/5 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-700" />
                  <h3 className="text-sm font-black tracking-widest uppercase text-[#2D0F14]">
                    Filtre Paneli
                  </h3>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
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
                      placeholder="Örn: Fiem..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold text-[#4A1D24] focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                    İstenen Uzmanlık / Hizmet
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24] focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">TÜM HİZMETLER / UZMANLIKLAR</option>
                    {allAvailableServices.map((service) => (
                      <option key={service} value={service}>
                        {service.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                    Şehir (81 İl Seçimi)
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24] focus:outline-hidden cursor-pointer"
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
                    İlçe / Mahalle
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    disabled={
                      selectedCity === "all" || availableDistricts.length === 0
                    }
                    className="w-full bg-[#FAF5F7] border border-[#4A1D24]/10 rounded-xl py-3.5 px-4 text-xs font-bold text-[#4A1D24] focus:outline-hidden cursor-pointer disabled:opacity-40"
                  >
                    <option value="all">TÜM İLÇELER</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-wider uppercase text-purple-900/60">
                    Minimum Salon Skoru
                  </label>
                  <div className="flex bg-[#FAF5F7] border border-[#4A1D24]/10 p-1 rounded-xl">
                    <button
                      onClick={() => setMinRating(0)}
                      className={`flex-1 text-[10px] font-black py-2.5 rounded-lg uppercase ${minRating === 0 ? "bg-[#4A1D24] text-white" : "text-[#4A1D24]/40"}`}
                    >
                      HEPSİ
                    </button>
                    <button
                      onClick={() => setMinRating(4.5)}
                      className={`flex-1 text-[10px] font-black py-2.5 rounded-lg uppercase ${minRating === 4.5 ? "bg-[#4A1D24] text-white" : "text-[#4A1D24]/40"}`}
                    >
                      4.0+
                    </button>
                    <button
                      onClick={() => setMinRating(4.8)}
                      className={`flex-1 text-[10px] font-black py-2.5 rounded-lg uppercase ${minRating === 4.8 ? "bg-[#4A1D24] text-white" : "text-[#4A1D24]/40"}`}
                    >
                      4.8+ ELİTE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="w-full bg-[#4A1D24] hover:bg-purple-700 text-white font-black text-xs py-4 rounded-xl tracking-widest uppercase transition-all mt-6 shadow-md cursor-pointer"
            >
              Sonuçları Listele ➔
            </button>
          </div>
        </>
      )}
    </div>
  );
}
