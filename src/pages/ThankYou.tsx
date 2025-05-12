
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const ThankYou: React.FC = () => {
  const navigate = useNavigate();

  // Generate a random order number
  const orderNumber = React.useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        
        <p className="text-xl mb-2">Your order has been placed successfully.</p>
        <p className="text-gray-600 mb-6">Order #{orderNumber}</p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/products")}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Continue Shopping
          </Button>
        </div>
        
        <p className="mt-10 text-sm text-gray-500">
          A receipt has been sent to your device.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
