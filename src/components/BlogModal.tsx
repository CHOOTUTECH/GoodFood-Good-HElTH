import React from 'react';
import { Leaf, X, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BlogModal: React.FC = () => {
  const { isBlogOpen, setIsBlogOpen, navigateToProduct } = useShop();

  if (!isBlogOpen) return null;

  const articles = [
    {
      id: 'art-1',
      title: 'Why Cold-Pressed Avocado Oil is the Ultimate High-Heat Cooking Oil',
      date: 'August 14, 2024',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      summary: 'Explore why avocado oil boasts a 500°F smoke point, high monounsaturated fats, and vital lutein without oxidizing under heat.',
      linkedProductId: 'avocado-oil'
    },
    {
      id: 'art-2',
      title: 'Ancient Amaranth: How Aztecs Fuelled Their Dynasties with Supergrains',
      date: 'July 29, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      summary: 'A complete protein packed with all 9 essential amino acids. Here are 3 simple breakfast porridge recipes for sustained energy.',
      linkedProductId: 'amaranth-grain'
    },
    {
      id: 'art-3',
      title: 'The Ritual of Ceremonial Uji Matcha: Calm Energy for Mindful Days',
      date: 'July 11, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      summary: 'Learn how stone-ground Tencha leaves provide L-theanine for alpha brain wave stimulation without caffeine jitters.',
      linkedProductId: 'matcha-powder'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#153e26] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#a3e635]" />
            <span className="font-serif text-lg font-bold">Verdant Grove Harvest Journal</span>
          </div>
          <button
            onClick={() => setIsBlogOpen(false)}
            aria-label="Close"
            className="text-gray-300 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#153e26]">
              Recipes & Organic Living Guides
            </h3>
            <p className="text-xs text-[#526453]">
              Nutritional science, farm spotlight stories, and seasonal whole-food culinary ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-[#fbfbf9] rounded-2xl border border-[#e5e8e1] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                      <Calendar className="w-3 h-3 text-[#2e7d32]" />
                      <span>{art.date}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-[#2e7d32]" />
                      <span>{art.readTime}</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-[#153e26] leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-[#637564] line-clamp-3">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      navigateToProduct(art.linkedProductId);
                      setIsBlogOpen(false);
                    }}
                    className="w-full text-left inline-flex items-center justify-between text-xs font-semibold text-[#153e26] hover:text-[#2d6a4f] pt-2 border-t border-gray-200 cursor-pointer"
                  >
                    <span>View Sourced Item</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
