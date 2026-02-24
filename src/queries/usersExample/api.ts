import type { Options } from 'ky';
import { httpPrivate } from '@/api/@axios';

export const getUsers = async (options?: Options) => {
    const response = await httpPrivate.get('/api/users', options);

    return response.data;
};

export const createUser = async (data: string, options?: Options) => {
    const response = await httpPrivate.post<string>('/api/users', data, options);

    return response.data;
};
