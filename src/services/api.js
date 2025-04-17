import axios from 'axios';

const baseURL = 'https://cmps271backend.onrender.com';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Profile endpoints
export const getProfile = () => api.get('/profile');
export const updateProfile = data => api.put('/profile', data);

// Auth endpoints
export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = data => api.post('/auth/signup', data);

// Expenses endpoints
export const getExpenses = () => api.get('/expenses');
export const addExpense = data => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = id => api.delete(`/expenses/${id}`);

// Budget endpoints
export const getBudgets = (month, year) => api.get(`/budget?month=${month}&year=${year}`);
export const updateBudgets = payload => api.put('/budget', payload);

// Rewards endpoints
export const getRewards = () => api.get('/rewards');
export const redeemReward = rewardId =>
  api.post('/rewards/redeem', { rewardId });
export const getTotalRewards = () => api.get('/rewards/total');
export const addReward = data => api.post('/rewards', data);

// Questions (dynamic sustainability questions)
export const getCategoryQuestions = category =>
  api.get(`/questions?category=${encodeURIComponent(category)}`);

// Sustainability endpoints
export const getSustainabilityMetrics = () => api.get('/sustainability');
export const updateSustainabilityMetrics = data => api.put('/sustainability', data);
export const computeSustainabilityMetrics = () => api.post('/sustainability/compute');

export default api;
