# Project Context – Phenomenon Next.js 16 Template

This file gives AI agents the **canonical high‑level context** for this repo, aligned with `README.md`.  
For details or edge‑cases, always defer to **`README.md`** and the actual source code.

---

## 1. Stack & Goals

- **Next.js 16 (App Router)** – file‑based routing in `src/app`
- **React 19 + TypeScript** – strict, typed React
- **TanStack Query** – async state & server state caching
- **Ky** – HTTP client
- **TanStack Form + Zod** – forms with schema validation
- **Nuqs** – URL/search params state
- **ESLint, Prettier, Stylelint, Husky** – quality gates

**Primary goals** of the template:
- Enforce a **clean, layered architecture**
- Make **data‑fetching, caching, and routing** consistent
- Keep **components and modules well‑scoped and reusable**

---

## 2. Top‑Level Structure (from `README.md`)

Only the most relevant folders for AI are listed here.

```txt
src/
├── app/             # Next.js App Router routes
├── modules/         # Page-level modules (no props)
├── components/      # Complex reusable components
├── ui/              # Primitive UI components
├── services/        # Domain services (API + queries)
├── lib/             # Core clients, configs, shared utils
├── hooks/           # Global hooks
├── utils/           # Global utilities
├── context/         # Global React contexts
├── stores/          # Zustand stores (optional)
├── schemas/         # Global Zod schemas
├── constants.ts     # Global constants
├── types.ts         # Global TS types
└── styles/          # Global styles
```

### 2.1 `src/app` – Routing (Next App Router)

- Contains **routes**, **layouts**, **search params loaders**, and optional **loading/not‑found** files.
- Typical route:

```txt
src/app/
├── layout.tsx               # Root layout
├── page.tsx                 # Home page
├── (main)/                  # Route group
│   ├── layout.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── loading.tsx
│       ├── not-found.tsx
│       └── searchParams.ts  # Nuqs/server loader
```

**Pattern** – route delegates to a module:

```ts
// src/app/page.tsx
'use client';

import Home from '@/modules/Home';

const HomePage: React.FC = () => {
    return <Home />;
};

export default HomePage;
```

---

## 3. Modules (`src/modules`)

Modules represent **pages** and are the **only things rendered directly by routes**.

- **Location**: `src/modules/<ModuleName>/`
- **No props**: modules **must not** receive props
- **Name**:
  - Route: `/about` → folder: `src/modules/About`
  - Component: `About` (PascalCase)
- **Exports**: default export of the module component
- **Allowed inside modules**:
  - `src/components`, `src/ui`, module‑local hooks/utils/constants/schemas/contexts/sub‑modules

### Module anatomy

```txt
src/modules/Home/
├── index.tsx          # required
├── styles.module.css  # optional
├── types.ts           # optional
├── constants.ts       # optional
├── hooks/             # optional
├── utils/             # optional
├── schemas/           # optional
├── components/        # optional
└── contexts/          # optional
```

Key rules:
- **No props** on module components.
- Module name == component name.
- Sub‑modules live under `src/modules/<Module>/components/...` and can represent nested routes.

---

## 4. Components vs UI (`src/components` & `src/ui`)

### 4.1 Primitive UI (`src/ui`)

- Basic, presentational components: buttons, inputs, typography, wrappers, icons, etc.
- **NO** complex logic, **NO** custom hooks, **NO** contexts.
- **Cannot** import from `src/components`.

Minimal structure:

```txt
src/ui/Button/
├── index.tsx
└── styles.module.css  # optional
```

### 4.2 Complex Components (`src/components`)

- Reusable components that **may contain business logic**.
- Can use **`src/ui`** as building blocks.
- May define component‑scoped hooks, utils, constants, contexts, schemas, and sub‑components.

Structure is similar to modules:

```txt
src/components/ArticleCard/
├── index.tsx
├── styles.module.css
├── types.ts
├── hooks/
├── utils/
├── constants.ts
├── schemas/
└── contexts/
```

Key rules:
- Default export for the component.
- Folder name == component name (PascalCase).
- Component‑specific files **must not** be imported outside that component’s tree.

---

## 5. Services & Data Layer (`src/services` + `src/lib`)

### 5.1 `src/lib` – Core configuration & utilities

From `README.md`:

```txt
src/lib/
├── @http.ts        # HTTP client configuration (Ky)
├── @queryClient.ts # TanStack Query client
├── constants.ts    # Global app constants
├── schemas.ts      # Global validation schemas
├── regexps.ts      # Global regexps
├── types.ts        # Global TS types
└── utils/          # Global utility functions
```

Typical HTTP client (Ky) pattern:

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

Query client pattern:

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
    if (isServer) return makeQueryClient();
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
};
```

### 5.2 `src/services` – Domain services

Per `README.md` “Services & API layer”:

```txt
src/services/
└── books/
    ├── api.ts        # HTTP calls
    ├── queries.ts    # Query & mutation hooks
    ├── queryKeys.ts  # Query key factory
    └── types.ts      # Request/response types
```

**Critical rules**:
- **Never** call HTTP clients directly in components.
- **All** remote data access goes through **service queries** (TanStack Query).

#### Query keys pattern

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

#### Query options + hook

```ts
// src/services/books/queries.ts
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getBooks } from './api';
import { BOOKS_QUERY_KEYS } from './queryKeys';

