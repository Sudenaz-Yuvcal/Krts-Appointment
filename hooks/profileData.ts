"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Appointment, ProfileMessage, Order, Review } from "@/type/profile";

export function useProfileData() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<ProfileMessage | null>(null);

  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchAllUserData = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const currentUserId = session.user.id;
      setUserId(currentUserId);
      setUserEmail(session.user.email || "");

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, phone, city, district, full_address")
          .eq("id", currentUserId)
          .maybeSingle();

        if (!profileError && profileData) {
          setFullName(profileData.full_name || "");
          setPhone(profileData.phone || "");
          setCity(profileData.city || "");
          setDistrict(profileData.district || "");
          setFullAddress(profileData.full_address || "");
        }

        const { data: appointmentsData, error: appError } = await supabase
          .from("appointments")
          .select(
            `id, customer_id, appointment_date, appointment_time, total_price, status, cancel_reason, salons ( salon_name )`,
          )
          .eq("customer_id", currentUserId)
          .order("created_at", { ascending: false });

        if (appointmentsData) setAppointments(appointmentsData as any);

        const { data: ordersData, error: orderError } = await supabase
          .from("product_orders")
          .select(
            `id, product_id, quantity, total_price, payment_intent_id, order_date, status, preparation_note, products ( product_name )`,
          )
          .eq("customer_id", currentUserId)
          .order("order_date", { ascending: false });

        if (ordersData) setOrders(ordersData as any);

        const { data: reviewsData, error: revError } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

        if (reviewsData) setReviews(reviewsData as Review[]);
      } catch (err) {
        console.error("Veritabanı yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserData();
  }, [router]);

  const handleUpdate = async (type: "profile" | "address" | "password") => {
    setSaveLoading(true);
    setMessage(null);

    try {
      if (type === "password") {
        if (newPassword.length < 6)
          throw new Error("Şifre en az 6 karakter olmalıdır.");

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;

        setNewPassword("");
        setMessage({
          type: "success",
          text: "Şifreniz başarıyla güncellendi.",
        });
        return true;
      } else {
        let updateData: any = {};
        if (type === "profile") {
          updateData = { full_name: fullName, phone: phone };
        } else if (type === "address") {
          updateData = {
            city: city,
            district: district,
            full_address: fullAddress,
          };
        }

        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", userId);
        if (error) throw error;

        setMessage({
          type: "success",
          text: "Bilgileriniz veritabanına başarıyla kaydedildi!",
        });
        return true;
      }
    } catch (err: any) {
      console.error("Güncelleme hatası:", err);
      setMessage({ type: "error", text: err.message || "Bir hata oluştu." });
      return false;
    } finally {
      setSaveLoading(false);
    }
  };
  return {
    loading,
    saveLoading,
    message,
    setMessage,
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
  };
}
