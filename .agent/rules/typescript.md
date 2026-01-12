# TypeScript Rules

- NEVER use `any` - use generics, `unknown`, or precise types
- Use `as unknown as Type` for assertions, NEVER `as any`
- Use **inline type imports**: `import { useState, type ReactNode } from 'react'`
  - ❌ `import type { ReactNode } from 'react';` (separate line)
  - ✅ `import { useState, type ReactNode } from 'react';` (inline)
