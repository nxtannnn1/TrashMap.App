// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // --- ATENÇÃO MÁXIMA ---
  // Substitua pela URL do seu backend. Se estiver testando no seu celular,
  // use o IP da sua máquina na rede, NUNCA 'localhost'.
  // Exemplo: 'http://192.168.1.10:8080'
  baseURL: '192.168.100.7:8080',
  headers: {
    'Content-Type': 'application/json',
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
      // Exemplo: Se o backend retornar 401 (Não autorizado),
      // podemos limpar o token e forçar o logout.
      // Isso será tratado melhor no AuthContext.
      await SecureStore.deleteItemAsync('user-token');
    }
    return Promise.reject(error);
  }
);

export default api;