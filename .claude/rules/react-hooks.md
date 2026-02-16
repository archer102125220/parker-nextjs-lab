
# React Hooks Usage Guidelines

## useLayoutEffect vs useEffect

### When to use `useLayoutEffect`

Use `useLayoutEffect` when synchronizing external props to internal state that affects **visual rendering**:

```tsx
// ✅ CORRECT: Prevents visual flickering for visual state sync
useLayoutEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);
```

**Use cases:**
- Slider/Swiper position sync
- Animation state initialization
- DOM measurements before paint
- Any state sync that affects layout/position

### When to use `useEffect`

Use `useEffect` for side effects that don't directly affect visual rendering:

```tsx
// ✅ CORRECT: For non-visual side effects
useEffect(() => {
  fetchData();
  subscribeToEvents();
}, [dependencies]);
```

**Use cases:**
- Data fetching
- Event subscriptions
- Timers and intervals
- Analytics tracking
- Logging

## Key Differences

| Aspect | `useEffect` | `useLayoutEffect` |
|--------|-------------|-------------------|
| Timing | After browser paint | Before browser paint |
| Execution | Asynchronous | Synchronous |
| Blocks UI | No | Yes |
| SSR | Safe | Warning in SSR (use in client components) |

## Warning

`useLayoutEffect` runs synchronously and blocks the browser from painting. Avoid heavy computations in `useLayoutEffect` to prevent UI jank.
