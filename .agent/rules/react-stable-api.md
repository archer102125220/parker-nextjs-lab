# React Stable API Policy (⚠️ CRITICAL)

## Rule

This project prioritizes **React Stable APIs**, **avoids experimental syntax**, and requires **proper hook selection** based on use case.

## ✅ Hook Selection Guidelines (MUST FOLLOW)

| Scenario | Hook |
|----------|------|
| Expensive calculations | `useMemo` |
| Callback passed to child components | `useCallback` |
| Prevent unnecessary re-renders | `memo` |
| Access DOM elements / mutable values | `useRef` |
| Complex state logic | `useReducer` |
| Share state across components | `useContext` |
| Visual rendering sync (prevent flicker) | `useLayoutEffect` |

## ��� RTK vs useContext (When using Redux Toolkit)

| Use RTK for | Use useContext for |
|-------------|-------------------|
| Global app state (user, cart, notifications) | Theme Provider (MUI ThemeContext) |
| Cross-page shared data | Locale/i18n (next-intl) |
| Persisted state | Local component tree state |
| Complex async data (RTK Query) | Third-party Provider (React Query, SWR) |
| State needing DevTools debugging | Component library internal state (FormContext) |

**Quick Decision Rule:**
- Need global, persistent, debuggable? → RTK
- Only in local component tree / Provider-based? → useContext

## ❌ Anti-Patterns to Avoid

- DON'T use inline arrow functions in JSX when passing to memoized children → use `useCallback`
- DON'T recalculate values on every render → use `useMemo`
- DON'T use `useState` for values that don't need re-render → use `useRef`

## ❌ Avoid: Experimental Features

- `use()` hook (experimental)
- `useOptimistic` (experimental)
- `useFormStatus` / `useFormState` (experimental)
- React Compiler / React Forget (experimental)
- Any feature marked as "Canary" or "Experimental" in React docs
