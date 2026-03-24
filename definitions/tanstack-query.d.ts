import '@tanstack/react-query';

interface TanstackQueryMetaOptions extends Record<string, unknown> {
    successMessage?: string;
    errorMessage?: string;
    showErrorMessage?: boolean;
}

declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: TanstackQueryMetaOptions;
        mutationMeta: TanstackQueryMetaOptions;
    }
}
