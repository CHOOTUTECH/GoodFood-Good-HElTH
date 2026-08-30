import { ProductService, AuthService, OrderService, OrderTrackerService, AdminService, API_BASE_URL } from './api';

/**
 * ==============================================================================
 * 🧪 API ENDPOINTS TEST SUITE & DIAGNOSTIC UTILITY
 * ==============================================================================
 *
 * Aap iss test utility ko browser console ya kisi component se run kar sakte hain
 * taaki pata chal sake ki backend ke kaunse endpoints live hain aur response kya de rahe hain.
 *
 * Usage in Browser Console or Code:
 * --------------------------------------------------
 * import { runFullApiDiagnostics } from './services/api.tester';
 * runFullApiDiagnostics();
 */

export interface TestResult {
  endpoint: string;
  name: string;
  success: boolean;
  durationMs: number;
  data?: any;
  error?: string;
}

export async function runFullApiDiagnostics(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  console.group('🌿 [Verdant Grove] Running API Diagnostic Tests...');
  console.log(`Connecting to Base API URL: ${API_BASE_URL}`);

  // Test 1: Healthcheck
  const t0 = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    results.push({
      endpoint: 'GET /api/health',
      name: 'Server Healthcheck',
      success: res.ok,
      durationMs: Math.round(performance.now() - t0),
      data
    });
    console.log('✅ [1/6] Healthcheck:', data);
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/health',
      name: 'Server Healthcheck',
      success: false,
      durationMs: Math.round(performance.now() - t0),
      error: err.message
    });
    console.warn('⚠️ [1/6] Healthcheck failed (using internal fallback):', err.message);
  }

  // Test 2: Fetch Products
  const t1 = performance.now();
  try {
    const { products, total } = await ProductService.getProducts();
    results.push({
      endpoint: 'GET /api/products',
      name: 'Fetch Products List',
      success: products.length > 0,
      durationMs: Math.round(performance.now() - t1),
      data: { count: products.length, total }
    });
    console.log(`✅ [2/6] Products fetched successfully: ${products.length} products found.`);
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/products',
      name: 'Fetch Products List',
      success: false,
      durationMs: Math.round(performance.now() - t1),
      error: err.message
    });
  }

  // Test 3: Fetch Single Product by Slug
  const t2 = performance.now();
  try {
    const product = await ProductService.getProductBySlug('avocado-oil');
    results.push({
      endpoint: 'GET /api/products/:slug',
      name: 'Fetch Single Product',
      success: Boolean(product && product.id),
      durationMs: Math.round(performance.now() - t2),
      data: product ? { id: product.id, name: product.name, price: product.price } : null
    });
    console.log('✅ [3/6] Single product details fetched:', product?.name);
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/products/:slug',
      name: 'Fetch Single Product',
      success: false,
      durationMs: Math.round(performance.now() - t2),
      error: err.message
    });
  }

  // Test 4: Order Tracking
  const t3 = performance.now();
  try {
    const trackData = await OrderTrackerService.trackOrder('VG-8492');
    results.push({
      endpoint: 'GET /api/orders/track/:id',
      name: 'Live Order Tracking',
      success: Boolean(trackData && trackData.id),
      durationMs: Math.round(performance.now() - t3),
      data: trackData ? { id: trackData.id, status: trackData.status, trackingNumber: trackData.trackingNumber } : null
    });
    console.log('✅ [4/6] Order tracking verified for VG-8492:', trackData?.status);
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/orders/track/:id',
      name: 'Live Order Tracking',
      success: false,
      durationMs: Math.round(performance.now() - t3),
      error: err.message
    });
  }

  // Test 5: Admin Stats
  const t4 = performance.now();
  try {
    const stats = await AdminService.getStats();
    results.push({
      endpoint: 'GET /api/admin/stats',
      name: 'Store Admin Analytics',
      success: Boolean(stats && stats.totalProducts !== undefined),
      durationMs: Math.round(performance.now() - t4),
      data: stats
    });
    console.log('✅ [5/6] Admin stats loaded:', stats);
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/admin/stats',
      name: 'Store Admin Analytics',
      success: false,
      durationMs: Math.round(performance.now() - t4),
      error: err.message
    });
  }

  // Test 6: Auth Current User
  const t5 = performance.now();
  try {
    const user = await AuthService.getCurrentUser();
    results.push({
      endpoint: 'GET /api/auth/me',
      name: 'Auth Verification',
      success: true,
      durationMs: Math.round(performance.now() - t5),
      data: user ? { id: user.id, email: user.email } : 'Guest session'
    });
    console.log('✅ [6/6] Auth check complete:', user?.name || 'Guest user');
  } catch (err: any) {
    results.push({
      endpoint: 'GET /api/auth/me',
      name: 'Auth Verification',
      success: false,
      durationMs: Math.round(performance.now() - t5),
      error: err.message
    });
  }

  console.groupEnd();
  return results;
}

// Make runnable in browser console directly: (window as any).runApiTests()
if (typeof window !== 'undefined') {
  (window as any).runApiTests = runFullApiDiagnostics;
}
