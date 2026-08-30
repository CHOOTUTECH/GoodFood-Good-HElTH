/**
 * ==============================================================================
 * VERDANT GROVE - BACKEND REST API SERVICE LAYER
 * ==============================================================================
 * 
 * 📌 BASE URL: http://127.0.0.1:8000/api/ (Configurable via VITE_API_BASE_URL)
 * 
 * 🔗 FULL LIST OF INTEGRATED ENDPOINTS:
 *  1.  GET       /api/products                          -> Fetch all / filtered products list
 *  2.  GET       /api/products/{slug}                   -> Fetch single product details by slug or ID
 *  3.  GET       /api/products/{slug}/reviews           -> Fetch product customer reviews
 *  4.  POST      /api/products/{slug}/reviews           -> Post new customer review
 *  5.  POST      /api/auth/register                     -> Register new user account
 *  6.  POST      /api/auth/login                        -> Authenticate user and return JWT token
 *  7.  GET       /api/auth/me                           -> Get current logged-in user profile
 *  8.  GET       /api/cart                              -> Fetch user's server-stored cart
 *  9.  POST      /api/cart                              -> Add / update single item in cart
 * 10.  POST      /api/cart/sync                         -> Sync complete cart items with server
 * 11.  GET       /api/orders                            -> Get all orders for authenticated user
 * 12.  POST      /api/orders                            -> Create new order & initiate checkout
 * 13.  GET       /api/orders/track/{number-or-tracking} -> Track order status & delivery progress
 * 14.  POST      /api/user/wishlist                     -> Sync & save user's wishlist
 * 15.  POST      /api/newsletter/subscribe              -> Newsletter email subscription
 */

import { Product, Review, CartItem, User, Order } from '../types';
import { initialProducts, initialReviews } from '../data/products';

// 🌐 1. Base URL Configuration (Defaults to relative /api on same host, or VITE_API_BASE_URL if configured)
export const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/**
 * Clean URL formatting helper to prevent duplicate slashes
 */
function buildEndpointUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Common Fetch helper with Authorization token, timeout and JSON handling
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const fullUrl = buildEndpointUrl(endpoint);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // 401 on unauthenticated guest requests is expected and normal
      let errorMessage = `API Error [${response.status}] ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message || errorData?.error) {
          errorMessage = errorData.message || errorData.error;
        }
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }
      const errorObj: any = new Error(errorMessage);
      errorObj.status = response.status;
      throw errorObj;
    }

    return await response.json();
  } catch (error: any) {
    // Only log warning if it's not a standard guest 401
    if (error?.status !== 401) {
      console.warn(`[Verdant API] Request to ${fullUrl} could not connect:`, error.message || error);
    }
    throw error;
  }
}

// ==============================================================================
// 🛍️ 2. PRODUCTS API SERVICE
// ==============================================================================

export interface GetProductsParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

// Local Storage Helper for authoritative product store
export const getLocalStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return initialProducts;
  try {
    const saved = localStorage.getItem('vg_admin_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading vg_admin_products:', e);
  }
  // Initialize default products if not yet present
  try {
    localStorage.setItem('vg_admin_products', JSON.stringify(initialProducts));
  } catch (e) {}
  return initialProducts;
};

export const setLocalStoredProducts = (prods: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('vg_admin_products', JSON.stringify(prods));
  } catch (e) {
    console.error('Error saving vg_admin_products:', e);
  }
};

export const ProductService = {
  /**
   * 1. GET /api/products
   * Fetch all or filtered products directly with unified local/admin persistence
   */
  async getProducts(params?: GetProductsParams): Promise<{ products: Product[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All Products') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params?.sortBy) query.set('sort', params.sortBy);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';

    try {
      const response = await apiRequest<any>(endpoint);
      let list: Product[] = [];
      if (Array.isArray(response) && response.length > 0) {
        list = response;
      } else if (response && Array.isArray(response.products) && response.products.length > 0) {
        list = response.products;
      } else if (response && Array.isArray(response.data) && response.data.length > 0) {
        list = response.data;
      }

      if (list.length > 0) {
        setLocalStoredProducts(list);
        return { products: list, total: response.total ?? list.length };
      }
    } catch {
      // Backend not available - seamlessly use local authoritative store
    }

    // Authoritative Unified Store
    let result = [...getLocalStoredProducts()];
    if (params?.category && params.category !== 'All Products') {
      result = result.filter(p => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.specifications?.origin && p.specifications.origin.toLowerCase().includes(q))
      );
    }
    if (params?.maxPrice !== undefined) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }
    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.price >= params.minPrice!);
    }
    if (params?.sortBy) {
      if (params.sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
      else if (params.sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
      else if (params.sortBy === 'rating') result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      else if (params.sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return { products: result, total: result.length };
  },

  /**
   * 2. GET /api/products/{slug}
   * Fetch single product details by slug or ID
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiRequest<any>(`/products/${encodeURIComponent(slug)}`);
      if (response && response.product) return response.product;
      if (response && response.data) return response.data;
      if (response && response.id) return response;
    } catch {
      // ignore
    }
    const stored = getLocalStoredProducts();
    const found = stored.find(p => p.id === slug || (p.slug && p.slug === slug));
    return found || stored[0] || null;
  },

  /**
   * Alias for getProductBySlug (supports ID or slug)
   */
  async getProductById(id: string): Promise<Product | null> {
    return this.getProductBySlug(id);
  },

  /**
   * 3. GET /api/products/{slug}/reviews
   * Fetch product customer reviews
   */
  async getProductReviews(slug: string): Promise<Review[]> {
    try {
      const response = await apiRequest<any>(`/products/${encodeURIComponent(slug)}/reviews`);
      if (Array.isArray(response) && response.length > 0) return response;
      if (response && Array.isArray(response.reviews) && response.reviews.length > 0) return response.reviews;
      if (response && Array.isArray(response.data) && response.data.length > 0) return response.data;
    } catch {
      // ignore
    }
    return initialReviews;
  },

  /**
   * 4. POST /api/products/{slug}/reviews
   * Post new customer review
   */
  async submitReview(
    slug: string, 
    reviewData: { author: string; rating: number; title: string; comment: string }
  ): Promise<{ success: boolean; review?: Review; message?: string }> {
    try {
      return await apiRequest<{ success: boolean; review?: Review; message?: string }>(`/products/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    } catch {
      const fallbackReview: Review = {
        id: `rev-${Date.now()}`,
        author: reviewData.author || 'Verified Customer',
        rating: reviewData.rating || 5,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: reviewData.title || 'Verified Purchase',
        comment: reviewData.comment,
        verified: true
      };
      return { success: true, review: fallbackReview, message: 'Review submitted successfully!' };
    }
  },

  /**
   * Admin Create Product: POST /api/products
   */
  async createProduct(productData: Partial<Product>): Promise<{ success: boolean; product: Product; message?: string }> {
    const newId = productData.id || `prod-${Date.now()}`;
    const generatedSlug = productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);

    const newProd: Product = {
      id: newId,
      slug: generatedSlug,
      name: productData.name || 'New Organic Product',
      subtitle: productData.subtitle || '100% Pure Organic Farm Harvest',
      category: productData.category || 'Oils & Vinegars',
      price: Number(productData.price) || 19.99,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : (Number(productData.price) ? Number(productData.price) * 1.2 : 24.99),
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 1,
      badge: productData.badge || 'Fresh Harvest',
      isSale: productData.isSale ?? Boolean(productData.originalPrice && Number(productData.originalPrice) > Number(productData.price)),
      image: productData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      galleryImages: productData.galleryImages || [productData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'],
      packageSize: productData.packageSize || '500ml',
      sizes: productData.sizes || ['250ml', '500ml', '1000ml'],
      description: productData.description || '100% Certified USDA Organic direct from sustainable family farms.',
      specifications: productData.specifications || {
        origin: 'Oregon, USA',
        certifications: 'USDA Organic, Non-GMO',
        harvestDate: 'Current Season',
        shelfLife: '18 Months',
        storage: 'Cool, dry place away from direct sunlight'
      },
      inStock: productData.inStock ?? true,
      stockCount: productData.stockCount ?? 45,
      featured: productData.featured ?? false,
      ...productData
    } as Product;

    // Save to unified local store immediately
    const current = getLocalStoredProducts();
    const updated = [newProd, ...current.filter(p => p.id !== newProd.id && p.slug !== newProd.slug)];
    setLocalStoredProducts(updated);

    try {
      await apiRequest<{ success: boolean; product: Product; message?: string }>('/products', {
        method: 'POST',
        body: JSON.stringify(newProd)
      });
    } catch {}

    return { success: true, product: newProd, message: 'Product created and synced across the store!' };
  },

  /**
   * Admin Update Product: PUT /api/products/:id
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; product: Product; message?: string }> {
    const current = getLocalStoredProducts();
    let updatedProduct: Product | null = null;

    const updatedList = current.map(p => {
      if (p.id === id || p.slug === id) {
        const merged: Product = {
          ...p,
          ...productData,
          price: productData.price !== undefined ? Number(productData.price) : p.price,
          originalPrice: productData.originalPrice !== undefined ? Number(productData.originalPrice) : p.originalPrice,
          stockCount: productData.stockCount !== undefined ? Number(productData.stockCount) : p.stockCount,
          specifications: {
            ...p.specifications,
            ...(productData.specifications || {})
          }
        };
        updatedProduct = merged;
        return merged;
      }
      return p;
    });

    if (!updatedProduct) {
      // If product was not found in list, create it
      const fallback = { id, ...productData } as Product;
      updatedProduct = fallback;
      updatedList.unshift(fallback);
    }

    setLocalStoredProducts(updatedList);

    try {
      await apiRequest<{ success: boolean; product: Product; message?: string }>(`/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } catch {}

    return { success: true, product: updatedProduct!, message: 'Product updated and synced across the store!' };
  },

  /**
   * Admin Delete Product: DELETE /api/products/:id
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message?: string; deletedId: string }> {
    const current = getLocalStoredProducts();
    const updated = current.filter(p => p.id !== id && p.slug !== id);
    setLocalStoredProducts(updated);

    try {
      await apiRequest<{ success: boolean; message?: string; deletedId: string }>(`/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch {}

    return { success: true, message: 'Product deleted from store catalog', deletedId: id };
  }
};

// ==============================================================================
// 👤 3. USER AUTHENTICATION & PROFILE API SERVICE
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
   * 5. POST /api/auth/register
   * Register new user account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        localStorage.setItem('vg_current_user', JSON.stringify(response.user));
      }
      return response;
    } catch {
      // Local fallback
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
      localStorage.setItem('vg_current_user', JSON.stringify(newUser));

      return {
        success: true,
        user: newUser,
        token: mockToken,
        message: 'Account registered successfully!'
      };
    }
  },

  /**
   * 6. POST /api/auth/login
   * Authenticate user and return JWT token
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        localStorage.setItem('vg_current_user', JSON.stringify(response.user));
      }
      return response;
    } catch {
      // Local fallback
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
      localStorage.setItem('vg_current_user', JSON.stringify(mockUser));

      return {
        success: true,
        user: mockUser,
        token: mockToken,
        message: 'Signed in successfully!'
      };
    }
  },

  /**
   * 7. GET /api/auth/me
   * Get current authenticated user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiRequest<User>('/auth/me');
    } catch {
      const savedUser = localStorage.getItem('vg_current_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  /**
   * User Logout
   */
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('vg_current_user');
    }
  }
};

