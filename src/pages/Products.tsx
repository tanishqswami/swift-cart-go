
import React from "react";
import ProductList from "@/components/ProductList";

const Products: React.FC = () => {
  return (
    <div className="container mx-auto pb-20">
      <h1 className="text-2xl font-bold p-4">Products</h1>
      <ProductList />
    </div>
  );
};

export default Products;
