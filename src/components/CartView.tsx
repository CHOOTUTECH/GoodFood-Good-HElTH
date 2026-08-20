import React, { useState } from 'react';
import { Leaf, Truck, ArrowLeft, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CartService } from '../services/api';

/**
 * ==============================================================================
 * CART VIEW & COUPON VALIDATION API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * - Coupon discount check karne ke liye: `CartService.validateCoupon(promoCode, subtotal)`
 *   (POST /api/cart/validate-coupon { code, subtotal })
 */

export const CartView: React.FC = () => {
  const {
    cart,
    subtotal,
    freeShippingThreshold,
    remainingForFreeShipping,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCurrentView,
    setIsCheckoutOpen,
    navigateToProduct
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 4.99;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 12: COUPON CODE VALIDATION API]
  // ==============================================================================
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    try {
      /*
      // 👉 REAL API INTEGRATION:
      // POST /api/cart/validate-coupon
      // const response = await fetch('/api/cart/validate-coupon', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: promoCode, subtotal })
      // });
      // const result = await response.json();
      */

      const result = await CartService.validateCoupon(promoCode, subtotal);
      if (result.valid) {
        setDiscountAmount(result.discountAmount || subtotal * 0.1);
        setPromoApplied(true);
      } else {
        alert('Invalid promo code. Try ORGANIC10 for 10% off!');
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 && subtotal < freeShippingThreshold ? 0 : 0));

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#fbfbf9] min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-auto text-center px-4 space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#e8efe9] text-[#153e26] flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#153e26]">Your Cart is Empty</h2>
          <p className="text-sm text-[#546555] leading-relaxed">
            Looks like you haven't added any organic provisions yet. Discover our fresh harvests and pantry staples!
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-8 py-3.5 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fbfbf9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#153e26] mb-6">
          Your Cart
        </h1>

        {/* Free Shipping Progress Banner (Exact match to Image 1.png) */}
        <div className="bg-[#f4f6f0] border border-[#e0e4da] p-4 sm:p-5 rounded-2xl mb-8">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#153e26] mb-2.5">
            <Truck className="w-4 h-4 text-[#2e7d32]" />
            {remainingForFreeShipping > 0 ? (
              <span>
                You're only <span className="font-bold text-[#2e7d32]">${remainingForFreeShipping.toFixed(2)}</span> away from Free Shipping!
              </span>
            ) : (
              <span className="text-[#2e7d32] font-bold">
                🎉 Congratulations! You have qualified for FREE Shipping!
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#e2e6dd] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#153e26] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Layout: Left Table + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cart Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e5e8e1] overflow-hidden p-4 sm:p-6">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 pb-4 border-b border-[#ecefe8] text-xs font-bold uppercase tracking-wider text-[#637564]">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-[#edf0e8]">
              {cart.map((item, idx) => {
                const itemTotal = item.unitPrice * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize || ''}-${idx}`}
                    className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Product Info */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <div
                        onClick={() => navigateToProduct(item.product.id)}
                        className="w-20 h-20 rounded-xl bg-[#f4f6f0] overflow-hidden border border-[#e5e8e1] shrink-0 cursor-pointer"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#e8efe9] text-[#235835]">
                          {item.product.id === 'amaranth-grain' ? 'BULK' : 'ORGANIC'}
                        </span>
                        <h3
                          onClick={() => navigateToProduct(item.product.id)}
                          className="font-serif text-base font-bold text-[#153e26] hover:text-[#2d6a4f] transition-colors cursor-pointer"
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#637564]">
                          {item.selectedSize || item.product.packageSize}
                        </p>
                        <p className="text-xs font-semibold text-[#153e26] sm:hidden">
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Stepper Quantity */}
                    <div className="sm:col-span-3 flex sm:justify-center items-center gap-3">
                      <div className="flex items-center border border-[#d2d8ce] rounded-lg bg-[#fbfbf9] overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, -1)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#153e26] hover:bg-[#eaece5] transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-[#153e26] min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, 1)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-[#153e26] hover:bg-[#eaece5] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        aria-label="Remove item"
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer sm:hidden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total & Remove button */}
                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-bold text-base text-[#153e26]">
                        ${itemTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        aria-label="Remove item"
                        className="hidden sm:inline-flex text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Bottom Buttons */}
            <div className="pt-6 mt-4 border-t border-[#ecefe8] flex items-center justify-between">
              <button
                onClick={() => setCurrentView('shop')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#153e26] hover:text-[#2d6a4f] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>

              <button
                onClick={clearCart}
                className="text-xs font-medium text-[#7d8f7e] hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Order Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e5e8e1] p-6 space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#153e26]">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-[#4e6050]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#153e26]">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>10% Discount (ORGANIC10)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-xs font-medium text-[#647866]">
                  {subtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-medium text-[#153e26]">$0.00</span>
              </div>

              <div className="pt-4 border-t border-[#edf0e8] flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold text-[#153e26]">Total</span>
                <span className="font-serif text-2xl font-bold text-[#153e26]">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ORGANIC10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-[#fbfbf9] border border-[#d2d8ce] rounded-lg px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#153e26]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f4f6f0] border border-[#d2d8ce] text-[#153e26] rounded-lg text-xs font-semibold hover:bg-[#eaece5] cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold mt-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Coupon applied successfully!</span>
                </div>
              )}
            </form>

            {/* Proceed to Checkout CTA Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Footer */}
            <div className="pt-4 border-t border-[#edf0e8] space-y-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#546555] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#153e26]" />
                <span>Secure SSL 256-Bit Encrypted Checkout</span>
              </div>

              <div className="text-[11px] text-gray-400 flex items-center justify-center gap-2">
                <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[9px] font-bold tracking-wider">VISA</span>
                <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[9px] font-bold tracking-wider">MASTERCARD</span>
                <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[9px] font-bold tracking-wider">AMEX</span>
                <span className="px-1.5 py-0.5 border border-gray-200 rounded text-[9px] font-bold tracking-wider">APPLE PAY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
