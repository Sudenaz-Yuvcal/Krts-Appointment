"use client";

import { CreditCard, Lock } from "lucide-react";
import { CheckoutFormData } from "@/type/card";

interface PaymentFormProps {
  formData: CheckoutFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PaymentForm({ formData, onChange }: PaymentFormProps) {
  return (
    <div className="border border-purple-100 rounded-3xl bg-white p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-purple-50 pb-3">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-purple-500" />
          <h2 className="text-sm md:text-base font-black tracking-widest uppercase text-[#2D0F14]">
            Kart Bilgileri
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
          <Lock className="w-3.5 h-3.5" /> 256-Bit SSL
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Kart Sahibi *
          </label>
          <div className="bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
            <input
              type="text"
              name="cardName"
              required
              value={formData.cardName}
              onChange={onChange}
              placeholder="JOHN DOE"
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full uppercase"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
            Kart Numarası *
          </label>
          <div className="flex items-center gap-2 bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
            <CreditCard className="w-4 h-4 text-purple-300" />
            <input
              type="text"
              name="cardNumber"
              required
              maxLength={16}
              value={formData.cardNumber}
              onChange={onChange}
              placeholder="0000000000000000"
              className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
              S.K.T *
            </label>
            <div className="flex items-center gap-2 bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
              <input
                type="text"
                name="cardExpiry"
                required
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={onChange}
                className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-purple-950/60 uppercase tracking-wider block">
              CVV *
            </label>
            <div className="flex items-center gap-2 bg-purple-50/40 border border-purple-100 px-3.5 py-3 rounded-xl focus-within:border-purple-400 transition-colors">
              <input
                type="password"
                name="cardCvv"
                required
                maxLength={3}
                placeholder="***"
                value={formData.cardCvv}
                onChange={onChange}
                className="bg-transparent text-sm font-bold outline-none text-[#2D0F14] placeholder-purple-300/70 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}