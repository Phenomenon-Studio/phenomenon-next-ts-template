export const IS_DEV = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_IS_DEV === 'true';
export const IS_SCAN = process.env.APP_MODE === 'scan';

export const JWT_AUTH_TOKEN_COOKIE_NAME = '<appName>_AuthToken';
export const JWT_REFRESH_TOKEN_COOKIE_NAME = '<appName>_RefreshToken';

export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

export const COMMON_ERROR_MESSAGE = 'Uh-oh, something went wrong.';

export const JWT_COOKIE_OPTIONS = {
    path: '/',
    secure: !IS_DEV,
    sameSite: 'lax' as const,
    expires: new Date(Date.now() + 7 * ONE_DAY),
};

export const CUSTOM_EVENTS_NAMES = {
    refreshTokenFailed: 'REFRESH_TOKEN_FAILED',
};
