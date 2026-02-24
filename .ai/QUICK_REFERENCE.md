# Quick Reference – Phenomenon Next.js 16 Template

Short checklists and snippets aligned with the **current `README.md`**.

---

## 1. Folder Structure Checklists

### 1.1 Module checklist

```txt
src/modules/<ModuleName>/
├── index.tsx              ✓ required
├── styles.module.css      ○ optional
├── types.ts               ○ optional
├── constants.ts           ○ optional
├── hooks/                 ○ optional
│   └── use<ModuleName>*.ts
├── utils/                 ○ optional
│   └── <utilName>.ts
├── schemas/               ○ optional
│   └── <schemaName>Schema.ts
├── components/            ○ optional
│   └── <ComponentName>/
└── contexts/              ○ optional
    └── <ContextName>Context.tsx
```

Rules:
- **Modules never take props**
- Module name == component name (PascalCase)

### 1.2 Component checklist

```txt
src/components/<ComponentName>/  (or src/ui/<ComponentName>/)
├── index.tsx              ✓ required
├── styles.module.css      ○ optional
├── types.ts               ○ optional
├── hooks/                 ○ optional
├── utils/                 ○ optional
├── constants.ts           ○ optional
├── schemas/               ○ optional
├── components/            ○ optional
└── contexts/              ○ optional
```

Constraints:
- `src/ui` components: **no complex logic**, **no hooks**, **no contexts**, **cannot import `src/components`**

### 1.3 Services & API checklist

```txt
src/services/
└── <domain>/
    ├── api.ts        ✓ HTTP calls
    ├── queries.ts    ✓ query & mutation hooks
    ├── queryKeys.ts  ✓ query key factory
    └── types.ts      ○ request/response types
```

Rules:
- All remote data access goes through this layer.
- Components call **hooks** from `queries.ts`, not HTTP directly.

### 1.4 Core lib checklist

```txt
src/lib/
├── @http.ts          ✓ Ky HTTP client
├── @queryClient.ts   ✓ TanStack Query client
├── constants.ts      ○ global constants
├── schemas.ts        ○ global schemas
├── regexps.ts        ○ global regexps
├── types.ts          ○ global TS types
└── utils/            ○ global utilities
```

### 1.5 Route checklist (Next App Router)

```txt
src/app/
├── layout.tsx                   ✓ root layout
├── page.tsx                     ✓ home page
├── (group)/                     ○ route group
│   ├── layout.tsx              ○ group layout
│   ├── page.tsx                ○ group page
│   ├── <route>/
│   │   ├── page.tsx            ○ route page
│   │   ├── loading.tsx         ○ loading UI
│   │   ├── not-found.tsx       ○ not-found UI
│   │   └── searchParams.ts     ○ Nuqs/server loader
```

---

## 2. Naming Conventions

| Entity           | Convention                        | Example                         | Location                         |
|-----------------|------------------------------------|---------------------------------|----------------------------------|
| Module          | PascalCase                         | `Home`                          | `src/modules/Home/`             |
| Component       | PascalCase                         | `ArticleCard`                   | `src/components/ArticleCard/`   |
| UI component    | PascalCase                         | `Button`                        | `src/ui/Button/`                |
| Hook            | camelCase `use` prefix             | `useDashboardSearchParams`      | `src/hooks/use…` / `…/hooks/`   |
| Util            | camelCase                          | `getHasPermissions`             | `src/utils/getHasPermissions.ts`|
| Schema          | camelCase + `Schema` suffix        | `signUpSchema.ts`               | `src/schemas/signUpSchema.ts`   |
| Route folder    | kebab-case                         | `user-profile`                  | `src/app/user-profile/`         |
| Icon file       | kebab-case + `_size`               | `arrow-left_16.svg`             | `src/icons/arrow-left_16.svg`   |
| Service folder  | camelCase                          | `books`                         | `src/services/books/`           |
| Context         | PascalCase + `Context` suffix      | `AuthContext.tsx`               | `src/context/AuthContext.tsx`   |
| Store           | camelCase + `Store` suffix         | `authStore.ts`                  | `src/stores/authStore.ts`       |

Additional rules:
- File names **must match** main exported symbol.
- Use `import type { X } from '@/types'` for types.

---

## 3. File Templates

### 3.1 Module template

```ts
// src/modules/<ModuleName>/index.tsx
'use client';

import { memo } from 'react';
import s from './styles.module.css';

const <ModuleName>: React.FC = () => {
    return (
        <main className={s.wrap}>
            {/* Module content */}
        </main>
    );
};

export default memo(<ModuleName>);
```

### 3.2 Component template

```ts
// src/components/<ComponentName>/index.tsx
'use client';

import { memo } from 'react';
import s from './styles.module.css';

const <ComponentName>: React.FC = () => {
    return (
        <div className={s.wrap}>
            {/* Component content */}
        </div>
    );
};

export default memo(<ComponentName>);
```

