# Code Examples – Phenomenon Next.js 16 Template

Concrete examples aligned with the **current `README.md`** structure:
- **Modules** with no props
- **Services layer** (`src/services/*`)
- **Core clients** in `src/lib`
- **TanStack Query** patterns (query keys, options, hooks, prefetching)
- **Nuqs** search params

Use these as **canonical patterns** when generating or editing code.

---

## 1. Module Examples (`src/modules`)

### 1.1 Module folder structure

```txt
src/modules/Home/
├── index.tsx
├── styles.module.css
├── constants.ts
├── hooks/
│   └── useHomeSearchParams.ts
├── utils/
│   └── homeLogger.ts
├── schemas/
│   └── homeFilterSchema.ts
└── components/
    └── Counter/
        ├── index.tsx
        └── styles.module.css
```

### 1.2 Home module – no props

```ts
// src/modules/Home/index.tsx
'use client';

import { memo } from 'react';
import clsx from 'clsx';
import PhenomenonMarkIcon from '@/ui/icons/PhenomenonMarkIcon';
import { CURRENT_YEAR } from './constants';
import Counter from './components/Counter';
import s from './styles.module.css';

const Home: React.FC = () => {
    return (
        <main className={clsx(s.wrap, 'full-height')}>
            <div className={s.inner}>
                <header className={s.header}>
                    <PhenomenonMarkIcon className={s.icon} />
                    <h1 className={s.title}>
                        <strong className={s.company}>Phenomenon</strong>
                    </h1>
                </header>
                <section className={s.content}>
                    <Counter />
                </section>
            </div>
            <footer className={s.footer}>&copy;&nbsp;{CURRENT_YEAR}, Phenomenon.studio</footer>
        </main>
    );
};

export default memo(Home);
```

### 1.3 Module constants

```ts
// src/modules/Home/constants.ts
export const CURRENT_YEAR = new Date().getFullYear();
```

### 1.4 Module‑local hook

```ts
// src/modules/Home/hooks/useHomeSearchParams.ts
'use client';

import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

export const useHomeSearchParams = () => {
    return useQueryStates({
        search: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
    });
};
```

### 1.5 Module‑local util

```ts
// src/modules/Home/utils/homeLogger.ts
export const homeLogger = (message: string) => {
    // This util is only used within the Home module
    // If it becomes shared, move it to src/utils
    console.log(`[Home] ${message}`);
};
```

### 1.6 Module schema

```ts
// src/modules/Home/schemas/homeFilterSchema.ts
import { z } from 'zod';

export const homeFilterSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).default(1),
});

export type HomeFilterSchema = z.infer<typeof homeFilterSchema>;
```

---

## 2. Component Examples (`src/components` & `src/ui`)

### 2.1 Counter component inside a module

```ts
// src/modules/Home/components/Counter/index.tsx
'use client';

import { memo, useState } from 'react';
import clsx from 'clsx';
import s from './styles.module.css';

const Counter: React.FC = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount((prev) => prev + 1);
    };

    const decrement = () => {
        setCount((prev) => prev - 1);
    };

    return (
        <article className={s.wrap}>
            <div className={s['counter-wrap']}>
                Count:&nbsp;<strong>{count}</strong>
            </div>
            <footer className={s.footer}>
                <button className={clsx(s.cta, 'focus-primary')} onClick={decrement}>
                    -
                </button>
                <button className={clsx(s.cta, 'focus-primary')} onClick={increment}>
                    +
                </button>
            </footer>
        </article>
    );
};

export default memo(Counter);
```

### 2.2 Primitive UI button (no logic, no hooks)

```ts
// src/ui/Button/index.tsx
'use client';

import { memo } from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import s from './styles.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
    return <button className={clsx(s.button, className)} {...props} />;
};

export default memo(Button);
```

---

## 3. Core Clients & Utilities (`src/lib`)

### 3.1 HTTP client with Ky

```ts
// src/lib/@http.ts
import ky from 'ky';
import { env } from '@/lib/env';

export const http = ky.create({
    prefixUrl: env.NEXT_PUBLIC_API_URL,
    timeout: false,
    retry: 0,
});
```

### 3.2 TanStack Query client

```ts
// src/lib/@queryClient.ts
import { isServer, QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

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
        },
    });
};

export const getQueryClient = () => {
    if (isServer) {
        return makeQueryClient();
    }

    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
};
```

### 3.3 Query client provider

```ts
// src/context/QueryClientContext.tsx
'use client';

import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/@queryClient';

const QueryClientContext: React.FC<PropsWithChildren> = ({ children }) => {
    const queryClient = getQueryClient();

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryClientContext;
```

