import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Thermometer, 
  Sparkles,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';

/**
 * ==============================================================================
 * LIVE PRODUCT & ORDER TRACKER VIEW
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * 1. Order Search: `trackOrderById(searchId)` -> GET /api/orders/track/:id
 * 2. Order History: Logged-in user ke orders `orders` state me available hain.
 * 3. Live Steps: Placed -> Harvest Inspected -> Eco-Packed -> In Transit -> Out for Delivery -> Delivered
 * 4. Re-Order: Products ko direct Cart me add karke 1-click repurchase allow karta hai.
 */

export const TrackOrderView: React.FC = () => {
  const { 
    orders, 
    currentTrackedOrder, 
    setCurrentTrackedOrder, 
    trackOrderById, 
    addToCart, 
    setCurrentView,
    currentUser,
    setIsAuthModalOpen
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');
  const [reorderedAlert, setReorderedAlert] = useState(false);

  // Set default tracked order if none selected
  useEffect(() => {
    if (!currentTrackedOrder && orders.length > 0) {
      setCurrentTrackedOrder(orders[0]);
    }
  }, [orders, currentTrackedOrder, setCurrentTrackedOrder]);

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT: SEARCH ORDER BY TRACKING ID]
  // ==============================================================================
  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchError('');
    setIsSearching(true);

    try {
      /*
      // 👉 REAL API CALL:
      // const response = await fetch(`/api/orders/track/${encodeURIComponent(searchQuery)}`);
      // const orderData = await response.json();
      */
      const order = await trackOrderById(searchQuery);
      if (order) {
        setCurrentTrackedOrder(order);
        setActiveTab('track');
      } else {
        setSearchError(`No order found matching "${searchQuery}". Please verify your Order ID (e.g. VG-8492) or Tracking Number.`);
      }
    } catch (err: any) {
      setSearchError('Unable to fetch live tracking information at this moment.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOrderFromHistory = (order: Order) => {
    setCurrentTrackedOrder(order);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorderAll = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity, item.selectedSize);
    });
    setReorderedAlert(true);
    setTimeout(() => {
      setReorderedAlert(false);
      setCurrentView('cart');
    }, 1200);
  };

  const activeOrder = currentTrackedOrder || (orders.length > 0 ? orders[0] : null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'harvested':
        return { label: 'Harvest Inspected', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'packed':
        return { label: 'Eco-Packed', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'in_transit':
        return { label: 'In Transit (Live)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'bg-lime-100 text-lime-800 border-lime-300' };
      case 'delivered':
        return { label: 'Delivered Fresh', color: 'bg-green-100 text-green-800 border-green-300' };
      default:
        return { label: 'Processing', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="w-full bg-[#fbfbf9] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5a725c] mb-2 uppercase tracking-wider">
            <button onClick={() => setCurrentView('home')} className="hover:text-[#153e26] cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#153e26]">Live Order & Delivery Tracker</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#153e26] tracking-tight flex items-center gap-3">
                <span>Organic Delivery Tracker</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#e4efe0] text-[#153e26] border border-[#c1d9b9]">
                  <Leaf className="w-3.5 h-3.5 text-[#2e7d32]" />
                  Zero-Emission Transit
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#4a5f4c] mt-1">
                Real-time farm-to-doorstep traceability for your unrefined, certified organic provisions.
              </p>
            </div>

            {/* Switch Tabs (Tracker vs History) */}
            <div className="flex items-center bg-[#e8eee4] p-1 rounded-xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('track')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-white text-[#153e26] shadow-sm'
                    : 'text-[#526a54] hover:text-[#153e26]'
                }`}
              >
                Live Tracking
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-[#153e26] shadow-sm'
                    : 'text-[#526a54] hover:text-[#153e26]'
                }`}
              >
                Order History ({orders.length})
              </button>
            </div>
          </div>

          {!currentUser && (
            <div className="mt-4 p-4 bg-[#153e26] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-[#235835]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3e635] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">Have an existing account?</div>
                  <div className="text-[11px] sm:text-xs text-[#c5ddcb]">Sign in to automatically sync all your past farm harvests and active shipments.</div>
                </div>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-[#a3e635] hover:bg-[#92dc22] text-[#153e26] font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e4e7de] mb-8">
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. VG-8492) or Tracking # (e.g. TRK-ORG-849201)..."
                className="w-full pl-12 pr-4 py-3 text-sm bg-[#fbfbf9] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26] focus:bg-white text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3 bg-[#153e26] hover:bg-[#1f5435] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isSearching ? (
                <span>Locating...</span>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Track Package</span>
                </>
              )}
            </button>
          </form>

          {searchError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick Demo ID pills */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Quick Test Numbers:</span>
            {orders.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.id);
                  trackOrderById(o.id);
                  setActiveTab('track');
                }}
                className="bg-[#eef4ea] hover:bg-[#dfead7] text-[#153e26] font-mono px-2.5 py-1 rounded-md border border-[#c4dcba] transition-colors cursor-pointer"
              >
                {o.id} ({o.trackingNumber})
              </button>
            ))}
          </div>
        </div>

        {/* Reorder Notification Toast */}
        {reorderedAlert && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#153e26] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#a3e635] animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-[#a3e635]" />
            <span className="text-sm font-semibold">All order items added to Cart! Redirecting...</span>
          </div>
        )}

        {/* TAB 1: LIVE TRACKING DETAILS */}
        {activeTab === 'track' && activeOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Tracking Status Timeline & Vehicle Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Main Status Header Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e7de]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold font-serif text-[#153e26]">
                        Order {activeOrder.id}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(activeOrder.status).color}`}>
                        {getStatusBadge(activeOrder.status).label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                      <span>Tracking: <strong className="font-mono text-gray-800">{activeOrder.trackingNumber}</strong></span>
                      <span>•</span>
                      <span>Placed on: <strong>{activeOrder.orderDate}</strong></span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-[#f7f9f5] p-3 rounded-xl border border-[#e2e8dc]">
                    <div className="text-[11px] font-bold text-[#456147] uppercase tracking-wider">Estimated Delivery</div>
                    <div className="text-base font-bold text-[#153e26] flex items-center sm:justify-end gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-[#2e7d32]" />
                      <span>{activeOrder.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                {/* Eco Transit & Quality Assurance Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                  <div className="bg-[#f2f7ed] p-3.5 rounded-xl border border-[#d6e7ce] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#153e26] text-white flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-[#a3e635]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#153e26]">Courier Fleet</div>
                      <div className="text-[11px] text-[#4d664f]">{activeOrder.carrier || 'Verdant Eco-Express'}</div>
                    </div>
                  </div>

                  <div className="bg-[#f2f7ed] p-3.5 rounded-xl border border-[#d6e7ce] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#153e26] text-white flex items-center justify-center shrink-0">
                      <Thermometer className="w-5 h-5 text-[#a3e635]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#153e26]">Cold-Chain Monitored</div>
                      <div className="text-[11px] text-[#4d664f]">Optimal 38°F Insulated</div>
                    </div>
                  </div>

                  <div className="bg-[#f2f7ed] p-3.5 rounded-xl border border-[#d6e7ce] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#153e26] text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#a3e635]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#153e26]">Farm Certified</div>
                      <div className="text-[11px] text-[#4d664f]">100% USDA Organic Sealed</div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Progress Timeline */}
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-[#153e26] uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#2e7d32]" />
                    <span>Farm-to-Doorstep Journey</span>
                  </h3>

                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#d5ded0]">
                    {activeOrder.trackingSteps.map((step, index) => (
                      <div key={index} className="relative flex items-start gap-4">
                        {/* Step Marker Node */}
                        <div className={`absolute -left-6 sm:-left-8 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          step.completed
                            ? 'bg-[#153e26] border-[#153e26] text-white'
                            : 'bg-white border-[#b6c7b3] text-gray-300'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3e635]" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                          step.current
                            ? 'bg-[#f4f9f0] border-[#9fd394] shadow-xs ring-2 ring-[#153e26]/10'
                            : step.completed
                            ? 'bg-[#fafbfa] border-gray-200'
                            : 'bg-white border-dashed border-gray-200 opacity-60'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <div className="font-bold text-sm text-[#153e26] flex items-center gap-2">
                              <span>{step.title}</span>
                              {step.current && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#153e26] text-white">
                                  CURRENT STEP
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-500">{step.timestamp}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Delivery Address & Driver Support Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e7de] grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d664f] mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2e7d32]" />
                    <span>Destination Shipping Address</span>
                  </h4>
                  <div className="text-sm font-semibold text-gray-900">{activeOrder.customerName}</div>
                  <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {activeOrder.shippingAddress.street}<br />
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.zip}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Contact: {activeOrder.customerEmail}
                  </div>
                </div>

                <div className="bg-[#f9faf8] p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d664f] mb-2 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#2e7d32]" />
                      <span>Eco-Courier Helpline</span>
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Need delivery instructions changed or special gate drop-off? Contact our eco-route driver directly.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Courier contact requested. SMS alert sent to delivery driver for Order ' + activeOrder.id)}
                    className="mt-3 w-full py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Send Delivery Note / Gate Code
                  </button>
                </div>
              </div>

            </div>

            {/* Right Col: Items in Order & Repurchase Box */}
            <div className="space-y-6">
              
              {/* Itemized Order Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e7de]">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="font-serif font-bold text-lg text-[#153e26]">
                    Items in Package ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                  <button
                    onClick={() => alert('Downloading Verified Tax Invoice & Farm Certificate PDF...')}
                    className="text-xs text-[#2e7d32] hover:text-[#153e26] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice PDF</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 my-4 max-h-[380px] overflow-y-auto">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-[#f5f7f2] border border-gray-200 overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </h5>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {item.selectedSize || item.product.packageSize} • Qty: <strong>{item.quantity}</strong>
                        </div>
                        <div className="text-xs font-bold text-[#153e26] mt-0.5">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Promo Discount (ORGANIC10)</span>
                      <span>-${activeOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Carbon-Neutral Delivery</span>
                    <span className="font-semibold text-[#153e26]">
                      {activeOrder.shipping === 0 ? 'FREE' : `$${activeOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-[#153e26]">
                    <span>Total Paid</span>
                    <span>${activeOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 text-right">
                    Paid via {activeOrder.paymentMethod}
                  </div>
                </div>

                {/* Re-order Button */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleReorderAll(activeOrder)}
                    className="w-full py-3 bg-[#153e26] hover:bg-[#1f5435] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Order These Items Again</span>
                  </button>
                  <p className="text-[11px] text-center text-gray-500 mt-2">
                    Adds the same provisions and jar sizes into your cart instantly.
                  </p>
                </div>

              </div>

              {/* Farm Transparency Card */}
              <div className="bg-[#f2f7ed] rounded-2xl p-5 border border-[#cde0c5] text-xs text-[#39533b] space-y-2.5">
                <div className="font-serif font-bold text-[#153e26] text-sm flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2e7d32]" />
                  <span>Harvest Seed-to-Table Guarantee</span>
                </div>
                <p className="leading-relaxed">
                  Every product in this order is cold-pressed, stone-ground, or tap-harvested from partner cooperative regenerative family farms with verified zero synthetic pesticides.
                </p>
              </div>

            </div>

          </div>
        ) : activeTab === 'track' && !activeOrder ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-gray-900">No active tracking selected</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
              Enter an Order ID above or pick an order from your history to track delivery progress.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-2.5 bg-[#153e26] text-white text-sm font-semibold rounded-xl hover:bg-[#1f5435] transition-colors cursor-pointer"
            >
              Browse Organic Pantry
            </button>
          </div>
        ) : null}

        {/* TAB 2: ORDER HISTORY LIST */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-gray-900">No Orders Placed Yet</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
                  You haven't placed any orders yet. Explore our cold-pressed oils, raw honey, and heirloom grains!
                </p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="px-6 py-2.5 bg-[#153e26] text-white text-sm font-semibold rounded-xl hover:bg-[#1f5435] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e4e7de] hover:border-[#153e26]/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      {/* Left Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-serif font-bold text-lg text-[#153e26]">
                            Order #{order.id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            Placed on {order.orderDate}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600">
                          Tracking: <strong className="font-mono text-gray-900">{order.trackingNumber}</strong> • {order.items.length} unique provisions
                        </div>

                        {/* Thumbnails preview */}
                        <div className="flex items-center gap-2 pt-1">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.product.image}
                              alt={item.product.name}
                              title={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50"
                            />
                          ))}
                          {order.items.length > 4 && (
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-2 rounded-lg">
                              +{order.items.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Total & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-gray-500">Total Paid</div>
                          <div className="text-lg font-bold text-[#153e26]">${order.total.toFixed(2)}</div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleSelectOrderFromHistory(order)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#153e26] hover:bg-[#1f5435] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Live</span>
                          </button>
                          <button
                            onClick={() => handleReorderAll(order)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#f4f7f1] hover:bg-[#e6efe1] text-[#153e26] border border-[#bcd6b8] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
