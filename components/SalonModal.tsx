"use client";
import { Lock, CheckCircle2 } from "lucide-react";
import { ModalProps } from "@/type/salon";

export function AuthModal({ isOpen, onClose, onRedirect }: ModalProps & { onRedirect: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-50 text-center space-y-4">
        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-700">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-purple-950">Giriş Yapmanız Gerekiyor</h3>
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            Randevu oluşturma işlemini tamamlayabilmek için güvenliğiniz amacıyla üye girişi yapmalısınız. Seçimleriniz kaybolmayacaktır.
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition text-xs cursor-pointer"
          >
            Kapat
          </button>
          <button
            onClick={onRedirect}
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition text-xs cursor-pointer"
          >
            Giriş Yap / Üye Ol
          </button>
        </div>
      </div>
    </div>
  );
}

export function SuccessModal({ isOpen, onClose, salonName }: ModalProps & { salonName?: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-50 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-black text-purple-950">Randevunuz Alınmıştır!</h3>
          <p className="text-xs text-gray-600 leading-relaxed px-2">
            <span className="font-bold text-purple-900">{salonName}</span> salonundan gerçekleştirdiğiniz randevu talebi başarıyla sisteme iletilmiştir.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-800 font-medium mt-2">
            ⚠️ Randevunuz şu anda <span className="font-bold">onay bekliyor</span> durumundadır.
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition text-xs cursor-pointer"
        >
          Randevularıma Git
        </button>
      </div>
    </div>
  );
}