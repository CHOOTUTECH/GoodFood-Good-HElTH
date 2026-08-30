import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initialProducts, initialReviews } from './src/data/products';
import { Product, Review, CartItem, User, Order } from './src/types';

// In-memory persistent database for testing and production runtime
let productsDb: Product[] = JSON.parse(JSON.stringify(initialProducts));
let reviewsDb: Record<string, Review[]> = {
  'avocado-oil': JSON.parse(JSON.stringify(initialReviews)),
};

// Users database with demo user pre-configured
const usersDb: Record<string, { user: User; passwordHash: string; token: string }> = {
  'usr-jairam-101': {
    user: {
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
    },
    passwordHash: 'demo1234',
    token: 'vg_token_demo_jairam_101'
  }
};

// Cart database by user/session token
const cartsDb: Record<string, CartItem[]> = {
  'usr-jairam-101': [
    {
      product: initialProducts[0],
      quantity: 2,
      selectedSize: '250ml',
      unitPrice: 18.99
    },
    {
      product: initialProducts[2],
      quantity: 1,
      selectedSize: '16 oz',
      unitPrice: 14.99
    }
  ]
};

// Wishlists by user ID
const wishlistsDb: Record<string, string[]> = {
  'usr-jairam-101': ['avocado-oil', 'macadamia-nuts']
};

// Orders database
const ordersDb: Order[] = [
  {
    id: 'VG-8492',
    trackingNumber: 'TRK-ORG-849201',
    userId: 'usr-jairam-101',
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
        product: initialProducts[0],
        quantity: 2,
        selectedSize: '250ml',
        unitPrice: 18.99
      },
      {
        product: initialProducts[2],
        quantity: 1,
        selectedSize: '32 oz',
        unitPrice: 22.00
      }
    ],
    subtotal: 59.98,
    discount: 5.99,
    shipping: 0,
    total: 53.99,
    paymentMethod: 'Credit Card (Visa **** 4242)',
    status: 'in_transit',
    orderDate: 'Aug 22, 2026',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    carrier: 'Verdant Eco-Express (Zero-Emission Van)',
    trackingSteps: [
      {
        status: 'placed',
        title: 'Order Confirmed & Payment Verified',
        description: 'Payment processed securely. Farm batch provisioning verified.',
        timestamp: 'Aug 22, 09:15 AM',
        completed: true
      },
      {
        status: 'harvested',
        title: 'Harvest Quality Inspected',
        description: '100% USDA Certified Organic fresh yield picked and tested.',
        timestamp: 'Aug 22, 01:30 PM',
        completed: true
      },
      {
        status: 'packed',
        title: 'Packed in Biodegradable Insulation',
        description: 'Sealed with recyclable thermal insulation and cold packs.',
        timestamp: 'Aug 23, 06:45 PM',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'In Transit — Eco Delivery Hub',
        description: 'Package dispatched via regional zero-emission electric courier.',
        timestamp: 'Aug 24, 08:20 AM',
        completed: true,
        current: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier driver will deliver to your doorstep safely.',
        timestamp: 'Aug 25, 10:00 AM',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Delivered Fresh',
        description: 'Package delivered at your front door / porch.',
        timestamp: 'Aug 25, 04:00 PM',
        completed: false
      }
    ]
  }
];

