
import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout?: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { getTotalPrice, getTotalItems } = useCart();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-gray-800 mb-4">Cart Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Items ({totalItems})</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatCurrency(totalPrice * 0.1)}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-3 mb-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totalPrice * 1.1)}</span>
        </div>
      </div>
      
      {onCheckout && (
        <Button 
          onClick={onCheckout}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={totalItems === 0}
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
