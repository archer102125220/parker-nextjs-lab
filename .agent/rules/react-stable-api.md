---
trigger: always_on
---

# React Stable API Policy (⚠️ CRITICAL)

## Rule

This project prioritizes **React Stable APIs**, **avoids experimental syntax**, and requires **proper hook selection**.

## ✅ Complete React 19 Stable Hooks

| Category | Hooks |
|----------|-------|
| State | `useState`, `useReducer` |
| Context | `useContext` |
| Ref | `useRef`, `useImperativeHandle` |
| Effect | `useEffect`, `useLayoutEffect`, `useInsertionEffect` |
| Performance | `useMemo`, `useCallback` |
| Scheduling | `useTransition`, `useDeferredValue` |
| Other | `useId`, `useSyncExternalStore`, `useDebugValue` |
| React 19 New | `useActionState`, `useFormStatus`, `useOptimistic`, `use` |

## ✅ Hook Selection Guidelines

| Scenario | Hook |
|----------|------|
| Expensive calculations | `useMemo` |
| Callbacks passed to children | `useCallback` |
| Prevent unnecessary re-renders | `memo` |
| Access DOM / mutable values | `useRef` |
| Complex state logic | `useReducer` |
| Share state across components | `useContext` |
| Visual sync (prevent flicker) | `useLayoutEffect` |
| Form action state (React 19) | `useActionState` |
| Optimistic updates (React 19) | `useOptimistic` |
| Non-blocking UI updates | `useTransition` |

## 📦 RTK vs useContext (When using Redux Toolkit)

| Use RTK for | Use useContext for |
|-------------|-------------------|
| Global app state (user, cart, notifications) | Theme Provider (MUI ThemeContext) |
| Cross-page shared data | Locale/i18n (next-intl) |
| Persisted state | Local component tree state |
| Complex async data (RTK Query) | Third-party Provider (React Query, SWR) |
| State needing DevTools debugging | Component library internal state (FormContext) |

## ❌ Anti-Patterns to Avoid

- DON'T use inline arrow functions in JSX when passing to memoized children - use `useCallback`
- DON'T recalculate values on every render - use `useMemo`
- DON'T use `useState` for values that don't need re-render - use `useRef`

## ❌ Avoid: Experimental Features

- React Compiler / React Forget (experimental)
- Any feature marked as "Canary" or "Experimental" in React docs
- Unstable APIs (prefixed with `unstable_`)