export const getBooksQueryOptions = (search: string) => {
    return queryOptions({
        queryKey: BOOKS_QUERY_KEYS.listWithParams({ search }),
        queryFn({ signal }) {
            return getBooks({ signal, search });
        },
    });
};

export const useGetBooks = (search: string) => {
    return useQuery(getBooksQueryOptions(search));
};
```

#### Mutation hooks

- Wrap API calls with `useMutation`.
- Return the **callable mutate function** and relevant flags.

---

## 6. Query Prefetching & Hydration

From `README.md`:

- Use **`HydrationBoundary`** and **`React.Suspense`**.
- Server components **prefetch** queries; client components use `useSuspenseQuery`.

Server‑side pattern:

```ts
// app/(main)/dashboard/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/@queryClient';
import { getBooksQueryOptions } from '@/services/books/queries';

const DashboardPage: React.FC = async () => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(getBooksQueryOptions(''));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <React.Suspense fallback={<div>Loading...</div>}>
                <DashboardClient />
            </React.Suspense>
        </HydrationBoundary>
    );
};
```

Client‑side pattern:

```ts
'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getBooksQueryOptions } from '@/services/books/queries';

const DashboardClient: React.FC = () => {
    const { data: booksResponse } = useSuspenseQuery(getBooksQueryOptions(''));
    // ...
};
```

---

## 7. Hooks, Utils, Contexts, Stores

### 7.1 Hooks

- Global hooks: `src/hooks/useSomething.ts`
- Component/module‑local hooks: `<entity>/hooks/useSomething.ts`
- Naming: **camelCase** starting with `use`.

Example:

```ts
// src/hooks/useHavePermissions.ts
export const useHavePermissions = () => {
    // ...
};
```

### 7.2 Utils

- Global utils: `src/utils/<utilName>.ts`
- Local utils: `<entity>/utils/<utilName>.ts`
- Naming: camelCase, file name == function name.

### 7.3 Contexts

- Global: `src/context/<Name>Context.tsx`
- Local: `<entity>/contexts/<Name>Context.tsx`
- Naming: PascalCase ending with `Context`.

### 7.4 Stores

- Optional, based on Zustand.
- Location: `src/stores/<storeName>Store.ts`
- File name maps to hook: `use<StoreName>Store`.

---

## 8. Schemas, Types, Constants

### 8.1 Schemas (`src/schemas` + local `schemas/`)

- Use **Zod**.
- File naming: `camelCase + Schema.ts` (e.g. `signUpSchema.ts`).
- Always export **inferred types**:

```ts
import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
```

### 8.2 Types

- Global types: `src/types.ts`.
- Component/module types: local `types.ts`.
- Always import using `import type`:

```ts
import type { User } from '@/types';
```

### 8.3 Constants

- Global: `src/constants.ts`.
- Local: `<entity>/constants.ts`.
- CamelCase names; file name **`constants.ts`**.

---

## 9. Search Params (Nuqs)

### Server‑side loader (`nuqs/server`)

```ts
// src/app/(main)/dashboard/searchParams.ts
import { createLoader, parseAsString, parseAsInteger } from 'nuqs/server';

export const loadSearchParams = createLoader({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
});
```

### Client‑side hook

```ts
// src/modules/Dashboard/hooks/useDashboardSearchParams.ts
'use client';

import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

export const useDashboardSearchParams = () => {
    return useQueryStates({
        search: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
    });
};
```

---

## 10. Icons

- Location: typically `src/icons/` and/or icon components under `src/ui/icons/`.
- Naming: **kebab‑case with size suffix**, e.g. `arrow-left_16.svg`.
- Should use `currentColor` so they inherit CSS `color`.

Usage:

```ts
import ArrowLeft16Icon from '@/icons/arrow-left_16.svg';

<ArrowLeft16Icon className={s.icon} />;
```

---

## 11. Critical Rules (Do/Don’t)

These summarize the most important constraints from `README.md` and `.cursorrules`:

- **Modules**
  - **DO**: Keep modules prop‑less.
  - **DON’T**: Pass props into modules.
- **Data fetching**
  - **DO**: Put HTTP calls in `src/services/*/api.ts` and wrap them with TanStack Query hooks.
  - **DON’T**: Call HTTP clients or fetch directly from components.
- **Query keys**
  - **DO**: Use a **factory pattern** with hierarchical keys (`BOOKS_QUERY_KEYS.all`, `.list()`, `.item(id)`).
- **Prefetching**
  - **DO**: Use `HydrationBoundary` + `React.Suspense` with `useSuspenseQuery` on the client.
- **UI vs components**
  - **DO**: Keep `src/ui` primitive and logic‑free.
  - **DON’T**: Import `src/components` from `src/ui`.
- **Scopes**
  - **DO**: Keep hooks/utils/constants/contexts/schemas scoped to where they’re used.
  - **DON’T**: Reuse component‑specific files outside their component tree.
- **Types & schemas**
  - **DO**: Use `import type` and export inferred Zod types.

For anything ambiguous, read `README.md` and mirror the latest documented patterns.

