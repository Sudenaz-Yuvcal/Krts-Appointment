"use client";

import { User, Calendar, ShoppingBag, MessageSquare, ChevronRight } from "lucide-react";
import { TabType, Appointment, Order, Review } from "@/type/profile";

interface SidebarProps {
  fullName: string;
  userEmail: string;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  appointments: Appointment[];
  orders: Order[];
  reviews: Review[];
}

export default function Sidebar({
  fullName,
  userEmail,
  activeTab,
  setActiveTab,
  appointments,
  orders,
  reviews,
}: SidebarProps) {
  return (
    <div className="bg-white border border-purple-200/60 rounded-2xl p-5 shadow-xs h-fit space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-purple-950 text-white rounded-full flex items-center justify-center font-black text-sm uppercase">
          {fullName ? fullName.charAt(0) : "K"}
        </div>
        <div className="truncate">
          <h4 className="text-sm font-black truncate">{fullName || "Kullanıcı"}</h4>
          <p className="text-[10px] font-bold text-slate-400 truncate">{userEmail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "profile" ? "bg-purple-50 text-purple-950" : "hover:bg-slate-50 text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-purple-600" /> Profil Bilgilerim
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => setActiveTab("appointments")}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "appointments" ? "bg-purple-50 text-purple-950" : "hover:bg-slate-50 text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-purple-600" /> Randevularım ({appointments.length})
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "orders" ? "bg-purple-50 text-purple-950" : "hover:bg-slate-50 text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-purple-600" /> Siparişlerim ({orders.length})
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === "reviews" ? "bg-purple-50 text-purple-950" : "hover:bg-slate-50 text-slate-600"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-purple-600" /> Yorumlarım ({reviews.length})
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>
      </div>
    </div>
  );
}