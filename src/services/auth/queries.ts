import { redirect, RedirectType } from 'next/navigation';
import { setJWTCookiesOnClientSide } from '@/lib/utils/auth/jwt/client';
import { mutationOptions } from '@tanstack/react-query';
import { login, logout, signUp } from './api';
import { authQueryKeys } from './queryKeys';

export const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authQueryKeys.login(),
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
        mutationKey: authQueryKeys.signUp(),
        meta: {
            successMessage: 'Sign up successful. We sent you a confirmation email. Please check your inbox.',
            showSuccessMessage: true,
        },
        mutationFn: signUp,
    });
};

export const logoutMutationOptions = () => {
    return mutationOptions({
        mutationKey: authQueryKeys.logout(),
        meta: {
            showErrorMessage: true,
        },
        mutationFn: logout,
        onSuccess() {
            redirect('/login', RedirectType.replace);
        },
    });
};
