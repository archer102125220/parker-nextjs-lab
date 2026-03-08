---
applyTo: "app/**/*.{tsx,ts}"
---

# Next.js App Router Best Practices

## Server Components vs Client Components (MANDATORY)

**Core Principle**: Default to Server Components, use Client Components only when needed.

### When to use Server Components (default)

| Scenario | Reason |
|----------|--------|
| Data fetching | Reduces client bundle, faster load |
| Backend resources | Direct DB queries, file access |
| Sensitive data | API keys, tokens not exposed |
| Static content | Non-interactive UI |

### When to use Client Components (`'use client'`)

| Scenario | Reason |
|----------|--------|
| Interactivity | onClick, onChange events |
| Hooks | useState, useEffect, useContext |
| Browser APIs | localStorage, window |
| Third-party client libs | Libraries that depend on window |

### Best Practices

1. **Push `'use client'` to leaf components** - Don't mark entire pages as client
2. **Server fetches, Client renders** - Fetch data in Server Component, pass to Client
3. **Use children pattern** - Server can wrap Client which wraps Server via children

## Next.js Dynamic Import (⚠️ CRITICAL)

- ✅ `dynamic(() => import(...))` - Default, SSR enabled
- ❌ `dynamic(() => import(...), { ssr: false })` - AVOID unless absolutely necessary
- Only use `{ ssr: false }` when third-party lib cannot run in Node.js
- Misuse causes: build failure, SEO damage, performance issues

## Internationalization (next-intl 4.x)

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

## Build & Dev Tooling (Webpack Required) (⚠️ CRITICAL)

- **ALWAYS use Webpack**: This project uses SCSS `:export` syntax which is currently incompatible with Turbopack.
- **Dev**: Use `yarn dev:webpack` (HTTP) or `yarn dev-https:webpack` (HTTPS)
- **Build**: Use `yarn build:webpack`
- **Do NOT use**: `yarn dev` or `yarn build` (Turbopack default)
- **Environment Check**: When starting the development server, ALWAYS check if `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_DOMAIN` in `.env` match the port/domain settings in `package.json` scripts. If there is a mismatch (e.g., .env port 3000 vs script port 3001), OR if `.env` is gitignored and unreadable by the IDE, you MUST wait for user confirmation before proceeding.