### 3.3 Service API template

```ts
// src/services/<domain>/api.ts
import type { Options } from 'ky';
import { http } from '@/lib/@http';
import type { <ResponseType> } from './types';

export const <getFnName> = async (
    params: { search: string },
    options?: Options,
): Promise<<ResponseType>> => {
    const response = await http.get('api/<endpoint>', {
        searchParams: params,
        ...options,
    });

    return response.json<<ResponseType>>();
};
```

### 3.4 Query keys template

```ts
// src/services/<domain>/queryKeys.ts
export const <DOMAIN>_QUERY_KEYS = {
    all: ['<domain>'] as const,
    list() {
        return [...<DOMAIN>_QUERY_KEYS.all, 'list'] as const;
    },
    listWithParams(params: Record<string, unknown>) {
        return [...<DOMAIN>_QUERY_KEYS.list(), params] as const;
    },
    allItems() {
        return [...<DOMAIN>_QUERY_KEYS.all, 'item'] as const;
    },
    item(id: string | number) {
        return [...<DOMAIN>_QUERY_KEYS.allItems(), id] as const;
    },
};
```

### 3.5 Query options template

```ts
// src/services/<domain>/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { <getFnName> } from './api';
import { <DOMAIN>_QUERY_KEYS } from './queryKeys';

export const get<QueryName>QueryOptions = (params: Record<string, unknown>) => {
    return queryOptions({
        queryKey: <DOMAIN>_QUERY_KEYS.listWithParams(params),
        queryFn({ signal }) {
            return <getFnName>(params, { signal });
        },
    });
};
```

### 3.6 Query hook template

```ts
// src/services/<domain>/queries.ts
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { get<QueryName>QueryOptions } from './queries';

export const use<QueryName> = (params: Record<string, unknown>) => {
    return useQuery(get<QueryName>QueryOptions(params));
};

export const useSuspense<QueryName> = (params: Record<string, unknown>) => {
    return useSuspenseQuery(get<QueryName>QueryOptions(params));
};
```

### 3.7 Mutation hook template

```ts
// src/services/<domain>/queries.ts
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { <mutationApiFn> } from './api';
import type { <RequestType>, <ResponseType> } from './types';

export const use<MutationName> = (
    options?: UseMutationOptions<<ResponseType>, Error, <RequestType>, unknown>,
) => {
    return useMutation({
        ...options,
        mutationFn(variables) {
            return <mutationApiFn>(variables);
        },
    });
};
```

### 3.8 Page with prefetching template

```ts
// src/app/<route>/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/@queryClient';
import { get<QueryName>QueryOptions } from '@/services/<domain>/queries';
import { loadSearchParams } from './searchParams';
import <ModuleName>Client from './<ModuleName>Client';

type SearchParams = Promise<{ search?: string; page?: string }>;

const <RouteName>Page: React.FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
    const queryClient = getQueryClient();
    const awaitedSearchParams = await searchParams;

    await queryClient.prefetchQuery(
        get<QueryName>QueryOptions(awaitedSearchParams),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <React.Suspense fallback={<div>Loading...</div>}>
                <<ModuleName>Client />
            </React.Suspense>
        </HydrationBoundary>
    );
};

export default <RouteName>Page;
```

### 3.9 Search params loader (Nuqs/server)

```ts
// src/app/<route>/searchParams.ts
import { createLoader, parseAsString, parseAsInteger } from 'nuqs/server';

export const loadSearchParams = createLoader({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
});
```

### 3.10 Search params hook (client)

```ts
// src/modules/<ModuleName>/hooks/use<ModuleName>SearchParams.ts
'use client';

import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

export const use<ModuleName>SearchParams = () => {
    return useQueryStates({
        search: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
    });
};
```

### 3.11 Schema template

```ts
// src/schemas/<schemaName>Schema.ts
import { z } from 'zod';

export const <schemaName>Schema = z.object({
    // schema fields
});

export type <SchemaName>Schema = z.infer<typeof <schemaName>Schema>;
```

---

## 4. Common Import Patterns

### 4.1 Modules & components

```ts
import Home from '@/modules/Home';
import Counter from '@/modules/Home/components/Counter';
import ArticleCard from '@/components/ArticleCard';
import Button from '@/ui/Button';
```

### 4.2 Services & queries

```ts
import { http } from '@/lib/@http';
import { getBooksQueryOptions, useGetBooks } from '@/services/books/queries';
import { BOOKS_QUERY_KEYS } from '@/services/books/queryKeys';
```

### 4.3 Hooks & utils

```ts
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { useDashboardSearchParams } from '@/modules/Dashboard/hooks/useDashboardSearchParams';
import { getHasPermissions } from '@/utils/getHasPermissions';
```

