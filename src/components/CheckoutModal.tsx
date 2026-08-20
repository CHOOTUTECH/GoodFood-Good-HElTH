import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, CheckCircle2, Truck, CreditCard, Lock, X, Loader2, User as UserIcon, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { OrderService, OrderPayload } from '../services/api';
import { Order } from '../types';

/**
 * ==============================================================================
 * CHECKOUT MODAL & PAYMENT GATEWAY API INTEGRATION
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * - Jab user "Pay" button par click karta hai:
 *   1. Step 1: Order payload prepare hota hai (Customer details, Cart items, Total amount).
 *   2. Step 2: `OrderService.createOrder(orderPayload)` call hota hai (POST /api/orders).
 *   3. Step 3: Newly created Order state me add hota hai (`addNewOrder(order)`),
 *      jisse user turant Live Order Tracker me jakar live delivery status dekh sake.
 */

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    subtotal, 
    clearCart, 
    setCurrentView,
    currentUser,
    addNewOrder,
    setIsAuthModalOpen
  } = useShop();

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || 'Jairam',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || 'Singh',
    email: currentUser?.email || 'jairamsingh.tech@gmail.com',
    address: currentUser?.address?.street || '742 Organic Harvest Way, Suite 4B',
    city: currentUser?.address?.city || 'Portland',
    state: currentUser?.address?.state || 'OR',
    zip: currentUser?.address?.zip || '97201',
    cardNumber: '•••• •••• •••• 4242',
    exp: '12/28',
    cvv: '982'
  });

  // Keep form synced if user logs in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.name?.split(' ')[0] || prev.firstName,
        lastName: currentUser.name?.split(' ').slice(1).join(' ') || prev.lastName,
        email: currentUser.email || prev.email,
        address: currentUser.address?.street || prev.address,
        city: currentUser.address?.city || prev.city,
        state: currentUser.address?.state || prev.state,
        zip: currentUser.address?.zip || prev.zip
      }));
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT 3: PROCESS PAYMENT & CREATE ORDER]
  // ==============================================================================
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload: OrderPayload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
      items: cart,
      subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod: 'card',
      cardDetails: {
        cardNumber: formData.cardNumber,
        exp: formData.exp,
        cvv: formData.cvv
      }
    };

    try {
      /*
      // 👉 REAL API INTEGRATION / PAYMENT GATEWAY:
      // Option A: Direct backend API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderPayload)
      // });
      // const data = await response.json();
      */

      const response = await OrderService.createOrder(orderPayload);
      
      const newOrder: Order = {
        id: response.orderId,
        trackingNumber: response.trackingNumber,
        userId: currentUser?.id,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        items: [...cart],
        subtotal,
        discount: 0,
        shipping: subtotal >= 49 ? 0 : 4.99,
        total: subtotal + (subtotal >= 49 ? 0 : 4.99),
        paymentMethod: 'Credit Card (Visa **** 4242)',
        status: 'placed',
        orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        estimatedDelivery: 'In 2-3 Business Days',
        carrier: 'Verdant Eco-Express (Zero-Emission Fleet)',
        trackingSteps: [
          {
            status: 'placed',
            title: 'Order Confirmed & Payment Received',
            description: 'Order details verified. Farm picking ticket created.',
            timestamp: 'Just now',
            completed: true,
            current: true
          },
          {
            status: 'harvested',
            title: 'Harvest Selection & Quality Inspection',
            description: 'Organic agronomists will inspect batch purity.',
            timestamp: 'Estimated in 3 hours',
            completed: false
          },
          {
            status: 'packed',
            title: 'Eco-Insulation Sealed & Packed',
            description: 'Insulated with biodegradable cotton and non-toxic ice blocks.',
            timestamp: 'Estimated Tomorrow, 9:00 AM',
            completed: false
          },
          {
            status: 'in_transit',
            title: 'In Transit — Eco Regional Hub',
            description: 'Dispatched via electric delivery van.',
            timestamp: 'Estimated Tomorrow, 1:00 PM',
            completed: false
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Doorstep Delivery',
            description: 'Courier route scheduled to your doorstep.',
            timestamp: 'Estimated in 2 days',
            completed: false
          },
          {
            status: 'delivered',
            title: 'Delivered Fresh',
            description: 'Package placed safely on your porch.',
            timestamp: 'Estimated in 2-3 days',
            completed: false
          }
        ]
      };

      addNewOrder(newOrder);
      setConfirmedOrder(newOrder);

      setStep('success');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#153e26', '#2e7d32', '#a3e635', '#e8f5e9']
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order could not be processed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndShop = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setStep('shipping');
    setCurrentView('shop');
  };

  const handleGoToTracker = () => {
    clearCart();
    setIsCheckoutOpen(false);
    setStep('shipping');
    setCurrentView('track');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#153e26] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#a3e635]" />
            <span className="font-serif text-lg font-bold">Verdant Grove Express Checkout</span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close"
            className="text-gray-300 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Guest vs User notice */}
          {!currentUser && step === 'shipping' && (
            <div className="mb-4 p-3 bg-[#f2f7ed] border border-[#cbe0c3] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#1f4a29]">
                <UserIcon className="w-4 h-4 text-[#2e7d32]" />
                <span>Already have an account? Sign in for 1-click address autofill.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="font-bold text-[#153e26] underline hover:text-[#2e7d32] cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#153e26] font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>1. Shipping Information</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email for Delivery Tracking</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#153e26] font-bold text-sm">
                <CreditCard className="w-4 h-4" />
                <span>2. Payment & Review</span>
              </div>

              <div className="bg-[#f8f9f6] p-4 rounded-xl text-xs space-y-2 border border-[#e5e8e1]">
                <div className="flex justify-between font-medium">
                  <span>Ship To:</span>
                  <span className="text-gray-700">{formData.address}, {formData.city}, {formData.state}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#153e26] pt-1 border-t border-gray-200">
                  <span>Total Due:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 pl-9 text-xs font-mono focus:outline-none focus:border-[#153e26]"
                  />
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Expires</label>
                  <input
                    type="text"
                    required
                    value={formData.exp}
                    onChange={(e) => setFormData({ ...formData, exp: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Security Code (CVV)</label>
                  <input
                    type="text"
                    required
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    className="w-full bg-[#fbfbf9] border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-green-700" />
                <span>Encrypted with bank-grade 256-bit SSL protection</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-1/3 py-3 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay ${subtotal.toFixed(2)}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && confirmedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#e8efe9] text-[#153e26] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#2e7d32]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#153e26]">
                Order Confirmed!
              </h3>
              <p className="text-xs text-[#526453] max-w-sm mx-auto leading-relaxed">
                Thank you for choosing certified organic goodness. Your order <span className="font-bold text-[#153e26]">#{confirmedOrder.id}</span> has been confirmed.
              </p>
              
              <div className="bg-[#f4f6f0] p-4 rounded-xl text-xs text-left max-w-sm mx-auto space-y-1.5 border border-[#dce5d6]">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-mono font-bold text-[#153e26]">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-semibold text-gray-900">{confirmedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carrier:</span>
                  <span className="text-[#2e7d32] font-semibold">{confirmedOrder.carrier}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleGoToTracker}
                  className="px-6 py-3 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Truck className="w-4 h-4 text-[#a3e635]" />
                  <span>Track Your Fresh Delivery Live</span>
                </button>
                <button
                  onClick={handleFinishAndShop}
                  className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
