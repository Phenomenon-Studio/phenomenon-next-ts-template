---
allowed-tools: Write, Read, Glob
description: Scaffold a new route module following project anatomy conventions
---

Scaffold a new module named `$ARGUMENTS` in `src/modules/`.

Modules are route-level features rendered by `src/app/` route files only. Root module component takes no props.

## Files to create

Create ONLY what is needed — no empty placeholders.

### Always
- `src/modules/{Name}/index.tsx`

### Only when needed
- `src/modules/{Name}/types.ts`
- `src/modules/{Name}/constants.ts`
- `src/modules/{Name}/styles.module.css`
- `src/modules/{Name}/hooks/use{Something}.ts`
- `src/modules/{Name}/components/{SubName}/index.tsx`
- `src/modules/{Name}/schemas/<name>Schema.ts` — export schema + `z.infer` type

## Template: index.tsx

```tsx
import React from 'react';

const {Name}: React.FC = () => {
  return (
    <>
      {/* module content */}
    </>
  );
};

export default {Name};
```

## Wire up the route

Show the user the app route file to update after scaffolding. Example for `About`:

```tsx
// src/app/about/page.tsx
import About from '@/modules/About';

const AboutPage: React.FC = () => {
  return (
    <About />
  );
};

export default AboutPage;
```

## Rules

- No props on the root module component
    - Except case when data is fetched from the server
- Module name matches its route: `/about` -> `About`
- PascalCase folder, default export, filename matches exported symbol
- May use `src/components/` and `src/components/ui/`
- Sub-components under `components/` are private to this module
- Colocate helpers; promote to global only when reused across modules
