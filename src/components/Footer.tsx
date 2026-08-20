import React, { useState } from 'react';
import { Leaf, Instagram, Share2, Youtube, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setCategoryFilter, setIsAboutOpen, setIsBlogOpen } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-[#f4f4f0] border-t border-[#e6e6dc] text-[#334235]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#153e26] flex items-center justify-center text-white">
                <Leaf className="w-3.5 h-3.5 text-[#a3e635]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#153e26]">
                Verdant Grove
              </span>
            </div>
            <p className="text-sm text-[#546555] leading-relaxed pr-4">
              Your trusted source for 100% organic food products. Eat healthy, live healthy, and make this world a better place. Direct from our trusted farms to your table.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-[#465a48]">
              <a
                href="#social"
                onClick={(e) => e.preventDefault()}
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white border border-[#deded4] flex items-center justify-center hover:bg-[#153e26] hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-[#deded4] flex items-center justify-center hover:bg-[#153e26] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                aria-label="Youtube"
                className="w-9 h-9 rounded-full bg-white border border-[#deded4] flex items-center justify-center hover:bg-[#153e26] hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#153e26] text-[15px] mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#526453]">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCategoryFilter('All Products');
                    setCurrentView('shop');
                  }}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCategoryFilter('Oils & Vinegars');
                    setCurrentView('shop');
                  }}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  Oils & Vinegars
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  About Our Farms
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsBlogOpen(true)}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  Healthy Living Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-[#153e26] text-[15px] mb-4 tracking-wide">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm text-[#526453]">
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-[#153e26] transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-[#153e26]"
                >
                  <span>🚚 Track Order & Delivery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('cart')}
                  className="hover:text-[#153e26] transition-colors cursor-pointer"
                >
                  My Cart & Orders
                </button>
              </li>
              <li>
                <span className="hover:text-[#153e26] transition-colors cursor-pointer">
                  Shipping & Cold-Chain Info
                </span>
              </li>
              <li>
                <span className="hover:text-[#153e26] transition-colors cursor-pointer">
                  Farm Harvest Certification
                </span>
              </li>
              <li>
                <span className="hover:text-[#153e26] transition-colors cursor-pointer">
                  Privacy Policy & Guarantees
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Us & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#153e26] text-[15px] mb-2 tracking-wide">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-sm text-[#526453]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#153e26] shrink-0" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#153e26] shrink-0" />
                <span>info@verdantgrove.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#153e26] shrink-0 mt-0.5" />
                <span>123 Green Street, Healthy City, NC 12345, USA</span>
              </div>
            </div>

            {/* Inline mini subscribe */}
            <div className="pt-2">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white border border-[#d6d8cf] px-3 py-2 rounded-lg text-xs w-full focus:outline-none focus:border-[#153e26]"
                />
                <button
                  type="submit"
                  className="bg-[#153e26] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#205234] transition-colors shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-[#153e26] mt-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>Thank you for subscribing!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#e2e4da] flex flex-col md:flex-row items-center justify-between text-xs text-[#6a7d6c] gap-4">
          <div>
            © 2024 Verdant Grove Organic Market. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#153e26] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#153e26] transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
