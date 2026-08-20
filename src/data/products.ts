import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'avocado-oil',
    name: 'Organic Extra Virgin Avocado Oil',
    subtitle: 'Cold-pressed, high heat cooking oil.',
    category: 'Oils & Vinegars',
    price: 18.99,
    rating: 5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '250ml Bottle',
    sizes: ['250ml', '500ml'],
    pricePerSize: {
      '250ml': 18.99,
      '500ml': 32.99
    },
    description: 'Cold-pressed from the finest Hass avocados, our Organic Extra Virgin Avocado Oil offers a buttery, smooth flavor and a high smoke point perfect for searing, roasting, and finishing. Sourced sustainably for maximum purity and nutritional benefit.',
    detailedDescription: 'Elevate your culinary creations with our premium Organic Extra Virgin Avocado Oil. Meticulously cold-pressed from the flesh of ripe, sustainably grown Hass avocados, this versatile oil is a kitchen essential for those who prioritize both exceptional taste and vibrant health.\n\nUnlike many other cooking oils, avocado oil boasts a naturally high smoke point (up to 500°F/260°C), making it the ideal choice for high-heat cooking methods such as searing, sautéing, and roasting without breaking down and losing its nutritional integrity or flavor profile.',
    keyBenefits: [
      'Rich in heart-healthy monounsaturated fats (oleic acid).',
      'Contains lutein, an antioxidant beneficial for eye health.',
      'Enhances the absorption of important nutrients found in vegetables.'
    ],
    specifications: {
      origin: 'Mexico',
      extraction: 'Cold-Pressed',
      smokePoint: '500°F (260°C)',
      certifications: 'USDA Organic, Non-GMO',
      shelfLife: '24 Months',
      storage: 'Store in a cool, dark place away from direct sunlight.'
    },
    nutritionFacts: {
      servingSize: '1 Tbsp (15ml)',
      servingsPerContainer: '16',
      calories: 120,
      totalFat: '14g',
      saturatedFat: '2g',
      transFat: '0g',
      polyunsaturatedFat: '2g',
      monounsaturatedFat: '10g',
      sodium: '0mg',
      totalCarb: '0g',
      dietaryFiber: '0g',
      sugars: '0g',
      protein: '0g',
      vitaminE: '15%'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'macadamia-nuts',
    name: 'Organic Macadamia Nuts',
    subtitle: 'Raw, unsalted, and sustainably sourced.',
    category: 'Nuts & Seeds',
    price: 12.99,
    rating: 5,
    reviewCount: 130,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '8 oz Kraft Pouch',
    sizes: ['8 oz', '16 oz', '32 oz'],
    pricePerSize: {
      '8 oz': 12.99,
      '16 oz': 22.99,
      '32 oz': 39.99
    },
    description: 'Whole, raw macadamia nuts harvested at peak ripeness. Creamy, rich, and naturally loaded with healthy fats and manganese.',
    detailedDescription: 'Hand-picked from certified biodynamic groves in Hawaii, our macadamia nuts are gently cracked and preserved without added salts or oils. Their buttery texture and delicate sweetness make them an exquisite keto snack, baking accent, or dairy-free milk base.',
    keyBenefits: [
      'Highest concentration of monounsaturated fats among all tree nuts.',
      'Naturally rich in manganese and thiamine (Vitamin B1).',
      'Zero added sodium, preservatives, or irradiation.'
    ],
    specifications: {
      origin: 'Hawaii, USA',
      extraction: 'Sun-dried & Shelled',
      certifications: 'USDA Organic, Non-GMO Verified, Kosher',
      shelfLife: '12 Months',
      storage: 'Keep refrigerated after opening for optimal crunch.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'maple-syrup',
    name: 'Organic Maple Syrup',
    subtitle: 'Grade A Dark, robust taste from family farms.',
    category: 'Natural Sweeteners',
    price: 10.49,
    originalPrice: 12.99,
    rating: 5,
    reviewCount: 102,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '32 oz Glass Bottle',
    sizes: ['16 oz Glass', '32 oz Glass Bottle'],
    pricePerSize: {
      '16 oz Glass': 10.49,
      '32 oz Glass Bottle': 24.00
    },
    description: '100% pure Grade A Dark maple syrup with a robust, caramelized flavor profile. Tapped sustainably from old-growth Vermont sugar maples.',
    detailedDescription: 'Crafted over wood-fired evaporators by multi-generational family sugar makers, our Grade A Dark maple syrup captures the deep soul of Northern hardwood forests. Free from artificial corn syrups, preservatives, and colorants.',
    keyBenefits: [
      'Natural low-glycemic alternative to refined white sugars.',
      'Contains over 24 distinct plant antioxidants.',
      'Rich in essential trace minerals: zinc and manganese.'
    ],
    specifications: {
      origin: 'Vermont, USA',
      extraction: 'Wood-fired Evaporation',
      certifications: 'USDA Organic, Non-GMO, 100% Pure Grade A',
      shelfLife: '36 Months sealed',
      storage: 'Refrigerate after opening.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'amaranth-grain',
    name: 'Organic Amaranth',
    subtitle: 'Ancient grain, high in protein and gluten-free.',
    category: 'Grains & Legumes',
    price: 7.99,
    originalPrice: 9.99,
    isSale: true,
    rating: 5,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574316071802-0d684efa7cd5?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Sale',
    packageSize: '1 lb Paper Sack',
    sizes: ['1 lb Paper Sack', '2 lb Paper Sack', '5 lb Bulk Bag'],
    pricePerSize: {
      '1 lb Paper Sack': 7.51,
      '2 lb Paper Sack': 13.99,
      '5 lb Bulk Bag': 29.99
    },
    description: 'Nutty, nutrient-dense ancient Aztec supergrain with a complete amino acid profile. Naturally gluten-free and easy to digest.',
    detailedDescription: 'Prized for millennia as the food of immortality, our non-hybridized organic amaranth grain offers an earthy, peppery-sweet flavor when simmered into porridge, popped like miniature corn, or ground into wholesome flour.',
    keyBenefits: [
      'Complete protein containing all 9 essential amino acids including lysine.',
      'Naturally gluten-free grain suitable for celiac dietary needs.',
      'High in dietary fiber, non-heme iron, and magnesium.'
    ],
    specifications: {
      origin: 'Bolivia',
      extraction: 'Traditional De-hulling & Triple Sifted',
      certifications: 'USDA Organic, Certified Gluten-Free',
      shelfLife: '24 Months',
      storage: 'Store in an airtight container in a pantry.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'matcha-powder',
    name: 'Organic Matcha Powder',
    subtitle: 'Ceremonial grade, rich in antioxidants.',
    category: 'Superfoods & Powders',
    price: 18.99,
    rating: 5,
    reviewCount: 66,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '100g Tin',
    sizes: ['50g Tin', '100g Tin', '250g Pouch'],
    pricePerSize: {
      '50g Tin': 18.99,
      '100g Tin': 32.99,
      '250g Pouch': 64.99
    },
    description: 'First-harvest ceremonial grade Japanese green tea powder shade-grown in Uji, Kyoto. Vibrant emerald green with umami sweetness.',
    detailedDescription: 'Stone-ground using granite mills, our shade-cultivated Tencha leaves yield unmatched L-theanine and EGCG polyphenol density. Delivers sustained calm focus without the caffeine crash.',
    keyBenefits: [
      '137 times more antioxidants than standard brewed green tea.',
      'L-Theanine promotes relaxed alertness and focused mindfulness.',
      'Supports healthy metabolism and liver cellular defense.'
    ],
    specifications: {
      origin: 'Uji, Kyoto, Japan',
      extraction: 'Slow Granite Stone Ground',
      certifications: 'JAS Organic, USDA Organic',
      shelfLife: '12 Months unopened',
      storage: 'Keep sealed in freezer or refrigerator.'
    },
    inStock: true,
    featured: true
  },
  {
    id: 'olive-oil',
    name: 'Single-Estate Extra Virgin Olive Oil',
    subtitle: 'Early harvest, robust Koroneiki olives.',
    category: 'Oils & Vinegars',
    price: 21.50,
    rating: 5,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '500ml Dark Glass',
    description: 'High-polyphenol cold extracted olive oil from southern Greek hillsides with fresh cut grass and artichoke tasting notes.',
    specifications: {
      origin: 'Peloponnese, Greece',
      extraction: 'Cold Pressed within 4 hours of harvest',
      certifications: 'EU Organic, USDA Organic, PGI Certified'
    },
    inStock: true,
    featured: false
  },
  {
    id: 'raw-honey',
    name: 'Wild Mountain Raw Honey',
    subtitle: 'Unfiltered, enzyme-rich floral nectar.',
    category: 'Natural Sweeteners',
    price: 14.50,
    rating: 5,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '16 oz Glass Jar',
    description: 'Never heated above 105°F to preserve active pollen, propolis, and live digestive enzymes.',
    specifications: {
      origin: 'Cascade Range, Oregon',
      extraction: 'Raw Gravity Settled',
      certifications: 'USDA Organic, Non-GMO Verified'
    },
    inStock: true,
    featured: false
  },
  {
    id: 'chia-seeds',
    name: 'Organic Black Chia Seeds',
    subtitle: 'Omega-3 rich super seeds for puddings and smoothies.',
    category: 'Nuts & Seeds',
    price: 6.99,
    originalPrice: 8.50,
    isSale: true,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Sale',
    packageSize: '1 lb Eco Pouch',
    description: 'High hydrophilic fiber seeds that expand up to 12x their weight, promoting long-lasting satiety and hydration.',
    specifications: {
      origin: 'Argentina',
      extraction: 'Clean Sifted',
      certifications: 'USDA Organic, Fair Trade Certified'
    },
    inStock: true,
    featured: false
  },
  {
    id: 'cacao-powder',
    name: 'Ceremonial Heirloom Cacao Powder',
    subtitle: 'Sun-cured Criollo raw cacao beans.',
    category: 'Superfoods & Powders',
    price: 15.99,
    rating: 5,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Organic',
    packageSize: '12 oz Resealable Kraft',
    description: 'Rich in magnesium and theobromine for gentle mood and heart elevation without artificial additives.',
    specifications: {
      origin: 'Ecuador',
      extraction: 'Cold Fermented & Milled',
      certifications: 'USDA Organic, Direct Trade'
    },
    inStock: true,
    featured: false
  }
];

export const initialReviews = [
  {
    id: 'r1',
    author: 'Eleanor Vance',
    rating: 5,
    date: 'August 12, 2024',
    title: 'Highest quality avocado oil on the market',
    comment: 'The buttery aroma is immediately noticeable when you crack the bottle. Used it for roasting root vegetables and it held up beautifully with no burning.',
    verified: true
  },
  {
    id: 'r2',
    author: 'Marcus Sterling',
    rating: 5,
    date: 'August 3, 2024',
    title: 'Clean taste and exceptional bottle dispenser',
    comment: 'Love the dark bottle protecting the precious antioxidants. Pure avocado freshness without any rancidity or seed oil blending.',
    verified: true
  },
  {
    id: 'r3',
    author: 'Dr. Clara Lin',
    rating: 5,
    date: 'July 28, 2024',
    title: 'Daily staple for anti-inflammatory cooking',
    comment: 'As a nutritionist, I recommend this exact oil to all my patients. Truly cold-pressed with vibrant natural chlorophyll hues.',
    verified: true
  }
];
