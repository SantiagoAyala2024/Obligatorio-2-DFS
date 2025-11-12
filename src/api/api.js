import axios from 'axios';

const api = axios.create({
    baseURL: "https://obligatorio-1-dfs.vercel.app/"
});

api.interceptors.request.use((config) => {
    
    if (config.skipAuth) {
        return config;
    }

    const token = localStorage.getItem("token");
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export default api;