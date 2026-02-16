
# TypeScript Rules

## Type Safety (MANDATORY)

- **NEVER use `any` type** - Use generics, `unknown`, or precise types
- **Use `as unknown as Type`** for type assertions, NEVER `as any`
- **Add comments** explaining WHY when using type assertions
- **Use inline type imports** - `import { useState, type ReactNode } from 'react'`

## Examples

```typescript
// ❌ FORBIDDEN
function process(data: any) { }
const el = document.getElementById('id') as any;
import type { ReactNode } from 'react'; // separate line

// ✅ REQUIRED
function process<T extends { value: unknown }>(data: T) { }
const el = document.getElementById('id') as unknown as CustomElement;
import { useState, type ReactNode } from 'react'; // inline type
```
