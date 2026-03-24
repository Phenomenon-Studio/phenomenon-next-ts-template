# CLAUDE.md

Claude Code entry point for `phenomenon-next-ts-template`. Full agent rules live in [AGENTS.md](./AGENTS.md) — read it for architecture boundaries and naming conventions. This file adds Claude Code-specific context.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + App Router |
| UI | React 19 + React Compiler |
| Data fetching | TanStack Query 5 + ky |
| URL state | nuqs |
| Validation | Zod 4 |
| Utility hooks | @react-hookz/web |
| Env validation | @t3-oss/env-nextjs |
| Styling | CSS Modules (`styles.module.css`) |
| Source alias | `@/` → `src/` |

> React Compiler is enabled (`babel-plugin-react-compiler`) — avoid manual `useMemo`/`useCallback` unless there is a proven need.

> Zod 4 API differs from Zod 3 — check the current Zod 4 docs before writing schemas.

## Commands

| Intent | Command |
|---|---|
| Dev server (Turbopack + HTTPS) | `npm run dev` |
| Production build | `npm run build` |
| Build with bundle analyzer | `npm run build:analyze` |
| All linters | `npm run lint` |
| Prettier write | `npm run fix:prettier` |

> Prettier runs automatically after every file edit (Claude Code hook) — no need to run it manually.

## Architecture boundaries — enforce strictly

```
app/           thin route files only; render a module from modules/
modules/       route-level features; root module components have NO props
components/    reusable composed components; may use components/ui/
components/ui/ primitive only; must NOT import from components/
services/      domain API layer: @queryKeyFactory.ts (shared) · <domain>/api.ts · queries.ts · types.ts
lib/           cross-cutting infra (HTTP client, env, constants, types, utils)
hooks/         shared hooks only; colocate feature hooks near their feature
```

## Naming conventions

- Hooks: `useSomething.ts` — filename matches exported symbol
- Schemas: `somethingSchema.ts` — export schema + `z.infer` type
- Components/modules: `PascalCase/index.tsx` — default export
- Query keys: `queryKeyFactory('<domain>')` called at top of `queries.ts`; no per-domain `queryKeys.ts` file
- Stores (Zustand): `<name>Store.ts` — exports `use<Name>Store`
- Icons: `kebab-case_<size>.svg` (e.g. `arrow-left_16.svg`)

## Skills available

`.claude/skills/` — invoke when relevant:
- `modern-best-practice-react-components` — React 19, avoid useEffect, event handler patterns
- `clean-typescript` — TypeScript conventions
- `modern-accessible-html-jsx` — semantic HTML/JSX
- `web-security` — OWASP/security patterns

`.agents/skills/` — shared across agents:
- `next-best-practices` — Next.js App Router patterns
- `vercel-react-best-practices` — React performance optimization rules
- `tanstack-query-best-practices` — TanStack Query 5 patterns
- `nuqs-url-state` — URL state (filters, pagination, server/client sync)
- `zod-v4` — Zod 4 schemas, breaking changes vs Zod 3, project conventions
- `grill-me` — stress-test plans before implementation

## Subagents available

`.claude/agents/DocsExplorer` — fetches up-to-date docs for any library (Context7 MCP + web fallback). Use proactively when you need current API docs for any stack library.

## Slash commands

- `/code-review [BUGS|SECURITY|PERFORMANCE]` — in-depth codebase review
- `/new-component <Name>` — scaffold a component following project anatomy
- `/new-module <Name>` — scaffold a route module following project anatomy
- `/new-service <domain>` — scaffold a full service domain layer
