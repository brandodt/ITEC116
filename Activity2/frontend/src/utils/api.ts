import axios from 'axios';
import type { AuthResponse, LoginData, RegisterData, Note } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
};

// Notes API
export const notesAPI = {
    getAll: async (): Promise<Note[]> => {
        const response = await api.get('/notes');
        return response.data;
    },

    create: async (data: { title: string; content: string }): Promise<Note> => {
        const response = await api.post('/notes', data);
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string }): Promise<Note> => {
        const response = await api.patch(`/notes/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notes/${id}`);
    },
};

export default api;