import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/database";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
          <p className="text-xs text-gray-500">#{product.barcode}</p>
        </div>
        {product.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{product.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