// ==============================================================================
// 🛒 4. CART API SERVICE
// ==============================================================================

export const CartService = {
  /**
   * 8. GET /api/cart
   * Fetch user's server-stored cart
   */
  async getCart(): Promise<CartItem[]> {
    try {
      return await apiRequest<CartItem[]>('/cart');
    } catch {
      const savedCart = localStorage.getItem('vg_cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  /**
   * 9. POST /api/cart
   * Add / update single item in cart
   */
  async addToCart(item: CartItem): Promise<{ success: boolean; cart: CartItem[] }> {
    try {
      return await apiRequest<{ success: boolean; cart: CartItem[] }>('/cart', {
        method: 'POST',
        body: JSON.stringify(item)
      });
    } catch {
      return { success: true, cart: [item] };
    }
  },

  /**
   * 10. POST /api/cart/sync
   * Sync complete cart items with server
   */
  async syncCartWithServer(items: CartItem[]): Promise<{ success: boolean; cart: CartItem[] }> {
    try {
      return await apiRequest<{ success: boolean; cart: CartItem[] }>('/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items })
      });
    } catch {
      localStorage.setItem('vg_cart', JSON.stringify(items));
      return { success: true, cart: items };
    }
  },

  /**
   * Validate discount coupon
   * POST /api/cart/validate-coupon
   */
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discountPercentage?: number; discountAmount?: number; message?: string }> {
    try {
      return await apiRequest('/cart/validate-coupon', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
    } catch {
      if (code.trim().toUpperCase() === 'ORGANIC10') {
        return { valid: true, discountPercentage: 10, discountAmount: subtotal * 0.1, message: '10% discount applied!' };
      }
      return { valid: false, message: 'Invalid coupon code' };
    }
  }
};

// ==============================================================================
// 📦 5. ORDERS & TRACKING API SERVICE
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
  order?: Order;
}

export const OrderService = {
  /**
   * 11. GET /api/orders
   * Get all orders for authenticated user
   */
  async getOrders(): Promise<Order[]> {
    try {
      return await apiRequest<Order[]>('/orders');
    } catch {
      const saved = localStorage.getItem('vg_orders_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
      return [];
    }
  },

  /**
   * 12. POST /api/orders
   * Create new order & initiate checkout
   */
  async createOrder(orderPayload: OrderPayload): Promise<OrderResponse> {
    try {
      return await apiRequest<OrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });
    } catch {
      const orderId = `VG-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingNumber = `TRK-ORG-${Date.now().toString().slice(-6)}`;
      return {
        success: true,
        orderId,
        trackingNumber,
        estimatedDelivery: '2-3 Business Days',
        status: 'confirmed'
      };
    }
  },

  /**
   * Admin Update Order Status: PUT /api/orders/:id/status
   */
  async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    note?: string, 
    carrier?: string, 
    estimatedDelivery?: string
  ): Promise<{ success: boolean; order?: Order; message?: string }> {
    try {
      return await apiRequest<{ success: boolean; order?: Order; message?: string }>(`/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note, carrier, estimatedDelivery })
      });
    } catch {
      return { success: true, message: `Status updated locally to ${status}` };
    }
  },

  /**
   * Admin Delete Order: DELETE /api/orders/:id
   */
  async deleteOrder(orderId: string): Promise<{ success: boolean; message?: string; deletedId: string }> {
    try {
      return await apiRequest<{ success: boolean; message?: string; deletedId: string }>(`/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE'
      });
    } catch {
      return { success: true, message: 'Order deleted locally', deletedId: orderId };
    }
  }
};

export const OrderTrackerService = {
  /**
   * GET /api/orders
   * Alias for OrderService.getOrders
   */
  async getUserOrders(): Promise<Order[]> {
    return OrderService.getOrders();
  },

  /**
   * 13. GET /api/orders/track/{number-or-tracking}
   * Track order status & live delivery journey
   */
  async trackOrder(numberOrTracking: string): Promise<Order | null> {
    const cleanQuery = numberOrTracking.trim();
    try {
      return await apiRequest<Order>(`/orders/track/${encodeURIComponent(cleanQuery)}`);
    } catch {
      // Local fallback lookup
      const allOrders = await this.getUserOrders();
      const matched = allOrders.find(
        o => o.id.toUpperCase() === cleanQuery.toUpperCase() || o.trackingNumber.toUpperCase() === cleanQuery.toUpperCase()
      );

      if (matched) return matched;

      // Realistic generated demo tracking object
      return {
        id: cleanQuery.toUpperCase().startsWith('VG-') ? cleanQuery.toUpperCase() : `VG-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingNumber: cleanQuery.toUpperCase().startsWith('TRK-') ? cleanQuery.toUpperCase() : `TRK-ORG-${Math.floor(100000 + Math.random() * 900000)}`,
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
            product: initialProducts[0],
            quantity: 2,
            selectedSize: '500ml Glass Bottle',
            unitPrice: 24.50
          },
          {
            product: initialProducts[2],
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
    }
  },

  /**
   * Save order locally / cache
   */
  async saveNewOrder(order: Order): Promise<void> {
    const existing = await this.getUserOrders();
    const updated = [order, ...existing.filter(o => o.id !== order.id)];
    localStorage.setItem('vg_orders_history', JSON.stringify(updated));
  }
};

