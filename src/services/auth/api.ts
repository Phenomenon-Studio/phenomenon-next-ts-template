import { httpPrivate } from '@/lib/@http';
import { Options } from 'ky';

export type RefreshTokenRequest = {
    refreshToken: string;
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
};

export const refreshToken = async (data: RefreshTokenRequest, options?: Options) => {
    const response = await httpPrivate.post<RefreshTokenResponse>('/api/refresh-token', {
        json: data,
        ...options,
    });

    return response.json();
};
