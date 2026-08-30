import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order } from '../types';
import { initialProducts } from '../data/products';
import { 
  ProductService, 
  CartService, 
  AuthService, 
  OrderService, 
  OrderTrackerService, 
  UserService, 
  LoginPayload, 
  RegisterPayload,
  getLocalStoredProducts,
  setLocalStoredProducts
} from '../services/api';

/**
 * ==============================================================================
 * SHOP STATE CONTEXT & UNIFIED DATA STORE
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * 1. Unified Single Store:
 *    - `products`: Authoritative store synchronized with Admin Dashboard.
 *    - Whenever Admin adds, edits, or deletes a product, it immediately updates
 *      all views (Home, Shop, Cart, Detail, Search, QuickView) without manual refresh.
 * 2. User Auth & Orders:
 *    - `currentUser`, `orders`, and live order tracking with persistent storage.
 */

export type AppView = 'home' | 'shop' | 'product' | 'cart' | 'track' | 'account' | 'admin';

interface ShopContextType {
  // Products & Shop State
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  refetchProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  currentView: AppView;
  selectedProductId: string;
  categoryFilter: string;
  searchQuery: string;

  // User Auth State
  currentUser: User | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  loginUser: (payload: LoginPayload) => Promise<{ success: boolean; message?: string }>;
  registerUser: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;

  // Orders & Tracking State
  orders: Order[];
  currentTrackedOrder: Order | null;
  setCurrentTrackedOrder: (order: Order | null) => void;
  trackOrderById: (orderIdOrTracking: string) => Promise<Order | null>;
  addNewOrder: (order: Order) => void;
  refetchOrders: () => Promise<void>;

