# 🌿 Verdant Grove E-Commerce — Full API Integration & Testing Guide

This guide explains **how the API system is structured**, **which exact files to edit to connect your external backend**, and **how to test every endpoint**.

---

## 📍 Quick Summary: Where to Make Changes?

| If you want to... | Edit this file | What to change |
| :--- | :--- | :--- |
| **Change Backend URL** | `.env` or `.env.example` or `src/services/api.ts` | Set `VITE_API_URL=http://your-backend.com/api` |
| **Modify API Request / Response Mapping** | `src/services/api.ts` | Edit functions in `ProductService`, `AuthService`, `OrderService` |
| **Add Custom Auth Headers / Tokens** | `src/services/api.ts` | Update `apiRequest()` helper function |
| **Change Built-in Express Backend** | `server.ts` | Modify or add Express route handlers (`app.get`, `app.post`) |
| **Frontend State & Real-Time Sync** | `src/context/ShopContext.tsx` | Controls state between Admin Center and Customer Store |

---

## 1. Changing the API Base URL

Open **`/src/services/api.ts`** (Lines 3–15):

```typescript
// src/services/api.ts
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000/api' // <-- Change this to your local backend URL (e.g. Django, Express, FastAPI)
    : '/api');                    // Production URL
```

Alternatively, add this to your **`.env`** file:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 2. API Endpoints Specification

Below are the exact REST endpoints expected by the frontend. If your backend uses different URL paths or property names, modify the corresponding function in `src/services/api.ts`.

### 🛍️ Products Service (`ProductService` in `src/services/api.ts`)

#### 1. Get All Products
- **HTTP Method**: `GET /api/products`
- **Query Params**: `?category=Oils%20%26%20Vinegars&search=oil&minPrice=10&maxPrice=100&sortBy=price-low`
- **Expected Response**:
```json
{
  "products": [
    {
      "id": "avocado-oil",
      "slug": "avocado-oil",
      "name": "Cold-Pressed Extra Virgin Avocado Oil",
      "subtitle": "100% Pure Hass Avocado",
      "category": "Oils & Vinegars",
      "price": 18.99,
      "originalPrice": 24.99,
      "rating": 4.9,
      "reviewCount": 128,
      "badge": "Best Seller",
      "image": "https://images.unsplash.com/...",
      "packageSize": "250ml",
      "sizes": ["250ml", "500ml", "1000ml"],
      "inStock": true,
      "stockCount": 45,
      "featured": true,
      "description": "Rich in oleic acid and healthy fats...",
      "specifications": {
        "origin": "Michoacán, Mexico (Certified Fair Trade)",
        "certifications": "USDA Organic, Non-GMO Project Verified, Keto Certified"
      }
    }
  ],
  "total": 1
}
```

#### 2. Get Product by ID / Slug
- **HTTP Method**: `GET /api/products/:slug`
- **Expected Response**:
```json
{
  "product": { ...product_object... },
  "success": true
}
```

#### 3. Create Product (Admin)
- **HTTP Method**: `POST /api/products`
- **Request Body**:
```json
{
  "name": "Organic Wildflower Honey",
  "category": "Raw Honey & Syrups",
  "price": 16.50,
  "originalPrice": 20.00,
  "image": "https://images.unsplash.com/...",
  "description": "Pure raw unpasteurized honey",
  "packageSize": "500g",
  "stockCount": 80,
  "inStock": true
}
```
- **Response**: `{ "success": true, "product": { ... }, "message": "Product created" }`

#### 4. Update Product (Admin)
- **HTTP Method**: `PUT /api/products/:id`
- **Request Body**: Partial product fields to update (e.g. `{ "price": 14.99, "stockCount": 60 }`)
- **Response**: `{ "success": true, "product": { ... } }`

#### 5. Delete Product (Admin)
- **HTTP Method**: `DELETE /api/products/:id`
- **Response**: `{ "success": true, "deletedId": "prod-123" }`

---

### 🔐 Authentication Service (`AuthService` in `src/services/api.ts`)

#### 1. User Login
- **HTTP Method**: `POST /api/auth/login`
- **Request Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**:
```json
{
  "token": "jwt_token_string_here",
  "user": {
    "id": "usr-101",
    "name": "Jairam Singh",
    "email": "user@example.com",
    "phone": "+1 (555) 382-9104",
    "address": {
      "street": "742 Organic Harvest Way",
      "city": "Portland",
      "state": "OR",
      "zip": "97201"
    }
  }
}
```

#### 2. User Registration
- **HTTP Method**: `POST /api/auth/register`
- **Request Body**: `{ "name": "Name", "email": "user@example.com", "password": "...", "phone": "..." }`
- **Response**: `{ "token": "...", "user": { ... } }`

#### 3. Current User Profile
- **HTTP Method**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

---

### 📦 Orders & Tracking Service (`OrderService` in `src/services/api.ts`)

#### 1. Create Order
- **HTTP Method**: `POST /api/orders`
- **Request Body**:
```json
{
  "items": [
    { "productId": "avocado-oil", "quantity": 2, "selectedSize": "250ml", "unitPrice": 18.99 }
  ],
  "shippingAddress": { "street": "...", "city": "...", "state": "...", "zip": "..." },
  "paymentMethod": "Credit Card",
  "subtotal": 37.98,
  "discount": 0,
  "shipping": 0,
  "total": 37.98
}
```
- **Response**: Full Order object with generated `id` (e.g. `VG-8492`) and `trackingNumber`.

#### 2. Live Order Tracking
- **HTTP Method**: `GET /api/orders/track/:id`
- **Response**:
```json
{
  "order": {
    "id": "VG-8492",
    "trackingNumber": "TRK-ORG-849201",
    "status": "in_transit",
    "estimatedDelivery": "Tomorrow by 4:00 PM",
    "carrier": "Verdant Eco-Express",
    "trackingSteps": [
      { "status": "placed", "title": "Order Placed", "completed": true },
      { "status": "harvested", "title": "Farm Harvest Inspected", "completed": true },
      { "status": "packed", "title": "Packed in Eco-Insulation", "completed": true },
      { "status": "in_transit", "title": "In Transit", "completed": true, "current": true },
      { "status": "out_for_delivery", "title": "Out for Delivery", "completed": false },
      { "status": "delivered", "title": "Delivered", "completed": false }
    ]
  }
}
```

---

## 3. How to Test API Calls (Client-Side Test Function)

You can run automated API tests directly in your browser console or import the test suite from `src/services/api.tester.ts`.

Example test snippet to test backend connectivity:
```typescript
import { testApiConnections } from './src/services/api.tester';

// Run full test suite:
testApiConnections().then(results => console.log('API Test Results:', results));
```
