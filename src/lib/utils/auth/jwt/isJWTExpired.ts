import { decodeJWTPayload } from './decodeJWTPayload';

export const isJWTExpired = async (token: string) => {
    const decoded = await decodeJWTPayload(token);
    if (!decoded) {
        return true;
    }

    // Add 60 second buffer for clock skew
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now - 60;
};
