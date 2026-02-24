import type { KyInstance } from 'ky';
import { JWT_AUTH_TOKEN_COOKIE_NAME } from '@/constants';

export const createServerHttpPrivate = (http: KyInstance) => {
    return http.extend({
        hooks: {
            beforeRequest: [
                async (request) => {
                    const { cookies } = await import('next/headers');
                    const { getCookie } = await import('cookies-next/server');
                    const token = await getCookie(JWT_AUTH_TOKEN_COOKIE_NAME, { cookies });

                    if (token) {
                        request.headers.set('Authorization', `Bearer ${token}`);
                    }
                },
            ],
        },
    });
};
