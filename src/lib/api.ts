import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 600000, // 10 minutes
});

export const getMediaUrl = (path: string | null | undefined) => {
    if (!path) return '';
    // If it's already a full URL (new Cloudinary uploads), return as is
    if (path.startsWith('http')) return path;

    // Legacy support for Minio (optional, adjust if you still need it)
    // const MINIO_URL = 'http://localhost:9000';
    // return `${MINIO_URL}/${path}`;

    return path;
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
