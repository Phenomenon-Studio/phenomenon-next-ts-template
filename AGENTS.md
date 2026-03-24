# AGENTS.md

Agent-focused guide for working in this repository. Keep this file concise and operational.

Human onboarding and long-form conventions live in [README.md](./README.md).

## Project snapshot

- Next.js 16 + App Router + TypeScript (React 19).
- Source is under `src/`; alias `@/` points to `src/`.
- Data layer uses `ky` + TanStack Query 5.
- Validation and shared contracts use `zod`.

## Authoritative sources

- Scripts and dependency versions: `package.json`.
- Folder and naming conventions: `README.md`.
- Environment validation: `src/env.ts` and `src/lib/env.ts`.

## Commands

| Intent | Command |
|---|---|
| Local dev (Turbopack + HTTPS) | `npm run dev` |
| Dev in scan mode | `npm run dev:scan` |
| Production build | `npm run build` |
| Build with analyzer | `npm run build:analyze` |
| Run production server | `npm run start` |
| Run all linters | `npm run lint` |
| ESLint only | `npm run lint:next` |
| Stylelint only | `npm run lint:stylelint` |
| Prettier check | `npm run lint:prettier` |
| Prettier write | `npm run fix:prettier` |

## Current code map (`src/`)

```
app/                # Next.js routes, root layout, metadata entrypoints
modules/            # Route-level UI blocks used by app routes
providers/          # Context providers for the application
components/         # Composed reusable components (may use ui/)
components/ui/      # Primitive UI building blocks
services/           # Domain data layer: @queryKeyFactory.ts (shared), <domain>/api.ts · queries.ts · types.ts
lib/                # Infra/shared code (@http, env, constants, search params, utils)
hooks/              # Shared React hooks
styles/             # Global CSS entry and resets
icons/              # SVG/TSX source assets
```

## Architecture rules for agents

- App routes in `src/app/` should render modules from `src/modules/` (keep route files thin).
- `src/components/ui/` is primitive-only; do not import from `src/components/` into UI primitives.
- Domain API work belongs in `src/services/<domain>/`:
  - `api.ts`: request functions
  - `queries.ts`: query/mutation option factories and hook adapters; query keys are defined here using `queryKeyFactory` from `src/services/@queryKeyFactory.ts`
  - `types.ts`: request/response types
- `src/services/@queryKeyFactory.ts` is the shared key factory — do **not** create per-domain `queryKeys.ts` files
- Prefer consuming data in UI through TanStack Query options/hooks, not direct request calls in components.
- Keep cross-cutting infra in `src/lib/` (HTTP clients, env helpers, auth/jwt utils, shared constants/types).

## Naming and placement conventions

- Hooks: `useSomething.ts` and exported symbol should match filename.
- Schemas: `somethingSchema` in `*Schema.ts`, export `z.infer` type.
- Components/modules: PascalCase folder, `index.tsx` default export.
- Query keys: created with `queryKeyFactory('<domain>')` at the top of `queries.ts`; the returned scoped generator is used inline for all query/mutation keys in that file.
- Colocate feature-only helpers (`hooks/`, `utils/`, `constants.ts`, `schemas/`) near feature; promote to shared only when reused.

## Guardrails

- Do not introduce `pages/` router patterns; this project uses App Router conventions.
- Avoid mixing unrelated architectural patterns (legacy `api/` + separate query folders) unless a migration is intentional.
- Keep docs and code aligned: if structure conventions change, update this file and `.agents/docs/README.md`.
- Prefer small, focused edits that preserve existing project style and lint rules.

## Skills for agents

- Project skills are in `.agents/skills/` and should be used when relevant:
  - `next-best-practices` — Next.js App Router patterns
  - `vercel-react-best-practices` — React performance patterns
  - `web-security` — OWASP/security guidance
  - `tanstack-query-best-practices` — TanStack Query 5 patterns
  - `nuqs-url-state` — URL state with nuqs (filters, pagination, deep links)
  - `zod-v4` — Zod 4 schemas and API (breaking changes vs Zod 3)
  - `grill-me` — stress-test plans before implementation
