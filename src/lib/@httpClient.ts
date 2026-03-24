import type { KyInstance } from 'ky';
import ky from 'ky';
import { getQueryClient } from '@/services/@queryClient';
import { refreshToken } from '@/services/auth/api';
import { CUSTOM_EVENTS_NAMES, JWT_AUTH_TOKEN_COOKIE_NAME } from './constants';
import {
    getAuthTokenFromClientSideCookies,
    removeJWTCookies,
    setJWTCookiesOnClientSide,
} from './utils/auth/jwt/client';

type FailedQueueItem = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processFailedQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

const redirectToLogin = async () => {
    const queryClient = getQueryClient();

    await queryClient.cancelQueries();
    queryClient.clear();
    await removeJWTCookies();

    if (!window.location.pathname.startsWith('/login')) {
        const loginUrl = new URL(`/login?from=${window.location.pathname}`, origin);
        window.location.href = loginUrl.origin;
    }
};

export const createClientHttpPrivate = (http: KyInstance) => {
    return http.extend({
        retry: 0,
        hooks: {
            beforeRequest: [
                async (request) => {
                    const { getCookie } = await import('cookies-next/client');
                    const token = getCookie(JWT_AUTH_TOKEN_COOKIE_NAME);

                    if (token) {
                        request.headers.set('Authorization', `Bearer ${token}`);
                    }
                },
            ],
            afterResponse: [
                async (request, options, response, state) => {
                    if (response.status === 401) {
                        if (state.retryCount) {
                            return await redirectToLogin();
                        }

                        const refreshTokenFromCookie = await getAuthTokenFromClientSideCookies();

                        if (!refreshTokenFromCookie) {
                            return await redirectToLogin();
                        }

                        if (isRefreshing) {
                            return new Promise<string>((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            })
                                .then((token) => {
                                    request.headers.set('Authorization', `Bearer ${token}`);

                                    return ky(request, options);
                                })
                                .catch((err) => {
                                    return Promise.reject(err);
                                });
                        }

                        isRefreshing = true;

                        try {
                            const newAccessToken = await refreshToken({
                                refreshToken: refreshTokenFromCookie as string,
                            });

                            await setJWTCookiesOnClientSide(
                                newAccessToken.data.accessToken,
                                newAccessToken.data.refreshToken
                            );

                            processFailedQueue(null, newAccessToken.data.accessToken);

                            const newRequest = request.clone();
                            newRequest.headers.set('Authorization', `Bearer ${newAccessToken.data.accessToken}`);

                            return ky(newRequest, options);
                        } catch (error) {
                            processFailedQueue(error, null);

                            /**
                             * NOTE: for triggering logout endpoint
                             */
                            window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS_NAMES.refreshTokenFailed));

                            return await redirectToLogin();
                        } finally {
                            isRefreshing = false;
                        }
                    }
                },
            ],
            beforeRetry: [
                async ({ retryCount }) => {
                    if (retryCount > 1) {
                        return await redirectToLogin();
                    }
                },
            ],
        },
    });
};
