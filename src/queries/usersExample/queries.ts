import type { UseMutationOptions } from '@tanstack/react-query';
import type { SearchParamsOption } from 'ky';
import type { BaseErrorData } from '@/lib/@http';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { createUser, getUsers } from '@/queries/usersExample/api';
import { usersQueryKeys } from './queryKeys';

export const getUsersQueryOptions = (searchParams: Record<string, unknown> | URLSearchParams = {}) => {
    return queryOptions({
        queryKey: usersQueryKeys.list(searchParams),
        queryFn({ signal }) {
            return getUsers({ signal, searchParams: searchParams as SearchParamsOption });
        },
    });
};

export const useCreateUser = (options?: UseMutationOptions<string, BaseErrorData, string, unknown>) => {
    return useMutation({
        ...options,
        mutationFn(data) {
            return createUser(data);
        },
    });
};
