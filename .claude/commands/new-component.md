---
allowed-tools: Write, Read, Glob
description: Scaffold a new component following project anatomy conventions
---

Scaffold a new component named `$ARGUMENTS` following this project's anatomy conventions.

## Determine target location

- `src/components/ui/` — primitive UI element (button, input, badge, icon wrapper, etc.) with no business logic
- `src/components/` — composed component that may include business logic and can use `src/components/ui/`

If the name or context makes this ambiguous, ask the user before creating files.

## Files to create

Create ONLY files that are actually needed. Do not generate empty placeholder files.

### Always create
- `src/components/{Name}/index.tsx` — the component itself

### Create only when needed
- `src/components/{Name}/types.ts` — if props are complex enough to warrant a separate file
- `src/components/{Name}/styles.module.css` — if the component needs scoped CSS beyond utility classes
- `src/components/{Name}/constants.ts` — if the component has non-trivial local constants
- `src/components/{Name}/hooks/use{Something}.ts` — if the component needs a dedicated hook (not reusable elsewhere)
- `src/components/{Name}/utils/<utilName>.ts` — if the component has a non-trivial pure helper
- `src/components/{Name}/schemas/<name>Schema.ts` — if the component owns a Zod schema (export schema + inferred type)

## Template: `index.tsx`

```tsx
import React from 'react';
// import s from './styles.module.css'; // uncomment if using CSS Modules


export const {Name}: React.FC<{Name}Props> = ({ }) => {
  return (
    <>
      {/* component content */}
    </>
  );
};

```

## Template: `types.ts`

```tsx

export type  {Name}Props = {
  // define props here
}
```

## Rules to enforce

- Arrow function component, typed with `React.FC<Props>`
- Default export from `index.tsx`
- PascalCase folder name matches the component name and exported symbol
- No `useEffect` for derived state — compute during render
- Define named event handlers (`clickHandler`, `submitHandler`) — no inline arrow functions in JSX
- No imports from `src/components/` inside `src/components/ui/` components
- Colocate all helpers; promote to shared paths only if reused across components
