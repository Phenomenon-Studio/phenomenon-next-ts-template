'use client';

import { getQueryClient } from '@/tanstackQuery/@queryClient';
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const queryClient = getQueryClient();

    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
};

export default QueryClientProvider;