// ==============================================================================
// ❤️ 6. WISHLIST API SERVICE
// ==============================================================================

export const UserService = {
  /**
   * 14. POST /api/user/wishlist
   * Sync & save user's wishlist
   */
  async syncWishlist(productIds: string[]): Promise<{ success: boolean }> {
    try {
      return await apiRequest<{ success: boolean }>('/user/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productIds })
      });
    } catch {
      localStorage.setItem('vg_wishlist', JSON.stringify(productIds));
      return { success: true };
    }
  }
};

// ==============================================================================
// ✉️ 7. NEWSLETTER & MARKETING API SERVICE
// ==============================================================================

export const MarketingService = {
  /**
   * 15. POST /api/newsletter/subscribe
   * Newsletter email subscription
   */
  async subscribeNewsletter(email: string): Promise<{ success: boolean; discountCoupon?: string; message: string }> {
    try {
      return await apiRequest<{ success: boolean; discountCoupon?: string; message: string }>('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch {
      return {
        success: true,
        discountCoupon: 'ORGANIC10',
        message: 'Thank you for subscribing! Your 10% coupon code is ORGANIC10.'
      };
    }
  }
};

// ==============================================================================
// 🛠️ 8. ADMIN DASHBOARD & STORE MANAGEMENT API SERVICE
// ==============================================================================

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeShipments: number;
  deliveredOrders: number;
  totalUsers: number;
  totalProducts: number;
  outOfStockCount: number;
  recentOrders?: Order[];
}

