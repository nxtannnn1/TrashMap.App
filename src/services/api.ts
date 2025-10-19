// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // --- ATENÇÃO MÁXIMA ---
  // Substitua pela URL do seu backend. Se estiver testando no seu celular,
  // use o IP da sua máquina na rede, NUNCA 'localhost'.
  // Exemplo: 'http://192.168.1.10:8080'
  baseURL: '192.168.100.7:8080',
});

export default api;