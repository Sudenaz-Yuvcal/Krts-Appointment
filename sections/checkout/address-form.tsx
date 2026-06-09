"use client";

import { MapPin, User, Phone } from "lucide-react";
import { CheckoutFormData } from "@/type/card";

interface AddressFormProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function AddressForm({ formData, onChange }: AddressFormProps) {
  return (
    <div className="border border-purple-100 rounded-3xl bg-white p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-purple-50 pb-3">
        <MapPin className="w-5 h-5 text-purple-500" />
        <h2 className="text-sm md:text-base font-black tracking-widest uppercase text-[#2D0F14]">
          Teslimat Adresi
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Ad Soyad *
          </label>
          <div className="flex items-center gap-2 bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
            <User className="w-4 h-4 text-purple-300" />
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={onChange}
              placeholder="John Doe"
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Telefon *
          </label>
          <div className="flex items-center gap-2 bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
            <Phone className="w-4 h-4 text-purple-300" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={onChange}
              placeholder="05xx xxx xx xx"
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Şehir *
          </label>
          <div className="bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={onChange}
              placeholder="İstanbul"
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Açık Adres *
          </label>
          <div className="bg-purple-50/40 border border-purple-100 p-3.5 rounded-xl focus-within:border-purple-400 transition-colors">
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={onChange}
              placeholder="Mahalle, sokak, daire..."
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}