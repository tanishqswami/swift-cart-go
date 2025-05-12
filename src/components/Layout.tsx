import React from "react";
import MobileNav from "./MobileNav";
import ProductSearch from "./ProductSearch";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="font-bold text-xl text-blue-600">Smart Trolley</h1>
            <div className="w-full md:w-96">
              <ProductSearch />
            </div>
          </div>
        </div>
      </header>
      
      <main className="mb-16">
        {children}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Layout;
