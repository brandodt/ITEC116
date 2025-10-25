export interface User {
    id: string;
    _id?: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    _id: string;
    title: string;
    content: string;
    userId: {
        id?: string;
        _id?: string;
        name: string;
        email: string;
    };
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    postId: string;
    userId: User;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}
