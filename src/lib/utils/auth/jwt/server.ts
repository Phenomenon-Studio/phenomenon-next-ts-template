'use server';

import type { DecodedJWT } from '@/lib/types';
import { cookies } from 'next/headers';
import {
    JWT_AUTH_TOKEN_COOKIE_NAME,
    JWT_COOKIE_OPTIONS,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
    ONE_DAY,
    ONE_SECOND,
} from '@/lib/constants';
import { deleteCookie, getCookie, setCookie } from 'cookies-next/server';
import { decodeJWTPayload } from './decodeJWTPayload';

/**
 * Token info compatible with previous Firebase token structure
 * Maps 'sub' to 'uid' for backward compatibility
 */
export type DecodedToken = {
    uid: string;
} & DecodedJWT;

const getCookieServerSide = async (key: string) => {
    return await getCookie(key, { cookies });
};

export const getAuthTokenFromServerSideCookies = async () => {
    const token = await getCookieServerSide(JWT_AUTH_TOKEN_COOKIE_NAME);

    return token ?? null;
};

export const getRefreshTokenFromServerSideCookies = async (): Promise<string | null> => {
    const token = await getCookieServerSide(JWT_REFRESH_TOKEN_COOKIE_NAME);

    return token ?? null;
};

export const getDecodedUserFromJWT = async () => {
    const token = await getAuthTokenFromServerSideCookies();

    if (!token) {
        return null;
    }

    return decodeJWTPayload(token);
};

export const setJWTCookiesOnServerSide = async (accessToken: string, refreshToken?: string) => {
    await setCookie(JWT_AUTH_TOKEN_COOKIE_NAME, accessToken, { cookies });

    if (refreshToken) {
        await setCookie(JWT_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            cookies,
            ...JWT_COOKIE_OPTIONS,
            maxAge: (30 * ONE_DAY) / ONE_SECOND,
        });
    }
};

export const removeJWTCookiesOnServerSide = async () => {
    await deleteCookie(JWT_AUTH_TOKEN_COOKIE_NAME, { cookies });
    await deleteCookie(JWT_REFRESH_TOKEN_COOKIE_NAME, { cookies });
};
