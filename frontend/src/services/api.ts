import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth interceptor - attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('localmart_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== Auth APIs =====
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  signup: (data: {
    name: string
    email: string
    password: string
    phone: string
    dob: string
    address: string
  }) => api.post('/auth/signup', data),
}

// ===== Shop APIs =====
export const shopAPI = {
  getAll: (params?: {
    category?: string
    rating?: number
    verified?: boolean
    search?: string
  }) => api.get('/shops', { params }),

  getById: (id: string) => api.get(`/shops/${id}`),

  getProducts: (shopId: string) => api.get(`/shops/${shopId}/products`),

  getCategories: () => api.get('/shops/categories'),

  search: (query: string) => api.get('/shops/search', { params: { q: query } }),
}

// ===== Product APIs =====
export const productAPI = {
  getAll: (params?: { category?: string; shopId?: string }) =>
    api.get('/products', { params }),
}

export default api
