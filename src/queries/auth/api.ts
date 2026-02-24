import type { AxiosRequestConfig } from 'axios';
import { httpPrivate } from '@/api/@axios';

export type RefreshTokenData = {
    refreshToken: string;
};

export type RefreshTokenResponseData = {
    accessToken: string;
    refreshToken: string;
};

export const refreshToken = async (data: RefreshTokenData, config?: AxiosRequestConfig) => {
    const response = await httpPrivate.post<RefreshTokenResponseData>('/api/refresh-token', data, config);

    return response.data;
};
