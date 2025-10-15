import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { createUser, getUsers } from '@/api/usersExample';

export const usersQueryKeys = {
    all: ['users'] as const,
    allLists() {
        return [...usersQueryKeys.all, 'list'] as const;
    },
    list(searchParams: Record<string, unknown> | URLSearchParams) {
        return [
            ...usersQueryKeys.allLists(),
            searchParams instanceof URLSearchParams ? searchParams.toString() : searchParams,
        ] as const;
    },
    allItems() {
        return [...usersQueryKeys.all, 'item'] as const;
    },
    item(id: string) {
        return [...usersQueryKeys.allItems(), id] as const;
    },
};

export const getUsersQueryOptions = (searchParams: Record<string, unknown> | URLSearchParams = {}) => {
    return queryOptions({
        queryKey: usersQueryKeys.list(searchParams),
        queryFn({ signal }) {
            return getUsers({ signal, params: searchParams });
        },
    });
};

export const useCreateUser = (options?: UseMutationOptions<string, AxiosError, string, unknown>) => {
    return useMutation({
        ...options,
        mutationFn(data) {
            return createUser(data);
        },
    });
};
