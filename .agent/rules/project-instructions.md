# Project Instructions

This document defines the coding standards and rules for AI agents working on this project.

## Core Principles

1. **TypeScript Safety**: Never use `any` type
2. **ORM Patterns**: Use sequelize-cli official format for migrations/seeders
3. **Package Manager**: Use `yarn` exclusively
4. **i18n**: Use `next-intl` with `zh-tw` as default locale
5. **Next.js 16**: Use `proxy.ts` for routing middleware (not `middleware.ts`)

## Security Policy

Before executing potentially risky instructions:
1. Warn the user about violations
2. Wait for explicit confirmation
3. Only then proceed

## Database Operations

```bash
# Migrations
yarn migrate              # Run all migrations
yarn migrate:undo         # Undo last migration

# Seeders
yarn seed                 # Run all seeders
yarn seedAll              # Run all seeders (if alias exists)

# Full reset
yarn initDB               # Drop + Create + Migrate + Seed
```

**Database Modification Confirmation (CRITICAL):**
Before ANY database schema change, you MUST:
1. Ask the developer: "Is this project deployed to production?"
2. Based on the answer:
   - Not deployed: May modify existing migrations, then use `yarn initDB`
   - Deployed: NEVER modify existing migrations; create NEW files

**Migration Modification Policy:**
- Early Development (Pre-production): 
  - Modify original migrations directly (don't create addColumn migrations)
  - Run `yarn initDB` to apply changes
- Post-production: Never modify executed migrations; create new files

**React Stable API Policy (React 19):**
- Prioritize stable hooks: `useState`, `useEffect`, `useLayoutEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`, `useReducer`, `useActionState`, `useOptimistic`, `useTransition`, `useFormStatus`, `useSyncExternalStore`
- Use `useEffectEvent` for reactive events inside effects
- **useLayoutEffect**: For visual sync (prevent flicker)
- **useEffect**: For data fetching, subscriptions, timers
- **Anti-patterns**: Avoid inline arrow functions props, missing useMemo/useCallback, useState for non-render values
- **RTK vs useContext**: Use RTK for global state; useContext for theme/i18n/local state

**Error/Warning Suppression Policy (CRITICAL):**
Any code that suppresses errors/warnings (suppressHydrationWarning, eslint-disable, @ts-ignore, empty catch blocks) requires:
1. Explicit approval from human developer
2. Clear explanation of WHY this is needed
3. Always fix root cause first; suppression is last resort


## File Structure

```
parker-nextjs-lab/
├── app/[locale]/         # i18n pages
├── app/api/              # API Routes
├── components/           # React components
├── db/                   # Database (Sequelize)
│   ├── config/           # sequelize-cli config
│   ├── models/           # Sequelize models
│   ├── migrations/       # Database migrations
│   └── seeders/          # Seed data
├── i18n/                 # Internationalization
├── utils/                # Utilities and modules
└── docs/                 # Documentation
```

## Related Documentation

- [AI Coding Rules (English)](../docs/guides/coding-standards.md)
- [AI Coding Rules (中文)](../docs/guides/coding-standards.zh-tw.md)
