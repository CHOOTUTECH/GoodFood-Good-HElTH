import React, { useState } from 'react';
import { 
  Leaf, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Sprout, 
  BookOpen, 
  Info, 
  Store, 
  Truck, 
  LogIn, 
  LogOut, 
  Package, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    totalCartCount,
    wishlist,
    setCategoryFilter,
    categoryFilter,
    setIsSearchOpen,
    setIsAboutOpen,
    setIsBlogOpen,
    currentUser,
    orders,
    setIsAuthModalOpen,
    setAuthModalMode,
    logoutUser
  } = useShop();

  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'All Products',
    'Oils & Vinegars',
    'Nuts & Seeds',
    'Grains & Legumes',
    'Superfoods & Powders',
    'Natural Sweeteners'
  ];

  const handleCategorySelect = (category: string) => {
    setCategoryFilter(category);
    setCurrentView('shop');
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Extract initials
  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'JS';

  return (
    <header className="w-full bg-[#fafaf8] border-b border-[#ecece6] sticky top-0 z-40">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#153e26] text-[#e3efe6] text-[11px] sm:text-xs py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>🚚</span>
            <span className="font-medium tracking-wide">Free Delivery on orders over $49 • 100% Farm Fresh Traceability</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 font-medium text-[#c0dec7]">
            <button
              onClick={() => handleNavClick('admin')}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-xs font-semibold text-[#a3e635]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
            <span className="text-[#4e825e]">|</span>
            <button
              onClick={() => handleNavClick('track')}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-xs font-semibold"
            >
              <Truck className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>Track Delivery</span>
            </button>
            <span className="text-[#4e825e] hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-3">
              <span>Family Harvested</span>
              <span className="text-[#4e825e]">|</span>
              <span>Zero Synthetics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            className="md:hidden p-2 rounded-lg text-[#153e26] hover:bg-[#eef1ea] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#153e26] flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0">
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a3e635]" />
            </div>
            <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#153e26]">
              Verdant Grove
            </span>
          </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-7 text-[15px] font-medium text-[#2d3a2e]">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors hover:text-[#153e26] pb-1 cursor-pointer ${
              currentView === 'home'
                ? 'text-[#153e26] font-semibold border-b-2 border-[#153e26]'
                : 'text-[#4a554a]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              setCategoryFilter('All Products');
              handleNavClick('shop');
            }}
            className={`transition-colors hover:text-[#153e26] pb-1 cursor-pointer ${
              currentView === 'shop'
                ? 'text-[#153e26] font-semibold border-b-2 border-[#153e26]'
                : 'text-[#4a554a]'
            }`}
          >
            Shop Market
          </button>

          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              className="flex items-center gap-1.5 transition-colors hover:text-[#153e26] pb-1 cursor-pointer text-[#4a554a]"
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoriesDropdownOpen && (
              <div
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e5e7eb] py-2 z-50 animate-in fade-in slide-from-top-2 duration-150"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#2d3a2e] hover:bg-[#f4f6f0] hover:text-[#153e26] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Track Orders Link */}
          <button
            onClick={() => handleNavClick('track')}
            className={`transition-colors hover:text-[#153e26] pb-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'track'
                ? 'text-[#153e26] font-semibold border-b-2 border-[#153e26]'
                : 'text-[#4a554a]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#2e7d32]" />
            <span>Track Order</span>
            {orders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#2e7d32]" />
            )}
          </button>

          {/* Admin Center Link */}
          <button
            id="nav-admin-center-desktop"
            onClick={() => handleNavClick('admin')}
            className={`transition-colors hover:text-[#153e26] pb-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'text-[#153e26] font-semibold border-b-2 border-[#153e26]'
                : 'text-[#153e26]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
            <span className="font-semibold">Admin Center</span>
          </button>

          <button
            onClick={() => setIsAboutOpen(true)}
            className="transition-colors hover:text-[#153e26] pb-1 cursor-pointer text-[#4a554a]"
          >
            Our Farms
          </button>

          <button
            onClick={() => setIsBlogOpen(true)}
            className="transition-colors hover:text-[#153e26] pb-1 cursor-pointer text-[#4a554a]"
          >
            Journal
          </button>
        </nav>

        {/* Right Icon Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-[#2d3a2e]">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
            className="p-2 hover:bg-[#eaece5] rounded-full transition-colors cursor-pointer text-[#2d3a2e] hover:text-[#153e26]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account / Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-label="User Account"
              className={`p-2 hover:bg-[#eaece5] rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentUser ? 'text-[#153e26]' : 'text-[#2d3a2e]'
              }`}
            >
              {currentUser ? (
                <div className="w-7 h-7 rounded-full bg-[#153e26] text-white text-xs font-bold flex items-center justify-center border border-[#9fd394]">
                  {initials}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-4 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#153e26] text-white flex items-center justify-center font-bold text-sm">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">{currentUser.name}</div>
                        <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentView('track');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-[#f4f6f0] hover:text-[#153e26] rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#2e7d32]" />
                          <span>Track Live Orders</span>
                        </span>
                        <span className="text-xs font-bold bg-[#e3efe6] text-[#153e26] px-2 py-0.5 rounded-full">
                          {orders.length}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[#153e26] hover:bg-[#eef5ed] font-medium rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
                          <span>Admin Center (Store Control)</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full">
                          Real Data
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('cart');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-[#f4f6f0] hover:text-[#153e26] rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#2e7d32]" />
                        <span>My Cart ({totalCartCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('shop');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-[#f4f6f0] hover:text-[#153e26] rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Store className="w-4 h-4 text-[#2e7d32]" />
                        <span>Organic Provisions</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-2">
                      <div className="w-10 h-10 rounded-full bg-[#f2f6ee] text-[#153e26] flex items-center justify-center mx-auto mb-2">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">Welcome to Verdant Grove</div>
                      <p className="text-xs text-gray-500 mt-0.5">Sign in to track orders, save favorites & fast checkout.</p>
                    </div>

                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="w-full py-2.5 bg-[#153e26] hover:bg-[#1f5435] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>

                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="w-full py-2.5 bg-[#f4f7f1] hover:bg-[#e7efe2] text-[#153e26] border border-[#c3dcb9] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create New Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              setCategoryFilter('All Products');
              setCurrentView('shop');
            }}
            aria-label="Wishlist"
            className="hidden sm:inline-flex p-2 hover:bg-[#eaece5] rounded-full transition-colors relative cursor-pointer text-[#2d3a2e] hover:text-[#153e26]"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#153e26] rounded-full" />
            )}
          </button>

          {/* Cart Icon & Count Badge */}
          <button
            onClick={() => setCurrentView('cart')}
            aria-label="Shopping Cart"
            className="p-2 hover:bg-[#eaece5] rounded-full transition-colors relative cursor-pointer text-[#2d3a2e] hover:text-[#153e26]"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-[#153e26] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#fbfbf9] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="p-4 bg-[#153e26] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#a3e635]" />
                  </div>
                  <span className="font-serif text-lg font-bold">Verdant Grove</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Sign In / Account section in mobile drawer */}
              <div className="p-4 bg-[#f0f5ec] border-b border-[#dce8d6]">
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#153e26]">{currentUser.name}</div>
                      <div className="text-[11px] text-gray-500">{currentUser.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAuth('login')}
                      className="flex-1 py-2 bg-[#153e26] text-white text-xs font-semibold rounded-lg text-center cursor-pointer shadow-xs"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleOpenAuth('register')}
                      className="flex-1 py-2 bg-white border border-[#b8d4b3] text-[#153e26] text-xs font-semibold rounded-lg text-center cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>

              {/* Main Nav Items */}
              <div className="p-4 space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    currentView === 'home'
                      ? 'bg-[#153e26] text-white'
                      : 'text-[#153e26] hover:bg-[#eef2eb]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4" />
                    Home
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    setCategoryFilter('All Products');
                    handleNavClick('shop');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    currentView === 'shop'
                      ? 'bg-[#153e26] text-white'
                      : 'text-[#153e26] hover:bg-[#eef2eb]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Store className="w-4 h-4" />
                    Shop All Organic
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                {/* Mobile Track Order link */}
                <button
                  onClick={() => handleNavClick('track')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    currentView === 'track'
                      ? 'bg-[#153e26] text-white'
                      : 'text-[#153e26] hover:bg-[#eef2eb]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#2e7d32]" />
                    Track Order & Deliveries
                  </span>
                  <span className="text-xs font-bold bg-[#e3efe6] text-[#153e26] px-2 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                </button>

                {/* Mobile Admin Link */}
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-[#153e26] text-white'
                      : 'text-[#153e26] bg-[#f0f6ee] hover:bg-[#e4efe0]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
                    Admin Center (Store Control)
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-[#a3e635] text-[#153e26] px-2 py-0.5 rounded-full">
                    Real Data
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('cart')}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    currentView === 'cart'
                      ? 'bg-[#153e26] text-white'
                      : 'text-[#153e26] hover:bg-[#eef2eb]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    Cart & Checkout
                  </span>
                  {totalCartCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-[#153e26] text-white rounded-full">
                      {totalCartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsAboutOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-[#153e26] hover:bg-[#eef2eb] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Info className="w-4 h-4" />
                    Our Story & Farms
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    setIsBlogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-[#153e26] hover:bg-[#eef2eb] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4" />
                    Harvest Journal
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>
              </div>

              {/* Categories Section */}
              <div className="p-4 pt-2 border-t border-[#e2e6dd]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#576d59] mb-2 px-1">
                  Shop by Category
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        categoryFilter === cat && currentView === 'shop'
                          ? 'bg-[#e3efe6] text-[#153e26] font-bold'
                          : 'text-[#384a3b] hover:bg-[#eef1eb]'
                      }`}
                    >
                      <span>{cat}</span>
                      <Sprout className="w-3.5 h-3.5 text-[#3b824b] opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="p-4 border-t border-[#e2e6dd] bg-[#f4f6f0] text-xs text-[#526453] space-y-2">
              <div className="flex items-center gap-2 font-medium text-[#153e26]">
                <Leaf className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>100% Certified Organic Foods</span>
              </div>
              <p className="text-[11px] text-[#637564]">
                Carbon-Neutral Express Home Delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
