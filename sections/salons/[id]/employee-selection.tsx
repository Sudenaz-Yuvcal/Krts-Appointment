"use client";
import { EmployeeSelectionProps } from "@/type/salon";

export default function EmployeeSelection({
  selectedServiceId,
  filteredEmployees,
  selectedEmployeeId,
  onSelectEmployee,
}: EmployeeSelectionProps) {
  if (!selectedServiceId) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
      <h2 className="text-sm font-bold text-purple-950 mb-4 flex items-center gap-2">
        <span className="bg-purple-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
          2
        </span>
        Uzman Seçin
      </h2>
      {filteredEmployees.length === 0 ? (
        <p className="text-xs text-red-500 italic">Bu hizmeti verebilecek uygun uzman bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredEmployees.map((emp) => {
            const isSelected = selectedEmployeeId === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/60 shadow-xs"
                    : "border-gray-100 bg-gray-50/30 hover:border-purple-200"
                }`}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mb-2 font-bold text-xs overflow-hidden">
                  {emp.avatar_url ? (
                    <img src={emp.avatar_url} alt={emp.full_name} className="w-full h-full object-cover" />
                  ) : (
                    emp.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  )}
                </div>
                <p className="text-xs font-bold text-purple-950 line-clamp-1">{emp.full_name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{emp.role || "Uzman"}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}