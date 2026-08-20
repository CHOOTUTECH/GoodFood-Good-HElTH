import React from 'react';
import { Leaf, X, Sprout, HeartHandshake, Globe, Award, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import familyFarmImage from '../assets/images/family_farming_harvest_1786971161043.jpg';

export const AboutModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen, setCurrentView } = useShop();

  if (!isAboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#153e26] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#a3e635]" />
            <span className="font-serif text-base sm:text-lg font-bold">About Verdant Grove</span>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            aria-label="Close"
            className="text-gray-300 hover:text-white p-1 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm text-[#4e6050]">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100 shadow-inner">
            <img
              src={familyFarmImage}
              alt="Verdant Grove family farming and harvesting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-[#153e26]/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[11px] font-medium border border-white/20">
              Generational Organic Growers
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#153e26]">
              Cultivating Wellness from the Ground Up
            </h3>
            <p className="leading-relaxed">
              Founded with a simple belief: the food we put in our bodies should nourish both our vitality and the earth that produced it. We partner directly with certified organic family growers across clean agricultural heartlands.
            </p>
            <p className="leading-relaxed">
              Every single product in our catalog meets strict regenerative standards: zero chemical pesticides, zero synthetic fertilizers, no GMO seeds, and ethical living wages for every grower family.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-[#f8f9f6] rounded-xl border border-[#e5e8e1] space-y-1">
              <div className="font-bold text-[#153e26] flex items-center gap-1.5 text-xs">
                <Award className="w-4 h-4 text-[#2e7d32]" />
                100% Certified Organic
              </div>
              <p className="text-[11px] text-gray-500">Every harvest is independently certified & tested.</p>
            </div>
            <div className="p-3.5 bg-[#f8f9f6] rounded-xl border border-[#e5e8e1] space-y-1">
              <div className="font-bold text-[#153e26] flex items-center gap-1.5 text-xs">
                <Globe className="w-4 h-4 text-[#2e7d32]" />
                Carbon-Neutral & Compostable
              </div>
              <p className="text-[11px] text-gray-500">Plastic-free recyclable paper & glass packaging.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsAboutOpen(false);
                setCurrentView('shop');
              }}
              className="w-full min-h-[44px] py-3 bg-[#153e26] hover:bg-[#205234] text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center"
            >
              Explore Our Pure Provisions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

