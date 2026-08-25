/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { TrackOrderView } from './components/TrackOrderView';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { AboutModal } from './components/AboutModal';
import { BlogModal } from './components/BlogModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const AppContent: React.FC = () => {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-[#1a2e1d] selection:bg-[#153e26] selection:text-white">
      {/* Top Sticky Header */}
      <Header />

      {/* Main Content Area with Smooth Screen Transitions and Mobile Bottom Padding */}
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView />
            </motion.div>
          )}

          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ShopView />
            </motion.div>
          )}

          {currentView === 'product' && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProductDetailView />
            </motion.div>
          )}

          {currentView === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <CartView />
            </motion.div>
          )}

          {currentView === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TrackOrderView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals & Drawers */}
      <CheckoutModal />
      <SearchModal />
      <AboutModal />
      <BlogModal />
      <AuthModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

