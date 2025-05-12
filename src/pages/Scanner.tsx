
import React from "react";
import BarcodeScanner from "@/components/BarcodeScanner";

const Scanner: React.FC = () => {
  return (
    <div className="container mx-auto pb-20">
      <h1 className="text-2xl font-bold p-4">Scan Products</h1>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <BarcodeScanner />
        </div>
      </div>
    </div>
  );
};

export default Scanner;
