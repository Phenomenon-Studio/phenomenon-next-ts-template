---
allowed-tools: Write, Read, Glob
description: Scaffold a full service domain layer following project conventions
---

Scaffold a new service domain named `$ARGUMENTS` in `src/services/`.

A service domain encapsulates all API communication, caching contracts, and query/mutation hooks for one data domain.

## Files to create

Always create all four files:

- `src/services/{domain}/types.ts`
- `src/services/{domain}/api.ts`
- `src/services/{domain}/queryKeys.ts`
- `src/services/{domain}/queries.ts`

## Templates

### types.ts
```ts
// Request and response types for the {domain} domain

export type {Domain} = {
  id: string;
  // ...
}

export type Get{Domain}sRequest ={
  // ...
}

export type Get{Domain}sResponse ={
  // ...
}
```

### api.ts
```ts
import { 
    http,
    // httpPrivate, // uncomment if using private API
} from '@/lib/@http';
import type { {Domain}, Get{Domain}sRequest, Get{Domain}sResponse } from './types';
import type { Options } from 'ky';

export const get{Domain}s = (data: Get{Domain}sRequest, options?: Options) => {
  return http.get<Get{Domain}sResponse>('{domain}s', { json: data, ...options }).json();
};

export const get{Domain} = (id: string, options?: Options) => {
  return http.get<Get{Domain}Response>(`{domain}s/${id}`, options).json();
};
```

### queryKeys.ts
```ts
export const {domain}QueryKeys = {
  all: ['{domain}s'] as const,
  lists() {
    return [...{domain}QueryKeys.all, 'list'] as const;
  },
  list(params: Record<string, unknown>) {
    return [...{domain}QueryKeys.lists(), params] as const;
  },
  details() {
    return [...{domain}QueryKeys.all, 'detail'] as const;
  },
  detail(id: string) {
    return [...{domain}QueryKeys.details(), id] as const;
  },
};
```

### queries.ts
```ts
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { get{Domain}, get{Domain}s } from './api';
import { {domain}QueryKeys } from './queryKeys';
import type { Get{Domain}sParams } from './types';

export const {domain}sQueryOptions = (params: Get{Domain}sParams) => {
    return  queryOptions({
        queryKey: {domain}QueryKeys.list(params),
        queryFn: () => get{Domain}s(params),
    });
}

export const {domain}QueryOptions = (id: string) => {
    return queryOptions({
    queryKey: {domain}QueryKeys.detail(id),
    queryFn: () => get{Domain}(id),
    });
}
```

## Rules

- `api.ts` — plain async functions only, no hooks
- `queryKeys.ts` — hierarchical key factory; reuse for invalidation and prefetch
- `queries.ts` — `queryOptions` / `mutationOptions` factories; hooks are thin wrappers (`useQuery(xQueryOptions(params))`)
- `types.ts` — request params + response shapes; no UI types here
- Import the HTTP client from `@/lib/@http`, not raw `ky`
- Use `queryOptions()` factory pattern so options can be reused in both hooks and prefetch/SSR
- After scaffolding, show the user how to consume the query in a component or module
