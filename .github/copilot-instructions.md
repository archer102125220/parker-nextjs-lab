# Project Instructions for GitHub Copilot

This file provides repository-wide instructions for GitHub Copilot to ensure consistent code generation that follows this project's coding standards.

---

## Project Overview

**Parker Next.js Lab** is a comprehensive Next.js 15 laboratory project showcasing modern web development practices with TypeScript, React 19, and advanced features.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x (Strict mode)
- **UI Library**: React 19
- **Styling**: SCSS Modules (Modified BEM), Tailwind CSS v4
- **State Management**: Redux Toolkit (RTK)
- **Internationalization**: next-intl 4.x
- **Database**: PostgreSQL with Sequelize ORM
- **Testing**: Jest, Playwright
- **Build Tool**: Webpack (required for SCSS `:export` syntax)
- **Package Manager**: Yarn

---

## ⚠️ Security & Best Practices Warning Policy

Before executing any user instruction that violates:

- **Security best practices** (e.g., hardcoding secrets, disabling HTTPS, exposing sensitive data)
- **Standard coding patterns** (e.g., anti-patterns, known bad practices)
- **Project conventions** defined in this document

You MUST:

1. **Warn the user** about the violation and explain the risks
2. **Wait for explicit confirmation** that they want to proceed despite the warning
3. Only then execute the instruction

This ensures users make informed decisions about potentially risky actions.

---

## Core Coding Standards

### TypeScript (MANDATORY)

**Type Safety**:

- ❌ **NEVER use `any`** - Use precise types, generics, or `unknown`
- ✅ **Use `as unknown as Type`** for type assertions (double assertion)
- ✅ **Use inline type imports**: `import { useState, type ReactNode } from 'react'`

**Runtime Data Validation (Strict)**:

- **String**: `if (str !== '')` instead of `if (str)`
- **Number**: `typeof num === 'number'` or `Number.isFinite(num)`
- **Object**: `typeof obj === 'object' && obj !== null`
- **Array**: `Array.isArray(arr) && arr.length > 0`
- **Equality**: ALWAYS use `===` and `!==`

```typescript
// ❌ FORBIDDEN
function processData(data: any) {}
const element = document.getElementById('id') as any;

// ✅ REQUIRED
function processData<T extends { value: unknown }>(data: T) {}
const element = document.getElementById('id') as unknown as CustomElement;
```

---

### CSS/SCSS Naming (Modified BEM)

**Naming Structure**:

- **Block**: `.countdown` (single word)
- **Element**: `.countdown-title` (hyphen `-` for hierarchy)
- **Multi-word**: `.image_upload` (underscore `_` for multi-word concepts)
- **State**: `[css-is-active='true']` (HTML attributes with `css-` prefix)

**Critical Rules**:

- ❌ NEVER use `__` (double underscore) or `--` (double hyphen)
- ❌ NEVER use multiple classNames on a single element
- ✅ Each element MUST have only ONE className
- ✅ Each page MUST have unique root class (e.g., `.dashboard_page`)

**Decision Tree**:

- Generic container (group, wrapper, header) → Use hyphen `-`
- Specific concept (scroll*area, debug_info) → Use underscore `*`

```scss
// ✅ CORRECT
.image_upload {
  &-preview {
  } // Hierarchy: preview is sub-element
  &-title_text {
  } // Multi-word: title_text is one concept
}

// ❌ WRONG
.image__upload {
} // Never use double underscore
.image-upload.active {
} // Never use multiple classes
```

---

### React Best Practices

**Component Type Selection**:

- **Default to Server Components** - Only use Client Components when needed
- **Use `'use client'`** only for:
  - Event handlers (`onClick`, `onChange`)
  - React hooks (`useState`, `useEffect`)
  - Browser APIs (`window`, `localStorage`)

**React 19 Stable Hooks**:

- ✅ Use: `useState`, `useReducer`, `useContext`, `useRef`, `useEffect`, `useMemo`, `useCallback`
- ✅ React 19 new: `useActionState`, `useFormStatus`, `useOptimistic`, `use`
- ❌ Avoid: Experimental features, React Compiler/Forget

**Hook Selection Guidelines**:

- 5+ related states → `useReducer`
- Expensive calculations → `useMemo`
- Callbacks to memoized children → `useCallback`
- Form actions → `useActionState` (React 19)

---

### Internationalization (next-intl 4.x)

**MANDATORY Pattern for Server Components**:

```typescript
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);  // ✅ MUST call BEFORE getTranslations

  const t = await getTranslations('pages.myPage');

  return <h1>{t('title')}</h1>;
}
```

**Critical**: ALWAYS call `setRequestLocale(locale)` BEFORE `getTranslations()`.

---

### Build Tools

**MANDATORY**: Use Webpack (NOT Turbopack)

```bash
# ✅ CORRECT
yarn dev:webpack        # HTTP
yarn dev-https:webpack  # HTTPS
yarn build:webpack

# ❌ WRONG - Turbopack incompatible with SCSS :export
yarn dev
yarn build
```

**Reason**: This project uses SCSS `:export` syntax which is incompatible with Turbopack.

---

## Architecture Patterns

