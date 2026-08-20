import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order } from '../types';
import { initialProducts } from '../data/products';
import { ProductService, CartService, AuthService, OrderTrackerService, LoginPayload, RegisterPayload } from '../services/api';

/**
 * ==============================================================================
 * SHOP STATE CONTEXT & API INTEGRATION HUB
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * 1. User Auth:
 *    - `currentUser`: Logged-in user information (Name, Email, Phone, Saved Address).
 *    - `login()`: Backend API `POST /api/auth/login` call karta hai.
 *    - `register()`: Backend API `POST /api/auth/register` call karta hai.
 *    - `logout()`: Session clear karta hai.
 * 2. Order Tracking:
 *    - `orders`: User ke sabhi placed orders list.
 *    - `trackOrderById(id)`: Backend API `GET /api/orders/track/:id` se live delivery tracking details lata hai.
 * 3. Products & Cart:
 *    - Central state for shopping, cart, wishlist, and active screen navigation.
 */

export type AppView = 'home' | 'shop' | 'product' | 'cart' | 'track' | 'account';

interface ShopContextType {
  // Products & Shop State
  products: Product[];
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
  // 🔗 [API INTEGRATION POINT 1: FETCH PRODUCTS FROM BACKEND]
  // ==============================================================================
  const [products, setProducts] = useState<Product[]>(initialProducts);

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
    // Default initial demonstration user
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
    // Seed an initial demo order so user can immediately see live tracking
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

  // Sync Current User to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vg_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vg_current_user');
    }
  }, [currentUser]);

  // Initialize with initial cart items
  const mapleProduct = initialProducts.find(p => p.id === 'maple-syrup') || initialProducts[2];
  const amaranthProduct = initialProducts.find(p => p.id === 'amaranth-grain') || initialProducts[3];

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: mapleProduct,
      quantity: 1,
      selectedSize: '32 oz Glass Bottle',
      unitPrice: 24.00
    },
    {
      product: amaranthProduct,
      quantity: 1,
      selectedSize: '1 lb Paper Sack',
      unitPrice: 7.51
    }
  ]);

  const [wishlist, setWishlist] = useState<string[]>(['avocado-oil']);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('avocado-oil');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
