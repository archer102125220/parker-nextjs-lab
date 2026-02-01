---
applyTo: "**/*.{tsx,jsx}"
---

# React Stable API Policy (⚠️ CRITICAL)

**Prioritize React Stable APIs**, **avoid experimental syntax**, and **use proper hook selection**

## ✅ React 19 Stable Hooks

`useState`, `useReducer`, `useContext`, `useRef`, `useImperativeHandle`, `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useEffectEvent`, `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`, `useId`, `useSyncExternalStore`, `useDebugValue`, `useActionState`, `useFormStatus`, `useOptimistic`, `use`

## Hook Selection Guidelines

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

## ❌ Avoid

- React Compiler/Forget (experimental)
- Any "Canary" or "Experimental" features
- `unstable_` prefixed APIs

## ⚠️ Anti-patterns

- DON'T use inline arrow functions in JSX when passing to memoized children → use `useCallback`
- DON'T recalculate values on every render → use `useMemo`
- DON'T use `useState` for values that don't need re-render → use `useRef`

## 📦 RTK vs useContext (when using Redux Toolkit)

- **Use RTK**: Global app state, cross-page data, persisted state, RTK Query, state needing DevTools
- **Use useContext**: Theme/i18n Provider, local component tree state, third-party Provider (React Query, SWR)

## useLayoutEffect vs useEffect

- Use `useLayoutEffect` when syncing props to state that affects **visual rendering** (sliders, position)
- Use `useEffect` for data fetching, subscriptions, timers
- `useLayoutEffect` runs synchronously before browser paint - avoid heavy computations

## Demo Components (`components/Demo/`)

- Full-page Client Components for feature demonstrations
- Naming: PascalCase (e.g., `BannerDemo.tsx`, `LazyLoadTest.tsx`)
- Rules:
  - Full-page content → `components/Demo/[PageName].tsx`
  - Multiple sub-components → `components/[PageName]/` folder
