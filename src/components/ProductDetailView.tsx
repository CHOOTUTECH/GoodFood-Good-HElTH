import React, { useState, useEffect } from 'react';
import { Leaf, Star, Truck, ShieldCheck, Sprout, Heart, ShoppingBag, Check, ChevronRight, Share2, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Review } from '../types';
import { ProductService } from '../services/api';

/**
 * ==============================================================================
 * PRODUCT DETAIL VIEW & REVIEWS API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * 1. Product Details: `selectedProductId` ke basis par product data load hota hai (GET /api/products/:id).
 * 2. Reviews Fetching: Product ke customer reviews load karne ke liye `ProductService.getProductReviews(productId)` 
 *    (GET /api/products/:id/reviews) use hota hai.
 * 3. Review Submission: New review post karne ke liye `ProductService.submitReview(productId, reviewData)` 
 *    (POST /api/products/:id/reviews) call hota hai.
 */

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    isLoadingProducts,
    setCurrentView,
    addToCart,
    wishlist,
    toggleWishlist
  } = useShop();

  const [apiProduct, setApiProduct] = useState<Product | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Find product from list or fetch directly via API GET /api/products/{id}
  const productFromList = products.find(p => p.id === selectedProductId || p.slug === selectedProductId);
  const product = productFromList || apiProduct;

  useEffect(() => {
    async function loadProductDetail() {
      if (!productFromList && selectedProductId) {
        setIsLoadingDetail(true);
        try {
          const res = await ProductService.getProductBySlug(selectedProductId);
          if (res) {
            setApiProduct(res);
          }
        } catch (err) {
          console.error('Failed to load product detail:', err);
        } finally {
          setIsLoadingDetail(false);
        }
      }
    }
    loadProductDetail();
  }, [selectedProductId, productFromList]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Set default size once product is available
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize(product.packageSize || '');
      }
    }
  }, [product]);

  // ==============================================================================
  // 🔗 [API: GET /api/products/{slug}/reviews]
  // ==============================================================================
  useEffect(() => {
    async function loadReviews() {
      if (product?.id || product?.slug) {
        const targetSlug = product.slug || product.id;
        const reviews = await ProductService.getProductReviews(targetSlug);
        if (reviews && reviews.length > 0) {
          setReviewsList(reviews);
        } else {
          setReviewsList([]);
        }
      }
    }
    loadReviews();
  }, [product?.id, product?.slug]);

  if (isLoadingProducts || isLoadingDetail) {
    return (
      <div className="w-full bg-[#fbfbf9] min-h-[70vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#153e26] animate-spin mb-4" />
        <p className="text-sm font-medium text-[#153e26]">Loading product details from server...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#fbfbf9] min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f0f4ec] text-[#2e7d32] flex items-center justify-center mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153e26] mb-2">Product Not Found</h2>
        <p className="text-sm text-[#546555] max-w-md mb-6">
          The requested organic product could not be retrieved from the backend API.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-3 bg-[#153e26] hover:bg-[#205234] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image || 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=800'];

  // Calculate current price based on selected size
  let currentPrice = product.price;
  if (product.pricePerSize && selectedSize && product.pricePerSize[selectedSize]) {
    currentPrice = product.pricePerSize[selectedSize];
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 8: SUBMIT NEW CUSTOMER REVIEW]
  // ==============================================================================
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const targetSlug = product.slug || product.id;
      const response = await ProductService.submitReview(targetSlug, {
        author: newReviewAuthor,
        rating: newReviewRating,
        title: newReviewTitle || 'Verified Purchase Review',
        comment: newReviewComment
      });

      if (response && response.review) {
        setReviewsList(prev => [response.review!, ...prev]);
      }
      setNewReviewAuthor('');
      setNewReviewTitle('');
      setNewReviewComment('');
      setNewReviewRating(5);
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="w-full bg-[#fbfbf9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#637564] mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-[#153e26] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <button
            onClick={() => setCurrentView('shop')}
            className="hover:text-[#153e26] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#637564]">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-[#153e26] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero: Images Left, Purchasing Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white p-6 sm:p-10 rounded-3xl border border-[#e5e8e1]">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f6f0] border border-[#e8ece5] flex items-center justify-center">
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5e9] text-[#2e7d32] shadow-sm z-10">
                <Leaf className="w-3 h-3" />
                <span>{product.badge || 'Organic'}</span>
              </span>

              <img
                src={images[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#f4f6f0] ${
                      selectedImageIndex === idx
                        ? 'border-[#153e26] ring-2 ring-[#153e26]/20'
                        : 'border-[#e8ece5] hover:border-gray-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Ratings, Pricing, Variants, Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#153e26] leading-tight">
                {product.name}
              </h1>

              {/* Star rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#526453] font-medium">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#153e26]">
                ${currentPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Snippet Description */}
            <p className="text-sm text-[#546555] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#153e26]">
                  Size
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#153e26] text-white shadow-sm'
                          : 'bg-[#f4f6f0] text-[#3e5040] hover:bg-[#eaece4] border border-[#e0e4da]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="flex items-center border border-[#d2d8ce] rounded-xl bg-[#fbfbf9] overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-sm font-semibold text-[#153e26] hover:bg-[#eaece5] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-[#153e26] min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3.5 py-2.5 text-sm font-semibold text-[#153e26] hover:bg-[#eaece5] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    addedAnimation
                      ? 'bg-green-700 text-white'
                      : 'bg-[#153e26] hover:bg-[#205234] text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#fbeae8] border-[#f2b8b5] text-[#d93025]'
                      : 'border-[#d2d8ce] bg-white text-[#4e6050] hover:bg-[#f4f6f0]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* 4 Trust Value Icons (2x2 grid matching Image 5.png) */}
            <div className="pt-6 border-t border-[#edf0e8] grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e8efe9] flex items-center justify-center text-[#153e26] shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#153e26]">100% Organic</h4>
                  <p className="text-[11px] text-[#647866]">Certified Pure</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e8efe9] flex items-center justify-center text-[#153e26] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#153e26]">Free Delivery</h4>
                  <p className="text-[11px] text-[#647866]">Orders over $49</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e8efe9] flex items-center justify-center text-[#153e26] shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#153e26]">Sustainably Sourced</h4>
                  <p className="text-[11px] text-[#647866]">Ethical Farming</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e8efe9] flex items-center justify-center text-[#153e26] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#153e26]">Secure Payment</h4>
                  <p className="text-[11px] text-[#647866]">256-bit Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs (Description, Nutrition Facts, Reviews) */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl border border-[#e5e8e1] overflow-hidden p-4 sm:p-10">
          {/* Tabs bar */}
          <div className="flex border-b border-[#e5e8e1] space-x-6 sm:space-x-8 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition-colors cursor-pointer min-h-[40px] ${
                activeTab === 'description'
                  ? 'text-[#153e26] border-b-2 border-[#153e26]'
                  : 'text-[#647866] hover:text-[#153e26]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 transition-colors cursor-pointer min-h-[40px] ${
                activeTab === 'nutrition'
                  ? 'text-[#153e26] border-b-2 border-[#153e26]'
                  : 'text-[#647866] hover:text-[#153e26]'
              }`}
            >
              Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors cursor-pointer min-h-[40px] ${
                activeTab === 'reviews'
                  ? 'text-[#153e26] border-b-2 border-[#153e26]'
                  : 'text-[#647866] hover:text-[#153e26]'
              }`}
            >
              Reviews ({reviewsList.length})
            </button>
          </div>

          {/* Tab 1: Description & Specifications */}
          {activeTab === 'description' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-sm text-[#4e6050] leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>

                {product.keyBenefits && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-serif text-lg font-bold text-[#153e26]">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 text-sm text-[#4e6050]">
                      {product.keyBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-[#e8efe9] text-[#153e26] flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                            ✓
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Specifications Card (Image 5.png) */}
              <div className="lg:col-span-5 bg-[#f8f9f6] p-6 rounded-2xl border border-[#e5e8e1] space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#153e26] pb-2 border-b border-[#e2e6de]">
                  Specifications
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#647866]">Origin:</span>
                    <span className="font-semibold text-[#153e26]">{product.specifications.origin}</span>
                  </div>
                  {product.specifications.extraction && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-[#647866]">Extraction:</span>
                      <span className="font-semibold text-[#153e26]">{product.specifications.extraction}</span>
                    </div>
                  )}
                  {product.specifications.smokePoint && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-[#647866]">Smoke Point:</span>
                      <span className="font-semibold text-[#153e26]">{product.specifications.smokePoint}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#647866]">Certifications:</span>
                    <span className="font-semibold text-[#153e26]">{product.specifications.certifications}</span>
                  </div>
                  {product.specifications.shelfLife && (
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-[#647866]">Shelf Life:</span>
                      <span className="font-semibold text-[#153e26]">{product.specifications.shelfLife}</span>
                    </div>
                  )}
                  {product.specifications.storage && (
                    <div className="flex justify-between py-1">
                      <span className="text-[#647866]">Storage:</span>
                      <span className="font-medium text-[#153e26] text-right max-w-[60%]">{product.specifications.storage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Nutrition Facts */}
          {activeTab === 'nutrition' && (
            <div className="max-w-md bg-white border-2 border-black p-5 font-sans">
              <h2 className="text-3xl font-black border-b-8 border-black pb-1 leading-none">
                Nutrition Facts
              </h2>
              <div className="text-xs border-b border-black py-1">
                <div>Serving size: <span className="font-bold">{product.nutritionFacts?.servingSize || '1 Serving'}</span></div>
                <div>Servings per container: <span className="font-bold">{product.nutritionFacts?.servingsPerContainer || '16'}</span></div>
              </div>

              <div className="border-b-4 border-black py-1 flex justify-between items-baseline">
                <span className="font-bold text-sm">Amount per serving<br/><span className="text-2xl font-black">Calories</span></span>
                <span className="text-3xl font-black">{product.nutritionFacts?.calories || 120}</span>
              </div>

              <div className="text-right text-[11px] font-bold border-b border-black py-0.5">
                % Daily Value*
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between border-b border-gray-300 py-0.5">
                  <span><strong className="font-black">Total Fat</strong> {product.nutritionFacts?.totalFat || '14g'}</span>
                  <span className="font-bold">18%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 py-0.5 pl-4">
                  <span>Saturated Fat {product.nutritionFacts?.saturatedFat || '2g'}</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 py-0.5 pl-4">
                  <span>Trans Fat {product.nutritionFacts?.transFat || '0g'}</span>
                  <span></span>
                </div>
                <div className="flex justify-between border-b border-gray-300 py-0.5 pl-4">
                  <span>Monounsaturated Fat {product.nutritionFacts?.monounsaturatedFat || '10g'}</span>
                  <span></span>
                </div>
                <div className="flex justify-between border-b border-gray-300 py-0.5">
                  <span><strong className="font-black">Sodium</strong> {product.nutritionFacts?.sodium || '0mg'}</span>
                  <span className="font-bold">0%</span>
                </div>
                <div className="flex justify-between border-b border-gray-300 py-0.5">
                  <span><strong className="font-black">Total Carbohydrate</strong> {product.nutritionFacts?.totalCarb || '0g'}</span>
                  <span className="font-bold">0%</span>
                </div>
                <div className="flex justify-between border-b border-black py-0.5">
                  <span><strong className="font-black">Protein</strong> {product.nutritionFacts?.protein || '0g'}</span>
                  <span></span>
                </div>
              </div>

              <div className="text-[10px] text-gray-600 pt-2 leading-tight">
                * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Reviews Feed */}
                <div className="lg:col-span-7 space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl bg-[#fbfbf9] border border-[#e5e8e1] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#153e26]">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#e8efe9] text-[#2e7d32] rounded-full font-semibold">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{rev.date}</span>
                      </div>

                      <div className="flex items-center text-[#f59e0b]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <h4 className="font-semibold text-xs text-[#153e26]">{rev.title}</h4>
                      <p className="text-xs text-[#526453] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Submit Review Form */}
                <div className="lg:col-span-5 bg-[#f8f9f6] p-6 rounded-2xl border border-[#e5e8e1] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#153e26]">
                    Write a Review
                  </h3>
                  <form onSubmit={handleAddReview} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-white border border-[#d2d8ce] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${star <= newReviewRating ? 'text-[#f59e0b] fill-current' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="Summary of your experience"
                        className="w-full bg-white border border-[#d2d8ce] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Your Feedback</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="How did you use this item? What did you like?"
                        className="w-full bg-white border border-[#d2d8ce] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Add To Cart Action Bar (Floating above MobileBottomNav on small screens) */}
        <div className="md:hidden fixed bottom-[58px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e6de] px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-[#647866] font-medium leading-none">
              {selectedSize || product.packageSize}
            </div>
            <div className="font-serif text-lg font-bold text-[#153e26] leading-tight mt-0.5">
              ${(currentPrice * quantity).toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#d2d8ce] rounded-lg bg-[#fbfbf9] overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1.5 text-xs font-bold text-[#153e26] active:bg-gray-200"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold text-[#153e26] min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1.5 text-xs font-bold text-[#153e26] active:bg-gray-200"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                addedAnimation
                  ? 'bg-[#2e7d32] text-white'
                  : 'bg-[#153e26] text-white hover:bg-[#205234]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-[#a3e635]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
