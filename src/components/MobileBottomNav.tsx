import React from 'react';
import { Leaf, Store, Search, Truck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    totalCartCount, 
    orders, 
    setIsSearchOpen 
  } = useShop();

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fafaf8]/95 backdrop-blur-md border-t border-[#e2e6de] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around safe-area-pb"
    >
      {/* Home Tab */}
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-colors cursor-pointer active:scale-95 ${
          currentView === 'home'
            ? 'text-[#153e26] font-bold'
            : 'text-[#5a6e5b] hover:text-[#153e26]'
        }`}
      >
        <div className={`p-1 rounded-lg ${currentView === 'home' ? 'bg-[#e4efe0]' : ''}`}>
          <Leaf className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      {/* Shop Tab */}
      <button
        onClick={() => setCurrentView('shop')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-colors cursor-pointer active:scale-95 ${
          currentView === 'shop'
            ? 'text-[#153e26] font-bold'
            : 'text-[#5a6e5b] hover:text-[#153e26]'
        }`}
      >
        <div className={`p-1 rounded-lg ${currentView === 'shop' ? 'bg-[#e4efe0]' : ''}`}>
          <Store className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Market</span>
      </button>

      {/* Search Button (Center Quick Action) */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl text-[#5a6e5b] hover:text-[#153e26] transition-colors cursor-pointer active:scale-95"
      >
        <div className="p-1 rounded-lg">
          <Search className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
      </button>

      {/* Track Orders Tab */}
      <button
        onClick={() => setCurrentView('track')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl relative transition-colors cursor-pointer active:scale-95 ${
          currentView === 'track'
            ? 'text-[#153e26] font-bold'
            : 'text-[#5a6e5b] hover:text-[#153e26]'
        }`}
      >
        <div className={`p-1 rounded-lg relative ${currentView === 'track' ? 'bg-[#e4efe0]' : ''}`}>
          <Truck className="w-5 h-5" />
          {orders.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2e7d32] ring-2 ring-white" />
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Track</span>
      </button>

      {/* Cart Tab with Count Badge */}
      <button
        onClick={() => setCurrentView('cart')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl relative transition-colors cursor-pointer active:scale-95 ${
          currentView === 'cart'
            ? 'text-[#153e26] font-bold'
            : 'text-[#5a6e5b] hover:text-[#153e26]'
        }`}
      >
        <div className={`p-1 rounded-lg relative ${currentView === 'cart' ? 'bg-[#e4efe0]' : ''}`}>
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#153e26] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
      </button>
    </nav>
  );
};
