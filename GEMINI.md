# Project Instructions for Gemini

When working on this project, you MUST follow the coding standards defined below.

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

## Quick Rules

### TypeScript
- NEVER use `any` - use generics, `unknown`, or precise types
- Use `as unknown as Type` for assertions, NEVER `as any`
- Use **inline type imports**: `import { useState, type ReactNode } from 'react'`

### CSS/SCSS Naming (Modified BEM)
- **Block**: `.countdown` (Single word)
- **Element**: `.countdown-title` (hyphen `-` separates Block-Element)
- **Sub-Element**: `.countdown-title-icon` (hyphen `-` separates Element-SubElement)
- **Multi-word Segment**: `.image_upload` (underscore `_` separates words **WITHIN** a single segment)
- **State**: `[css-is-active='true']` (HTML attr with `css-` prefix)
- **CSS variables**: `--editor_height` (underscore `_`)

#### 🛑 Critical Disambiguation for Gemini:
- **Hierarchy (Hyphen `-`)**: Use when adding a new structural level or generic container.
  - ✅ `.controls-group` (`group` is a sub-element of `controls`)
  - ✅ `.card-body` (`body` is a sub-element of `card`)
- **Multi-word Segment (Underscore `_`)**: Use when the name describes a SINGLE specific concept that happens to need two words.
  - ✅ `.scroll_area` (A "scroll area" is one specific thing)
  - ✅ `.debug_info` (Information about debugging)
  - ✅ `.image_upload` (Upload component for images)
- **Rule of Thumb**: If it's a generic container noun (group, wrapper, container, inner), it's likely a Sub-Element (`-`). If it's a specific descriptive noun phrase, it's a Multi-word Segment (`_`).

#### Other Rules:
- NEVER use `__` (double underscore) or `--` (double hyphen)
- Use HTML attributes for states/variants: `[css-color='red']`, `[css-is-disabled='true']`
- Each element MUST have only ONE className

### Page Root Class
- Page: `[name]_page` (e.g., `.hooks_test_page`)
- Component: `[name]` (e.g., `.image_upload`)
- Each page MUST have unique root class

### CSS Property Order
1. Positioning (position, top, z-index)
2. Display & Box Model (display, flex, width, margin, padding)
3. Typography (font, color)
4. Visual (background, box-shadow)
5. Animation (transition)
6. Misc (cursor)

### File Organization
- Placeholders: `styles/placeholders/`
- NEVER create `_shared` in `app/`
- NEVER share CSS class names between pages
- For shared DOM: create component with `pageClassName` prop
- **Each element MUST have its own unique class**
  - ❌ Bad: `.footer-links a { ... }` (targeting tag)
  - ✅ Good: `.footer-link { ... }` (unique class)
  - ✅ Exception: Dynamic content areas (e.g., `.content p { ... }`)
  - ✅ Exception: Third-party content (e.g., `:global a { ... }` in WangEditor)

#### Style Reuse Strategy (Strict)
- **Single Page Reuse**: Define `%placeholder_name` at the top of the SCSS file and use `@extend` in the specific element classes.
- **Multi-Page Reuse**: Define in `styles/placeholders/` and use `@use`.
- **Primary Goal**: Maintain unique unique class names for every structural element to ensure instant file/element location in DevTools.

#### Strict Nesting (Hierarchy Reflection)
- Class names MUST generally reflect the DOM containment hierarchy if it aids context.
- Example: If `group` is inside `scroll_area`, it should be named `scroll_area-group`, not just `group` (unless `group` is a top-level independent abstraction).

### Demo Components (`components/Demo/`)
- Full-page Client Components for feature demonstrations
- Naming: PascalCase (e.g., `BannerDemo.tsx`, `LazyLoadTest.tsx`)
- Rules:
  - Full-page content → `components/Demo/[PageName].tsx`
  - Multiple sub-components → `components/[PageName]/` folder

### Inline Styles
- ALLOWED: MUI `sx`, CSS variable passing
- FORBIDDEN: static values, dynamic calculations

