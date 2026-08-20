/**
 * ==============================================================================
 * VERDANT GROVE - BACKEND API INTEGRATION SERVICE (REST / GRAPHQL READY)
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH GUIDE FOR BACKEND INTEGRATION:
 * 
 * Yeh file sabhi backend API endpoints ke liye central service layer hai.
 * Jab aap apna backend (Node.js/Express, Python/Django, FastAPI, Firebase, Supabase, PHP)
 * connect karenge, toh aapko bas yaha par endpoints ke URLs aur request handling uncomment karni hogi.
 * 
 * 1. Base URL: Apna backend server URL `.env` me configure karein (e.g. VITE_API_BASE_URL=http://localhost:5000/api)
 * 2. Auth Headers: JWT token ya API key yaha se automatically add ho sakti hai.
 * 3. Fallback: Agar backend band ho ya development mode ho, toh automatically local mock data se app chalta rahega.
 */

import { Product, Review, CartItem, User, Order } from '../types';
import { initialProducts } from '../data/products';

// 🌐 1. Backend Base URL Configuration
// Jab backend ready ho, `.env` me VITE_API_BASE_URL=http://localhost:5000/api set karein.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Common Fetch helper with Authorization token and JSON headers
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token'); // Agar user logged in ho toh token yaha se aayega
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorBody}`);
  }

  return response.json();
}

// ==============================================================================
// 🛍️ 2. PRODUCTS API (Products fetching, sorting, category filtering, search)
// ==============================================================================

export const ProductService = {
  /**
   * [API 1: Fetch All Products / Filtered Products]
   * GET /api/products?category=...&search=...&minPrice=...&maxPrice=...&sort=...
   */
  async getProducts(params?: {
    category?: string;
    search?: string;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    const query = new URLSearchParams(params as any).toString();
    return await apiRequest<{ products: Product[]; total: number }>(`/products?${query}`);
    */

    // 👉 CURRENT FALLBACK: Local filtered array
    let result = [...initialProducts];
    if (params?.category && params.category !== 'All Products') {
      result = result.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params?.maxPrice) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }
    return { products: result, total: result.length };
  },

  /**
   * [API 2: Fetch Single Product Details by ID]
   * GET /api/products/:id
   */
  async getProductById(id: string): Promise<Product | null> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<Product>(`/products/${id}`);
    */

    // 👉 CURRENT FALLBACK:
    const product = initialProducts.find(p => p.id === id);
    return product || null;
  },

  /**
   * [API 3: Fetch Product Customer Reviews]
   * GET /api/products/:id/reviews
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<Review[]>(`/products/${productId}/reviews`);
    */

    return [];
  },

  /**
   * [API 4: Submit New Customer Review]
   * POST /api/products/:id/reviews
   * Payload: { author, rating, title, comment }
   */
  async submitReview(productId: string, reviewData: {
    author: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<{ success: boolean; review: Review }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<{ success: boolean; review: Review }>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    */

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: reviewData.author,
      rating: reviewData.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: reviewData.title,
      comment: reviewData.comment,
      verified: true
    };
    return { success: true, review: newReview };
  }
};

// ==============================================================================
// 🛒 3. CART & WISHLIST API (Synchronize user cart with backend database)
// ==============================================================================

export const CartService = {
  /**
   * [API 5: Sync / Save Cart to User Account]
   * POST /api/cart/sync
   * Payload: { items: CartItem[] }
   */
  async syncCartWithServer(items: CartItem[]): Promise<{ success: boolean; cart: CartItem[] }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<{ success: boolean; cart: CartItem[] }>('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
    */
    return { success: true, cart: items };
  },

  /**
   * [API 6: Fetch Cart from Server (For logged in user)]
   * GET /api/cart
   */
  async getCart(): Promise<CartItem[]> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<CartItem[]>('/cart');
    */
    return [];
  },

  /**
   * [API 7: Validate Promo / Discount Coupon]
   * POST /api/cart/validate-coupon
   * Payload: { code: string, subtotal: number }
   */
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discountPercentage?: number; discountAmount?: number; message?: string }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest('/cart/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    });
    */

    if (code.trim().toUpperCase() === 'ORGANIC10') {
      return { valid: true, discountPercentage: 10, discountAmount: subtotal * 0.1, message: '10% discount applied!' };
    }
    return { valid: false, message: 'Invalid coupon code' };
  }
};

// ==============================================================================
// 💳 4. ORDER CREATION & CHECKOUT PAYMENT GATEWAY API
// ==============================================================================

export interface OrderPayload {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'cod' | 'upi' | 'paypal' | 'razorpay';
  cardDetails?: {
    cardNumber: string;
    exp: string;
    cvv: string;
  };
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  trackingNumber: string;
  estimatedDelivery: string;
  status: 'confirmed' | 'pending' | 'processing';
}

export const OrderService = {
  /**
   * [API 8: Place New Order / Process Payment]
   * POST /api/orders
   * 
   * 👉 Agar aap Razorpay ya Stripe use kar rahe hain:
   * 1. Pehle server par POST /api/payments/create-order call karein to get order_id / client_secret
   * 2. Razorpay/Stripe client SDK open karein
   * 3. Payment verify karne ke baad POST /api/orders call karein
   */
  async createOrder(orderPayload: OrderPayload): Promise<OrderResponse> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
    */

    // Simulated Server Response:
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: `VG-${Math.floor(1000 + Math.random() * 9000)}`,
          trackingNumber: `TRK-ORG-${Date.now().toString().slice(-6)}`,
          estimatedDelivery: '2-3 Business Days',
          status: 'confirmed'
        });
      }, 500);
    });
  }
};

// ==============================================================================
// ✉️ 5. NEWSLETTER & MARKETING SUBSCRIPTION API
// ==============================================================================

export const MarketingService = {
  /**
   * [API 9: Subscribe to 10% Discount Newsletter]
   * POST /api/newsletter/subscribe
   * Payload: { email: string }
   */
  async subscribeNewsletter(email: string): Promise<{ success: boolean; discountCoupon?: string; message: string }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    */

    return {
      success: true,
      discountCoupon: 'ORGANIC10',
      message: 'Thank you for subscribing! Your 10% coupon code is ORGANIC10.'
    };
  }
};

// ==============================================================================
// 👤 6. USER AUTHENTICATION & PROFILE API (Login, Register, Logout, Profile)
// ==============================================================================

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export const AuthService = {
  /**
   * [API 10: User Login]
   * POST /api/auth/login
   * Payload: { email, password, rememberMe }
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
    */

    // Simulated Server Verification:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!payload.email || !payload.password) {
          reject(new Error('Email and password are required'));
          return;
        }

        const mockUser: User = {
          id: `usr-${Date.now()}`,
          name: payload.email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
          email: payload.email,
          phone: '+1 (555) 234-5678',
          address: {
            street: '742 Evergreen Terrace',
            city: 'Portland',
            state: 'OR',
            zip: '97201'
          },
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toISOString()
        };

        const mockToken = `vg_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem('auth_token', mockToken);

        resolve({
          success: true,
          user: mockUser,
          token: mockToken,
          message: 'Successfully logged in'
        });
      }, 500);
    });
  },

  /**
   * [API 11: User Registration]
   * POST /api/auth/register
   * Payload: { name, email, password, phone, address }
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
    */

    // Simulated Server Registration:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!payload.name || !payload.email || !payload.password) {
          reject(new Error('Please fill in all required fields'));
          return;
        }

        const newUser: User = {
          id: `usr-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone || '+1 (555) 019-2834',
          address: payload.address || {
            street: '124 Organic Orchard Way',
            city: 'Seattle',
            state: 'WA',
            zip: '98101'
          },
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          createdAt: new Date().toISOString()
        };

        const mockToken = `vg_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem('auth_token', mockToken);

        resolve({
          success: true,
          user: newUser,
          token: mockToken,
          message: 'Account created successfully!'
        });
      }, 600);
    });
  },

  /**
   * [API 12: Get Current Logged-in User Profile]
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<User | null> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    try {
      return await apiRequest<User>('/auth/me');
    } catch {
      return null;
    }
    */

    const savedUser = localStorage.getItem('vg_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * [API 13: User Logout]
   * POST /api/auth/logout
   */
  async logout(): Promise<void> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    */
    localStorage.removeItem('auth_token');
    localStorage.removeItem('vg_current_user');
  }
};

