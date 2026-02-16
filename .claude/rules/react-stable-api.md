
# React Stable API Policy (⚠️ CRITICAL)

## Rule

This project prioritizes **React Stable APIs**, **avoids experimental syntax**, and requires **proper hook selection** based on use case.

## ✅ Complete React 19 Stable Hooks List

### State Hooks
| Hook | Description |
|------|-------------|
| `useState` | Declare and update state variables |
| `useReducer` | Complex state logic (multiple sub-values or depends on previous state) |

### Context Hook
| Hook | Description |
|------|-------------|
| `useContext` | Subscribe to React Context, avoid prop drilling |

### Ref Hooks
| Hook | Description |
|------|-------------|
| `useRef` | Access DOM elements or store mutable values (no re-render) |
| `useImperativeHandle` | Customize ref value exposed to parent (with forwardRef) |

### Effect Hooks
| Hook | Description |
|------|-------------|
| `useEffect` | Side effects (after paint, asynchronous) |
| `useLayoutEffect` | Side effects (before paint, synchronous) |
| `useInsertionEffect` | CSS-in-JS libraries, fires before useLayoutEffect |
| `useEffectEvent` | Capture reactive values for effect, without triggering re-run |

### Performance Optimization Hooks
| Hook | Description |
|------|-------------|
| `useMemo` | Memoize calculated values |
| `useCallback` | Memoize function definitions |

### Scheduling Hooks
| Hook | Description |
|------|-------------|
| `useTransition` | Mark UI updates as "transitions", can be interrupted |
| `useDeferredValue` | Defer re-rendering of non-urgent UI |

### Other Hooks
| Hook | Description |
|------|-------------|
| `useId` | Generate stable unique IDs (SSR consistent) |
| `useSyncExternalStore` | Subscribe to external stores |
| `useDebugValue` | Custom label in DevTools |

### React 19 New Hooks (Stable)
| Hook | Description |
|------|-------------|
| `useActionState` | Simplify form action and submission state |
| `useFormStatus` | Access form's pending status |
| `useOptimistic` | Optimistic UI updates |
| `use` | Read Promise/Context (can be called conditionally) |

## ✅ Hook Selection Guidelines (MUST FOLLOW)

### Performance Optimization (REQUIRED when applicable)
| Scenario | Hook |
|----------|------|
| Expensive calculations | `useMemo` |
| Callback passed to child components | `useCallback` |
| Prevent unnecessary re-renders | `memo` |

### State Management
| Scenario | Hook |
|----------|------|
| Simple state | `useState` |
| Complex state logic | `useReducer` |
| Share state across components | `useContext` |
| Form action state (React 19) | `useActionState` |
| Optimistic updates | `useOptimistic` |

### Side Effects
| Scenario | Hook |
|----------|------|
| Data fetching, subscriptions, timers | `useEffect` |
| Visual rendering sync (prevent flicker) | `useLayoutEffect` |
| CSS-in-JS style injection | `useInsertionEffect` |
| Reactive events inside effects | `useEffectEvent` |

### Scheduling & Performance
| Scenario | Hook |
|----------|------|
| Non-blocking UI updates | `useTransition` |
| Defer non-urgent rendering | `useDeferredValue` |

### RTK vs useContext (When using Redux Toolkit)

| Use RTK for | Use useContext for |
|-------------|-------------------|
| Global app state (user, cart, notifications) | Theme Provider (MUI ThemeContext) |
| Cross-page shared data | Locale/i18n (next-intl) |
| Persisted state | Local component tree state |
| Complex async data (RTK Query) | Third-party Provider (React Query, SWR) |
| State needing DevTools debugging | Component library internal state (FormContext) |

**Quick Decision Rule:**
```
Need global, persistent, debuggable? → RTK
Only in local component tree / Provider-based? → useContext
```

## ❌ Anti-Patterns to Avoid

```tsx
// ❌ BAD: Creating new function on every render when passed to child
<ChildComponent onClick={() => handleClick(id)} />

// ✅ GOOD: Memoized callback
const memoizedClick = useCallback(() => handleClick(id), [id]);
<ChildComponent onClick={memoizedClick} />

// ❌ BAD: Recalculating on every render
const expensiveResult = items.filter(i => i.active).map(i => transform(i));

// ✅ GOOD: Memoized calculation
const expensiveResult = useMemo(
  () => items.filter(i => i.active).map(i => transform(i)),
  [items]
);

// ❌ BAD: Using useState for values that don't need re-render
const [timerIdState, setTimerId] = useState<number>();

// ✅ GOOD: Using useRef for mutable values
const timerIdRef = useRef<number>();
```

## ✅ React 19 New Hooks Examples

### useActionState - Form Action State
```tsx
// ✅ GOOD: Managing form submission state with useActionState
async function submitForm(prevState: FormState, formData: FormData) {
  const result = await saveData(formData);
  return { success: result.ok, message: result.message };
}

function MyForm() {
  const [state, formAction, isPending] = useActionState(submitForm, { success: false });
  
  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### useOptimistic - Optimistic UI Updates
```tsx
// ✅ GOOD: Optimistic update while waiting for server response
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  );
  
  async function addTodo(formData: FormData) {
    const newTodo = { id: Date.now(), text: formData.get('text') as string };
    addOptimisticTodo(newTodo); // Immediately show in UI
    await saveTodoToServer(newTodo); // Then save to server
  }
  
  return (
    <form action={addTodo}>
      {optimisticTodos.map(todo => (
        <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
          {todo.text}
        </li>
      ))}
    </form>
  );
}
```

### useTransition - Non-blocking UI Updates
```tsx
// ✅ GOOD: Keep UI responsive during expensive state updates
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // Urgent: update input immediately
    
    startTransition(() => {
      // Non-urgent: can be interrupted
      setResults(filterLargeDataset(value));
    });
  }
  
  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

## ❌ Avoid: Experimental Features

- React Compiler / React Forget (experimental)
- Any feature marked as "Canary" or "Experimental" in React docs
- Unstable APIs (prefixed with `unstable_`)


