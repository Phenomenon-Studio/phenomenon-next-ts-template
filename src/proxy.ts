import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
    JWT_AUTH_TOKEN_COOKIE_NAME,
    JWT_COOKIE_OPTIONS,
    JWT_REFRESH_TOKEN_COOKIE_NAME,
    ONE_DAY,
} from '@/lib/constants';
import { isJWTExpired } from '@/lib/utils/auth/jwt/isJWTExpired';
import { refreshToken } from '@/services/auth/api';

const PUBLIC_PATHS = ['/login', '/sign-up'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        PUBLIC_PATHS.some((publicPath) => {
            return pathname.startsWith(publicPath);
        })
    ) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get(JWT_AUTH_TOKEN_COOKIE_NAME)?.value;
    const refreshTokenValue = request.cookies.get(JWT_REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!accessToken && !refreshTokenValue) {
        return NextResponse.redirect(new URL(`/login?from=${pathname}`, request.url));
    }

    if (accessToken && !(await isJWTExpired(accessToken))) {
        return NextResponse.next();
    }

    if (!refreshTokenValue) {
        return NextResponse.redirect(new URL(`/login?from=${pathname}`, request.url));
    }

    try {
        const result = await refreshToken({ refreshToken: refreshTokenValue });
        const response = NextResponse.next();

        response.cookies.set(JWT_AUTH_TOKEN_COOKIE_NAME, result.data.accessToken, JWT_COOKIE_OPTIONS);

        if (result.data.refreshToken) {
            response.cookies.set(JWT_REFRESH_TOKEN_COOKIE_NAME, result.data.refreshToken, {
                ...JWT_COOKIE_OPTIONS,
                expires: new Date(Date.now() + 30 * ONE_DAY),
            });
        }

        return response;
    } catch {
        const response = NextResponse.redirect(new URL(`/login?from=${pathname}`, request.url));
        response.cookies.delete(JWT_AUTH_TOKEN_COOKIE_NAME);
        response.cookies.delete(JWT_REFRESH_TOKEN_COOKIE_NAME);
        return response;
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
