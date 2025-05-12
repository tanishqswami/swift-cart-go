
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShoppingCart, Barcode, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const MobileNav: React.FC = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navItems = [
    {
      name: "Products",
      path: "/products",
      icon: <Package size={24} />,
    },
    {
      name: "Scanner",
      path: "/scanner",
      icon: <Barcode size={24} />,
    },
    {
      name: "Cart",
      path: "/cart",
      icon: <ShoppingCart size={24} />,
      badge: totalItems > 0 ? totalItems : undefined,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              location.pathname === item.path
                ? "text-blue-500"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;
