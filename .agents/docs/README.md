# Agent docs entrypoint

Use this document for quick orientation, then follow the canonical guide in [`AGENTS.md`](../../AGENTS.md).

## What to read first

- For implementation rules and boundaries: [`AGENTS.md`](../../AGENTS.md)
- For full human-oriented setup and rationale: [`README.md`](../../README.md)
- For scripts and exact versions: [`package.json`](../../package.json)

## First 60 seconds checklist (for AI agents)

- Confirm task scope and target directories before editing.
- Verify architecture boundaries (`app` routes -> `modules`; `components/ui` stays primitive).
- Check domain data flow in `src/services/<domain>/` (`api.ts`, `queries.ts`, `queryKeys.ts`).
- Reuse shared infra from `src/lib/` (HTTP clients, env helpers, auth utils) before adding new helpers.
- Prefer colocating feature-only files; promote to shared paths only when reused across domains.

## Repository architecture quick map

```
src/
├── app/                # Route files and root layout
├── modules/            # Route-level feature modules rendered by app routes
├── components/         # Composed reusable components
│   └── ui/             # Primitive UI components only
├── services/           # Domain API + TanStack Query contracts
├── lib/                # Infra utilities, env/contracts, shared helpers
├── hooks/              # Shared hooks
├── styles/             # Global styles
├── icons/              # SVG assets
└── ui/icons/           # TSX icon components
```

## Practical conventions to enforce

- Keep app route files thin and render a module from `src/modules/`.
- Avoid direct API calls inside UI components when query options/hooks exist.
- Keep query keys centralized per domain and reuse them for invalidation/prefetch.
- Use naming conventions consistently:
  - hooks: `useSomething.ts`
  - schemas: `*Schema.ts` + `z.infer`
  - components/modules: PascalCase folder + `index.tsx`

## When docs drift

If the structure or architecture changes, update both:

- [`AGENTS.md`](../../AGENTS.md)
- [`.agents/docs/README.md`](./README.md)
