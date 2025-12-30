# React Hooks Best Practices

## Next.js Dynamic Import (⚠️ CRITICAL)
- ✅ `dynamic(() => import(...))` - Default, SSR enabled
- ❌ `dynamic(() => import(...), { ssr: false })` - AVOID unless absolutely necessary
- Only use `{ ssr: false }` when third-party lib cannot run in Node.js
- Misuse causes: build failure, SEO damage, performance issues

## useLayoutEffect vs useEffect
- Use `useLayoutEffect` when syncing props to state that affects **visual rendering** (sliders, position)
- Use `useEffect` for data fetching, subscriptions, timers
- `useLayoutEffect` runs synchronously before browser paint - avoid heavy computations
