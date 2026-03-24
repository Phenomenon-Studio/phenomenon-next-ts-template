import type { UseMutationOptions } from '@tanstack/react-query';
import type { SearchParamsOption } from 'ky';
import type { BaseErrorData } from '@/lib/@http';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { queryKeyFactory } from '@/services/@queryKeyFactory';
import { createUser, getUsers } from '@/services/usersExample/api';

const usersExampleQueryKey = queryKeyFactory('usersExample');

export const getUsersQueryOptions = (searchParams: Record<string, unknown> | URLSearchParams = {}) => {
    const normalizedParams = searchParams instanceof URLSearchParams ? searchParams.toString() : searchParams;

    return queryOptions({
        queryKey: usersExampleQueryKey('getUsers', normalizedParams),
        queryFn({ signal }) {
            return getUsers({ signal, searchParams: normalizedParams as SearchParamsOption });
        },
    });
};

export const useCreateUser = (options?: UseMutationOptions<string, BaseErrorData, string, unknown>) => {
    return useMutation({
        ...options,
        mutationKey: usersExampleQueryKey('createUser'),
        mutationFn(data) {
            return createUser(data);
        },
    });
};
