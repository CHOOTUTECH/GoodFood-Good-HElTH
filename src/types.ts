export interface Product {
  id: string;
  slug?: string;
  name: string;
  subtitle?: string;
  category: 'Oils & Vinegars' | 'Nuts & Seeds' | 'Grains & Legumes' | 'Superfoods & Powders' | 'Natural Sweeteners';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  badge?: string; // 'Organic', 'Bulk', 'Sale'
  isSale?: boolean;
  packageSize: string; // e.g. "32 oz Glass Bottle", "1 lb Paper Sack", "250ml"
  sizes?: string[]; // e.g. ["250ml", "500ml"]
  pricePerSize?: Record<string, number>;
  description: string;
  detailedDescription?: string;
  keyBenefits?: string[];
  specifications: {
    origin: string;
    extraction?: string;
    smokePoint?: string;
    certifications: string;
    shelfLife?: string;
    storage?: string;
  };
  nutritionFacts?: {
    servingSize: string;
    servingsPerContainer: string;
    calories: number;
    totalFat: string;
    saturatedFat: string;
    transFat: string;
    polyunsaturatedFat: string;
    monounsaturatedFat: string;
    sodium: string;
    totalCarb: string;
    dietaryFiber: string;
    sugars: string;
    protein: string;
    vitaminE?: string;
    iron?: string;
  };
  inStock: boolean;
  stockCount?: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  unitPrice: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  avatar?: string;
  createdAt?: string;
}

export type OrderStatus = 'placed' | 'harvested' | 'packed' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string; // e.g. VG-8942
  trackingNumber: string; // e.g. TRK-ORG-894201
  userId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
  carrier?: string;
}
