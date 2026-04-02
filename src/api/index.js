import axios from 'axios';

const API = axios.create({
    // Since your backend is running on the same MacBook as your Web Dashboard
    baseURL: 'http://localhost:5001/api', 
});

// Add the token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;