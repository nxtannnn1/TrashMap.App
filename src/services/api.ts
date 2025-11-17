// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: "http://192.168.100.7:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('user-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Você também pode adicionar um interceptor para respostas
// para, por exemplo, fazer logout automático se o token expirar (status 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
    
      
    
      await SecureStore.deleteItemAsync('user-token');
    }
    return Promise.reject(error);
  }
);

export default api;