import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

const ProductSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchQuery.length >= 2) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">
                    Location: {product.location || 'Not specified'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch; 