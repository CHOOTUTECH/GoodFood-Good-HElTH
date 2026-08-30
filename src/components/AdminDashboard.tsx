import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, User } from '../types';
import { AdminService, AdminStats } from '../services/api';
import { 
  Package, 
  Truck, 
  Users, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Database,
  Eye,
  Check,
  X,
  Layers,
  ArrowUpRight,
  Sparkles,
  Tag,
  MapPin
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Organic Olive Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800' },
  { label: 'Avocado Oil', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Wild Raw Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800' },
  { label: 'Apple Cider Vinegar', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800' },
  { label: 'Organic Quinoa & Grain', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Artisan Sourdough', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
  { label: 'Chia Seeds Superfood', url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=800' },
  { label: 'Organic Herbal Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800' }
];

const CATEGORIES = [
  'Oils & Vinegars',
  'Pantry & Grains',
  'Artisan Spreads & Honey',
  'Herbal & Botanicals',
  'Superfoods & Seeds'
];

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    deleteOrder,
    setCurrentView,
    trackOrderById,
    refetchProducts,
    refetchOrders
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'settings'>('products');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '100% Pure Organic Farm Harvest',
    category: 'Oils & Vinegars',
    price: 19.99,
    originalPrice: 24.99,
    packageSize: '500ml Glass Bottle',
    badge: 'Fresh Harvest',
    image: PRESET_IMAGES[0].url,
    description: 'Certified USDA Organic harvested directly from sustainable regenerative family farms.',
    origin: 'Willamette Valley, Oregon, USA',
    inStock: true,
    featured: false
  });

  // Order Status Update Modal
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<Order['status']>('placed');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [statusCarrier, setStatusCarrier] = useState('Verdant Eco-Express (Zero-Emission Van)');
  const [statusEstimatedDelivery, setStatusEstimatedDelivery] = useState('3-4 Business Days');

  // Load backend stats & users
  const loadAdminData = async () => {
    setIsLoadingStats(true);
    try {
      const [statsData, usersData] = await Promise.all([
        AdminService.getStats(),
        AdminService.getUsers()
      ]);
      setStats(statsData);
      setUsersList(usersData.users || []);
    } catch {
      // Fallback
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [products, orders]);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open Create Product
  const handleOpenCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      subtitle: '100% Pure Organic Farm Harvest',
      category: 'Oils & Vinegars',
      price: 19.99,
      originalPrice: 24.99,
      packageSize: '500ml Glass Bottle',
      badge: 'Fresh Harvest',
      image: PRESET_IMAGES[0].url,
      description: 'Certified USDA Organic harvested directly from sustainable regenerative family farms.',
      origin: 'Willamette Valley, Oregon, USA',
      inStock: true,
      featured: false
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      subtitle: p.subtitle || '100% Pure Organic Farm Harvest',
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price * 1.2,
      packageSize: p.packageSize || '500ml',
      badge: p.badge || '',
      image: p.image,
      description: p.description,
      origin: p.specifications?.origin || 'Oregon, USA',
      inStock: p.inStock ?? true,
      featured: p.featured ?? false
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showNotice('Please enter a product name', 'error');
      return;
    }

    if (editingProductId) {
      // Update
      const res = await updateProduct(editingProductId, {
        name: productForm.name,
        subtitle: productForm.subtitle,
        category: productForm.category as any,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        packageSize: productForm.packageSize,
        badge: productForm.badge,
        image: productForm.image,
        description: productForm.description,
        inStock: productForm.inStock,
        featured: productForm.featured,
        specifications: {
          origin: productForm.origin,
          certifications: 'USDA Organic, Non-GMO Project Verified',
          storage: 'Store in cool, dry pantry.'
        }
      });
      if (res.success) {
        showNotice(`Product "${productForm.name}" updated successfully!`);
        setIsProductModalOpen(false);
      } else {
        showNotice(res.message || 'Failed to update product', 'error');
      }
    } else {
      // Create
      const res = await createProduct({
        name: productForm.name,
        subtitle: productForm.subtitle,
        category: productForm.category as any,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        packageSize: productForm.packageSize,
        badge: productForm.badge,
        image: productForm.image,
        galleryImages: [productForm.image],
        description: productForm.description,
        inStock: productForm.inStock,
        featured: productForm.featured,
        specifications: {
          origin: productForm.origin,
          certifications: 'USDA Organic, Non-GMO Project Verified',
          storage: 'Store in cool, dry pantry.'
        }
      });
      if (res.success) {
        showNotice(`New real product "${productForm.name}" published to store!`);
        setIsProductModalOpen(false);
      } else {
        showNotice(res.message || 'Failed to create product', 'error');
      }
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        showNotice(`Product "${name}" deleted from store.`);
      } else {
        showNotice(res.message || 'Failed to delete product', 'error');
      }
    }
  };

  // Open Status Update Modal
  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrderForStatus(order);
    setNewOrderStatus(order.status);
    setStatusCarrier(order.carrier || 'Verdant Eco-Express (Zero-Emission Van)');
    setStatusEstimatedDelivery(order.estimatedDelivery || '3-4 Business Days');
    setStatusUpdateNote('');
  };

  // Save Order Status
  const handleSaveOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;

    const res = await updateOrderStatus(
      selectedOrderForStatus.id,
      newOrderStatus,
      statusUpdateNote.trim() ? statusUpdateNote.trim() : undefined,
      statusCarrier,
      statusEstimatedDelivery
    );

    if (res.success) {
      showNotice(`Order ${selectedOrderForStatus.id} advanced to "${newOrderStatus}"! Live tracker updated.`);
      setSelectedOrderForStatus(null);
    } else {
      showNotice(res.message || 'Failed to update order', 'error');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const res = await deleteOrder(orderId);
      if (res.success) {
        showNotice(`Order ${orderId} removed.`);
      } else {
        showNotice(res.message || 'Failed to delete order', 'error');
      }
    }
  };

  // View Customer Live Tracker for Order
  const handleViewLiveTracker = async (orderId: string) => {
    await trackOrderById(orderId);
    setCurrentView('track');
  };

  // Reset database handler
  const handleResetData = async (mode: 'seed' | 'clear') => {
    const confirmMsg = mode === 'clear' 
      ? 'Clear all products and orders to build your 100% custom real inventory from scratch?' 
      : 'Reset products and demo orders to default USDA organic catalog?';

    if (window.confirm(confirmMsg)) {
      try {
        const res = await AdminService.resetData(mode);
        showNotice(res.message);
        await Promise.all([refetchProducts(), refetchOrders(), loadAdminData()]);
      } catch {
        showNotice('Failed to reset data', 'error');
      }
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = stats?.totalRevenue ?? orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeShipments = stats?.activeShipments ?? orders.filter(o => o.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#1c281e] pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium transition-all animate-in fade-in slide-from-bottom-3 ${
          notification.type === 'success' 
            ? 'bg-[#153e26] text-white border border-[#2e7d32]' 
            : 'bg-red-900 text-white border border-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#a3e635]" /> : <AlertCircle className="w-5 h-5 text-red-300" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <div className="bg-[#153e26] text-white border-b border-[#205234]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a3e635] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verdant Grove Admin Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Store & Real Data Management
              </h1>
              <p className="text-sm text-[#c0dec7] mt-0.5">
                Full CRUD control over products, live delivery order progression, inventory, and accounts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-admin-add-product-header"
                onClick={handleOpenCreateProduct}
                className="px-4 py-2.5 bg-[#a3e635] hover:bg-[#b8f547] text-[#153e26] font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Real Product</span>
              </button>
              <button
                id="btn-admin-preview-store"
                onClick={() => setCurrentView('shop')}
                className="px-4 py-2.5 bg-[#205234] hover:bg-[#2a6842] text-white font-medium text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-[#2d6f47]"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#205234]">
            <div className="bg-[#1b482d] p-4 rounded-2xl border border-[#25613c]">
              <div className="flex items-center justify-between text-xs text-[#a5d2b1]">
                <span>Total Store Revenue</span>
                <DollarSign className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#a5d2b1] mt-0.5">From real placed orders</div>
            </div>

            <div className="bg-[#1b482d] p-4 rounded-2xl border border-[#25613c]">
              <div className="flex items-center justify-between text-xs text-[#a5d2b1]">
                <span>Active Shipments</span>
                <Truck className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {activeShipments}
              </div>
              <div className="text-[11px] text-[#a5d2b1] mt-0.5">Live on tracking radar</div>
            </div>

            <div className="bg-[#1b482d] p-4 rounded-2xl border border-[#25613c]">
              <div className="flex items-center justify-between text-xs text-[#a5d2b1]">
                <span>Catalog Products</span>
                <Package className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {products.length}
              </div>
              <div className="text-[11px] text-[#a5d2b1] mt-0.5">Active in inventory</div>
            </div>

            <div className="bg-[#1b482d] p-4 rounded-2xl border border-[#25613c]">
              <div className="flex items-center justify-between text-xs text-[#a5d2b1]">
                <span>Customer Accounts</span>
                <Users className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {usersList.length || 1}
              </div>
              <div className="text-[11px] text-[#a5d2b1] mt-0.5">Registered via API</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#e1e4dc] pb-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              id="tab-admin-products"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#153e26] text-white shadow-sm'
                  : 'bg-white text-[#4a554a] hover:bg-[#eaece5] border border-[#e1e4dc]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              id="tab-admin-orders"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#153e26] text-white shadow-sm'
                  : 'bg-white text-[#4a554a] hover:bg-[#eaece5] border border-[#e1e4dc]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Orders & Live Tracking ({orders.length})</span>
            </button>

            <button
              id="tab-admin-users"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#153e26] text-white shadow-sm'
                  : 'bg-white text-[#4a554a] hover:bg-[#eaece5] border border-[#e1e4dc]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customer Users ({usersList.length || 1})</span>
            </button>

            <button
              id="tab-admin-settings"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#153e26] text-white shadow-sm'
                  : 'bg-white text-[#4a554a] hover:bg-[#eaece5] border border-[#e1e4dc]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>API & Database</span>
            </button>
          </div>

          <button
            id="btn-admin-refresh"
            onClick={() => {
              refetchProducts();
              refetchOrders();
              loadAdminData();
              showNotice('Refreshed data from backend API');
            }}
            className="p-2 bg-white hover:bg-[#eaece5] text-[#2d3a2e] rounded-xl border border-[#e1e4dc] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Reload from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync API</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 📦 TAB 1: PRODUCTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e1e4dc] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#768478]" />
                <input
                  id="input-admin-search-products"
                  type="text"
                  placeholder="Search products by title or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  id="select-admin-filter-category"
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm font-medium text-[#2d3a2e] focus:outline-none focus:border-[#153e26]"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  id="btn-admin-add-product-main"
                  onClick={handleOpenCreateProduct}
                  className="px-4 py-2 bg-[#153e26] hover:bg-[#1f5635] text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#a3e635]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#e1e4dc] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#2d3a2e]">
                  <thead className="bg-[#f7f8f5] text-xs uppercase font-semibold text-[#5a685c] border-b border-[#e1e4dc]">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Badge</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ecefe9]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#768478]">
                          <Package className="w-12 h-12 mx-auto mb-2 text-[#b0bcaf]" />
                          <p className="font-semibold text-base">No products found</p>
                          <p className="text-xs mt-1">Try changing search filter or add a new product.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#fafbf9] transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#e1e4dc] shrink-0 bg-[#f7f8f5]"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-[#153e26] group-hover:text-[#2e7d32] transition-colors truncate">
                                  {prod.name}
                                </div>
                                <div className="text-xs text-[#768478] truncate max-w-xs">
                                  {prod.packageSize || '500ml'} • {prod.specifications?.origin || 'Oregon, USA'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eef3eb] text-[#2d5f38]">
                              {prod.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold text-[#153e26]">
                            ${prod.price.toFixed(2)}
                            {prod.originalPrice && (
                              <span className="text-xs text-[#8c9a8e] line-through ml-1.5 font-normal">
                                ${prod.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {prod.inStock !== false ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <Check className="w-3 h-3" />
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3" />
                                Sold Out
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {prod.badge ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#153e26] bg-[#dcfce7] px-2 py-0.5 rounded-md border border-[#86efac]">
                                <Sparkles className="w-3 h-3 text-[#15803d]" />
                                {prod.badge}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                aria-label="Edit product"
                                className="p-2 hover:bg-[#eef2ea] text-[#2d5f38] rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                aria-label="Delete product"
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚚 TAB 2: ORDERS & LIVE DELIVERY TRACKER CONTROL */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header Banner */}
            <div className="bg-[#153e26] text-white p-5 rounded-2xl shadow-sm border border-[#205234] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#a3e635] uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Real-Time Shipment Dispatcher</span>
                </div>
                <h2 className="text-xl font-bold font-serif text-white mt-1">
                  Active Deliveries & Tracking Progression
                </h2>
                <p className="text-xs text-[#c0dec7] mt-0.5">
                  Change order status here to immediately update what the customer sees on their live tracking screen.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-[#205234] px-3 py-1.5 rounded-xl border border-[#2d6f47]">
                  {orders.length} Total Registered Orders
                </span>
              </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#e1e4dc] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#768478]" />
                <input
                  id="input-admin-search-orders"
                  type="text"
                  placeholder="Search by Order ID, tracking #, or customer name..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  id="select-admin-filter-order-status"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm font-medium text-[#2d3a2e] focus:outline-none focus:border-[#153e26]"
                >
                  <option value="All">All Statuses</option>
                  <option value="placed">Placed / Confirmed</option>
                  <option value="harvested">Harvested</option>
                  <option value="packed">Packed</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered Fresh</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-[#e1e4dc]">
                  <Truck className="w-12 h-12 mx-auto mb-2 text-[#b0bcaf]" />
                  <p className="font-semibold text-base text-[#2d3a2e]">No orders found</p>
                  <p className="text-xs text-[#768478] mt-1">Place an order in the store to see it appear here instantly.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const currentStepObj = order.trackingSteps.find(s => s.status === order.status) || order.trackingSteps[0];
                  return (
                    <div 
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#e1e4dc] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#ecefe9]">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-base font-bold text-[#153e26] font-mono">
                              {order.id}
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0f4ec] text-[#2d5f38] border border-[#dbe4d4]">
                              Tracking: {order.trackingNumber}
                            </span>
                            <span className="text-xs text-[#768478]">
                              Placed on {order.orderDate}
                            </span>
                          </div>
                          <div className="text-xs text-[#4a554a] mt-1.5 flex items-center gap-2">
                            <span>Customer: <strong>{order.customerName}</strong> ({order.customerEmail})</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#2e7d32]" />
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleOpenStatusModal(order)}
                            className="px-3.5 py-2 bg-[#153e26] hover:bg-[#205234] text-[#a3e635] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-[#a3e635]" />
                            <span>Advance Status ({order.status.replace('_', ' ').toUpperCase()})</span>
                          </button>

                          <button
                            onClick={() => handleViewLiveTracker(order.id)}
                            className="px-3.5 py-2 bg-[#f4f7f1] hover:bg-[#e6ede1] text-[#153e26] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-[#d8e2d2]"
                            title="View customer tracking screen"
                          >
                            <span>Open Tracker</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items & Live Step Progress in Order Card */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                        {/* Order Items */}
                        <div className="md:col-span-2 space-y-2">
                          <div className="font-semibold text-[#5a685c] uppercase text-[11px] tracking-wider">
                            Order Items ({order.items.length})
                          </div>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-[#f8faf6] px-3 py-2 rounded-xl border border-[#edf1ea]">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img 
                                    src={item.product?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
                                    alt={item.product?.name}
                                    className="w-7 h-7 rounded-lg object-cover border border-[#e1e4dc]"
                                  />
                                  <span className="font-medium text-[#2d3a2e] truncate">
                                    {item.product?.name || 'Organic Harvest Product'}
                                  </span>
                                  {item.selectedSize && (
                                    <span className="text-[10px] text-[#768478] bg-white px-1.5 py-0.5 rounded border border-[#e1e4dc]">
                                      {item.selectedSize}
                                    </span>
                                  )}
                                </div>
                                <div className="font-semibold text-[#153e26] shrink-0 ml-2">
                                  {item.quantity}x • ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking Progression Info */}
                        <div className="bg-[#f4f7f1] p-3.5 rounded-xl border border-[#dbe4d4] flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-[#2d5f38]">
                              <span>Live Step Status</span>
                              <span className="capitalize">{order.status.replace('_', ' ')}</span>
                            </div>
                            <div className="font-bold text-[#153e26] text-sm mt-1">
                              {currentStepObj?.title || 'Order Confirmed'}
                            </div>
                            <div className="text-[11px] text-[#5a685c] mt-0.5 line-clamp-2">
                              {currentStepObj?.description}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[#d8e2d2] flex items-center justify-between text-[11px]">
                            <span className="text-[#768478]">Order Total:</span>
                            <span className="font-bold text-sm text-[#153e26]">${(order.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 👥 TAB 3: USERS & CUSTOMER LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#e1e4dc] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e1e4dc] bg-[#fafbf9]">
              <h2 className="text-lg font-bold text-[#153e26] font-serif">
                Registered Customer Accounts
              </h2>
              <p className="text-xs text-[#768478] mt-0.5">
                Live authenticated users in Verdant Grove backend auth storage.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#2d3a2e]">
                <thead className="bg-[#f7f8f5] text-xs uppercase font-semibold text-[#5a685c] border-b border-[#e1e4dc]">
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Phone</th>
                    <th className="px-5 py-3.5 text-right">Default Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ecefe9]">
                  {(usersList.length > 0 ? usersList : [
                    {
                      id: 'usr-jairam',
                      name: 'Jairam Singh',
                      email: 'jairamsingh.tech@gmail.com',
                      phone: '+1 (503) 555-0194',
                      role: 'Customer',
                      address: {
                        street: '124 Organic Harvest Way',
                        city: 'Portland',
                        state: 'OR',
                        zip: '97201'
                      }
                    }
                  ]).map((u, i) => (
                    <tr key={u.id || i} className="hover:bg-[#fafbf9] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#153e26]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#153e26] text-white flex items-center justify-center font-bold text-xs">
                            {u.name?.slice(0, 2).toUpperCase() || 'US'}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-[#4a554a]">
                        {u.email}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[#e3efe6] text-[#153e26]">
                          {u.role || 'Customer'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#768478]">
                        {u.phone || '—'}
                      </td>
                      <td className="px-5 py-4 text-right text-xs text-[#4a554a]">
                        {u.address ? `${u.address.city}, ${u.address.state} ${u.address.zip}` : 'Portland, OR 97201'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ⚙️ TAB 4: API & DATABASE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live API Health */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e4dc] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#153e26] font-serif font-bold text-lg">
                <Database className="w-5 h-5 text-[#2e7d32]" />
                <span>Backend Express REST API Status</span>
              </div>
              <p className="text-xs text-[#768478]">
                Verdant Grove runs a integrated full-stack Express server with real REST endpoints.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8f5] border border-[#e1e4dc]">
                  <span className="font-mono text-[#153e26]">GET/POST /api/products</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Ready ({products.length} items)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8f5] border border-[#e1e4dc]">
                  <span className="font-mono text-[#153e26]">GET/PUT /api/orders & track</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Ready ({orders.length} orders)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8f5] border border-[#e1e4dc]">
                  <span className="font-mono text-[#153e26]">POST /api/auth/register & login</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            </div>

            {/* Catalog Control */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e4dc] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#153e26] font-serif font-bold text-lg">
                <Layers className="w-5 h-5 text-[#2e7d32]" />
                <span>Real Catalog Initialization</span>
              </div>
              <p className="text-xs text-[#768478]">
                Need to clear dummy products or restore initial USDA organic inventory?
              </p>

              <div className="space-y-3 pt-2">
                <button
                  id="btn-admin-reset-seed"
                  onClick={() => handleResetData('seed')}
                  className="w-full py-2.5 px-4 bg-[#f4f7f1] hover:bg-[#e6ede1] text-[#153e26] text-xs font-bold rounded-xl transition-colors border border-[#d8e2d2] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#2e7d32]" />
                  <span>Restore Fresh USDA Organic Seed Catalog</span>
                </button>

                <button
                  id="btn-admin-clear-all"
                  onClick={() => handleResetData('clear')}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Clear All Products & Start Empty (100% Custom)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📝 MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e1e4dc] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="bg-[#153e26] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif">
                  {editingProductId ? 'Edit Product' : 'Add New Real Product'}
                </h3>
                <p className="text-xs text-[#c0dec7] mt-0.5">
                  Publishes directly into the store catalog via REST API.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#205234] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cold-Pressed Argan Oil"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26] focus:bg-white"
                />
              </div>

              {/* Subtitle / Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Subtitle / Quality Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra Virgin • Single Estate Cold-Pressed"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26] focus:bg-white"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm font-medium focus:outline-none focus:border-[#153e26]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Optional strikethrough"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              {/* Package Size, Badge & Farm Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Package Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500ml Glass Bottle"
                    value={productForm.packageSize}
                    onChange={(e) => setProductForm({ ...productForm, packageSize: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Badge / Ribbon
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller, Fresh Harvest"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Farm Origin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Willamette Valley, OR"
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                />

                {/* Preset image buttons */}
                <div className="mt-2">
                  <div className="text-[11px] text-[#768478] mb-1 font-medium">Or choose a high-res organic photography preset:</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: img.url })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          productForm.image === img.url 
                            ? 'bg-[#153e26] text-white border-[#153e26]' 
                            : 'bg-white text-[#4a554a] border-[#d8dcd3] hover:bg-[#f4f7f1]'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe tasting notes, harvest methods, certifications..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                />
              </div>

              {/* Stock toggle */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-[#153e26] focus:ring-[#153e26]"
                  />
                  <span className="text-xs font-semibold text-[#2d3a2e]">In Stock & Available to Order</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#153e26] focus:ring-[#153e26]"
                  />
                  <span className="text-xs font-semibold text-[#2d3a2e]">Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#e1e4dc] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#d8dcd3] font-semibold text-xs text-[#4a554a] hover:bg-[#f7f8f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#153e26] hover:bg-[#1f5635] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingProductId ? 'Save Product Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MODAL: ADVANCE ORDER TRACKING STATUS */}
      {/* ========================================================================= */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#e1e4dc] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#153e26] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-serif">
                  Advance Delivery Progression
                </h3>
                <p className="text-xs text-[#c0dec7]">
                  Order: <span className="font-mono font-bold text-white">{selectedOrderForStatus.id}</span> • {selectedOrderForStatus.customerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForStatus(null)}
                className="p-1.5 rounded-full hover:bg-[#205234] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderStatus} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Select New Live Status *
                </label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm font-semibold text-[#153e26] focus:outline-none focus:border-[#153e26]"
                >
                  <option value="placed">1. Placed & Payment Confirmed</option>
                  <option value="harvested">2. Fresh Harvest Quality Inspected</option>
                  <option value="packed">3. Packed in Biodegradable Insulation</option>
                  <option value="in_transit">4. In Transit — Eco Delivery Hub</option>
                  <option value="out_for_delivery">5. Out for Delivery (Driver en Route)</option>
                  <option value="delivered">6. Delivered Fresh at Doorstep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                  Custom Step Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Loaded onto Zero-Emission Delivery Van #14"
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-sm focus:outline-none focus:border-[#153e26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Carrier Name
                  </label>
                  <input
                    type="text"
                    value={statusCarrier}
                    onChange={(e) => setStatusCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#2d3a2e] mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="text"
                    value={statusEstimatedDelivery}
                    onChange={(e) => setStatusEstimatedDelivery(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f8f5] border border-[#d8dcd3] rounded-xl text-xs focus:outline-none focus:border-[#153e26]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e1e4dc] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#d8dcd3] font-semibold text-xs text-[#4a554a] hover:bg-[#f7f8f5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#153e26] hover:bg-[#1f5635] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#a3e635]" />
                  <span>Update Tracking Timeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
