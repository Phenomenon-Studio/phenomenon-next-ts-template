---
name: nuqs-url-state
description: nuqs URL state management patterns for Next.js App Router. Activate when reading or writing URL search params, building filters, pagination, tabs, or any state that should live in the URL.
---

# nuqs URL State Patterns

nuqs provides type-safe URL search param state for Next.js App Router. Use it for any state that should be shareable, bookmarkable, or survive a page refresh.

## When to Apply

- Filter panels, search inputs, sort controls
- Pagination (page, pageSize)
- Tabs or view mode toggles that should be deep-linkable
- Any state where "copy the URL" should reproduce the current view

Do NOT use nuqs for ephemeral UI state (modals, hover states, transient animations). Use `useState` for those.

## Core Rules

### 1. Always pair with a Zod schema for validation

nuqs parsers validate on parse, but complex shapes need explicit Zod schemas at the service boundary.

```ts
// BAD — raw string, no validation
const [sort] = useQueryState('sort');

// GOOD — typed parser
import { parseAsStringLiteral } from 'nuqs';
const SORT_OPTIONS = ['asc', 'desc'] as const;
const [sort, setSort] = useQueryState('sort', parseAsStringLiteral(SORT_OPTIONS).withDefault('asc'));
```

### 2. Use `useQueryStates` for related params

Group related params to avoid race conditions and unnecessary re-renders.

```ts
// BAD — two separate hooks, two URL updates
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));

// GOOD — atomic update
const [params, setParams] = useQueryStates({
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
});
```

### 3. Reset page when filters change

When filters update, page must reset to 1 in the same atomic call.

```ts
const handleSearchChange = (search: string) => {
  setParams({ search, page: 1 }); // reset together
};
```

### 4. Use `shallow: false` only when SSR needs to re-run

By default nuqs uses shallow routing (no server round-trip). Set `shallow: false` only when changing params must trigger a Server Component re-render (e.g., server-side filtered data).

```ts
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }));
```

### 5. Server Components: use `searchParams` prop, not `useQueryState`

`useQueryState` is a client hook. In Server Components, read params from the `searchParams` prop directly and validate with a Zod schema.

Route where the search parameters parsing is needed, should create a `searchParams.ts` file and export a loader that describes schema:

```ts
// src/app/products/searchParams.ts
import { createLoader, parseAsInteger, parseAsString } from 'nuqs/server';

export const loadProductsSearchParams = createLoader({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(''),
});
```

```ts
// app/products/page.tsx (Server Component)
import type { NextPage } from 'next';
import { loadProductsSearchParams } from './searchParams';

const Page: NextPage<{ searchParams: Promise<Record<string, string>> }> = ({ searchParams }) => {
  const awaitedSearchParams = await loadProductsSearchParams(searchParams);
  // pass parsed to prefetchQuery or directly to RSC data fetching
}

export default Page;
```

### 6. Define parsers as constants, not inline

Inline parser definitions recreate objects on every render. Repetitive parsers should be hoisted to global search params scope at `src/lib/searchParams/client.ts` and `src/lib/searchParams/server.ts`. Client and server should have the same parsers. CLient ones are applicable in client component only. Server ones are applicable in `src/app/*/searchParams.ts` files and in client component if `createSearchParamsCache` constant is used.

```ts
// BAD
const [page] = useQueryState('page', parseAsInteger.withDefault(1));

// GOOD — hoist to module scope
import { parseAsPage } from '@/lib/searchParams/client';

const [page] = useQueryState('page', parseAsPage);
```

### 7. Use `createSearchParamsCache` for RSC + client sync

When the same params are read in both Server and Client Components, use `createSearchParamsCache` to avoid duplication.

```ts
// src/lib/searchParams/server.ts
import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server';

export const productSearchParamsCache = createSearchParamsCache({
  page: parseAsPage,
  search: parseAsString.withDefault(''),
});
export type ProductSearchParams = ReturnType<typeof productSearchParamsCache.parse>;
```

```ts
// In Server Component layout or page:
productSearchParamsCache.parse(searchParams);

// In Client Component:
import { useQueryStates } from 'nuqs';
import { productSearchParamsCache } from '@/lib/searchParams/server';
const [params] = useQueryStates(productSearchParamsCache.parsers);
```

## Common Parsers Reference

| Data type | Parser |
|---|---|
| String | `parseAsString` |
| Integer | `parseAsInteger` |
| Float | `parseAsFloat` |
| Boolean | `parseAsBoolean` |
| String enum | `parseAsStringLiteral(['a', 'b'])` |
| JSON object | `parseAsJson(zodSchema.parse)` |
| Array | `parseAsArrayOf(parseAsString)` |
| ISO date | `parseAsIsoDateTime` |

## Integration with TanStack Query

Pass nuqs params into query options directly — they are already stable primitives.

```ts
const [params] = useQueryStates(productSearchParamsCache.parsers);
const { data } = useQuery(productsQueryOptions(params));
```

Invalidation does not need to touch nuqs — query keys derived from params will naturally update when params change.
