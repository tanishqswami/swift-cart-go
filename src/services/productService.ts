
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// Get product by barcode
export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching product by barcode:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch product by barcode:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch product by ID:", error);
    throw error;
  }
};
