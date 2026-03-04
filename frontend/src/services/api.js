import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

// Product API
export const productAPI = {
    getAll: (page = 0, size = 12, sortBy = 'id', direction = 'asc') =>
        api.get(`/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),
    getById: (id) => api.get(`/products/${id}`),
    search: (query, page = 0, size = 12) =>
        api.get(`/products/search?query=${query}&page=${page}&size=${size}`),
    getByCategory: (category, page = 0, size = 12) =>
        api.get(`/products/category/${category}?page=${page}&size=${size}`),
    getCategories: () => api.get('/products/categories'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    addItem: (data) => api.post('/cart/items', data),
    updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}?quantity=${quantity}`),
    removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
    clear: () => api.delete('/cart'),
};

// Order API
export const orderAPI = {
    checkout: () => api.post('/orders/checkout'),
    getMyOrders: (page = 0, size = 10) => api.get(`/orders?page=${page}&size=${size}`),
    getAllOrders: (page = 0, size = 10) => api.get(`/orders/admin/all?page=${page}&size=${size}`),
    updateStatus: (orderId, status) => api.put(`/orders/admin/${orderId}/status?status=${status}`),
};

export default api;
