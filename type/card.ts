export interface CartItemType {
  product_id: number;
  price: number;
  quantity: number;
  product_name?: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}