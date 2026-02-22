import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAPI = (data) => api.post('/auth/login', data);
export const registerAPI = (data) => api.post('/auth/register', data);
export const getProfileAPI = () => api.get('/auth/profile');

// Products
export const getCategoriesAPI = () => api.get('/categories');
export const getProductsAPI = () => api.get('/products');
export const getProductsByCategoryAPI = (slug) => api.get(`/products/${slug}`);
export const getProductByIdAPI = (id) => api.get(`/product/${id}`);
export const searchProductsAPI = (q) => api.get(`/search?q=${encodeURIComponent(q)}`);

// Cart
export const getCartAPI = () => api.get('/cart');
export const addToCartAPI = (data) => api.post('/cart/add', data);
export const updateCartAPI = (data) => api.post('/cart/update', data);
export const removeFromCartAPI = (data) => api.delete('/cart/remove', { data });

// Orders
export const createOrderAPI = (data) => api.post('/order/create', data);
export const getOrderHistoryAPI = () => api.get('/order/history');

// Admin
export const getAdminStatsAPI = () => api.get('/admin/dashboard/stats');
export const getAdminProductsAPI = (val) => api.get(`/admin/products?category_id=${val}`);
export const addAdminProductAPI = (data) => api.post('/admin/product/add', data);
export const updateAdminProductAPI = (id, data) => api.put(`/admin/product/update/${id}`, data);
export const deleteAdminProductAPI = (id) => api.delete(`/admin/product/delete/${id}`);
export const getAdminOrdersAPI = (status) => api.get(`/admin/orders${status ? `?status=${status}` : ''}`);
export const updateOrderStatusAPI = (id, data) => api.put(`/admin/order/status/${id}`, data);
export const getAdminCategoriesAPI = () => api.get('/admin/categories');
export const addAdminCategoryAPI = (data) => api.post('/admin/category/add', data);

export default api;