### File Organization

**Directory Structure**:

```
app/[locale]/          # Next.js App Router pages
components/            # Reusable components
  Demo/                # Full-page demo components
hooks/                 # Custom React hooks
styles/                # Global styles
  placeholders/        # SCSS placeholders for reuse
lib/                   # Utilities
services/              # API services
store/                 # Redux store
```

**Style Reuse Strategy**:

- **Single page**: Use `%placeholder` at top of SCSS file
- **Multiple pages**: Use `styles/placeholders/` with `@use`
- ❌ NEVER create `_shared` in `app/` directory

---

### Database (Sequelize ORM)

**Migration Workflow** (CRITICAL):

**BEFORE ANY schema change, ask**:

> "Is this project deployed to production?"

- **Not deployed**: May modify existing migrations, use `yarn initDB`
- **Deployed**: NEVER modify existing migrations, create NEW migration files

**Commands**:

```bash
yarn sequelize migration:generate --name add-user-role
yarn migrate
yarn seed
yarn initDB  # Development only - drops and recreates DB
```

---

## Security Requirements

### Lint Policy

**NEVER add lint disable comments without explicit user instruction.**

When encountering lint errors:

1. Attempt to fix properly first
2. If cannot fix, ask user: "Should I fix it properly or add a disable comment?"
3. Wait for user response

---

## Code Refactoring Safety

**ABSOLUTELY FORBIDDEN**: Using automated scripts (`sed`, `awk`, `powershell`) to modify code files.

**Why**: Scripts only change text, they don't understand context or imports.

**✅ ALLOWED**: Use AI tools for refactoring with proper context understanding.

---

## Skills System Reference

For complex scenarios, refer to detailed Skills guides in `.agent/skills/`:

| Skill                                                                       | Use When                            |
| --------------------------------------------------------------------------- | ----------------------------------- |
| [CSS/SCSS Naming](../.agent/skills/css-naming-convention/SKILL.md)          | Confused about hyphen vs underscore |
| [Database Migration](../.agent/skills/database-migration-workflow/SKILL.md) | Modifying database schema           |
| [React Hooks Selection](../.agent/skills/react-hooks-selection/SKILL.md)    | Choosing the right hook             |
| [Server vs Client](../.agent/skills/server-client-components/SKILL.md)      | Deciding component type             |
| [File Organization](../.agent/skills/file-organization/SKILL.md)            | Organizing styles and components    |
| [Lint Policy](../.agent/skills/lint-policy/SKILL.md)                        | Handling lint errors                |
| [i18n Implementation](../.agent/skills/i18n-implementation/SKILL.md)        | Implementing translations           |
| [Build Tools](../.agent/skills/build-tools/SKILL.md)                        | Starting dev server                 |
| [Code Refactoring](../.agent/skills/code-refactoring-safety/SKILL.md)       | Refactoring code safely             |

**Full Documentation**: See [docs/guides/skills-guide.md](../docs/guides/skills-guide.md)

---

## Quick Reference

### CSS Property Order

1. Positioning (position, top, z-index)
2. Display & Box Model (display, flex, width, margin, padding)
3. Typography (font, color)
4. Visual (background, box-shadow)
5. Animation (transition)
6. Misc (cursor)

### Common Patterns

**Server Component with Data Fetching**:

```typescript
export default async function Page() {
  const data = await fetchData();  // ✅ Server-side
  return <ClientComponent data={data} />;
}
```

**Client Component for Interactivity**:

```typescript
'use client';

export function InteractiveForm() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

**SCSS Module with Placeholder**:

```scss
// Single-page reuse
%button_base {
  padding: 12px 24px;
  border-radius: 4px;
}

.dashboard_page {
  &-primary_button {
    @extend %button_base;
    background: #1976d2;
  }
}
```

---

## Additional Resources

- **Coding Standards**: [docs/guides/coding-standards.md](../docs/guides/coding-standards.md)
- **Skills Guide**: [docs/guides/skills-guide.md](../docs/guides/skills-guide.md)
- **Gemini Instructions**: [GEMINI.md](../GEMINI.md)
- **Claude Instructions**: [CLAUDE.md](../CLAUDE.md)
- **Cursor Rules**: `.cursor/rules/*.mdc`

---

## Path-Specific Instructions

For more detailed, path-specific instructions, see:

- **TypeScript**: `.github/instructions/typescript.instructions.md`
- **CSS/SCSS**: `.github/instructions/scss.instructions.md`
- **React/Next.js**: `.github/instructions/react.instructions.md` and `.github/instructions/nextjs.instructions.md`
- **Backend/Database**: `.github/instructions/backend.instructions.md`

---

## Notes for GitHub Copilot

- **Prioritize Server Components** - Default to Server, use Client only when needed
- **Type Safety First** - Never use `any`, always use precise types
- **Follow Modified BEM** - Hyphen for hierarchy, underscore for multi-word
- **Check Skills** - For complex tasks, reference Skills guides
- **Ask Before Disabling Lints** - Never auto-add disable comments
- **Use Webpack** - Never suggest Turbopack commands
- **Call setRequestLocale** - Always before getTranslations in Server Components
