"use client";

import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { BookingSummaryProps } from "@/type/salon";


export default function BookingSummary({
  selectedServiceId,
  selectedEmployeeId,
  selectedDay,
  selectedHour,
  services,
  filteredEmployees,
  availableDays,
  bookingLoading,
  onFinalBooking,
}: BookingSummaryProps) {
  const chosenService = services.find((s) => s.id === selectedServiceId);
  const chosenEmployee = filteredEmployees.find(
    (e) => e.id === selectedEmployeeId,
  );
  const chosenDayLabel =
    availableDays
      .find((d) => d.value === selectedDay)
      ?.label.replace("Bugün", "")
      .replace("Yarın", "")
      .trim() || selectedDay;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 sticky top-6 space-y-4">
      <h3 className="text-sm font-bold text-purple-950 pb-3 border-b border-gray-100 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-purple-600" />
        Randevu Özeti
      </h3>

      {selectedServiceId ? (
        <div className="space-y-3.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Hizmet:</span>
            <span className="font-bold text-purple-950 text-right">
              {chosenService?.service_name}
            </span>
          </div>

          {selectedEmployeeId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Uzman:</span>
              <span className="font-bold text-purple-950">
                {chosenEmployee?.full_name}
              </span>
            </div>
          )}

          {selectedDay && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tarih:</span>
              <span className="font-bold text-purple-950">
                {chosenDayLabel}
              </span>
            </div>
          )}

          {selectedHour && (
            <div className="flex justify-between">
              <span className="text-gray-500">Saat:</span>
              <span className="font-bold text-purple-950">
                {selectedHour.substring(0, 5)}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
            <span className="text-sm font-bold text-purple-950">
              Toplam Tutar:
            </span>
            <span className="text-base font-black text-purple-700">
              {chosenService?.price} TL
            </span>
          </div>

          <button
            onClick={onFinalBooking}
            disabled={bookingLoading || !selectedHour}
            className="w-full mt-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
          >
            {bookingLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Randevu Alınıyor...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Randevuyu Onayla
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 space-y-2">
          <Clock className="w-8 h-8 mx-auto text-gray-300 stroke-[1.5]" />
          <p className="text-[11px] leading-relaxed px-4">
            Lütfen sol taraftan hizmet, uzman ve saat seçimi yapın.
          </p>
        </div>
      )}
    </div>
  );
}
