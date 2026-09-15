import axios from 'axios';

// Sử dụng biến môi trường hoặc fallback về URL online trên Render
const API_URL = import.meta.env.VITE_API_URL || 'https://phong-hcm-system.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Tự động gắn Token JWT vào header nếu có
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;