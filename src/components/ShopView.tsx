import React, { useState, useMemo } from 'react';
import { Leaf, Star, ShoppingBag, Check, SlidersHorizontal, ChevronDown, CheckSquare, Square, RefreshCw, Loader2, Sparkles, User as UserIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

/**
 * ==============================================================================
 * SHOP CATALOG & FILTERING API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * - Server side filtering & pagination:
 *   GET /api/products?category=${categoryFilter}&maxPrice=${maxPrice}&sort=${sortBy}&page=${currentPage}&limit=12
 */

export const ShopView: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    productsError,
    refetchProducts,
    navigateToProduct,
    addToCart,
    categoryFilter,
    setCategoryFilter,
    openQuickView,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useShop();

  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(['USDA Organic']);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Dynamically compute categories & counts from loaded API products
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const categoryList = [
      { name: 'All Products', count: products.length },
      ...Object.keys(counts).map(cat => ({
        name: cat,
        count: counts[cat]
      }))
    ];
    return categoryList;
  }, [products]);

  const certifications = [
    'USDA Organic',
    'Non-GMO Verified',
    'Gluten-Free',
    'Fair Trade'
  ];

  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // ==============================================================================
  // 🔗 [API: FILTER LOGIC OVER LOADED BACKEND PRODUCTS]
  // ==============================================================================
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (categoryFilter !== 'All Products' && p.category !== categoryFilter) {
        return false;
      }
      // Price filter
      if (p.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured
    });
  }, [products, categoryFilter, maxPrice, sortBy]);

  return (
    <div className="w-full bg-[#fbfbf9] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 sm:pb-8 border-b border-[#e5e8e1] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e7d32] mb-1">
              <Leaf className="w-3.5 h-3.5" />
              <span>Certified Organic Goods</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#153e26]">
              Shop All Organic
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm">
            <span className="text-[#647866] text-xs">
              Showing <span className="font-semibold text-[#153e26]">{filteredProducts.length}</span> results
            </span>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-3.5 py-2 bg-white border border-[#d2d8ce] text-[#153e26] font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {maxPrice < 60 ? `(≤$${maxPrice})` : ''}</span>
              </button>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-[#d2d8ce] text-[#153e26] font-medium py-2 pl-3 sm:pl-4 pr-8 rounded-lg text-xs focus:outline-none focus:border-[#153e26] cursor-pointer min-h-[40px]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name">Alphabetical</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Category Scroll Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-3 no-scrollbar -mx-4 px-4 border-b border-[#ecefe7]">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setCategoryFilter(cat.name);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                categoryFilter === cat.name
                  ? 'bg-[#153e26] text-white shadow-sm'
                  : 'bg-white text-[#4e6050] border border-[#d8ded4] hover:bg-[#f4f6f0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Main Grid: Sidebar + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 sm:pt-8">
          {/* Left Sidebar Filter (Responsive Desktop + Mobile Collapsible) */}
          <aside className={`lg:col-span-3 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories filter */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e8e1]">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#153e26] mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setCategoryFilter(cat.name);
                      setCurrentPage(1);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer text-left min-h-[36px] ${
                      categoryFilter === cat.name
                        ? 'bg-[#e8efe9] text-[#153e26] font-bold'
                        : 'text-[#4e6050] hover:bg-[#f4f6f2]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[#839684] text-[11px]">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e8e1]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#153e26]">
                  Filter by Price
                </h3>
                <span className="text-xs font-bold text-[#153e26]">
                  Up to ${maxPrice}
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#153e26] cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-[#637564] mt-2 font-medium">
                <span>$0</span>
                <span>$60+</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e5e8e1]">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#153e26] mb-3">
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map((cert) => {
                  const isChecked = selectedCertifications.includes(cert);
                  return (
                    <button
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className="w-full flex items-center gap-2.5 text-xs text-[#3a4d3c] text-left hover:text-[#153e26] cursor-pointer py-1.5"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#153e26] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9fb0a1] shrink-0" />
                      )}
                      <span className={isChecked ? 'font-semibold text-[#153e26]' : ''}>
                        {cert}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* User Access Banner */}
            {!currentUser && (
              <div className="bg-[#153e26] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-[#235835]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#a3e635] shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">Sign In to Track Orders & Unlock Member Pricing</h4>
                    <p className="text-[11px] sm:text-xs text-[#c5ddcb]">Save delivery addresses, track packages live, and earn harvest points.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#a3e635] hover:bg-[#92dc22] text-[#153e26] font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap border border-white/20"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#e5e8e1] p-4 animate-pulse space-y-4">
                    <div className="w-full aspect-[4/3] bg-[#f0f2eb] rounded-xl" />
                    <div className="h-4 bg-[#e8ece3] rounded w-3/4" />
                    <div className="h-3 bg-[#e8ece3] rounded w-1/2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-[#e8ece3] rounded w-1/4" />
                      <div className="h-8 bg-[#e8ece3] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#e5e8e1] space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#f4f6f0] mx-auto flex items-center justify-center text-[#153e26]">
                  <Leaf className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#153e26]">No Products in Backend Database</h3>
                <p className="text-xs sm:text-sm text-[#627363] max-w-md mx-auto">
                  Products are fetched live from <code className="bg-[#f0f2ea] px-2 py-0.5 rounded text-[#153e26] font-mono text-xs">GET /api/products</code>. When you add items in your backend server (or start <code className="bg-[#f0f2ea] px-2 py-0.5 rounded text-[#153e26] font-mono text-xs">http://127.0.0.1:8000</code>), they will instantly render here.
                </p>
                {productsError && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-lg max-w-sm mx-auto">
                    {productsError}
                  </p>
                )}
                <button
                  onClick={() => refetchProducts()}
                  className="px-6 py-2.5 bg-[#153e26] hover:bg-[#205234] text-white rounded-xl text-xs font-semibold cursor-pointer min-h-[40px] inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Products from API</span>
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#e5e8e1] space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#f4f6f0] mx-auto flex items-center justify-center text-[#153e26]">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#153e26]">No products match filter</h3>
                <p className="text-xs sm:text-sm text-[#627363]">Try adjusting your price filter or category selection.</p>
                <button
                  onClick={() => {
                    setCategoryFilter('All Products');
                    setMaxPrice(100);
                  }}
                  className="px-5 py-2.5 bg-[#153e26] text-white rounded-lg text-xs font-semibold cursor-pointer min-h-[40px]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigateToProduct(product.id)}
                    className="group bg-white rounded-2xl border border-[#e5e8e1] overflow-hidden hover:shadow-xl hover:border-[#b8cdbc] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Top Badges & Image */}
                    <div className="relative pt-3 px-3">
                      <div className="flex items-center justify-between z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">
                          <Leaf className="w-2.5 h-2.5" />
                          <span>{product.badge || 'Organic'}</span>
                        </span>
                        {product.isSale && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#fbeae8] text-[#c62828]">
                            Sale
                          </span>
                        )}
                      </div>

                      <div className="w-full aspect-[4/3] mt-2 overflow-hidden rounded-xl bg-[#f4f5f0] flex items-center justify-center relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        {/* Stars */}
                        <div className="flex items-center gap-1 text-[#f59e0b] text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                          <span className="text-[#64748b] text-[11px] ml-1 font-medium">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-serif text-[17px] font-bold text-[#153e26] line-clamp-1 group-hover:text-[#2d6a4f] transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#637564] line-clamp-2 leading-relaxed">
                          {product.subtitle || product.description}
                        </p>
                      </div>

                      {/* Price & Add to Cart button */}
                      <div className="pt-4 flex items-center justify-between mt-auto">
                        <div>
                          <div className="text-base font-bold text-[#153e26]">
                            ${product.price.toFixed(2)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            addedItem === product.id
                              ? 'bg-green-700 text-white'
                              : 'bg-[#153e26] hover:bg-[#205234] text-white shadow-sm'
                          }`}
                        >
                          {addedItem === product.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3.5 py-2 rounded-lg border border-[#d2d8ce] text-xs font-medium text-[#4e6050] hover:bg-white disabled:opacity-40 cursor-pointer min-h-[38px]"
              >
                Previous
              </button>

              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                    currentPage === num
                      ? 'bg-[#153e26] text-white'
                      : 'border border-[#d2d8ce] bg-white text-[#4e6050] hover:bg-[#f4f6f0]'
                  }`}
                >
                  {num}
                </button>
              ))}

              <span className="text-gray-400 px-1">...</span>

              <button
                onClick={() => setCurrentPage(8)}
                className="w-9 h-9 rounded-lg text-xs font-semibold border border-[#d2d8ce] bg-white text-[#4e6050] hover:bg-[#f4f6f0] flex items-center justify-center cursor-pointer"
              >
                8
              </button>

              <button
                disabled={currentPage === 8}
                onClick={() => setCurrentPage(p => Math.min(8, p + 1))}
                className="px-3.5 py-2 rounded-lg border border-[#d2d8ce] text-xs font-medium text-[#4e6050] hover:bg-white disabled:opacity-40 cursor-pointer min-h-[38px]"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
