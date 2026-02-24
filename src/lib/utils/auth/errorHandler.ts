import type { Mutation, Query } from '@tanstack/react-query';
import { HTTPError } from 'ky';

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

const refreshTokenAndRetry = (
    query?: Query<unknown, unknown, unknown>,
    mutation?: Mutation<unknown, unknown, unknown, unknown>,
    variables?: unknown
) => {
    try {
        if (!isRefreshing) {
            isRefreshing = true;
            failedQueue.push({ query, mutation, variables });

            processFailedQueue();
        } else {
            failedQueue.push({ query, mutation, variables });
        }
    } catch {
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
    const response = error as HTTPError;

    if (response?.response?.status === 401) {
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
