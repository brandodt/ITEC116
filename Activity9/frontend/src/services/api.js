/**
 * API Service Layer for E-Commerce
 * Abstracts all API calls for products, cart, and orders
 */

const API_BASE = '/api';

// Session ID for cart/order tracking
const SESSION_ID = localStorage.getItem('sessionId') || 
  (() => {
    const id = 'session_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', id);
    return id;
  })();

// Generic fetch wrapper with error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': SESSION_ID,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ PRODUCTS ============

export async function getAllProducts(category, search) {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);
  const query = params.toString();
  return request(`/products${query ? '?' + query : ''}`);
}

export async function getProductById(id) {
  return request(`/products/${id}`);
}

export async function getCategories() {
  return request('/products/categories');
}

export async function createProduct(data) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id, data) {
  return request(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}

// ============ CART ============

export async function getCart() {
  return request('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return request('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return request('/cart/update', {
    method: 'PATCH',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(productId) {
  return request(`/cart/remove/${productId}`, {
    method: 'DELETE',
  });
}

export async function clearCart() {
  return request('/cart/clear', {
    method: 'DELETE',
  });
}

export async function validateCart() {
  return request('/cart/validate', {
    method: 'POST',
  });
}

// ============ ORDERS ============

export async function getAllOrders() {
  return request('/orders');
}

export async function getOrderById(id) {
  return request(`/orders/${id}`);
}

export async function checkout() {
  return request('/orders/checkout', {
    method: 'POST',
  });
}

export async function getOrderStats() {
  return request('/orders/stats');
}
