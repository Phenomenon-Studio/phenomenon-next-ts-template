'use client';

import React from 'react';
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/services/@queryClient';

const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [queryClient] = React.useState(() => {
        return getQueryClient();
    });

    return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
};

export default QueryClientProvider;
