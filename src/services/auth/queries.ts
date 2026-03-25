'use client';

import { mutationOptions } from '@tanstack/react-query';
import { removeJWTCookies, setJWTCookiesOnClientSide } from '@/lib/utils/auth/jwt/client';
import { queryKeyFactory } from '@/services/@queryKeyFactory';
import { login, logout, signUp } from './api';

const authQueryKey = queryKeyFactory('auth');

export const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authQueryKey('login'),
        meta: {
            successMessage: 'Login successful. Redirecting to dashboard...',
            showSuccessMessage: true,
        },
        mutationFn: login,
        async onSuccess(response) {
            return await setJWTCookiesOnClientSide(response.data.accessToken, response.data?.refreshToken);
        },
    });
};

export const signUpMutationOptions = () => {
    return mutationOptions({
        mutationKey: authQueryKey('signUp'),
        meta: {
            successMessage: 'Sign up successful. We sent you a confirmation email. Please check your inbox.',
            showSuccessMessage: true,
        },
        mutationFn: signUp,
    });
};

export const logoutMutationOptions = () => {
    return mutationOptions({
        mutationKey: authQueryKey('logout'),
        meta: {
            showErrorMessage: true,
        },
        mutationFn: logout,
        async onSuccess() {
            await removeJWTCookies();
            window.location.replace('/login');
        },
    });
};
