"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

import BookingSummary from "@/sections/salons/[id]/booking-summary";
import SalonGallery from "@/sections/salons/[id]/salon-gallery";
import SalonSummary from "@/sections/salons/[id]/salon-summary";
import ServiceSelection from "@/sections/salons/[id]/service-selection";
import EmployeeSelection from "@/sections/salons/[id]/employee-selection";
import DateTimeSelection from "@/sections/salons/[id]/date-time-selection";
import { AuthModal,SuccessModal } from "@/components/SalonModal";
import { EmployeeData } from "@/type/salon";
import { SalonData } from "@/type/salon";
import { ServiceData } from "@/type/salon";


const generateAvailableDays = () => {
  const days = [];
  const turkishDays = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dayName = turkishDays[d.getDay()];
    const dateString = d.toISOString().split("T")[0];

    let label = `${d.getDate()} ${d.toLocaleString("tr-TR", { month: "long" })} ${dayName}`;
    if (i === 0) label = `Bugün`;
    if (i === 1) label = `Yarın`;

    days.push({
      value: dateString,
      dayName: dayName,
      label: label,
    });
  }
  return days;
};

const availableDays = generateAvailableDays();

export default function SalonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [salon, setSalon] = useState<SalonData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>(
    [],
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("");

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [generatedHours, setGeneratedHours] = useState<
    Array<{ time: string; label: string; isBooked: boolean }>
  >([]);

  useEffect(() => {
    async function fetchSalonData() {
      try {
        setLoading(true);
        const salonIdNumeric = parseInt(resolvedParams.id);

        if (isNaN(salonIdNumeric)) {
          throw new Error("Geçersiz Salon ID");
        }

        const { data: salonData, error: salonError } = await supabase
          .from("salons")
          .select(
            `
            id, 
            salon_id,
            salon_name, 
            cover_images, 
            opening_time,
            closing_time,
            phone,
            city,
            district,
            address,
            about
          `,
          )
          .eq("id", salonIdNumeric)
          .single();

        if (salonError) throw salonError;

        setSalon({
          id: salonData.id,
          salon_id: salonData.salon_id,
          salon_name: salonData.salon_name,
          cover_images: salonData.cover_images || [],
          opening_time: salonData.opening_time || "09:00",
          closing_time: salonData.closing_time || "19:00",
          phone: salonData.phone || null,
          city: salonData.city || "Belirtilmedi",
          district: salonData.district || "",
          address: salonData.address || null,
          about: salonData.about || "Premium kalitede hizmet sunan salonumuz.",
        });

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select(
            "id, service_name, price, duration_minutes, category, image_url, is_active",
          )
          .eq("salon_id", salonData.salon_id)
          .eq("is_active", true);

        if (servicesError)
          console.error("Hizmetler çekilemedi:", servicesError);

        if (servicesData) {
          const formattedServices = servicesData.map((s) => ({
            ...s,
            id: Number(s.id),
          }));
          setServices(formattedServices);
        }

        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select("id, full_name, is_available, role, avatar_url")
          .eq("salon_id", salonData.id)
          .eq("is_available", true);

        if (employeesError)
          console.error("Çalışanlar çekilemedi:", employeesError);

        if (employeesData) {
          const formattedEmployees = employeesData.map((e) => ({
            ...e,
            id: Number(e.id),
          }));
          setAllEmployees(formattedEmployees);
          setFilteredEmployees(formattedEmployees);
        }

        const savedService = searchParams.get("service_id");
        const savedEmployee = searchParams.get("employee_id");
        const savedDay = searchParams.get("day");
        const savedHour = searchParams.get("hour");

        if (savedService) {
          setSelectedServiceId(Number(savedService));
          setShowTimeSlots(true);
        }
        if (savedEmployee) setSelectedEmployeeId(Number(savedEmployee));
        if (savedDay) setSelectedDay(savedDay);
        if (savedHour) setSelectedHour(savedHour);
      } catch (err: any) {
        console.error("Veri yükleme hatası:", err);
        setError("Salon profili yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    }

    if (resolvedParams.id) {
      fetchSalonData();
    }
  }, [resolvedParams.id, searchParams]);

  useEffect(() => {
    async function filterEmployeesByService() {
      if (!selectedServiceId) {
        setFilteredEmployees(allEmployees);
        return;
      }

      try {
        const targetServiceId = Number(selectedServiceId);

        const { data: mappingData, error: mappingError } = await supabase
          .from("employee_services")
          .select("employee_id")
          .eq("service_id", targetServiceId);

        if (mappingError) throw mappingError;

        if (mappingData && mappingData.length > 0) {
          const allowedIds = mappingData.map((item) =>
            Number(item.employee_id),
          );
          const filtered = allEmployees.filter((emp) =>
            allowedIds.includes(Number(emp.id)),
          );
          setFilteredEmployees(filtered);

          if (
            selectedEmployeeId &&
            !allowedIds.includes(Number(selectedEmployeeId))
          ) {
            setSelectedEmployeeId(null);
          }
        } else {
          setFilteredEmployees([]);
          setSelectedEmployeeId(null);
        }
      } catch (err) {
        console.error("Çalışan filtreleme hatası:", err);
      }
    }

    if (allEmployees.length > 0) {
      filterEmployeesByService();
    }
  }, [selectedServiceId, allEmployees]);

  useEffect(() => {
    async function generateAvailableSlots() {
      if (!selectedEmployeeId || !selectedDay || !salon || !selectedServiceId) {
        setGeneratedHours([]);
        return;
      }

      try {
        setSlotsLoading(true);

        const chosenService = services.find((s) => s.id === selectedServiceId);
        const duration = chosenService ? chosenService.duration_minutes : 30;

        const currentDayConfig = availableDays.find(
          (d) => d.value === selectedDay,
        );
        const currentDayName = currentDayConfig?.dayName;

        const { data: scheduleData, error: scheduleError } = await supabase
          .from("employee_schedules")
          .select("schedule")
          .eq("employee_id", selectedEmployeeId)
          .maybeSingle();

        if (scheduleError) throw scheduleError;

        let startTime = salon.opening_time;
        let endTime = salon.closing_time;

        if (scheduleData && scheduleData.schedule) {
          let todaySchedule = null;

          if (Array.isArray(scheduleData.schedule)) {
            todaySchedule = scheduleData.schedule.find(
              (item: any) =>
                item.day === currentDayName || item.day_name === currentDayName,
            );
          } else if (scheduleData.schedule[currentDayName || ""]) {
            todaySchedule = scheduleData.schedule[currentDayName || ""];
          }

          if (todaySchedule) {
            if (todaySchedule.is_working === false) {
              setGeneratedHours([]);
              return;
            }
            startTime =
              todaySchedule.start_time ||
              todaySchedule.start ||
              salon.opening_time;
            endTime =
              todaySchedule.end_time || todaySchedule.end || salon.closing_time;
          }
        }

        const { data: appointmentsData, error: appointmentsError } =
          await supabase
            .from("appointments")
            .select("appointment_time")
            .eq("employee_id", selectedEmployeeId)
            .eq("appointment_date", selectedDay)
            .in("status", ["beklemede", "onaylandi"]);

        if (appointmentsError) throw appointmentsError;

        const bookedHours = appointmentsData
          ? appointmentsData.map((a) => a.appointment_time)
          : [];

        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);

        const startTotalMinutes = startH * 60 + startM;
        const endTotalMinutes = endH * 60 + endM;

        const slots = [];

        for (
          let mins = startTotalMinutes;
          mins + duration <= endTotalMinutes;
          mins += duration
        ) {
          const currentHour = Math.floor(mins / 60);
          const currentMin = mins % 60;

          const currentHourStr =
            currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
          const currentMinStr =
            currentMin < 10 ? `0${currentMin}` : `${currentMin}`;

          const fullTimeValue = `${currentHourStr}:${currentMinStr}:00`;
          const labelValue = `${currentHourStr}:${currentMinStr}`;

          const isBooked = bookedHours.some((bTime) =>
            bTime.startsWith(`${currentHourStr}:${currentMinStr}`),
          );

          slots.push({
            time: fullTimeValue,
            label: labelValue,
            isBooked: isBooked,
          });
        }

        setGeneratedHours(slots);

        if (
          selectedHour &&
          !slots.some((s) => s.time === selectedHour && !s.isBooked)
        ) {
          setSelectedHour("");
        }
      } catch (err) {
        console.error("Saat slotları hesaplanırken hata oluştu:", err);
      } finally {
        setSlotsLoading(false);
      }
    }

    generateAvailableSlots();
  }, [
    selectedEmployeeId,
    selectedDay,
    salon,
    selectedServiceId,
    services,
    selectedHour,
  ]);

  const handleLoginRedirect = () => {
    if (!salon) return;

    const currentSelectionParams = new URLSearchParams({
      service_id: selectedServiceId?.toString() || "",
      employee_id: selectedEmployeeId?.toString() || "",
      day: selectedDay,
      hour: selectedHour,
    }).toString();

    const returnUrl = `/salons/${salon.id}?${currentSelectionParams}`;
    router.push(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleFinalBooking = async () => {
    if (
      !selectedDay ||
      !selectedHour ||
      !selectedServiceId ||
      !selectedEmployeeId ||
      !salon
    ) {
      alert("Lütfen hizmet, uzman, tarih ve saat seçimini tamamlayın.");
      return;
    }

    try {
      setBookingLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setShowAuthModal(true);
        setBookingLoading(false);
        return;
      }

      const chosenService = services.find((s) => s.id === selectedServiceId);
      const finalPrice = chosenService ? chosenService.price : 0;

      const { error: insertError } = await supabase
        .from("appointments")
        .insert([
          {
            customer_id: user.id,
            salon_id: Number(salon.id),
            employee_id: Number(selectedEmployeeId),
            service_id: Number(selectedServiceId),
            appointment_date: selectedDay,
            appointment_time: selectedHour,
            total_price: finalPrice,
            status: "beklemede",
            payment_status: "odenmedi",
          },
        ]);

      if (insertError) throw insertError;

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Randevu kaydedilirken hata oluştu:", err);
      alert(
        `Randevu oluşturulamadı: ${err.message || "Bilinmeyen veritabanı hatası"}`,
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const bannerImg =
    salon?.cover_images && salon.cover_images.length > 0
      ? salon.cover_images[0]
      : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5F7] flex items-center justify-center gap-2 text-purple-950 font-medium">
        <Loader2 className="w-6 h-6 animate-spin text-purple-700" />
        Salon profili yükleniyor...
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen bg-[#FAF5F7] flex flex-col items-center justify-center p-4 text-center">
        <p className="text-red-500 font-bold mb-4">
          {error || "Salon bulunamadı."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5F7] min-h-screen pb-24">
      <SalonGallery bannerImg={bannerImg} salonName={salon.salon_name} />

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SalonSummary
            salonName={salon.salon_name}
            district={salon.district}
            city={salon.city}
            address={salon.address}
            about={salon.about}
          />

          <ServiceSelection
            services={services}
            selectedServiceId={selectedServiceId}
            onSelectService={(id) => {
              setSelectedServiceId(id);
              setShowTimeSlots(true);
            }}
          />

          <EmployeeSelection
            selectedServiceId={selectedServiceId}
            filteredEmployees={filteredEmployees}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={(id) => setSelectedEmployeeId(id)}
          />

          <DateTimeSelection
            showTimeSlots={showTimeSlots}
            selectedServiceId={selectedServiceId}
            selectedEmployeeId={selectedEmployeeId}
            availableDays={availableDays}
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setSelectedHour("");
            }}
            slotsLoading={slotsLoading}
            generatedHours={generatedHours}
            selectedHour={selectedHour}
            onSelectHour={(hour) => setSelectedHour(hour)}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingSummary
            selectedServiceId={selectedServiceId}
            selectedEmployeeId={selectedEmployeeId}
            selectedDay={selectedDay}
            selectedHour={selectedHour}
            services={services}
            filteredEmployees={filteredEmployees}
            availableDays={availableDays}
            bookingLoading={bookingLoading}
            onFinalBooking={handleFinalBooking}
          />
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onRedirect={handleLoginRedirect}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        salonName={salon.salon_name}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/profile?tab=appointments");
        }}
      />
    </div>
  );
}
