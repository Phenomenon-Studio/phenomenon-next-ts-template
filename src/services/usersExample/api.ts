import type { Options } from 'ky';
import { httpPrivate } from '@/lib/@http';

export const getUsers = async (options?: Options) => {
    const response = await httpPrivate.get('api/users', options);

    return response.json();
};

export const createUser = async (data: string, options?: Options) => {
    const response = await httpPrivate.post<string>('api/users', {
        ...options,
        json: data,
    });

    return response.json();
};
