export interface ValidateToken{
    token: string
}

export interface ApiValidateToken {
    success: boolean,
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    data: {
        token: string
    }
    success: boolean;
}

export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    createdAt?: string;
}

export interface UserInfoResponse {
    success: boolean;
    user: User;
}

export interface UpdateUserPayload {
    username?: string;
    email?: string;
    password?: string;
}