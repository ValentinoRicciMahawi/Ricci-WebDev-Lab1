import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Register user baru
  register: async (userData) => {
    const response = await api.post('register/', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('login/', { email, password });
    const data = response.data;

    // Simpan token dan user info di localStorage
    localStorage.setItem('access_token', data.token.access);
    localStorage.setItem('refresh_token', data.token.refresh);
    localStorage.setItem('user_email', data.email);
    localStorage.setItem('user_role', data.role);
    localStorage.setItem('user_name', data.full_name);
    localStorage.setItem('user_major', data.major || '');

    return data;
  },

  // Logout user
  logout: () => {
    localStorage.clear();
  },

  // Cek apakah user sudah login
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      // Cek apakah token sudah expired
      if (decoded.exp * 1000 < Date.now()) {
        authService.logout();
        return false;
      }
      return true;
    } catch (error) {
      authService.logout();
      return false;
    }
  },

  // Get current user data dari localStorage
  getCurrentUser: () => {
    return {
      email: localStorage.getItem('user_email'),
      role: localStorage.getItem('user_role'),
      name: localStorage.getItem('user_name'),
      major: localStorage.getItem('user_major'),
    };
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('user_role');
  },
};

export default authService;