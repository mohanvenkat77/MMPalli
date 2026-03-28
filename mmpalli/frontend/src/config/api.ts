import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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

export { API_BASE_URL };