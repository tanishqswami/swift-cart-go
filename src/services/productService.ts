
import { Product } from "@/types/database";

// Mock product data until connected to Supabase
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    price: 1.99,
    barcode: "8964000001",
    image_url: "https://images.unsplash.com/photo-1501286353178-1ec871a371b8?auto=format&fit=crop&w=300",
  },
  {
    id: "2",
    name: "Whole Milk",
    price: 3.49,
    barcode: "8964000002",
    image_url: "https://images.unsplash.com/photo-1635435971018-fa9fde7e863b?auto=format&fit=crop&w=300",
  },
  {
    id: "3",
    name: "Chocolate Bar",
    price: 2.29,
    barcode: "8964000003",
    image_url: "https://images.unsplash.com/photo-1575377427642-087fc49d0891?auto=format&fit=crop&w=300",
  },
  {
    id: "4",
    name: "Avocado",
    price: 1.79,
    barcode: "8964000004",
    image_url: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=300",
  },
  {
    id: "5",
    name: "Fresh Bread",
    price: 2.99,
    barcode: "8964000005",
    image_url: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=300",
  },
  {
    id: "6",
    name: "Coffee Beans",
    price: 8.99,
    barcode: "8964000006",
    image_url: "https://images.unsplash.com/photo-1559525839-8f275eef9567?auto=format&fit=crop&w=300",
  }
];

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  // This will be replaced with actual Supabase fetch
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

// Get product by barcode
export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  // This will be replaced with actual Supabase fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.barcode === barcode);
      resolve(product || null);
    }, 300);
  });
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  // This will be replaced with actual Supabase fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      resolve(product || null);
    }, 300);
  });
};
