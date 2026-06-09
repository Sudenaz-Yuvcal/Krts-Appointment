export interface ServiceData {
  id: number;
  service_name: string;
  price: number;
  duration_minutes: number;
}

export interface ServiceSelectionProps {
  services: ServiceData[];
  selectedServiceId: number | null;
  onSelectService: (id: number) => void;
}

export interface SalonSummaryProps {
  salonName: string;
  district?: string | null;
  city?: string | null;
  address?: string | null;
  about?: string | null;
}
export interface SalonGalleryProps {
  bannerImg: string;
  salonName: string;
}
export interface EmployeeData {
  id: number;
  full_name: string;
  is_available: boolean;
  role?: string | null;
  avatar_url?: string | null;
}


export interface EmployeeSelectionProps {
  selectedServiceId: number | null;
  filteredEmployees: EmployeeData[];
  selectedEmployeeId: number | null;
  onSelectEmployee: (id: number) => void;
}


export interface DayConfig {
  value: string;
  dayName: string;
  label: string;
}

export interface HourSlot {
  time: string;
  label: string; 
  isBooked: boolean;
}

export interface DateTimeSelectionProps {
  showTimeSlots: boolean;
  selectedServiceId: number | null;
  selectedEmployeeId: number | null;
  availableDays: DayConfig[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
  slotsLoading: boolean;
  generatedHours: HourSlot[];
  selectedHour: string;
  onSelectHour: (hour: string) => void;
}
export interface BookingSummaryProps {
  selectedServiceId: number | null;
  selectedEmployeeId: number | null;
  selectedDay: string;
  selectedHour: string;
  services: any[];
  filteredEmployees: any[];
  availableDays: any[];
  bookingLoading: boolean;
  onFinalBooking: () => void;
}
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface SalonCardProps {
  salon: {
    id: string;
    salon_name: string;
    city: string;
    district: string;
    about: string;
    cover_images: string[];
    services?: string[];
  };
}
export interface Salon {
  id: string;
  salon_name: string;
  city: string;
  district: string;
  about: string;
  cover_images: string[];
  services?: string[];
}
export interface SalonData {
  id: number;
  salon_id: string;
  salon_name: string;
  cover_images: string[] | null;
  opening_time: string;
  closing_time: string;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  about?: string | null;
}

