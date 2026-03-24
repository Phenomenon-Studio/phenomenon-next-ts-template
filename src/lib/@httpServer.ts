import type { KyInstance } from 'ky';
import { redirect, RedirectType } from 'next/navigation';
import ky from 'ky';
import { refreshToken } from '@/services/auth/api';
import {
    getAuthTokenFromServerSideCookies,
    getRefreshTokenFromServerSideCookies,
    removeJWTCookiesOnServerSide,
    setJWTCookiesOnServerSide,
} from './utils/auth/jwt/server';

export const createServerHttpPrivate = (http: KyInstance) => {
    return http.extend({
        hooks: {
            beforeRequest: [
                async (request) => {
                    const token = await getAuthTokenFromServerSideCookies();

                    if (token) {
                        request.headers.set('Authorization', `Bearer ${token}`);
                    }
                },
            ],
            afterResponse: [
                async (request, options, response) => {
                    if (response.status === 401) {
                        const refreshTokenFromCookie = await getRefreshTokenFromServerSideCookies();

                        if (!refreshTokenFromCookie) {
                            await removeJWTCookiesOnServerSide();
                            redirect('/login', RedirectType.replace);
                        }

                        try {
                            const newAccessToken = await refreshToken({
                                refreshToken: refreshTokenFromCookie as string,
                            });

                            await setJWTCookiesOnServerSide(
                                newAccessToken.data.accessToken,
                                newAccessToken.data.refreshToken
                            );

                            const newRequest = request.clone();
                            newRequest.headers.set('Authorization', `Bearer ${newAccessToken.data.accessToken}`);

                            return ky(newRequest, options);
                        } catch {
                            await removeJWTCookiesOnServerSide();
                            redirect('/login', RedirectType.replace);
                        }
                    }
                },
            ],
        },
    });
};
