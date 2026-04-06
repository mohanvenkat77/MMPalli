import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mmpalli-1.onrender.com/api';

// For reading data (No API key needed)
export const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/public`,
  headers: { 'Content-Type': 'application/json' }
});

// For modifying data (Requires API key)
export const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: { 'Content-Type': 'application/json' }
});

// Helper function to inject the API key when Admin logs in
export const setAdminApiKey = (key: string) => {
  adminApi.defaults.headers.common['X-API-Key'] = key;
};
// Add this interceptor if it's missing or update it
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('mmp_api_key');
  if (token) {
    config.headers['x-api-key'] = token;
  }
  return config;
});
export { API_BASE_URL };
