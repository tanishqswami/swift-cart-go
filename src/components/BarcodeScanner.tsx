
import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getProductByBarcode } from "@/services/productService";
import { toast } from "sonner";

const BarcodeScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Initialize scanner instance
    const scanner = new Html5Qrcode("reader");
    setHtml5QrCode(scanner);

    // Cleanup on component unmount
    return () => {
      if (scanner && scanning) {
        scanner.stop().catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);

  const startScanning = () => {
    if (!html5QrCode) return;

    setScanning(true);
    const config = { fps: 10, qrbox: 250 };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch((err) => {
        console.error("Error starting scanner:", err);
        toast.error("Could not access camera. Please check permissions.");
        setScanning(false);
      });
  };

  const stopScanning = () => {
    if (html5QrCode && scanning) {
      html5QrCode
        .stop()
        .then(() => {
          setScanning(false);
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log("Barcode scanned:", decodedText);
    
    try {
      // Temporarily stop scanning to prevent multiple scans
      await html5QrCode?.pause();
      
      // Find product by barcode
      const product = await getProductByBarcode(decodedText);
      
      if (product) {
        addToCart(product);
        toast.success(`Added ${product.name} to your cart`);
        
        // Brief pause to prevent duplicate scans
        setTimeout(() => {
          html5QrCode?.resume();
        }, 2000);
      } else {
        toast.error("Product not found");
        setTimeout(() => {
          html5QrCode?.resume();
        }, 1000);
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      toast.error("Failed to process scan");
      html5QrCode?.resume();
    }
  };

  const onScanFailure = (error: string) => {
    // No need to show errors for normal scanning process
    // Only log to console for debugging
    console.debug("Scan error:", error);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div id="reader" className="w-full max-w-sm h-64 mb-4"></div>
      
      <div className="w-full flex justify-center mt-4">
        {!scanning ? (
          <Button 
            onClick={startScanning}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start Scanning
          </Button>
        ) : (
          <Button 
            onClick={stopScanning}
            variant="destructive"
          >
            Stop Scanning
          </Button>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">Point your camera at a product barcode to scan</p>
        <p className="text-sm text-gray-500 mt-2">
          For testing, use these barcodes: 8964000001, 8964000002, etc.
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