### 4.4 Icons

```ts
import PhenomenonMarkIcon from '@/ui/icons/PhenomenonMarkIcon';
import ArrowLeftIcon from '@/icons/arrow-left_16.svg';
```

### 4.5 Path aliases

| Alias         | Maps to       | Example                        |
|---------------|--------------|--------------------------------|
| `@/`          | `src/`       | `@/modules/Home`              |
| `@/modules`   | `src/modules`| `@/modules/Dashboard`         |
| `@/components`| `src/components` | `@/components/ArticleCard`|
| `@/ui`        | `src/ui`     | `@/ui/Button`                 |
| `@/services`  | `src/services` | `@/services/books/queries` |
| `@/lib`       | `src/lib`    | `@/lib/@queryClient`          |
| `@/hooks`     | `src/hooks`  | `@/hooks/useOptimisticMutation` |
| `@/utils`     | `src/utils`  | `@/utils/getHasPermissions`   |
| `@/context`   | `src/context`| `@/context/QueryClientContext`|
| `@/schemas`   | `src/schemas`| `@/schemas/exampleSchema`     |
| `@/types`     | `src/types.ts` | `@/types`                   |
| `@/styles`    | `src/styles` | `@/styles/index.css`          |
| `@/icons`     | `src/icons`  | `@/icons/arrow-left_16.svg`   |

---

## 5. Common Snippets

### 5.1 Query hook usage

```ts
import { useGetBooks } from '@/services/books/queries';

const { data: booksResponse, isLoading, error } = useGetBooks({ search: 'react' });
```

### 5.2 Mutation hook usage

```ts
import { useCreateBook } from '@/services/books/queries';

const { mutate: createBook, isPending } = useCreateBook();

createBook({ title: 'New Book', author: 'Author' });
```

### 5.3 Suspense query usage

```ts
import { useSuspenseBooks } from '@/services/books/queries';

const { data: booksResponse } = useSuspenseBooks({ search: 'react' });
```

### 5.4 Query invalidation

```ts
import { useQueryClient } from '@tanstack/react-query';
import { BOOKS_QUERY_KEYS } from '@/services/books/queryKeys';

const queryClient = useQueryClient();

queryClient.invalidateQueries({
    queryKey: BOOKS_QUERY_KEYS.list(),
});
```

### 5.5 Prefetch on server

```ts
import { getQueryClient } from '@/lib/@queryClient';
import { getBooksQueryOptions } from '@/services/books/queries';

const queryClient = getQueryClient();

await queryClient.prefetchQuery(getBooksQueryOptions({ search: 'test' }));
```

### 5.6 Icon usage

```ts
import PhenomenonMarkIcon from '@/ui/icons/PhenomenonMarkIcon';

<PhenomenonMarkIcon className={s.icon} />;
```

### 5.7 Schema validation

```ts
import { exampleSchema } from '@/schemas/exampleSchema';

try {
    const data = exampleSchema.parse(rawData);
} catch (error) {
    // handle validation error
}
```

### 5.8 TanStack Form + Zod

```ts
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { signUpSchema } from './schemas/signUpSchema';

const form = useForm({
    defaultValues: {
        email: '',
        password: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
        // handle submission
    },
});
```

---

## 6. Quick Decision Tree

1. **Is it a page/route?** → Create a **module** in `src/modules/`.
2. **Is it basic UI without logic?** → Create a **UI component** in `src/ui/`.
3. **Is it reusable with logic?** → Create a **component** in `src/components/`.
4. **Does it call an API?** → Add to `src/services/<domain>/api.ts` and wrap with hooks in `queries.ts`.
5. **Is it routing or layout?** → Implement in `src/app/`.
6. **Shared logic across app?** → Use `src/hooks/`, `src/utils/`, `src/schemas/`, `src/constants.ts`.
7. **Used only in one module/component?** → Keep it local to that entity.

---

## 7. Critical Rules (Fast Reminder)

- **Modules**:
  - ❌ No props
  - ✅ One module per route, default export
- **Data fetching**:
  - ❌ No direct HTTP in components
  - ✅ Use **services** (`src/services/*`) + TanStack Query hooks
- **Query keys**:
  - ✅ Use hierarchical factory (`all`, `list()`, `listWithParams()`, `item(id)`)
- **Prefetching**:
  - ✅ Use `HydrationBoundary` + `React.Suspense` + `useSuspenseQuery`
- **UI vs components**:
  - ❌ `src/ui` cannot import `src/components`
  - ✅ `src/components` can import `src/ui`
- **Scoping**:
  - ❌ Don’t reuse component‑specific hooks/utils/constants/contexts outside their component
  - ✅ Move shared logic to global folders when reused
- **Types & schemas**:
  - ✅ Use `import type` for TS types
  - ✅ Export inferred types from Zod schemas

