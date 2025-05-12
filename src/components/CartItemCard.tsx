
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CartItem as CartItemType } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface CartItemCardProps {
  item: CartItemType;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  if (!item.product) return null;

  const handleIncrement = () => {
    updateQuantity(item.product_id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product_id, item.quantity - 1);
    } else {
      removeFromCart(item.product_id);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b">
      <div className="flex items-center">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="h-16 w-16 object-cover rounded mr-3"
        />
        <div>
          <h4 className="font-medium">{item.product.name}</h4>
          <p className="text-sm text-gray-600">
            {formatCurrency(item.product.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border rounded">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
          >
            <Minus size={16} />
          </Button>
          <span className="px-3">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="ml-4 text-right">
          <p className="font-semibold">
            {formatCurrency(item.product.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