// Helper to authenticate request
function getAuthUser(req: express.Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  if (!token) return null;

  for (const record of Object.values(usersDb)) {
    if (record.token === token) {
      return record.user;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser & CORS
  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ==========================================
  // 🌿 1. HEALTHCHECK ENDPOINT
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Verdant Grove API',
      timestamp: new Date().toISOString(),
      productsCount: productsDb.length,
      ordersCount: ordersDb.length
    });
  });

  // ==========================================
  // 🛍️ 2. PRODUCTS ENDPOINTS
  // ==========================================
  app.get('/api/products', (req, res) => {
    let result = [...productsDb];
    const { category, search, minPrice, maxPrice } = req.query;

    if (category && category !== 'All Products') {
      result = result.filter(p => p.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    res.json({
      products: result,
      total: result.length
    });
  });

  app.get('/api/products/:slug', (req, res) => {
    const { slug } = req.params;
    const product = productsDb.find(p => p.id === slug || (p.slug && p.slug === slug));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product, success: true });
  });

  // Admin Create Product: POST /api/products
  app.post('/api/products', (req, res) => {
    const data = req.body;
    if (!data.name || !data.category || data.price === undefined) {
      res.status(400).json({ error: 'Product name, category, and price are required' });
      return;
    }

    const newId = data.id || data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueId = productsDb.some(p => p.id === newId) ? `${newId}-${Date.now().toString().slice(-4)}` : newId;

    const newProduct: Product = {
      id: uniqueId,
      slug: uniqueId,
      name: data.name,
      subtitle: data.subtitle || '100% Pure Organic Farm Harvest',
      category: data.category,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      rating: Number(data.rating) || 5.0,
      reviewCount: Number(data.reviewCount) || 1,
      image: data.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      galleryImages: data.galleryImages && data.galleryImages.length > 0 ? data.galleryImages : [data.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'],
      badge: data.badge || 'Fresh Harvest',
      isSale: Boolean(data.isSale),
      packageSize: data.packageSize || '500g Eco-Pouch',
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : [data.packageSize || 'Standard'],
      pricePerSize: data.pricePerSize || { [data.packageSize || 'Standard']: Number(data.price) },
      description: data.description || 'Certified organic harvest from our family farm.',
      detailedDescription: data.detailedDescription || data.description || 'Certified organic harvest from our family farm.',
      keyBenefits: data.keyBenefits || ['100% USDA Certified Organic', 'Zero Preservatives', 'Non-GMO Verified', 'Direct Farm Sourced'],
      specifications: data.specifications || {
        origin: data.origin || 'Willamette Valley, Oregon, USA',
        certifications: 'USDA Organic, Non-GMO Project Verified',
        storage: 'Store in a cool, dry pantry away from direct sunlight.'
      },
      nutritionFacts: data.nutritionFacts || {
        servingSize: '1 Tbsp (15ml / 15g)',
        servingsPerContainer: '32',
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
        protein: '0g'
      },
      inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
      featured: Boolean(data.featured)
    };

    productsDb.unshift(newProduct);
    res.status(201).json({ success: true, product: newProduct, message: 'Product created successfully!' });
  });

  // Admin Update Product: PUT /api/products/:id
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const index = productsDb.findIndex(p => p.id === id || (p.slug && p.slug === id));

    if (index === -1) {
      res.status(404).json({ error: `Product with ID ${id} not found` });
      return;
    }

    productsDb[index] = {
      ...productsDb[index],
      ...data,
      price: data.price !== undefined ? Number(data.price) : productsDb[index].price,
      originalPrice: data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : undefined) : productsDb[index].originalPrice,
      inStock: data.inStock !== undefined ? Boolean(data.inStock) : productsDb[index].inStock,
      featured: data.featured !== undefined ? Boolean(data.featured) : productsDb[index].featured
    };

    res.json({ success: true, product: productsDb[index], message: 'Product updated successfully!' });
  });

  // Admin Delete Product: DELETE /api/products/:id
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = productsDb.findIndex(p => p.id === id || (p.slug && p.slug === id));

    if (index === -1) {
      res.status(404).json({ error: `Product with ID ${id} not found` });
      return;
    }

    const removed = productsDb.splice(index, 1)[0];
    res.json({ success: true, message: `Product "${removed.name}" deleted successfully!`, deletedId: id });
  });

  app.get('/api/products/:slug/reviews', (req, res) => {
    const { slug } = req.params;
    const reviews = reviewsDb[slug] || initialReviews;
    res.json({ reviews, total: reviews.length });
  });

  app.post('/api/products/:slug/reviews', (req, res) => {
    const { slug } = req.params;
    const { author, rating, title, comment } = req.body;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: author || 'Verified Customer',
      rating: Number(rating) || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: title || 'Verified Organic Purchase',
      comment: comment || '',
      verified: true
    };

    if (!reviewsDb[slug]) {
      reviewsDb[slug] = JSON.parse(JSON.stringify(initialReviews));
    }
    reviewsDb[slug].unshift(newReview);

    // Update product rating and review count
    const product = productsDb.find(p => p.id === slug || (p.slug && p.slug === slug));
    if (product) {
      product.reviewCount += 1;
      const allRatings = reviewsDb[slug].map(r => r.rating);
      product.rating = Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1));
    }

    res.status(201).json({
      success: true,
      review: newReview,
      message: 'Review submitted successfully!'
    });
  });

  // ==========================================
  // 👤 3. AUTHENTICATION & PROFILE
  // ==========================================
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Name, email and password are required.' });
      return;
    }

    const existingId = Object.keys(usersDb).find(id => usersDb[id].user.email.toLowerCase() === email.toLowerCase());
    if (existingId) {
      // Return existing user with refreshed token
      const existing = usersDb[existingId];
      res.json({
        success: true,
        user: existing.user,
        token: existing.token,
        message: 'Account already exists. Signed in successfully!'
      });
      return;
    }

    const userId = `usr-${Date.now()}`;
    const token = `vg_token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      phone: phone || '+1 (555) 019-2834',
      address: address || {
        street: '124 Organic Harvest Way',
        city: 'Portland',
        state: 'OR',
        zip: '97201'
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      createdAt: new Date().toISOString()
    };

    usersDb[userId] = {
      user: newUser,
      passwordHash: password,
      token
    };

    res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: 'Account registered successfully!'
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const foundEntry = Object.values(usersDb).find(
      entry => entry.user.email.toLowerCase() === email.toLowerCase()
    );

    if (foundEntry) {
      res.json({
        success: true,
        user: foundEntry.user,
        token: foundEntry.token,
        message: 'Signed in successfully!'
      });
      return;
    }

    // Auto-create or allow demo login smoothly
    const userId = `usr-${Date.now()}`;
    const token = `vg_token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const formattedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newUser: User = {
      id: userId,
      name: formattedName || 'Harvest Customer',
      email,
      phone: '+1 (555) 382-9104',
      address: {
        street: '742 Organic Harvest Way',
        city: 'Portland',
        state: 'OR',
        zip: '97201'
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      createdAt: new Date().toISOString()
    };

    usersDb[userId] = {
      user: newUser,
      passwordHash: password || 'demo123',
      token
    };

    res.json({
      success: true,
      user: newUser,
      token,
      message: 'Signed in successfully!'
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.json(user);
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // ==========================================
  // 🛒 4. CART ENDPOINTS
  // ==========================================
  app.get('/api/cart', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      res.json([]);
      return;
    }
    const cart = cartsDb[user.id] || [];
    res.json(cart);
  });

  app.post('/api/cart', (req, res) => {
    const user = getAuthUser(req);
    const item: CartItem = req.body;
    const userId = user ? user.id : 'guest';

    if (!cartsDb[userId]) {
      cartsDb[userId] = [];
    }

    const existingIdx = cartsDb[userId].findIndex(
      ci => ci.product.id === item.product.id && ci.selectedSize === item.selectedSize
    );

    if (existingIdx > -1) {
      cartsDb[userId][existingIdx].quantity += item.quantity || 1;
    } else {
      cartsDb[userId].push(item);
    }

    res.json({ success: true, cart: cartsDb[userId] });
  });

  app.post('/api/cart/sync', (req, res) => {
    const user = getAuthUser(req);
    const { items } = req.body;
    const userId = user ? user.id : 'guest';

    if (Array.isArray(items)) {
      cartsDb[userId] = items;
    }

    res.json({ success: true, cart: cartsDb[userId] || [] });
  });

  app.post('/api/cart/validate-coupon', (req, res) => {
    const { code, subtotal = 0 } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'ORGANIC10') {
      res.json({
        valid: true,
        discountPercentage: 10,
        discountAmount: Number((subtotal * 0.1).toFixed(2)),
        message: '10% discount applied!'
      });
      return;
    }

    if (cleanCode === 'FRESH20') {
      res.json({
        valid: true,
        discountPercentage: 20,
        discountAmount: Number((subtotal * 0.2).toFixed(2)),
        message: '20% Harvest discount applied!'
      });
      return;
    }

    res.status(400).json({
      valid: false,
      message: 'Invalid coupon code. Try ORGANIC10 or FRESH20.'
    });
  });

  // ==========================================
  // 📦 5. ORDERS & TRACKING ENDPOINTS
  // ==========================================
  app.get('/api/orders', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      res.json(ordersDb);
      return;
    }
    const userOrders = ordersDb.filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase());
    res.json(userOrders.length > 0 ? userOrders : ordersDb);
  });

  app.post('/api/orders', (req, res) => {
    const user = getAuthUser(req);
    const orderData = req.body;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `VG-${randomNum}`;
    const trackingNum = `TRK-ORG-${randomNum}01`;

    const newOrder: Order = {
      id: orderId,
      trackingNumber: trackingNum,
      userId: user?.id,
      customerEmail: orderData.customerEmail || user?.email || 'customer@verdantgrove.com',
      customerName: orderData.customerName || user?.name || 'Valued Customer',
      shippingAddress: orderData.shippingAddress || {
        street: '124 Organic Harvest Way',
        city: 'Portland',
        state: 'OR',
        zip: '97201'
      },
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'Credit Card (Visa)',
      status: 'placed',
      orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDelivery: '3-4 Business Days',
      carrier: 'Verdant Eco-Express (Zero-Emission Van)',
      trackingSteps: [
        {
          status: 'placed',
          title: 'Order Confirmed & Payment Verified',
          description: 'Payment processed securely. Farm batch provisioning verified.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'harvested',
          title: 'Harvest Quality Inspected',
          description: '100% USDA Certified Organic fresh yield picked and tested.',
          timestamp: 'Pending harvest schedule',
          completed: false
        },
        {
          status: 'packed',
          title: 'Packed in Biodegradable Insulation',
          description: 'Sealed with recyclable thermal insulation and cold packs.',
          timestamp: 'Pending packing',
          completed: false
        },
        {
          status: 'in_transit',
          title: 'In Transit — Eco Delivery Hub',
          description: 'Package dispatched via regional zero-emission electric courier.',
          timestamp: 'Pending dispatch',
          completed: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Courier driver will deliver to your doorstep safely.',
          timestamp: 'Pending arrival',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Delivered Fresh',
          description: 'Package delivered at your front door / porch.',
          timestamp: 'Pending delivery',
          completed: false
        }
      ]
    };

    ordersDb.unshift(newOrder);

    // Clear cart for user
    if (user) {
      cartsDb[user.id] = [];
    }

    res.status(201).json({
      success: true,
      order: newOrder,
      message: 'Order created successfully!'
    });
  });

  app.get('/api/orders/track/:identifier', (req, res) => {
    const { identifier } = req.params;
    const cleanId = (identifier || '').trim().toLowerCase();

    const order = ordersDb.find(
      o => o.id.toLowerCase() === cleanId || o.trackingNumber.toLowerCase() === cleanId
    );

    if (!order) {
      res.status(404).json({ error: `No order found with tracking/ID: ${identifier}` });
      return;
    }

    res.json(order);
  });

  // Admin Update Order Status: PUT /api/orders/:id/status
  app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, note, carrier, estimatedDelivery } = req.body;
    const order = ordersDb.find(o => o.id === id || o.trackingNumber === id);

    if (!order) {
      res.status(404).json({ error: `Order with ID ${id} not found` });
      return;
    }

    const validStatuses: Order['status'][] = ['placed', 'harvested', 'packed', 'in_transit', 'out_for_delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    order.status = status;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    // Advance and update tracking steps
    const statusIndex = validStatuses.indexOf(status);
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });

    order.trackingSteps = order.trackingSteps.map((step, idx) => {
      if (idx < statusIndex) {
        return { ...step, completed: true, current: false };
      } else if (idx === statusIndex) {
        return {
          ...step,
          completed: true,
          current: true,
          timestamp: step.timestamp.startsWith('Pending') || step.timestamp === 'Just now' ? nowStr : step.timestamp,
          description: note || step.description
        };
      } else {
        return { ...step, completed: false, current: false };
      }
    });

    res.json({ success: true, order, message: `Order status updated to "${status}"!` });
  });

  // Admin Update Entire Order: PUT /api/orders/:id
  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const index = ordersDb.findIndex(o => o.id === id || o.trackingNumber === id);

    if (index === -1) {
      res.status(404).json({ error: `Order with ID ${id} not found` });
      return;
    }

    ordersDb[index] = { ...ordersDb[index], ...data };
    res.json({ success: true, order: ordersDb[index], message: 'Order updated successfully!' });
  });

  // Admin Delete Order: DELETE /api/orders/:id
  app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const index = ordersDb.findIndex(o => o.id === id || o.trackingNumber === id);

    if (index === -1) {
      res.status(404).json({ error: `Order with ID ${id} not found` });
      return;
    }

    const removed = ordersDb.splice(index, 1)[0];
    res.json({ success: true, message: `Order ${removed.id} deleted successfully!`, deletedId: id });
  });

  // ==========================================
  // 📊 6. ADMIN STATS & USER MANAGEMENT
  // ==========================================
  app.get('/api/admin/stats', (req, res) => {
    const totalRevenue = ordersDb.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeShipments = ordersDb.filter(o => o.status !== 'delivered').length;
    const deliveredOrders = ordersDb.filter(o => o.status === 'delivered').length;
    const totalUsers = Object.keys(usersDb).length;
    const totalProducts = productsDb.length;
    const outOfStockCount = productsDb.filter(p => !p.inStock).length;

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: ordersDb.length,
      activeShipments,
      deliveredOrders,
      totalUsers,
      totalProducts,
      outOfStockCount,
      recentOrders: ordersDb.slice(0, 5)
    });
  });

  app.get('/api/admin/users', (req, res) => {
    const usersList = Object.values(usersDb).map(entry => entry.user);
    res.json({ users: usersList, total: usersList.length });
  });

  app.post('/api/admin/reset-data', (req, res) => {
    const { mode } = req.body; // 'seed' | 'clear'
    if (mode === 'clear') {
      productsDb = [];
      ordersDb.length = 0;
      res.json({ success: true, message: 'All products and orders cleared. You can now add 100% real products.' });
      return;
    }

    // Default Seed Reset
    productsDb = JSON.parse(JSON.stringify(initialProducts));
    res.json({ success: true, message: 'Database reset to default organic catalog!', totalProducts: productsDb.length });
  });

  // ==========================================
  // ❤️ 6. WISHLIST & NEWSLETTER ENDPOINTS
  // ==========================================
  app.post('/api/user/wishlist', (req, res) => {
    const user = getAuthUser(req);
    const { wishlist } = req.body;
    if (user && Array.isArray(wishlist)) {
      wishlistsDb[user.id] = wishlist;
    }
    res.json({ success: true, wishlist: wishlist || [] });
  });

  app.get('/api/user/wishlist', (req, res) => {
    const user = getAuthUser(req);
    if (user) {
      res.json({ wishlist: wishlistsDb[user.id] || [] });
      return;
    }
    res.json({ wishlist: [] });
  });

  app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    res.json({
      success: true,
      message: `Thank you! ${email} is now subscribed to farm fresh updates.`
    });
  });

  // ==========================================
  // ⚡ VITE MIDDLEWARE & SPA SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Verdant Grove Server running on http://localhost:${PORT}`);
  });
}

startServer();