// ==============================================================================
// 📦 7. ORDER HISTORY & LIVE PRODUCT TRACKER API
// ==============================================================================

export const OrderTrackerService = {
  /**
   * [API 14: Get User Orders History]
   * GET /api/user/orders
   */
  async getUserOrders(userId?: string): Promise<Order[]> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<Order[]>('/user/orders');
    */

    const saved = localStorage.getItem('vg_orders_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  },

  /**
   * [API 15: Track Order by Order ID or Tracking Number]
   * GET /api/orders/track/:orderIdOrTracking
   */
  async trackOrder(orderIdOrTracking: string): Promise<Order | null> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest<Order>(`/orders/track/${encodeURIComponent(orderIdOrTracking)}`);
    */

    const cleanQuery = orderIdOrTracking.trim().toUpperCase();
    const allOrders = await this.getUserOrders();
    const matched = allOrders.find(
      o => o.id.toUpperCase() === cleanQuery || o.trackingNumber.toUpperCase() === cleanQuery
    );

    if (matched) return matched;

    // Generate realistic demo tracking data for any arbitrary tracking/order ID:
    return {
      id: cleanQuery.startsWith('VG-') ? cleanQuery : `VG-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: cleanQuery.startsWith('TRK-') ? cleanQuery : `TRK-ORG-${Math.floor(100000 + Math.random() * 900000)}`,
      customerEmail: 'jairam.customer@verdantgrove.com',
      customerName: 'Jairam Singh',
      shippingAddress: {
        street: '742 Organic Harvest Way, Suite 4B',
        city: 'Portland',
        state: 'OR',
        zip: '97201'
      },
      items: [
        {
          product: initialProducts[0], // Extra Virgin Olive Oil
          quantity: 2,
          selectedSize: '500ml Glass Bottle',
          unitPrice: 24.50
        },
        {
          product: initialProducts[2], // Maple Syrup
          quantity: 1,
          selectedSize: '32 oz Glass Jug',
          unitPrice: 22.00
        }
      ],
      subtotal: 71.00,
      discount: 7.10,
      shipping: 0,
      total: 63.90,
      paymentMethod: 'Credit Card (**** 4242)',
      status: 'in_transit',
      orderDate: new Date(Date.now() - 1000 * 60 * 60 * 28).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      estimatedDelivery: 'Tomorrow, by 4:00 PM',
      carrier: 'Verdant Eco-Express (Zero-Emission Fleet)',
      trackingSteps: [
        {
          status: 'placed',
          title: 'Order Confirmed & Payment Verified',
          description: 'Payment processed securely. Farm provisioning slip generated.',
          timestamp: 'Yesterday, 09:15 AM',
          completed: true
        },
        {
          status: 'harvested',
          title: 'Harvest Quality Inspected & Selected',
          description: 'Verified 100% organic grade batch by our master agronomist.',
          timestamp: 'Yesterday, 01:30 PM',
          completed: true
        },
        {
          status: 'packed',
          title: 'Packed in Biodegradable Insulation',
          description: 'Sealed with recyclable thermal insulation and natural ice packs.',
          timestamp: 'Yesterday, 06:45 PM',
          completed: true
        },
        {
          status: 'in_transit',
          title: 'In Transit — Eco Delivery Hub',
          description: 'Package dispatched via regional zero-emission electric courier.',
          timestamp: 'Today, 08:20 AM',
          completed: true,
          current: true
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Courier driver will deliver to your doorstep safely.',
          timestamp: 'Estimated Tomorrow, 10:00 AM',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered Fresh',
          description: 'Package delivered at your front door / porch.',
          timestamp: 'Estimated Tomorrow, 04:00 PM',
          completed: false
        }
      ]
    };
  },

  /**
   * [API 16: Save New Placed Order]
   * POST /api/orders
   */
  async saveNewOrder(order: Order): Promise<void> {
    const existing = await this.getUserOrders();
    const updated = [order, ...existing];
    localStorage.setItem('vg_orders_history', JSON.stringify(updated));
  }
};

export const UserService = {
  /**
   * [API 17: Sync Wishlist with User Account]
   * POST /api/user/wishlist
   * Payload: { productIds: string[] }
   */
  async syncWishlist(productIds: string[]): Promise<{ success: boolean }> {
    /* 
    // 👉 REAL API IMPLEMENTATION:
    return await apiRequest('/user/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productIds })
    });
    */
    return { success: true };
  }
};
