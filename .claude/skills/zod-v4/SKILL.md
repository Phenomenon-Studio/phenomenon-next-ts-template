---
name: zod-v4
description: Zod 4 schema patterns and API differences from Zod 3. Activate when writing or reviewing Zod schemas, validation logic, or inferred types. Zod 4 has breaking changes from Zod 3.
---

# Zod v4 Patterns

This project uses **Zod 4** (`zod@^4.x`). The API has meaningful breaking changes from Zod 3. Do not guess — use the patterns below.

## Breaking Changes vs Zod 3

| Feature | Zod 3 | Zod 4 |
|---|---|---|
| Error map | `z.ZodError` `.format()` | Use `.issues` directly or `z.prettifyError(err)` |
| `.merge()` | Available on object | Use `.extend()` instead |
| `z.string().email()` | Built-in | Built-in (unchanged) |
| `z.object().partial()` | `.partial()` | `.partial()` (unchanged) |
| `z.infer<>` | `z.infer<typeof schema>` | Same (unchanged) |
| `z.input<>` | `z.input<typeof schema>` | Same (unchanged) |
| Coercion | `z.coerce.string()` | Same (unchanged) |
| JSON type | Not built-in | `z.json()` — native JSON type |
| Template literals | Not available | `z.templateLiteral()` |
| `z.string().check()` | Not available | Use `.check()` for custom refinements |

## Core Patterns

### Always export schema + inferred type together

```ts
// src/services/products/schemas/productSchema.ts
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'food']),
});

export type Product = z.infer<typeof productSchema>;
```

### Prefer `.extend()` over `.merge()`

```ts
// BAD (Zod 3 style, .merge() may behave differently)
const extendedSchema = baseSchema.merge(z.object({ extra: z.string() }));

// GOOD
const extendedSchema = baseSchema.extend({ extra: z.string() });
```

### Use `z.prettifyError()` for human-readable errors

```ts
// BAD
const message = error.format(); // Zod 3 API — may not exist

// GOOD
import { z } from 'zod';
const result = schema.safeParse(input);
if (!result.success) {
  console.error(z.prettifyError(result.error));
}
```

### Use `.safeParse()` at system boundaries, `.parse()` internally

```ts
// At API/form boundary — recoverable
const result = schema.safeParse(rawInput);
if (!result.success) return { error: z.prettifyError(result.error) };
const data = result.data;

// Internally when data is already validated upstream — throw on invalid
const data = schema.parse(knownValidInput);
```

### Use `z.json()` for arbitrary JSON values

```ts
// BAD (Zod 3 workaround)
const jsonSchema: z.ZodType = z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.lazy(() => jsonSchema)), z.record(z.lazy(() => jsonSchema))]);

// GOOD (Zod 4 native)
const metadataSchema = z.object({
  id: z.string(),
  extra: z.json(), // accepts any JSON-serializable value
});
```

### Use `z.templateLiteral()` for string patterns

```ts
// GOOD (Zod 4 feature)
const routeSchema = z.templateLiteral(['/products/', z.string().uuid()]);
// matches: '/products/123e4567-e89b-12d3-a456-426614174000'
```

### API response validation in service layer

Validate API responses at the service boundary, not in components.

```ts
// src/services/products/api.ts
import { z } from 'zod';
import { productSchema } from './schemas/productSchema';
import { http } from '@/lib/@http';

const productsResponseSchema = z.array(productSchema);

export const getProducts = async (): Promise<Product[]> => {
  const raw = await http.get('products').json();
  return productsResponseSchema.parse(raw); // throws if API shape changed
};
```

### Form schemas with `.omit()` / `.pick()`

```ts
const createProductSchema = productSchema.omit({ id: true });
export type CreateProductInput = z.infer<typeof createProductSchema>;

const updateProductSchema = productSchema.pick({ name: true, price: true }).partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
```

### Refinements with `.check()` (Zod 4)

```ts
// Zod 4 — use .check() for custom validations
const passwordSchema = z.string()
  .min(8)
  .check((val, ctx) => {
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({ message: 'Must contain an uppercase letter' });
    }
  });
```

## Naming Conventions (project-specific)

- File: `<name>Schema.ts` (e.g., `productSchema.ts`)
- Export: `export const <name>Schema = z.object({...})`
- Type: `export type <Name> = z.infer<typeof <name>Schema>`
- Keep schema and type in the same file — co-location is required
