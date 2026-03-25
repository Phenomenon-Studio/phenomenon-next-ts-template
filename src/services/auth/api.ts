import type { ResponseWithData } from '@/lib/types';
import { http } from '@/lib/@http';

export type LoginRequest = {
    email: string;
    password: string;
};

export type SignUpRequest = {
    email: string;
    password: string;
    passwordConfirm: string;
    returnUrl: string;
};

export type RefreshTokenRequest = {
    refreshToken: string;
};

export type LoginResponse = ResponseWithData<{
    accessToken: string;
    refreshToken?: string;
    employer: {
        id: string;
        email: string;
        entityType: 'employer' | 'admin' | 'employee';
        firstName: string;
        lastName: string;
    };
}>;

export type LoginWithSelectEmployerResponse = LoginResponse;

export type RefreshTokenResponse = ResponseWithData<{
    accessToken: string;
    refreshToken: string;
}>;

export const login = async (data: LoginRequest) => {
    const response = await http.post<LoginResponse>('auth/login', {
        json: data,
    });

    return response.json();
};

export const signUp = async (data: SignUpRequest) => {
    const response = await http.post('auth/sign-up', {
        json: data,
    });

    return response.json();
};

export const refreshToken = async (data: RefreshTokenRequest) => {
    const response = await http.post<RefreshTokenResponse>('auth/refresh-token', {
        json: data,
    });

    return response.json();
};

export const logout = async () => {};
