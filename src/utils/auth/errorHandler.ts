import type { Mutation, Query } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { refreshToken } from '@/api/auth';
import {
    getRefreshToken,
    removeAccessToken,
    removeRefreshToken,
    setAccessToken,
    setRefreshToken,
} from '@/utils/auth/tokens';

let isRedirecting = false;
let isRefreshing = false;
let failedQueue: {
    query?: Query<unknown, unknown, unknown>;
    mutation?: Mutation<unknown, unknown, unknown, unknown>;
    variables?: unknown;
}[] = [];

const processFailedQueue = () => {
    failedQueue.forEach(({ query, mutation, variables }) => {
        if (mutation) {
            const { options } = mutation;

            mutation.setOptions(options);
            mutation.execute(variables);
        }

        if (query) {
            query.fetch();
        }
    });

    isRefreshing = false;
    failedQueue = [];
};

const refreshTokenAndRetry = async (
    query?: Query<unknown, unknown, unknown>,
    mutation?: Mutation<unknown, unknown, unknown, unknown>,
    variables?: unknown
) => {
    try {
        if (!isRefreshing) {
            isRefreshing = true;
            failedQueue.push({ query, mutation, variables });

            const responseData = await refreshToken({
                refreshToken: getRefreshToken()!,
            });

            setAccessToken(responseData.accessToken);
            setRefreshToken(responseData.refreshToken);
            processFailedQueue();
        } else {
            failedQueue.push({ query, mutation, variables });
        }
    } catch {
        removeAccessToken();
        removeRefreshToken();

        if (!isRedirecting) {
            isRedirecting = true;
            window.location.href = '/login';
        }
    }
};

const errorHandler = (
    error: unknown,
    query?: Query<unknown, unknown, unknown>,
    mutation?: Mutation<unknown, unknown, unknown, unknown>,
    variables?: unknown
) => {
    const { status } = (error as AxiosError).response!;

    if (status === 401) {
        if (mutation) {
            refreshTokenAndRetry(undefined, mutation, variables);
        } else {
            refreshTokenAndRetry(query);
        }
    }
};

export const queryErrorHandler = (error: unknown, query: Query<unknown, unknown, unknown>) => {
    errorHandler(error, query);
};

export const mutationErrorHandler = (
    error: unknown,
    variables: unknown,
    _context: unknown,
    mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
    errorHandler(error, undefined, mutation, variables);
};
