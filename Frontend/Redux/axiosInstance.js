// axiosInstance.js
import axios from 'axios';
import { BACKEND_URL } from '@env';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global variable to store current user (set from React components)
let currentUser = null;

// Function to set the current user from React components
export const setCurrentUser = (user) => {
  currentUser = user;
};

// Function to clear the current user
export const clearCurrentUser = () => {
  currentUser = null;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.log('Unauthorized access');
      // Could dispatch a logout action or navigate to login
      // But don't use React hooks here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;