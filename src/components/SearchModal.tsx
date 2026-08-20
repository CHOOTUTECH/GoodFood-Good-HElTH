import React, { useState, useMemo } from 'react';
import { Search, X, Leaf, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * ==============================================================================
 * LIVE SEARCH AUTOCOMPLETE API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * - Live Server Search / Algolia / ElasticSearch connect karne ke liye:
 *   GET /api/search?q=${query}
 */

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateToProduct } = useShop();
  const [query, setQuery] = useState('');

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 11: LIVE QUERY AUTOCOMPLETE]
  // ==============================================================================
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search organic oils, raw nuts, superfoods, syrup..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-[#153e26] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close"
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-gray-500">Popular Searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Avocado Oil', 'Macadamia Nuts', 'Maple Syrup', 'Amaranth', 'Matcha'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 rounded-full bg-[#f4f6f0] text-[#153e26] text-xs font-medium hover:bg-[#e8efe9] cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No organic products match "{query}". Try a different keyword.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    navigateToProduct(product.id);
                    setIsSearchOpen(false);
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-[#f8f9f6] rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#f4f6f0]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-sm font-bold text-[#153e26]">
                          {product.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#e8efe9] text-[#2e7d32] font-semibold">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">${product.price.toFixed(2)}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
