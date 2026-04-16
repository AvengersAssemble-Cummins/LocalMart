import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('localmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getCurrentUserId = () => {
  const user = localStorage.getItem('localmart_user');
  if (user) {
    try {
      return JSON.parse(user).id || JSON.parse(user)._id;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// ===== Auth APIs =====
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: data => api.post('/auth/signup', data)
};
export const authService = authAPI;

// ===== Shop APIs =====
export const shopAPI = {
  getAll: params => api.get('/shops', { params }),
  getById: id => api.get(`/shops/${id}`),
  getProducts: id => api.get(`/shops/${id}/products`),
  getCategories: () => api.get('/shops/categories'),
  search: query => api.get('/shops/search', { params: { q: query } })
};
export const shopService = shopAPI;

// ===== Product APIs =====
export const productAPI = {
  getAll: params => api.get('/products', { params }),
  getById: id => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getShopsForProduct: id => api.get(`/products/${id}/shops`)
};
export const productService = productAPI;

// ===== Category APIs (from Product collection) =====
export const categoryService = {
  getAll: () => api.get('/products/categories').then(res => {
    return res.data.map((cat, i) => ({ id: String(i), name: cat }));
  })
};

// ===== Cart APIs =====
export const cartAPI = {
  get: userId => api.get(`/cart?userId=${userId}`),
  add: (userId, item) => api.post(`/cart/add?userId=${userId}`, item),
  update: (userId, productId, quantity) => api.put(`/cart/update?userId=${userId}&productId=${productId}&quantity=${quantity}`),
  remove: (userId, productId) => api.delete(`/cart/remove?userId=${userId}&productId=${productId}`)
};
export const cartService = cartAPI;

// ===== Order APIs =====
export const orderAPI = {
  getByUser: userId => api.get(`/orders?userId=${userId}`),
  getById: id => api.get(`/orders/${id}`),
  create: data => api.post('/orders', data)
};
export const orderService = orderAPI;

// ===== User APIs =====
export const userAPI = {
  getProfile: userId => api.get(`/users/${userId}`)
};
export const userService = userAPI;

export default api;
