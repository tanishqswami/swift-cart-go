
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/CartItemCard";
import CartSummary from "@/components/CartSummary";
import { Button } from "@/components/ui/button";

const Cart: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button 
                  onClick={() => navigate("/products")}
                  variant="outline"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Button 
                    variant="ghost" 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
                <div className="space-y-1">
                  {cartItems.map((item) => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="md:w-80">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
