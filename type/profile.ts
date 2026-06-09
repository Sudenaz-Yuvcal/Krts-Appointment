export type TabType = "profile" | "appointments" | "orders" | "reviews";

export interface Appointment {
  id: number;
  customer_id: string;
  appointment_date: string;
  appointment_time: string;
  total_price: number;
  status: string; 
  cancel_reason: string | null; 
  salons: { salon_name: string } | null;
}

export interface Order {
  id: string | number;
  product_id: string | number;
  quantity: number;
  total_price: number;
  payment_intent_id: string;
  order_date: string;
  status: string;
  preparation_note: string;
  products: { product_name: string } | null;
}

export interface Review {
  id: string | number;
  type: string;
  target_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProfileMessage {
  type: "success" | "error";
  text: string;
}