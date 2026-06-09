"use client";

import { AlertTriangle } from "lucide-react";
import { Appointment } from "@/type/profile";

interface AppointmentsTabProps {
  appointments: Appointment[];
}

export default function AppointmentsTab({ appointments }: AppointmentsTabProps) {
  return (
    <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-black uppercase tracking-tight text-purple-950 border-b border-slate-100 pb-3">
        Randevu Geçmişim
      </h3>
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold py-4 text-center">
            Henüz kayıtlı bir randevunuz bulunmamaktadır.
          </p>
        ) : (
          appointments.map((ap) => (
            <div key={ap.id} className="border border-purple-100 rounded-xl p-4 flex flex-col bg-[#FAF6F8]/50 gap-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-purple-950 text-white px-1.5 py-0.5 rounded-xs">
                      ID: {ap.id}
                    </span>
                    <h4 className="text-xs font-black text-purple-950">
                      {ap.salons?.salon_name || "Bilinmeyen Salon"}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    📅 {ap.appointment_date} - 🕒 {ap.appointment_time?.substring(0, 5)}
                  </p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none pt-2 md:pt-0">
                  <span className="text-xs font-black text-purple-950">{ap.total_price} TL</span>
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      ap.status?.toLowerCase() === "iptal edildi" || ap.status?.toLowerCase() === "cancelled"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : ap.status?.toLowerCase() === "tamamlandı" || ap.status?.toLowerCase() === "completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {ap.status === "completed" ? "Tamamlandı" : ap.status === "pending" ? "Beklemede" : ap.status === "cancelled" ? "İptal Edildi" : ap.status}
                  </span>
                </div>
              </div>
              {ap.cancel_reason && (
                <div className="flex gap-2 items-start bg-red-50/40 border border-red-100 rounded-lg p-2.5 text-[11px] text-red-900 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-[10px] uppercase block tracking-wider text-red-800">İptal Nedeni</span>
                    {ap.cancel_reason}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}