
export interface AuthResponse {
    success: boolean;
    token: string;
    message: string | null | undefined;
}

export interface User {
    email: string;
    name: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}

export type LoginRequest = AuthRequest

export interface RegisterRequest extends AuthRequest {
    name: string;
}

export interface AuthState {
    user: User | null | undefined;
    token: string | null | undefined;
    authenticated: boolean;
}

export interface SetAuthAuthenticatedState {
    authenticated: boolean;
}

export interface SetAuthTokenState {
    token: string | null | undefined;
}

export interface SetAuthUserState {
    user: User | null | undefined;
}

export interface FetchUserRequest {
    email: string;
}
