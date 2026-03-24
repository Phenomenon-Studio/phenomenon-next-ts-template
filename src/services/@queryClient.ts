import { getKyErrorMessage } from '@/lib/utils/getKyErrorMessage';
import { defaultShouldDehydrateQuery, environmentManager, MutationCache, QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined = undefined;

export const makeQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
            dehydrate: {
                shouldDehydrateQuery(query) {
                    return defaultShouldDehydrateQuery(query) || query.state.status === 'pending';
                },
                shouldRedactErrors() {
                    return false;
                },
            },
        },
        mutationCache: new MutationCache({
            async onError(error, __, ___, mutation) {
                const errorMessage = mutation.meta?.errorMessage;
                if (errorMessage || mutation.meta?.showErrorMessage) {
                    const errorMessageToShow =
                        errorMessage ||
                        (await getKyErrorMessage(
                            error,
                            errorMessage || 'Something went wrong! Please try again later.'
                        ));

                    // TODO: toast manager
                    // eslint-disable-next-line no-console
                    console.error(errorMessageToShow);
                }
            },
            onSuccess(_, __, ___, mutation) {
                if (mutation.meta?.successMessage) {
                    const successMessage = mutation.meta?.successMessage;

                    if (successMessage) {
                        // TODO: toast manager
                        // eslint-disable-next-line no-console
                        console.log(successMessage);
                    }
                }
            },
        }),
    });
};

export function getQueryClient() {
    if (environmentManager.isServer()) {
        return makeQueryClient();
    }

    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
}
