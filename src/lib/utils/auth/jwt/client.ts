import { deleteCookie, getCookie, setCookie } from 'cookies-next/client';
import {
    JWT_AUTH_TOKEN_COOKIE_NAME,
    JWT_COOKIE_OPTIONS,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
    ONE_DAY,
} from '@/lib/constants';

// eslint-disable-next-line require-await
export const getAuthTokenFromClientSideCookies = async () => {
    const token = getCookie(JWT_AUTH_TOKEN_COOKIE_NAME);
    return token ?? null;
};

// eslint-disable-next-line require-await
export const getRefreshTokenFromClientSideCookies = async () => {
    const token = getCookie(JWT_REFRESH_TOKEN_COOKIE_NAME);
    return token ?? null;
};

// eslint-disable-next-line require-await
export const removeJWTCookies = async () => {
    deleteCookie(JWT_AUTH_TOKEN_COOKIE_NAME);
    deleteCookie(JWT_REFRESH_TOKEN_COOKIE_NAME);
};

// eslint-disable-next-line require-await
export const setJWTCookiesOnClientSide = async (accessToken: string, refreshToken?: string) => {
    setCookie(JWT_AUTH_TOKEN_COOKIE_NAME, accessToken, JWT_COOKIE_OPTIONS);

    if (refreshToken) {
        setCookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            ...JWT_COOKIE_OPTIONS,
            expires: new Date(Date.now() + 30 * ONE_DAY),
        });
    }
};
