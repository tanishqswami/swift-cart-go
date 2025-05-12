export interface Product {
  id: string;
  name: string;
  price: number;
  weight: number; // Weight in grams
  barcode: string;
  image_url?: string;
  description?: string;
  category?: string;
  stock?: number;
  location?: string; // Location in the store
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  timestamp: string;
}

export interface Order {
  id: string;
  cart_items: CartItem[];
  total_price: number;
  payment_status: "pending" | "completed" | "failed";
  created_at: string;
}
