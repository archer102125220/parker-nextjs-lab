# Server Components vs Client Components (MANDATORY)

**Core Principle**: Default to Server Components, use Client Components only when needed.

## When to use Server Components (default)

| Scenario | Reason |
|----------|--------|
| Data fetching | Reduces client bundle, faster load |
| Backend resources | Direct DB queries, file access |
| Sensitive data | API keys, tokens not exposed |
| Static content | Non-interactive UI |

## When to use Client Components (`'use client'`)

| Scenario | Reason |
|----------|--------|
| Interactivity | onClick, onChange events |
| Hooks | useState, useEffect, useContext |
| Browser APIs | localStorage, window |
| Third-party client libs | Libraries that depend on window |

## Best Practices

1. **Push `'use client'` to leaf components** - Don't mark entire pages as client
2. **Server fetches, Client renders** - Fetch data in Server Component, pass to Client
3. **Use children pattern** - Server can wrap Client which wraps Server via children
