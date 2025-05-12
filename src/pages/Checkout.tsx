import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartSummary from "@/components/CartSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import WeightChecker from '@/components/WeightChecker';

const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [isWeightVerified, setIsWeightVerified] = useState(false);

  // This is a mock implementation for now
  // Will be replaced with Stripe integration
  const handlePayment = async () => {
    if (!isWeightVerified) {
      toast.error('Please verify the weight before proceeding with payment');
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);
      
      // Simulating payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in database
      const { error } = await supabase
        .from('orders')
        .insert({
          cart_items: JSON.stringify(cartItems),
          total_price: getTotalPrice() * 1.1, // Including tax
          payment_status: 'completed'
        });
      
      if (error) throw error;
      
      // After successful payment
      await clearCart();
      navigate("/thank-you");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <WeightChecker onWeightVerified={setIsWeightVerified} />
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handlePayment}
            disabled={!isWeightVerified || cartItems.length === 0 || processing}
            className="w-full md:w-auto px-8 py-2"
          >
            {processing ? "Processing..." : isWeightVerified ? "Proceed to Payment" : "Weight Verification Required"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
