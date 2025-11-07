import axios from 'axios';
import type { AuthResponse, LoginData, RegisterData, Post, Comment } from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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

export const postsAPI = {
    getAll: async (): Promise<Post[]> => {
        const response = await api.get('/posts');
        return response.data;
    },

    getOne: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    create: async (data: { title: string; content: string; tags?: string[] }): Promise<Post> => {
        const response = await api.post('/posts', data);
        return response.data;
    },

    update: async (id: string, data: { title?: string; content?: string; tags?: string[] }): Promise<Post> => {
        const response = await api.patch(`/posts/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
};

export const commentsAPI = {
    getByPost: async (postId: string): Promise<Comment[]> => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },

    create: async (postId: string, data: { content: string }): Promise<Comment> => {
        const response = await api.post(`/posts/${postId}/comments`, data);
        return response.data;
    },

    delete: async (commentId: string, postId: string): Promise<void> => {
        await api.delete(`/posts/${postId}/comments/${commentId}`);
    },
};

export default api;
