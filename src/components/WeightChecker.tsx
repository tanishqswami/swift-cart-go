import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { fetchLatestWeight } from '@/services/thingspeakService';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WeightCheckerProps {
  onWeightVerified: (isVerified: boolean) => void;
}

const WeightChecker: React.FC<WeightCheckerProps> = ({ onWeightVerified }) => {
  const { cartItems } = useCart();
  const [sensorWeight, setSensorWeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate expected weight from cart items
  const calculateExpectedWeight = (): number => {
    const total = cartItems.reduce((total, item) => {
      return total + (item.product?.weight || 0) * item.quantity;
    }, 0);
    console.log('Cart items:', cartItems.map(item => ({
      name: item.product?.name,
      weight: item.product?.weight,
      quantity: item.quantity
    })));
    console.log('Total expected weight:', total);
    return total;
  };

  // Check if weights match within tolerance
  const verifyWeight = (actual: number, expected: number): boolean => {
    // For weights less than 150g, use a fixed tolerance of 10g
    const tolerance = expected <= 150 ? 10 : expected * 0.05;
    const difference = Math.abs(actual - expected);
    console.log('Weight verification:', {
      actual,
      expected,
      tolerance,
      difference,
      isVerified: difference <= tolerance
    });
    return difference <= tolerance;
  };

  // Fetch weight from ThingSpeak
  const fetchWeight = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const weight = await fetchLatestWeight();
      setSensorWeight(weight);
    } catch (err) {
      setError('Failed to fetch weight data');
      toast.error('Failed to fetch weight data from sensor');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchWeight();
    const interval = setInterval(fetchWeight, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate verification status
  const expectedWeight = calculateExpectedWeight();
  const isVerified = sensorWeight !== null && verifyWeight(sensorWeight, expectedWeight);

  // Update parent component about verification status
  useEffect(() => {
    onWeightVerified(isVerified);
  }, [isVerified, onWeightVerified]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weight Verification</h2>
      
      <div className="space-y-4">
        {/* Expected Weight */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Expected Weight:</span>
          <span className="font-medium">{expectedWeight.toFixed(2)} g</span>
        </div>

        {/* Sensor Weight */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Sensor Weight:</span>
          <span className="font-medium">
            {isLoading ? (
              <span className="text-blue-500">Loading...</span>
            ) : error ? (
              <span className="text-red-500">Error</span>
            ) : (
              `${sensorWeight?.toFixed(2)} g`
            )}
          </span>
        </div>

        {/* Verification Status */}
        <div className="mt-4 p-3 rounded-md bg-gray-50">
          <div className="flex items-center justify-center space-x-2">
            {isVerified ? (
              <>
                <CheckCircle className="text-green-500" size={24} />
                <span className="text-green-600 font-medium">Weight Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-500" size={24} />
                <span className="text-red-600 font-medium">
                  Weight Mismatch – Please check basket
                </span>
              </>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchWeight}
          disabled={isLoading}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Weight'}
        </button>
      </div>
    </div>
  );
};

export default WeightChecker; 