---

## 4. Services Layer Examples (`src/services`)

Below is a **`books`** domain example that matches the patterns in `README.md`.

### 4.1 Types

```ts
// src/services/books/types.ts
export type Book = {
    id: string;
    title: string;
    author: string;
};

export type BooksListResponse = Book[];
```

### 4.2 API calls

```ts
// src/services/books/api.ts
import type { Options } from 'ky';
import { http } from '@/lib/@http';
import type { BooksListResponse } from './types';

export const getBooks = async (
    search: string,
    options?: Options,
): Promise<BooksListResponse> => {
    const response = await http.get('api/books', {
        searchParams: { search },
        ...options,
    });

    return response.json<BooksListResponse>();
};
```

### 4.3 Query keys

```ts
// src/services/books/queryKeys.ts
export const BOOKS_QUERY_KEYS = {
    all: ['books'] as const,
    list() {
        return [...BOOKS_QUERY_KEYS.all, 'list'] as const;
    },
    listWithParams(params: { search: string }) {
        return [...BOOKS_QUERY_KEYS.list(), params] as const;
    },
};
```

### 4.4 Query options & hook

```ts
// src/services/books/queries.ts
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getBooks } from './api';
import { BOOKS_QUERY_KEYS } from './queryKeys';

export const getBooksQueryOptions = (search: string) => {
    return queryOptions({
        queryKey: BOOKS_QUERY_KEYS.listWithParams({ search }),
        queryFn({ signal }) {
            return getBooks(search, { signal });
        },
    });
};

export const useGetBooks = (search: string) => {
    return useQuery(getBooksQueryOptions(search));
};

export const useSuspenseBooks = (search: string) => {
    return useSuspenseQuery(getBooksQueryOptions(search));
};
```

### 4.5 Mutation hook (pattern)

```ts
// src/services/books/queries.ts (example mutation)
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { Book } from './types';

type CreateBookPayload = Pick<Book, 'title' | 'author'>;

export const useCreateBook = (
    options?: UseMutationOptions<Book, Error, CreateBookPayload, unknown>,
) => {
    return useMutation({
        ...options,
        mutationFn: async (payload) => {
            // Implement API call here (e.g., http.post)
            // return created book
            return { id: 'temp-id', ...payload };
        },
    });
};
```

---

## 5. Routing & Prefetching Examples (`src/app`)

### 5.1 Root layout

```ts
// src/app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import QueryClientContext from '@/context/QueryClientContext';
import '@/styles/index.css';

const syneSans = localFont({
    src: './fonts/SyneSansVF.ttf',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Phenomenon Next JS Template',
    description: 'Generated by create next app',
};

const RootLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <html lang="en">
            <body className={`${syneSans.className} antialiased`}>
                <QueryClientContext>{children}</QueryClientContext>
            </body>
        </html>
    );
};

export default RootLayout;
```

### 5.2 Dashboard page with prefetch

```ts
// src/app/(main)/dashboard/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/@queryClient';
import { getBooksQueryOptions } from '@/services/books/queries';
import { loadSearchParams } from './searchParams';
import DashboardClient from './DashboardClient';

type SearchParams = Promise<{ search?: string; page?: string }>;

const DashboardPage: React.FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
    const queryClient = getQueryClient();
    const awaitedSearchParams = await searchParams;
    const search = awaitedSearchParams.search ?? '';

    await queryClient.prefetchQuery(getBooksQueryOptions(search));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <React.Suspense fallback={<div>Loading...</div>}>
                <DashboardClient />
            </React.Suspense>
        </HydrationBoundary>
    );
};

export default DashboardPage;
```

### 5.3 Search params loader (Nuqs/server)

```ts
// src/app/(main)/dashboard/searchParams.ts
import { createLoader, parseAsString, parseAsInteger } from 'nuqs/server';

export const loadSearchParams = createLoader({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
});
```

### 5.4 Dashboard client with suspense query

```ts
// src/app/(main)/dashboard/DashboardClient.tsx
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getBooksQueryOptions } from '@/services/books/queries';
import { useDashboardSearchParams } from '@/modules/Dashboard/hooks/useDashboardSearchParams';

const DashboardClient: React.FC = () => {
    const [searchParams] = useDashboardSearchParams();
    const search = searchParams.search ?? '';

    const { data: booksResponse } = useSuspenseQuery(getBooksQueryOptions(search));

    return (
        <div>
            {booksResponse?.map((book) => (
                <div key={book.id}>{book.title}</div>
            ))}
        </div>
    );
};

export default DashboardClient;
```