export const AdminService = {
  /**
   * GET /api/admin/stats
   */
  async getStats(): Promise<AdminStats> {
    try {
      const stats = await apiRequest<AdminStats>('/admin/stats');
      if (stats && stats.totalProducts !== undefined) return stats;
    } catch {}

    const prods = getLocalStoredProducts();
    let ordersList: Order[] = [];
    try {
      const savedOrders = localStorage.getItem('vg_orders_history');
      if (savedOrders) ordersList = JSON.parse(savedOrders);
    } catch {}

    const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const activeShipments = ordersList.filter(o => o.status !== 'delivered').length;
    const deliveredOrders = ordersList.filter(o => o.status === 'delivered').length;
    const outOfStockCount = prods.filter(p => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 0)).length;

    return {
      totalRevenue,
      totalOrders: ordersList.length,
      activeShipments,
      deliveredOrders,
      totalUsers: 1,
      totalProducts: prods.length,
      outOfStockCount,
      recentOrders: ordersList.slice(0, 5)
    };
  },

  /**
   * GET /api/admin/users
   */
  async getUsers(): Promise<{ users: User[]; total: number }> {
    try {
      return await apiRequest<{ users: User[]; total: number }>('/admin/users');
    } catch {
      return { users: [], total: 0 };
    }
  },

  /**
   * POST /api/admin/reset-data
   */
  async resetData(mode: 'seed' | 'clear'): Promise<{ success: boolean; message: string }> {
    if (mode === 'clear') {
      setLocalStoredProducts([]);
    } else {
      setLocalStoredProducts(initialProducts);
    }

    try {
      await apiRequest<{ success: boolean; message: string }>('/admin/reset-data', {
        method: 'POST',
        body: JSON.stringify({ mode })
      });
    } catch {}

    return { 
      success: true, 
      message: mode === 'clear' 
        ? 'All products and inventory cleared. Ready to add your custom items!' 
        : 'Catalog successfully restored to default USDA organic collection.' 
    };
  }
};
