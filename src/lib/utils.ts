import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

export function standardizeWeight(weight: number): number {
  // Define weight thresholds and their standardized values
  const thresholds = [
    { max: 150, value: 100 },
    { max: 200, value: 150 },
    { max: 300, value: 250 },
    { max: 400, value: 350 },
    { max: 500, value: 450 },
    { max: 750, value: 500 },
    { max: 1000, value: 750 },
    { max: 1500, value: 1000 },
    { max: 2000, value: 1500 },
    { max: 2500, value: 2000 },
    { max: 3000, value: 2500 },
    { max: 4000, value: 3000 },
    { max: 5000, value: 4000 },
    { max: Infinity, value: 5000 }
  ];

  // Find the appropriate threshold and return the standardized value
  for (const threshold of thresholds) {
    if (weight <= threshold.max) {
      return threshold.value;
    }
  }

  // Fallback to the highest threshold value
  return thresholds[thresholds.length - 1].value;
}
