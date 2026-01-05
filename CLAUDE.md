# Project Instructions for Claude

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

### CSS/SCSS Naming (Modified BEM)
- Block: `.countdown`
- Element: `.countdown-title` (hyphen `-`)
- Multi-word: `.image_upload` (underscore `_`)
- State: `[css-is-active='true']` (HTML attr with `css-` prefix)
- CSS variables: `--editor_height` (underscore `_`)
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
- **Environment Check**: When starting the development server, ALWAYS check if `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_DOMAIN` in `.env` match the port/domain settings in `package.json` scripts. If there is a mismatch (e.g., .env port 3000 vs script port 3001), you MUST wait for user confirmation before proceeding.


## Full Documentation
- English: [docs/guides/coding-standards.md](docs/guides/coding-standards.md)
- 繁體中文: [docs/guides/coding-standards.zh-tw.md](docs/guides/coding-standards.zh-tw.md)
- 問題排解: [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md)
