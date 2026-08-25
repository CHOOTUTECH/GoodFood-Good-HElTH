import React, { useState, useMemo } from 'react';
import { Leaf, ShieldCheck, Truck, RotateCcw, Sprout, HeartHandshake, Globe, ArrowRight, Star, ShoppingBag, Check, Sun, Users, Award, Calendar, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { MarketingService } from '../services/api';

// Sourced & generated organic farming imagery
import familyFarmImage from '../assets/images/family_farming_harvest_1786971161043.jpg';
import harvestBasketImage from '../assets/images/harvest_basket_fresh_1786971174622.jpg';

/**
 * ==============================================================================
 * HOME VIEW & MARKETING NEWSLETTER API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * 1. Featured Products: `products.filter(p => p.featured)` se aate hain (GET /api/products?featured=true)
 * 2. Newsletter Subscription: `MarketingService.subscribeNewsletter(newsletterEmail)` 
 *    (POST /api/newsletter/subscribe) se Mailchimp/SendGrid/backend list me save hota hai.
 */

export const HomeView: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    setCurrentView, 
    navigateToProduct, 
    addToCart, 
    setCategoryFilter, 
    setIsAboutOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useShop();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedFarmTab, setSelectedFarmTab] = useState<'harvest' | 'family' | 'soil'>('harvest');

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 4: FEATURED PRODUCTS SELECTION FROM LIVE API]
  // ==============================================================================
  const featuredProducts = useMemo(() => {
    const featured = products.filter(p => p.featured);
    return (featured.length > 0 ? featured : products).slice(0, 5);
  }, [products]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 5: NEWSLETTER SUBSCRIPTION (10% OFF PROMO)]
  // ==============================================================================
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      setIsSubscribing(true);
      /*
      // 👉 REAL API INTEGRATION:
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: newsletterEmail })
      // });
      */
      await MarketingService.subscribeNewsletter(newsletterEmail);
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    } catch (err) {
      console.error('Newsletter error:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfbf9]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f6f0] to-[#fbfbf9] pt-8 sm:pt-12 pb-14 sm:pb-20 border-b border-[#ecece6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8efe9] text-[#235835] text-xs font-semibold tracking-wider uppercase">
                <Leaf className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>Eat Healthy, Live Healthy</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#153e26] leading-[1.1] sm:leading-[1.08]">
                Pure Food.
                <br />
                Pure Life. <span className="inline-block text-[#3b824b] text-3xl sm:text-5xl">🌿</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#556756] max-w-lg leading-relaxed">
                Discover a wide range of 100% organic products for a healthier you and a better planet. Sourced directly from multi-generational family farms.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  onClick={() => setCurrentView('shop')}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#153e26] hover:bg-[#1f5736] text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </button>

                <button
                  onClick={() => {
                    setCategoryFilter('All Products');
                    setCurrentView('shop');
                  }}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-transparent border border-[#b8c2b9] text-[#1e3b26] font-semibold text-sm rounded-xl hover:bg-[#eaece5] transition-all flex items-center justify-center cursor-pointer active:scale-98"
                >
                  <span>Explore Categories</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 sm:pt-6 border-t border-[#e2e6df] grid grid-cols-3 gap-2 text-[11px] sm:text-xs font-medium text-[#4b5e4d]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#e3efe6] flex items-center justify-center text-[#153e26] text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                  <span className="truncate sm:overflow-visible">100% Organic</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#153e26] shrink-0" />
                  <span className="truncate sm:overflow-visible">Free Ship <span className="text-[10px] text-gray-500 hidden sm:inline">$49+</span></span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#153e26] shrink-0" />
                  <span className="truncate sm:overflow-visible">Secure Pay</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={harvestBasketImage}
                  alt="Freshly harvested organic food basket"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Organic Badge */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-[#153e26]/90 backdrop-blur-md text-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl flex flex-col items-center border border-white/20">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center mb-1">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635]" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#c3e8ca]">100%</span>
                  <span className="text-[11px] sm:text-xs font-semibold">ORGANIC</span>
                </div>

                {/* Bottom floating pill */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 sm:gap-3 max-w-[85%]">
                  <span className="text-lg sm:text-xl">🧺</span>
                  <div>
                    <div className="text-xs font-bold text-[#153e26]">Hand-Harvested Daily</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-500">From our grower families</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Value Pillars */}
      <section className="py-6 sm:py-10 bg-white border-b border-[#ebebe5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#f8f9f5] border border-[#eef0eb]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e8efe9] flex items-center justify-center shrink-0 text-[#153e26]">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#153e26]">100% Organic</h4>
                <p className="text-[11px] sm:text-xs text-[#637564]">Pure & Natural</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#f8f9f5] border border-[#eef0eb]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e8efe9] flex items-center justify-center shrink-0 text-[#153e26]">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#153e26]">No Chemicals</h4>
                <p className="text-[11px] sm:text-xs text-[#637564]">Safe for You</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#f8f9f5] border border-[#eef0eb]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e8efe9] flex items-center justify-center shrink-0 text-[#153e26]">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#153e26]">Free Delivery</h4>
                <p className="text-[11px] sm:text-xs text-[#637564]">Orders over $49</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#f8f9f5] border border-[#eef0eb]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e8efe9] flex items-center justify-center shrink-0 text-[#153e26]">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#153e26]">Easy Returns</h4>
                <p className="text-[11px] sm:text-xs text-[#637564]">Hassle Free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2e7d32]">
              <Leaf className="w-3.5 h-3.5" />
              <span>Our Products</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#153e26]">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-[#5d705e] max-w-md mx-auto">
              Selected by our herbalists & nutritionists from this season's finest harvest.
            </p>
          </div>

          {/* Product Cards Grid (Responsive 1-col on mobile, 2-col on sm, 5-col on desktop) */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e8ece5] p-4 animate-pulse space-y-3">
                  <div className="w-full aspect-[4/3] bg-[#f0f2eb] rounded-xl" />
                  <div className="h-4 bg-[#e8ece3] rounded w-3/4" />
                  <div className="h-3 bg-[#e8ece3] rounded w-1/2" />
                  <div className="h-8 bg-[#e8ece3] rounded w-full mt-2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e8ece5] space-y-3 max-w-lg mx-auto">
              <Leaf className="w-8 h-8 text-[#2e7d32] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#153e26]">Backend Products Ready</h3>
              <p className="text-xs text-[#5d705e]">
                Products added to your backend server (<code className="font-mono text-[11px] bg-[#f0f2ea] px-1 py-0.5 rounded">http://127.0.0.1:8000/api/products</code>) will automatically display here.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('All Products');
                  setCurrentView('shop');
                }}
                className="px-4 py-2 bg-[#153e26] hover:bg-[#205234] text-white rounded-lg text-xs font-semibold"
              >
                Open Shop Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigateToProduct(product.id)}
                  className="group bg-white rounded-2xl border border-[#e8ece5] overflow-hidden hover:shadow-xl hover:border-[#c5d4c8] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Top Badge & Image */}
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

                    <div className="w-full aspect-[4/3] mt-2 overflow-hidden rounded-xl bg-[#f4f5f0] flex items-center justify-center">
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
                          ({product.reviewCount || 0})
                        </span>
                      </div>

                      <h3 className="font-serif text-[16px] font-bold text-[#153e26] line-clamp-1 group-hover:text-[#2d6a4f] transition-colors">
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

          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => {
                setCategoryFilter('All Products');
                setCurrentView('shop');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#153e26] hover:text-[#2d6a4f] group cursor-pointer p-2"
            >
              <span>{products.length > 0 ? `View All ${products.length} Organic Products` : 'Explore Complete Catalog'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Dedicated Family Farming & Organic Harvesting Section */}
      <section className="py-12 sm:py-20 bg-[#f1f4ed] border-t border-b border-[#dfe5d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2e7d32]">
              <Sun className="w-3.5 h-3.5 text-[#eab308]" />
              <span>Grown with Care</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#153e26]">
              Family Farming & Daily Harvest
            </h2>
            <p className="text-xs sm:text-base text-[#526654] max-w-2xl mx-auto leading-relaxed">
              Every crop is nurtured by dedicated generational farmers using regenerative, chemical-free methods for maximum nutritional density.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Photo of Family Farming & Harvesting Organic Food */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={familyFarmImage}
                  alt="Multi-generational family farming and harvesting organic food"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center aspect-[16/10] sm:aspect-[16/10]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating Farm Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#2e7d32]" />
                  <span className="text-xs font-bold text-[#153e26]">3rd Gen Family Farm</span>
                </div>

                {/* Bottom Floating Stats */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-[#153e26]/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#a3e635] shrink-0" />
                    <div>
                      <div className="font-bold text-white">100% Pesticide-Free</div>
                      <div className="text-[11px] text-[#c3e8ca]">Certified USDA Organic</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Farm Story Tabs */}
            <div className="lg:col-span-5 space-y-4">
              {/* Tab Selector */}
              <div className="flex bg-[#e2ebd0]/60 p-1.5 rounded-2xl gap-1">
                <button
                  onClick={() => setSelectedFarmTab('harvest')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedFarmTab === 'harvest'
                      ? 'bg-white text-[#153e26] shadow-sm'
                      : 'text-[#4e6050] hover:text-[#153e26]'
                  }`}
                >
                  Daily Harvest
                </button>
                <button
                  onClick={() => setSelectedFarmTab('family')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedFarmTab === 'family'
                      ? 'bg-white text-[#153e26] shadow-sm'
                      : 'text-[#4e6050] hover:text-[#153e26]'
                  }`}
                >
                  Family Growers
                </button>
                <button
                  onClick={() => setSelectedFarmTab('soil')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedFarmTab === 'soil'
                      ? 'bg-white text-[#153e26] shadow-sm'
                      : 'text-[#4e6050] hover:text-[#153e26]'
                  }`}
                >
                  Living Soil
                </button>
              </div>

              {/* Tab Content Cards */}
              {selectedFarmTab === 'harvest' && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e2e6dd] space-y-3 animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#153e26]">
                    Hand-Harvested at Peak Ripeness
                  </h3>
                  <p className="text-xs sm:text-sm text-[#546555] leading-relaxed">
                    Our partner farmers harvest vegetables, grains, and fruits early each morning while the morning dew protects the fragile nutrients and rich essential oils.
                  </p>
                  <ul className="space-y-2 pt-1 text-xs text-[#425243]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Zero artificial ripening agents or waxes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Cold-transported within 24 hours of picking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Maximum antioxidant & mineral retention</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedFarmTab === 'family' && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e2e6dd] space-y-3 animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#153e26]">
                    Fair Living Wages & Generational Trust
                  </h3>
                  <p className="text-xs sm:text-sm text-[#546555] leading-relaxed">
                    We eliminate industrial middle-men by purchasing directly from family-run farm collectives, guaranteeing ethical compensation and preserving heritage farming lore.
                  </p>
                  <ul className="space-y-2 pt-1 text-xs text-[#425243]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>100% fair trade direct farmer contracts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Support for smallholder organic stewards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Preservation of non-GMO heirloom seeds</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedFarmTab === 'soil' && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#e2e6dd] space-y-3 animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#153e26]">
                    Regenerative Organic Agriculture
                  </h3>
                  <p className="text-xs sm:text-sm text-[#546555] leading-relaxed">
                    Healthy food begins with rich, living microbiomes. Our partner farms utilize cover crops, compost teas, and companion planting to naturally replenish the earth.
                  </p>
                  <ul className="space-y-2 pt-1 text-xs text-[#425243]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Carbon sequestering deep-root farming</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>100% pesticide and glyphosate-free soil</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      <span>Rainwater harvesting and drip irrigation</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#153e26] hover:bg-[#205234] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Family / Member Access Section on Landing Page */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fbfbf9] to-[#f4f7f2] border-t border-[#e2e6de]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#153e26] rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background Leaf Accents */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#2e7d32]/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#a3e635]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#a3e635] text-xs font-semibold uppercase tracking-wider border border-white/15">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Member Privileges & Live Tracking</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : 'Sign In or Register for Real-Time Order Tracking'}
                </h3>

                <p className="text-xs sm:text-sm text-[#c6decc] leading-relaxed max-w-xl">
                  {currentUser 
                    ? 'Your organic farm provisions are synced. Access your live delivery status, custom nutrition insights, and 1-click re-ordering anytime.'
                    : 'Create your free Verdant Grove account or sign in to track live delivery dispatch, view your order history, save favorite harvest items, and receive fresh crop alerts.'}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#dff0e3]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span>Real-time GPS Delivery Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span>Save Shipping & Payment Addresses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span>1-Tap Reordering of Farm Provisions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                    <span>Exclusive 10% First Order Promo</span>
                  </div>
                </div>
              </div>

              {/* Right Interactive Action Cards */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4 text-center">
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#a3e635] text-[#153e26] flex items-center justify-center font-bold text-xl shadow-lg">
                      {currentUser.name ? currentUser.name[0] : 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-base text-white">{currentUser.name}</div>
                      <div className="text-xs text-[#c3e8ca]">{currentUser.email}</div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={() => setCurrentView('track')}
                        className="w-full py-3 bg-[#a3e635] hover:bg-[#8fd426] text-[#153e26] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Track My Active Orders</span>
                      </button>
                      <button
                        onClick={() => setCurrentView('shop')}
                        className="w-full py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-all border border-white/20 cursor-pointer"
                      >
                        Browse Organic Market
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-white">Join Verdant Grove</h4>
                      <p className="text-xs text-[#c5ddcb]">Access your orders, track parcels, and explore products</p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={() => {
                          setAuthModalMode('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full py-3.5 bg-white text-[#153e26] hover:bg-[#f2f4ec] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <span>Sign In to Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setAuthModalMode('register');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full py-3 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all border border-white/20 cursor-pointer active:scale-95"
                      >
                        Create Free Account
                      </button>

                      <button
                        onClick={() => setCurrentView('track')}
                        className="w-full py-2 text-xs text-[#a3e635] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-medium"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track an order with Order ID</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-20 bg-[#fbfbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Photo of Fresh Organic Produce */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
                  alt="Fresh organic produce harvest"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center aspect-[4/3] sm:aspect-[16/11]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>

            {/* Right Story Text */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2e7d32]">
                <Leaf className="w-3.5 h-3.5" />
                <span>Our Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#153e26] leading-tight">
                Good Food for a Good Life
              </h2>

              <p className="text-[#556756] text-sm sm:text-base leading-relaxed">
                At Verdant Grove, we believe that healthy eating leads to a better life. That's why we bring you the finest 100% organic products sourced from trusted growers who care for nature as much as we do. Our mission is to bridge the gap between sustainable farming and your dining table.
              </p>

              {/* 3 Bullet Features */}
              <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e3efe6] flex items-center justify-center shrink-0 text-[#153e26] mt-0.5">
                    <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#153e26]">Sustainably Sourced</h4>
                    <p className="text-xs sm:text-sm text-[#5d705e]">
                      From trusted organic farms employing regenerative agriculture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e3efe6] flex items-center justify-center shrink-0 text-[#153e26] mt-0.5">
                    <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#153e26]">Better for Health</h4>
                    <p className="text-xs sm:text-sm text-[#5d705e]">
                      Nutrient rich, chemical-free ingredients for your well-being.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e3efe6] flex items-center justify-center shrink-0 text-[#153e26] mt-0.5">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#153e26]">Better for Planet</h4>
                    <p className="text-xs sm:text-sm text-[#5d705e]">
                      Eco-friendly packaging and a commitment to zero waste.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#153e26] hover:bg-[#205234] text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center"
                >
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter 10% Discount Banner */}
      <section className="w-full bg-[#153e26] text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#a3e635]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Get 10% Off Your First Order!
                </h3>
                <p className="text-xs sm:text-sm text-[#c5ddcb]">
                  Subscribe to our newsletter and get exclusive offers, health tips, and harvest updates.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-[#153e26] rounded-xl text-sm placeholder:text-gray-400 focus:outline-none shadow-sm min-h-[44px]"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-3 bg-[#245735] hover:bg-[#2e6d42] text-white text-sm font-semibold rounded-xl shrink-0 border border-white/20 transition-colors shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-[#a3e635] mt-2 font-medium">
                  ✓ Welcome! Your 10% coupon code <span className="font-bold underline">ORGANIC10</span> has been saved!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

