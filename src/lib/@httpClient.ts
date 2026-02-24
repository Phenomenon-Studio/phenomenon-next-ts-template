import type { KyInstance } from 'ky';
import { JWT_AUTH_TOKEN_COOKIE_NAME } from './constants';

export const createClientHttpPrivate = (http: KyInstance) => {
    return http.extend({
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
        },
    });
};
