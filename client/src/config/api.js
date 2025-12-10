import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Log the API URL for debugging
console.log('API URL:', API_URL);

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { API_URL };
