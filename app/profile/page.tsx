"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useProfileData } from "@/hooks/profileData";
import { TabType } from "@/type/profile";

import Sidebar from "@/components/Sidebar";
import ProfileTab from "@/components/ProfileTab";
import AppointmentsTab from "@/components/Appointments";
import OrdersTab from "@/components/OrderTab";
import ReviewsTab from "@/components/RewievTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const {
    loading,
    saveLoading,
    message,
    userEmail,
    fullName,
    setFullName,
    phone,
    setPhone,
    city,
    setCity,
    district,
    setDistrict,
    fullAddress,
    setFullAddress,
    newPassword,
    setNewPassword,
    appointments,
    orders,
    reviews,
    handleUpdate,
  } = useProfileData();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FAF6F8]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF6F8] py-10 px-4 md:px-16 text-[#2D0F14]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sol Menü (Sidebar Component) */}
        <Sidebar
          fullName={fullName}
          userEmail={userEmail}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          appointments={appointments}
          orders={orders}
          reviews={reviews}
        />

        {/* Sağ İçerik Alanı */}
        <div className="lg:col-span-3 space-y-6">
          {/* Bildirim Mesajları */}
          {message && (
            <div
              className={`flex items-center gap-3 border text-xs font-bold p-4 rounded-xl ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Aktif Sekme Yönetimi */}
          {activeTab === "profile" && (
            <ProfileTab
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              userEmail={userEmail}
              city={city}
              setCity={setCity}
              district={district}
              setDistrict={setDistrict}
              fullAddress={fullAddress}
              setFullAddress={setFullAddress}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              saveLoading={saveLoading}
              onUpdate={handleUpdate}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsTab appointments={appointments} />
          )}

          {activeTab === "orders" && <OrdersTab orders={orders} />}

          {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
        </div>
      </div>
    </div>
  );
}
