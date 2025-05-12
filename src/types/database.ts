
export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  image_url: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
  timestamp: string;
}

export interface Order {
  id: string;
  cart_items: CartItem[];
  total_price: number;
  payment_status: "pending" | "completed" | "failed";
  created_at: string;
}
