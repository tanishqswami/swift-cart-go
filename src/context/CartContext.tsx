import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types/database";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("smartTrolleyCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("smartTrolleyCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product) => {
    try {
      const existingItem = cartItems.find((item) => item.product_id === product.id);
      
      if (existingItem) {
        // Update quantity in database and local state
        const updatedQuantity = existingItem.quantity + 1;
        
        // Update in database
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: updatedQuantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
        
        // Update local state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: updatedQuantity }
              : item
          )
        );
        
        toast.success(`Added another ${product.name} to cart`);
      } else {
        // Create new cart item
        const newItem: CartItem = {
          id: uuidv4(),
          product_id: product.id,
          product: product,
          quantity: 1,
          timestamp: new Date().toISOString(),
        };
        
        // Insert into database
        const { error } = await supabase
          .from('cart_items')
          .insert({
            id: newItem.id,
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            timestamp: newItem.timestamp
          });
          
        if (error) throw error;
        
        // Update local state
        setCartItems((prevItems) => [...prevItems, newItem]);
        toast.success(`Added ${product.name} to cart`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const itemToRemove = cartItems.find(item => item.product_id === productId);
      
      if (!itemToRemove) return;
      
      // Remove from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemToRemove.id);
        
      if (error) throw error;
      
      // Remove from local state
      setCartItems((prevItems) => {
        const filtered = prevItems.filter((item) => item.product_id !== productId);
        if (itemToRemove?.product) {
          toast.info(`Removed ${itemToRemove.product.name} from cart`);
        }
        return filtered;
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      const itemToUpdate = cartItems.find(item => item.product_id === productId);
      
      if (!itemToUpdate) return;
      
      // Update in database
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemToUpdate.id);
        
      if (error) throw error;
      
      // Update in local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error("Failed to update item quantity");
    }
  };

  const clearCart = async () => {
    try {
      // Get all cart item IDs
      const itemIds = cartItems.map(item => item.id);
      
      if (itemIds.length === 0) return;
      
      // Delete all cart items from database
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .in('id', itemIds);
        
      if (error) throw error;
      
      // Clear local state
      setCartItems([]);
      toast.info("Cart has been cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
