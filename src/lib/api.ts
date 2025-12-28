import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 300000, // 5 minutes
});

export const MINIO_URL = 'http://localhost:9000';

export const getMediaUrl = (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${MINIO_URL}/${path}`;
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        const { data } = response;
        // Check for business logic status code
        if (data && data.statusCode && data.statusCode !== 'SUCCESS2000') {
            if (data.statusCode === 'EXCEPTION0505') {
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
            }
            return Promise.reject({
                response: {
                    data: {
                        message: data.message || 'Có lỗi xảy ra từ máy chủ'
                    }
                }
            });
        }
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default api;
