// axiosInstance.js
import axios from 'axios';

import {BASE_URL} from '@env';
import { useAuth } from '../context/UserContext';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

// Attach Firebase ID token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = useAuth();
    if (user) {
      try {
        const token = await user.getIdToken();
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

export default axiosInstance;
