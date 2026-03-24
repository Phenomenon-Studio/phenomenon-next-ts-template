import type { DecodedJWT } from '@/lib/types';

/**
 * Decode JWT payload without verification (verification happens server-side)
 * This is safe because we only use this for display purposes, not for authorization
 */
// eslint-disable-next-line require-await
export const decodeJWTPayload = async (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        const payload = parts[1];
        const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
        return JSON.parse(decoded) as DecodedJWT;
    } catch {
        return null;
    }
};
