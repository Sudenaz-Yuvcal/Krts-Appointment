"use client";
import { Loader2 } from "lucide-react";
import { DateTimeSelectionProps } from "@/type/salon";

export default function DateTimeSelection({
  showTimeSlots,
  selectedServiceId,
  selectedEmployeeId,
  availableDays,
  selectedDay,
  onSelectDay,
  slotsLoading,
  generatedHours,
  selectedHour,
  onSelectHour,
}: DateTimeSelectionProps) {
  if (!showTimeSlots || !selectedServiceId || !selectedEmployeeId) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 space-y-6">
      <div>
        <h2 className="text-sm font-bold text-purple-950 mb-3 flex items-center gap-2">
          <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
            3
          </span>
          Tarih Seçin
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {availableDays.map((day) => (
            <button
              key={day.value}
              onClick={() => onSelectDay(day.value)}
              className={`px-4 py-2.5 rounded-xl border text-xs whitespace-nowrap font-medium transition-all cursor-pointer shrink-0 ${
                selectedDay === day.value
                  ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                  : "bg-gray-50/50 border-gray-100 text-gray-700 hover:border-purple-200"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {selectedDay && (
        <div>
          <h2 className="text-sm font-bold text-purple-950 mb-3 flex items-center gap-2">
            <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
              4
            </span>
            Saat Seçin
          </h2>

          {slotsLoading ? (
            <div className="flex items-center gap-2 text-xs text-purple-700 font-medium py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Saat slotları
              hesaplanıyor...
            </div>
          ) : generatedHours.length === 0 ? (
            <p className="text-xs text-red-500 italic bg-red-50 border border-red-100 rounded-xl p-3">
              Seçilen uzmanın bugün için çalışma saati bulunmamaktadır veya
              izinlidir. Lütfen başka bir gün seçin.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {generatedHours.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.isBooked}
                  onClick={() => onSelectHour(slot.time)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    slot.isBooked
                      ? "bg-gray-100 border-gray-100 text-gray-400 line-through cursor-not-allowed"
                      : selectedHour === slot.time
                        ? "bg-purple-950 border-purple-950 text-white shadow-xs"
                        : "bg-white border-gray-200 text-purple-950 hover:border-purple-300"
                  }`}
                >
                  {slot.label}{" "}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
