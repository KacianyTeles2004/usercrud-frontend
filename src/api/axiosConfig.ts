import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/', // Ajuste para sua URL base do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;