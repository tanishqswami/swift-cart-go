
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartSummary from "@/components/CartSummary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  // This is a mock implementation for now
  // Will be replaced with Stripe integration
  const handlePayment = async () => {
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
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <div className="flex items-center">
                        <img
                          src={item.product?.image_url}
                          alt={item.product?.name}
                          className="h-10 w-10 object-cover rounded mr-3"
                        />
                        <span>{item.product?.name} × {item.quantity}</span>
                      </div>
                      <span className="font-medium">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold mb-4">Payment Method</h2>
              <p className="text-gray-600 mb-4">
                This is a demo checkout. In a real implementation, 
                Stripe would be integrated here.
              </p>
              
              <Button
                onClick={handlePayment}
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={cartItems.length === 0 || processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
          
          <div className="md:w-80">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