  // Admin CRUD & Management Actions
  createProduct: (productData: Partial<Product>) => Promise<{ success: boolean; product?: Product; message?: string }>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<{ success: boolean; product?: Product; message?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message?: string }>;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string, carrier?: string, estimatedDelivery?: string) => Promise<{ success: boolean; message?: string }>;
  deleteOrder: (orderId: string) => Promise<{ success: boolean; message?: string }>;

  // Modals & UI Controls
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  isAboutOpen: boolean;
  isBlogOpen: boolean;
  freeShippingThreshold: number;
  subtotal: number;
  remainingForFreeShipping: number;
  totalCartCount: number;

  // Actions
  setCurrentView: (view: AppView) => void;
  navigateToProduct: (productId: string) => void;
  setCategoryFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  updateCartQuantity: (productId: string, selectedSize: string | undefined, delta: number) => void;
  setCartItemQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAboutOpen: (open: boolean) => void;
  setIsBlogOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ==============================================================================
  // 🔗 [AUTHORITATIVE PRODUCT STORE (PERSISTENT & ADMIN-CONTROLLED)]
  // ==============================================================================
  const [products, setProducts] = useState<Product[]>(() => {
    return getLocalStoredProducts();
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Sync products changes to localStorage automatically
  useEffect(() => {
    setLocalStoredProducts(products);
  }, [products]);

  // Initialize Default Logged-In User or read from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vg_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'usr-jairam-101',
      name: 'Jairam Singh',
      email: 'jairamsingh.tech@gmail.com',
      phone: '+1 (555) 382-9104',
      address: {
        street: '742 Organic Harvest Way, Suite 4B',
        city: 'Portland',
        state: 'OR',
        zip: '97201'
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      createdAt: '2026-01-15'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Orders & Tracking State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vg_orders_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    const initialList = getLocalStoredProducts();
    const item1 = initialList[0] || initialProducts[0];
    const item2 = initialList[2] || initialProducts[2] || item1;
    return [
      {
        id: 'VG-8492',
        trackingNumber: 'TRK-ORG-849201',
        customerEmail: 'jairamsingh.tech@gmail.com',
        customerName: 'Jairam Singh',
        shippingAddress: {
          street: '742 Organic Harvest Way, Suite 4B',
          city: 'Portland',
          state: 'OR',
          zip: '97201'
        },
        items: [
          {
            product: item1,
            quantity: 2,
            selectedSize: '250ml',
            unitPrice: item1?.price || 18.99
          },
          {
            product: item2,
            quantity: 1,
            selectedSize: '32 oz',
            unitPrice: item2?.price || 22.00
          }
        ],
        subtotal: 59.98,
        discount: 5.99,
        shipping: 0,
        total: 53.99,
        paymentMethod: 'Credit Card (Visa **** 4242)',
        status: 'in_transit',
        orderDate: 'Aug 18, 2026',
        estimatedDelivery: 'Tomorrow by 4:00 PM',
        carrier: 'Verdant Eco-Express (Zero-Emission Van)',
        trackingSteps: [
          {
            status: 'placed',
            title: 'Order Confirmed & Payment Verified',
            description: 'Payment processed securely. Farm batch provisioning verified.',
            timestamp: 'Aug 18, 09:15 AM',
            completed: true
          },
          {
            status: 'harvested',
            title: 'Harvest Quality Inspected',
            description: '100% USDA Certified Organic fresh yield picked and tested.',
            timestamp: 'Aug 18, 01:30 PM',
            completed: true
          },
          {
            status: 'packed',
            title: 'Packed in Biodegradable Insulation',
            description: 'Sealed with recyclable thermal insulation and cold packs.',
            timestamp: 'Aug 18, 06:45 PM',
            completed: true
          },
          {
            status: 'in_transit',
            title: 'In Transit — Eco Delivery Hub',
            description: 'Package dispatched via regional zero-emission electric courier.',
            timestamp: 'Aug 19, 08:20 AM',
            completed: true,
            current: true
          },
          {
            status: 'out_for_delivery',
            title: 'Out for Delivery',
            description: 'Courier driver will deliver to your doorstep safely.',
            timestamp: 'Aug 20, 10:00 AM',
            completed: false
          },
          {
            status: 'delivered',
            title: 'Delivered Fresh',
            description: 'Package delivered at your front door / porch.',
            timestamp: 'Aug 20, 04:00 PM',
            completed: false
          }
        ]
      }
    ];
  });

  const [currentTrackedOrder, setCurrentTrackedOrder] = useState<Order | null>(null);

  // Sync Orders to LocalStorage
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('vg_orders_history', JSON.stringify(orders));
    }
  }, [orders]);

  // Cart & Wishlist initialized
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vg_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    const initialList = getLocalStoredProducts();
    const item1 = initialList[0] || initialProducts[0];
    const item2 = initialList[2] || initialProducts[2] || item1;
    return [
      {
        product: item1,
        quantity: 1,
        selectedSize: item1?.sizes?.[0] || '250ml',
        unitPrice: item1?.price || 18.99
      },
      {
        product: item2,
        quantity: 1,
        selectedSize: item2?.sizes?.[0] || '16 oz',
        unitPrice: item2?.price || 14.99
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vg_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['avocado-oil'];
      }
    }
    return ['avocado-oil'];
  });

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const list = getLocalStoredProducts();
    return list[0]?.id || list[0]?.slug || 'avocado-oil';
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Automatically propagate product updates (price changes, image changes, name edits) to Cart items
  useEffect(() => {
    if (products.length > 0) {
      setCart(prevCart => {
        const updated = prevCart
          .filter(item => products.some(p => p.id === item.product.id || p.slug === item.product.id))
          .map(item => {
            const latestProd = products.find(p => p.id === item.product.id || p.slug === item.product.id);
            if (!latestProd) return item;
            let newUnitPrice = latestProd.price;
            if (item.selectedSize && latestProd.pricePerSize && latestProd.pricePerSize[item.selectedSize]) {
              newUnitPrice = latestProd.pricePerSize[item.selectedSize];
            }
            return {
              ...item,
              product: latestProd,
              unitPrice: newUnitPrice
            };
          });
        return updated;
      });

      // Also clean up wishlist
      setWishlist(prev => prev.filter(id => products.some(p => p.id === id || p.slug === id)));

      // If selectedProductId is invalid, fix it
      setSelectedProductId(prev => {
        const exists = products.some(p => p.id === prev || p.slug === prev);
        return exists ? prev : (products[0]?.id || products[0]?.slug || '');
      });
    }
  }, [products]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vg_cart', JSON.stringify(cart));
  }, [cart]);

  // Refetch function for manual reload
  const fetchProductsFromApi = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const prodData = await ProductService.getProducts();
      if (prodData && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
        if (prodData.products.length > 0) {
          setSelectedProductId(prev => prev || prodData.products[0].id || prodData.products[0].slug || '');
        }
      }
    } catch {
      setProducts(getLocalStoredProducts());
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Initial load
  useEffect(() => {
    async function initBackendData() {
      await fetchProductsFromApi();

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) setCurrentUser(user);

          const fetchedOrders = await OrderService.getOrders();
          if (fetchedOrders && fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
          }
        } catch {}
      }
    }
    initBackendData();
  }, []);

  // Sync Wishlist to Backend: POST /api/user/wishlist
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && currentUser) {
      UserService.syncWishlist(wishlist).catch(() => {});
    }
  }, [wishlist, currentUser]);

  // Sync Cart to Backend: POST /api/cart/sync (only for logged-in sessions)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && currentUser) {
      CartService.syncCartWithServer(cart).catch(() => {});
    }
  }, [cart, currentUser]);

  // Sync Current User to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vg_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vg_current_user');
    }
  }, [currentUser]);

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);

  const freeShippingThreshold = 50.00;
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT: USER AUTH ACTIONS]
  // ==============================================================================
  const loginUser = async (payload: LoginPayload) => {
    try {
      const res = await AuthService.login(payload);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const registerUser = async (payload: RegisterPayload) => {
    try {
      const res = await AuthService.register(payload);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const logoutUser = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT: TRACK ORDER BY ID]
  // ==============================================================================
  const trackOrderById = async (orderIdOrTracking: string): Promise<Order | null> => {
    const order = await OrderTrackerService.trackOrder(orderIdOrTracking);
    if (order) {
      setCurrentTrackedOrder(order);
    }
    return order;
  };

  const addNewOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCurrentTrackedOrder(newOrder);
    OrderTrackerService.saveNewOrder(newOrder);
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Add Item to Cart
   */
  const addToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    const size = selectedSize || (product.sizes ? product.sizes[0] : product.packageSize);
    let unitPrice = product.price;
    if (product.pricePerSize && size && product.pricePerSize[size]) {
      unitPrice = product.pricePerSize[size];
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedSize: size, unitPrice }];
      }
    });
  };

  const updateCartQuantity = (productId: string, selectedSize: string | undefined, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const setCartItemQuantity = (productId: string, selectedSize: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Refetch orders list from backend API (GET /api/orders)
  const fetchOrdersFromApi = async () => {
    try {
      const fetched = await OrderService.getOrders();
      if (fetched && fetched.length > 0) {
        setOrders(fetched);
      }
    } catch {
      // ignore
    }
  };

  // Admin Create Product
  const createProduct = async (productData: Partial<Product>) => {
    try {
      const res = await ProductService.createProduct(productData);
      if (res.success && res.product) {
        setProducts(prev => [res.product, ...prev.filter(p => p.id !== res.product.id)]);
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to create product' };
    }
  };

  // Admin Update Product
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await ProductService.updateProduct(id, productData);
      if (res.success && res.product) {
        setProducts(prev => prev.map(p => (p.id === id || p.slug === id ? res.product : p)));
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update product' };
    }
  };

  // Admin Delete Product
  const deleteProduct = async (id: string) => {
    try {
      const res = await ProductService.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id && p.slug !== id));
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to delete product' };
    }
  };

  // Admin Update Order Status
  const updateOrderStatus = async (
    orderId: string, 
    status: Order['status'], 
    note?: string, 
    carrier?: string, 
    estimatedDelivery?: string
  ) => {
    try {
      const res = await OrderService.updateOrderStatus(orderId, status, note, carrier, estimatedDelivery);
      if (res.success) {
        setOrders(prev =>
          prev.map(o => {
            if (o.id === orderId || o.trackingNumber === orderId) {
              const validStatuses: Order['status'][] = ['placed', 'harvested', 'packed', 'in_transit', 'out_for_delivery', 'delivered'];
              const statusIndex = validStatuses.indexOf(status);
              const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

              const updatedSteps = o.trackingSteps.map((step, idx) => {
                if (idx < statusIndex) {
                  return { ...step, completed: true, current: false };
                } else if (idx === statusIndex) {
                  return {
                    ...step,
                    completed: true,
                    current: true,
                    timestamp: nowStr,
                    description: note || step.description
                  };
                } else {
                  return { ...step, completed: false, current: false };
                }
              });

              return {
                ...o,
                status,
                carrier: carrier || o.carrier,
                estimatedDelivery: estimatedDelivery || o.estimatedDelivery,
                trackingSteps: updatedSteps
              };
            }
            return o;
          })
        );
        // Also update currentTrackedOrder if active
        if (currentTrackedOrder && (currentTrackedOrder.id === orderId || currentTrackedOrder.trackingNumber === orderId)) {
          trackOrderById(orderId);
        }
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update order status' };
    }
  };

  // Admin Delete Order
  const deleteOrder = async (orderId: string) => {
    try {
      const res = await OrderService.deleteOrder(orderId);
      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId && o.trackingNumber !== orderId));
        if (currentTrackedOrder && (currentTrackedOrder.id === orderId || currentTrackedOrder.trackingNumber === orderId)) {
          setCurrentTrackedOrder(null);
        }
      }
      return res;
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to delete order' };
    }
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        productsError,
        refetchProducts: fetchProductsFromApi,
        cart,
        wishlist,
        currentView,
        selectedProductId,
        categoryFilter,
        searchQuery,
        currentUser,
        isAuthModalOpen,
        authModalMode,
        setIsAuthModalOpen,
        setAuthModalMode,
        loginUser,
        registerUser,
        logoutUser,
        orders,
        currentTrackedOrder,
        setCurrentTrackedOrder,
        trackOrderById,
        addNewOrder,
        refetchOrders: fetchOrdersFromApi,
        createProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        isQuickViewOpen,
        quickViewProduct,
        isSearchOpen,
        isCheckoutOpen,
        isAboutOpen,
        isBlogOpen,
        freeShippingThreshold,
        subtotal,
        remainingForFreeShipping,
        totalCartCount,
        setCurrentView,
        navigateToProduct,
        setCategoryFilter,
        setSearchQuery,
        addToCart,
        updateCartQuantity,
        setCartItemQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        openQuickView,
        closeQuickView,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setIsAboutOpen,
        setIsBlogOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