### Internationalization (next-intl 4.x)
- **ALWAYS** call `setRequestLocale(locale)` in Server Components before `getTranslations`
- Page must receive `params: Promise<{ locale: string }>` prop
- Pattern:
```tsx
async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale); // BEFORE getTranslations
  const t = await getTranslations('pages.myPage');
}
```

### Next.js Dynamic Import (⚠️ CRITICAL)
- ✅ `dynamic(() => import(...))` - Default, SSR enabled
- ❌ `dynamic(() => import(...), { ssr: false })` - AVOID unless absolutely necessary
- Only use `{ ssr: false }` when third-party lib cannot run in Node.js
- Misuse causes: build failure, SEO damage, performance issues

### useLayoutEffect vs useEffect
- Use `useLayoutEffect` when syncing props to state that affects **visual rendering** (sliders, position)
- Use `useEffect` for data fetching, subscriptions, timers
- `useLayoutEffect` runs synchronously before browser paint - avoid heavy computations

### React Stable API Policy (⚠️ CRITICAL)
- **Prioritize React Stable APIs**, **avoid experimental syntax**, and **use proper hook selection**
- ✅ **React 19 Stable Hooks**: `useState`, `useReducer`, `useContext`, `useRef`, `useImperativeHandle`, `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent`, `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, `useDebugValue`, `useActionState`, `useFormStatus`, `useOptimistic`, `use`
- ✅ **Hook Selection Guidelines**:
  | Scenario | Use |
  |----------|-----|
  | Expensive calculations | `useMemo` |
  | Callbacks passed to children | `useCallback` |
  | Prevent re-renders | `memo` |
  | Access DOM / mutable values | `useRef` |
  | Complex state logic | `useReducer` |
  | Share state across components | `useContext` |
  | Visual sync (prevent flicker) | `useLayoutEffect` |
  | Form action state (React 19) | `useActionState` |
  | Optimistic updates (React 19) | `useOptimistic` |
  | Non-blocking UI updates | `useTransition` |
  | Reactive events inside effects | `useEffectEvent` |
- ❌ **Avoid**: React Compiler/Forget (experimental), any "Canary" or "Experimental" features, unstable_ prefixed APIs
- ⚠️ **Anti-patterns**:
  - DON'T use inline arrow functions in JSX when passing to memoized children → use `useCallback`
  - DON'T recalculate values on every render → use `useMemo`
  - DON'T use `useState` for values that don't need re-render → use `useRef`
- 📦 **RTK vs useContext** (when using Redux Toolkit):
  - **Use RTK**: Global app state, cross-page data, persisted state, RTK Query, state needing DevTools
  - **Use useContext**: Theme/i18n Provider, local component tree state, third-party Provider (React Query, SWR)

### Lint Disable Comments (⚠️ CRITICAL)
- **NEVER** add `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or similar comments without **explicit user instruction**
- When encountering lint warnings/errors:
  1. Report the warning to the user
  2. Wait for user's explicit instruction to add a disable comment
  3. Only then add the disable comment with proper justification
- This applies to ALL lint suppression mechanisms

### Build & Dev Tooling (Webpack Required) (⚠️ CRITICAL)
- **ALWAYS use Webpack**: This project uses SCSS `:export` syntax which is currently incompatible with Turbopack.
- **Dev**: Use `yarn dev:webpack` (HTTP) or `yarn dev-https:webpack` (HTTPS)
- **Build**: Use `yarn build:webpack`
- **Do NOT use**: `yarn dev` or `yarn build` (Turbopack default)
- **Environment Check**: When starting the development server, ALWAYS check if `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_DOMAIN` in `.env` match the port/domain settings in `package.json` scripts. If there is a mismatch (e.g., .env port 3000 vs script port 3001), OR if `.env` is gitignored and unreadable by the IDE, you MUST wait for user confirmation before proceeding.

## Full Documentation
- English: [docs/guides/coding-standards.md](docs/guides/coding-standards.md)
- 繁體中文: [docs/guides/coding-standards.zh-tw.md](docs/guides/coding-standards.zh-tw.md)
- 問題排解: [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md)
