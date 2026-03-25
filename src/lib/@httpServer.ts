import type { KyInstance } from 'ky';
import { redirect, RedirectType } from 'next/navigation';
import ky from 'ky';
import { getQueryClient } from '@/services/@queryClient';
import { refreshToken } from '@/services/auth/api';
import {
    getAuthTokenFromServerSideCookies,
    getRefreshTokenFromServerSideCookies,
    removeJWTCookiesOnServerSide,
    setJWTCookiesOnServerSide,
} from './utils/auth/jwt/server';

const redirectToLogin = async () => {
    const queryClient = getQueryClient();

    await queryClient.cancelQueries();
    queryClient.clear();
    await removeJWTCookiesOnServerSide();

    redirect('/login', RedirectType.replace);
};

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
                        if (request.headers.get('X-Retry-Auth')) {
                            return await redirectToLogin();
                        }

                        try {
                            const refreshTokenFromCookie = await getRefreshTokenFromServerSideCookies();

                            if (!refreshTokenFromCookie) {
                                return await redirectToLogin();
                            }

                            const newAccessToken = await refreshToken({
                                refreshToken: refreshTokenFromCookie as string,
                            });

                            await setJWTCookiesOnServerSide(
                                newAccessToken.data.accessToken,
                                newAccessToken.data.refreshToken
                            );

                            const newRequest = request.clone();
                            newRequest.headers.set('Authorization', `Bearer ${newAccessToken.data.accessToken}`);
                            newRequest.headers.set('X-Retry-Auth', '1');

                            return ky(newRequest, options);
                        } catch {
                            return await redirectToLogin();
                        }
                    }
                },
            ],
        },
    });
};