---

## 6. Global Examples

### 6.1 Global constants

```ts
// src/constants.ts
export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const COMMON_ERROR_MESSAGE = 'Uh-oh, something went wrong.';
```

### 6.2 Global schema

```ts
// src/schemas/exampleSchema.ts
import { z } from 'zod';

export const exampleSchema = z.object({
    name: z.string(),
    type: z.string(),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;
```

### 6.3 Global hook

```ts
// src/hooks/useOptimisticMutation.ts
import type { DataTag, MutationFunction, QueryKey } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Updater<TQueryFnData, TVariables> = (
    _oldData: TQueryFnData | undefined,
    _variables: TVariables,
) => TQueryFnData | undefined;

type OptimisticProps<
    TData = unknown,
    TVariables = unknown,
    TQueryKey extends QueryKey = QueryKey,
    TQueryFnData = unknown,
> = {
    mutationFn: MutationFunction<TData, TVariables>;
    queryKey: TQueryKey;
    updater: Updater<TQueryFnData, TVariables>;
    invalidate: () => Promise<void>;
};

export const useOptimisticMutation = <
    TData = unknown,
    TVariables = unknown,
    TQueryFnData = unknown,
    TQueryKey extends QueryKey = QueryKey,
    TInferredQueryFnData = TQueryKey extends DataTag<unknown, infer TaggedValue>
        ? TaggedValue
        : TQueryFnData,
>({
    mutationFn,
    queryKey,
    updater,
    invalidate,
}: OptimisticProps<TData, TVariables, TQueryKey, TQueryFnData>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        async onMutate(variables) {
            await queryClient.cancelQueries({
                queryKey,
            });

            const snapshot = queryClient.getQueryData(queryKey);

            queryClient.setQueryData<TInferredQueryFnData>(queryKey, (old) => {
                return updater(old, variables);
            });

            return () => {
                queryClient.setQueryData(queryKey, snapshot);
            };
        },
        onError(_error, _variables, rollback) {
            rollback?.();
        },
        onSettled() {
            return invalidate();
        },
    });
};
```

---

## 7. Usage Snippets

### 7.1 Using a query hook

```ts
'use client';

import { useGetBooks } from '@/services/books/queries';

const MyComponent: React.FC = () => {
    const { data: booksResponse, isLoading, error } = useGetBooks('react');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Something went wrong</div>;
    }

    return (
        <ul>
            {booksResponse?.map((book) => (
                <li key={book.id}>{book.title}</li>
            ))}
        </ul>
    );
};
```

### 7.2 Using a mutation hook

```ts
'use client';

import { useCreateBook } from '@/services/books/queries';

const MyComponent: React.FC = () => {
    const { mutate: createBook, isPending } = useCreateBook();

    const handleSubmit = () => {
        createBook({ title: 'New Book', author: 'Author Name' });
    };

    return (
        <button onClick={handleSubmit} disabled={isPending}>
            Create Book
        </button>
    );
};
```

### 7.3 Using icons

```ts
import PhenomenonMarkIcon from '@/ui/icons/PhenomenonMarkIcon';

const Logo: React.FC = () => {
    return <PhenomenonMarkIcon className="icon" />;
};
```

### 7.4 Zod schema usage in a component

```ts
import { exampleSchema } from '@/schemas/exampleSchema';
import type { ExampleSchema } from '@/schemas/exampleSchema';

const data: ExampleSchema = exampleSchema.parse({
    name: 'Example',
    type: 'Type',
});
```

### 7.5 TanStack Form with Zod

```ts
// src/modules/SignUp/index.tsx
'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { signUpSchema } from './schemas/signUpSchema';

const SignUp: React.FC = () => {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validatorAdapter: zodValidator(),
        onSubmit: async ({ value }) => {
            // Handle form submission
            console.log(value);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.Field
                name="email"
                validators={{
                    onChange: signUpSchema.shape.email,
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor={field.name}>Email</label>
                        <input
                            id={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                            <div>{field.state.meta.errors[0]}</div>
                        )}
                    </div>
                )}
            </form.Field>
            <form.Field
                name="password"
                validators={{
                    onChange: signUpSchema.shape.password,
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor={field.name}>Password</label>
                        <input
                            id={field.name}
                            type="password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                            <div>{field.state.meta.errors[0]}</div>
                        )}
                    </div>
                )}
            </form.Field>
            <button type="submit" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
};

export default SignUp;
```

