// src/config/api.js
const isDocker = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isDocker
  ? 'http://backend:8080'     // dentro do Docker
  : 'http://localhost:8080';  // modo dev local

export default API_BASE_URL;
