"use client";

import { useState } from "react";
import { Edit3, X } from "lucide-react";

interface ProfileTabProps {
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  userEmail: string;
  city: string;
  setCity: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  fullAddress: string;
  setFullAddress: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  saveLoading: boolean;
  onUpdate: (type: "profile" | "address" | "password") => Promise<boolean>;
}

export default function ProfileTab({
  fullName, setFullName,
  phone, setPhone,
  userEmail,
  city, setCity,
  district, setDistrict,
  fullAddress, setFullAddress,
  newPassword, setNewPassword,
  saveLoading,
  onUpdate,
}: ProfileTabProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleSave = async (type: "profile" | "address" | "password") => {
    const success = await onUpdate(type);
    if (success) {
      if (type === "profile") setIsEditingProfile(false);
      if (type === "address") setIsEditingAddress(false);
      if (type === "password") setIsEditingPassword(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Kişisel Bilgiler */}
      <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-tight text-purple-950">Kişisel Bilgiler</h3>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-purple-700 hover:text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {isEditingProfile ? <><X className="w-3.5 h-3.5" /> İptal</> : <><Edit3 className="w-3.5 h-3.5" /> Düzenle</>}
          </button>
        </div>

        {!isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Ad Soyad</p>
              <p className="text-xs font-bold text-purple-950">{fullName || "Belirtilmemiş"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Telefon Numarası</p>
              <p className="text-xs font-bold text-purple-950">{phone || "Belirtilmemiş"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">E-Posta Adresi</p>
              <p className="text-xs font-bold text-slate-500">{userEmail}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold"
              placeholder="Ad Soyad"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold"
              placeholder="Telefon"
            />
            <button
              onClick={() => handleSave("profile")}
              disabled={saveLoading}
              className="w-full bg-purple-950 text-white font-black text-[11px] py-3 rounded-xl uppercase tracking-wider disabled:opacity-50"
            >
              {saveLoading ? "Kaydediliyor..." : "Veritabanını Güncelle"}
            </button>
          </div>
        )}
      </div>

      {/* Teslimat Adresi */}
      <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-tight text-purple-950">Teslimat Adresim</h3>
          <button
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="text-purple-700 hover:text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {isEditingAddress ? <><X className="w-3.5 h-3.5" /> İptal</> : <><Edit3 className="w-3.5 h-3.5" /> Düzenle</>}
          </button>
        </div>

        {!isEditingAddress ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Şehir</p>
                <p className="text-xs font-bold text-purple-950">{city || "Belirtilmemiş"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">İlçe</p>
                <p className="text-xs font-bold text-purple-950">{district || "Belirtilmemiş"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Açık Adres</p>
              <p className="text-xs font-bold text-purple-950 leading-relaxed">{fullAddress || "Açık adres eklenmemiş."}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold"
                placeholder="Şehir"
              />
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold"
                placeholder="İlçe"
              />
            </div>
            <textarea
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              rows={2}
              className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold resize-none"
              placeholder="Açık Adresiniz..."
            />
            <button
              onClick={() => handleSave("address")}
              disabled={saveLoading}
              className="w-full bg-purple-950 text-white font-black text-[11px] py-3 rounded-xl uppercase tracking-wider disabled:opacity-50"
            >
              {saveLoading ? "Kaydediliyor..." : "Adresi Tabloya Kaydet"}
            </button>
          </div>
        )}
      </div>

      {/* Güvenlik Ayarları */}
      <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs md:col-span-2">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-tight text-purple-950">Güvenlik Ayarları</h3>
          <button
            onClick={() => setIsEditingPassword(!isEditingPassword)}
            className="text-purple-700 hover:text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            {isEditingPassword ? <><X className="w-3.5 h-3.5" /> İptal</> : <><Edit3 className="w-3.5 h-3.5" /> Şifre Değiştir</>}
          </button>
        </div>

        {!isEditingPassword ? (
          <p className="text-xs text-slate-500 font-semibold">Hesap şifrenizi güncellemek için bu paneli kullanabilirsiniz.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="w-full space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Yeni Şifre</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#FAF6F8] border border-purple-100 rounded-xl py-2.5 px-3.5 text-xs font-bold"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={() => handleSave("password")}
              disabled={saveLoading}
              className="w-full md:w-48 bg-purple-700 hover:bg-purple-800 text-white font-black text-[11px] py-3 rounded-xl uppercase tracking-wider h-10 disabled:opacity-50"
            >
              {saveLoading ? "Değişiyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}