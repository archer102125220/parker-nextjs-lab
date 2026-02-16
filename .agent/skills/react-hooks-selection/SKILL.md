---
name: React Hooks Selection Guide
description: Decision tree and best practices for choosing the right React 19 hooks
---

# React Hooks Selection Guide

## 🎯 When to Use This Skill

Use this skill when:
- Choosing between multiple useState vs useReducer
- Deciding when to use useMemo vs useCallback
- Refactoring useEffect to useEffectEvent
- Implementing form handling with useActionState
- Optimizing performance with proper hook selection
- **Confused about which hook to use for a specific scenario**
- Refactoring components with too many useState calls
- Experiencing performance issues due to unnecessary re-renders

## 📋 Hook Selection Decision Tree

### State Management

#### Question 1: How many related state variables do you have?

**1-2 simple, independent states** → `useState`
```typescript
// ✅ CORRECT - Simple independent states
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

**3-4 related states** → Consider `useReducer`
```typescript
// 🟡 CONSIDER - Multiple related states
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Data | null>(null);

// ✅ BETTER - Use useReducer
type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: string };
```

**5+ related states** → **Definitely use `useReducer`**
```typescript
// ❌ WRONG - Too many related states
const [isOpen, setIsOpen] = useState(false);
const [isDragging, setIsDragging] = useState(false);
const [startX, setStartX] = useState(0);
const [currentX, setCurrentX] = useState(0);
const [offset, setOffset] = useState(0);

// ✅ CORRECT - Use useReducer
const [state, dispatch] = useReducer(drawerReducer, initialState);
```

#### Question 2: Is the state derived from props/other state?

**Yes** → `useMemo` (not useState)
```typescript
// ❌ WRONG - Using useState for derived state
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);

// ✅ CORRECT - Use useMemo
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);
```

**No** → `useState` or `useReducer`

---

### Effect Management

#### Question 1: Does the effect depend on a callback/function?

**Yes, and callback changes often** → `useEffectEvent`
```typescript
// ❌ WRONG - Callback in dependencies causes re-subscription
useEffect(() => {
  const handler = () => onMessage(data);
  socket.on('message', handler);
  return () => socket.off('message', handler);
}, [onMessage, data]);  // Re-subscribes on every change

// ✅ CORRECT - Use useEffectEvent
const handleMessage = useEffectEvent(() => {
  onMessage(data);  // Always uses latest values
});

useEffect(() => {
  socket.on('message', handleMessage);
  return () => socket.off('message', handleMessage);
}, []);  // Clean dependencies
```

**No** → Regular `useEffect`

#### Question 2: Does the effect affect visual rendering?

**Yes** (layout, position, size) → `useLayoutEffect`
```typescript
// ✅ CORRECT - Prevents flicker during slider transitions
useLayoutEffect(() => {
  setSliderIndex(externalValue);
}, [externalValue]);
```

**No** (data fetching, subscriptions) → `useEffect`
```typescript
// ✅ CORRECT - Non-visual side effects
useEffect(() => {
  fetchData();
}, [dependencies]);
```

---

### Performance Optimization

#### Question 1: Is this an expensive calculation?

**How to determine if it's expensive:**
- Array operations on large datasets (>1000 items)
- Complex filtering/sorting/mapping
- Recursive calculations
- Heavy string operations

**Yes** → `useMemo`
```typescript
// ✅ CORRECT - Expensive calculation
const sortedAndFilteredItems = useMemo(() => {
  return items
    .filter(item => item.category === category)
    .map(item => ({ ...item, formatted: formatItem(item) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}, [items, category]);
```

**No** → Don't memoize (premature optimization)
```typescript
// ✅ CORRECT - Simple calculation, no memoization needed
const fullName = `${firstName} ${lastName}`;
```

#### Question 2: Is this callback passed to memoized children?

**Yes** → `useCallback`
```typescript
// ✅ CORRECT - Callback passed to memoized child
const MemoizedChild = memo(Child);

function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}
```

**No** → Don't memoize
```typescript
// ✅ CORRECT - No memoization needed
function Parent() {
  const handleClick = () => console.log('clicked');
  return <div onClick={handleClick}>Click me</div>;
}
```

---

### Form Handling (React 19)

**Traditional approach** → `useState` + `useEffect`
**React 19 approach** → `useActionState`

```typescript
// ✅ CORRECT - React 19 form handling
const [state, formAction] = useActionState(async (prevState, formData) => {
  const email = formData.get('email');
  const result = await submitForm(email);
  return result;
}, { status: 'idle' });

return (
  <form action={formAction}>
    <input name="email" />
    <button type="submit">Submit</button>
    {state.error && <p>{state.error}</p>}
  </form>
);
```

---

## ✅ Correct Examples

### Example 1: useState → useReducer (Complex State)

**Before** (5+ related states):
```typescript
function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [offset, setOffset] = useState(0);
  
  const handleDragStart = (e: MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };
  
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
    setOffset(e.clientX - startX);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    if (offset > 100) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setOffset(0);
  };
}
```

**After** (useReducer):
```typescript
type State = {
  isOpen: boolean;
  isDragging: boolean;
  startX: number;
  currentX: number;
  offset: number;
};

type Action =
  | { type: 'START_DRAG'; payload: { x: number } }
  | { type: 'DRAG'; payload: { x: number } }
  | { type: 'END_DRAG' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

function drawerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        isDragging: true,
        startX: action.payload.x,
        currentX: action.payload.x,
      };
    case 'DRAG':
      return {
        ...state,
        currentX: action.payload.x,
        offset: action.payload.x - state.startX,
      };
    case 'END_DRAG':
      const shouldOpen = state.offset > 100;
      return {
        ...state,
        isDragging: false,
        isOpen: shouldOpen,
        offset: 0,
      };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

function Drawer() {
  const [state, dispatch] = useReducer(drawerReducer, {
    isOpen: false,
    isDragging: false,
    startX: 0,
    currentX: 0,
    offset: 0,
  });
  
  const handleDragStart = (e: MouseEvent) => {
    dispatch({ type: 'START_DRAG', payload: { x: e.clientX } });
  };
  
  const handleDrag = (e: MouseEvent) => {
    if (!state.isDragging) return;
    dispatch({ type: 'DRAG', payload: { x: e.clientX } });
  };
  
  const handleDragEnd = () => {
    dispatch({ type: 'END_DRAG' });
  };
}
```

**Benefits**:
- ✅ All related state in one place
- ✅ State transitions are explicit
- ✅ Easier to test (pure reducer function)
- ✅ Better for complex state logic

---

### Example 2: useEffect → useEffectEvent (Callback Dependencies)

**Before** (callback in dependencies):
```typescript
function Chat({ roomId, onMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const socket = connectToRoom(roomId);
    
    const handleMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      onMessage(msg);  // ❌ Causes re-subscription when onMessage changes
    };
    
    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [roomId, onMessage]);  // ❌ Re-subscribes when onMessage changes
}
```

**After** (useEffectEvent):
```typescript
function Chat({ roomId, onMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleMessage = useEffectEvent((msg: Message) => {
    setMessages(prev => [...prev, msg]);
    onMessage(msg);  // ✅ Always uses latest onMessage
  });
  
  useEffect(() => {
    const socket = connectToRoom(roomId);
    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [roomId]);  // ✅ Clean dependencies
}
```

**Benefits**:
- ✅ No unnecessary re-subscriptions
- ✅ Always uses latest callback
- ✅ Clean dependency array

---

### Example 3: Expensive Calculation → useMemo

```typescript
function ProductList({ products, category, searchTerm }: Props) {
  // ✅ CORRECT - Memoize expensive calculation
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering and sorting...');  // Only logs when dependencies change
    
    return products
      .filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .map(product => ({
        ...product,
        formattedPrice: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(product.price),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, category, searchTerm]);
  
  return (
    <div>
      {filteredAndSortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### Example 4: Callback to Memoized Children → useCallback

```typescript
const MemoizedProductCard = memo(ProductCard);

function ProductList({ products }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // ✅ CORRECT - useCallback for memoized children
  const handleToggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <MemoizedProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.has(product.id)}
          onToggleFavorite={handleToggleFavorite}  // ✅ Stable reference
        />
      ))}
    </div>
  );
}
```

---

## ❌ Common Mistakes

### Mistake 1: Using useState for Derived State

```typescript
// ❌ WRONG
function ProductList({ products, category }: Props) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    setFilteredProducts(products.filter(p => p.category === category));
  }, [products, category]);
  
  return <div>{/* ... */}</div>;
}

// ✅ CORRECT
function ProductList({ products, category }: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === category);
  }, [products, category]);
  
  return <div>{/* ... */}</div>;
}
```

**Why wrong**: Derived state causes unnecessary re-renders and complexity.

---

### Mistake 2: Overusing useMemo/useCallback

```typescript
// ❌ WRONG - Premature optimization
function Component() {
  const value = useMemo(() => 1 + 1, []);  // ❌ Overkill
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // ❌ Not passed to memoized children
  
  return <div onClick={handleClick}>{value}</div>;
}

// ✅ CORRECT - No unnecessary memoization
function Component() {
  const value = 1 + 1;
  const handleClick = () => console.log('clicked');
  
  return <div onClick={handleClick}>{value}</div>;
}
```

**Why wrong**: Adds complexity without performance benefit.

---

### Mistake 3: Using useEffect for Synchronization

```typescript
// ❌ WRONG - Using useEffect to sync props to state
function Slider({ value }: Props) {
  const [internalValue, setInternalValue] = useState(value);
  
  useEffect(() => {
    setInternalValue(value);
  }, [value]);  // ❌ Causes extra render
}

// ✅ CORRECT - Use useLayoutEffect for visual sync
function Slider({ value }: Props) {
  const [internalValue, setInternalValue] = useState(value);
  
  useLayoutEffect(() => {
    setInternalValue(value);
  }, [value]);  // ✅ Synchronous, no flicker
}
```

**Why wrong**: `useEffect` runs after paint, causing visual flicker.

---

### Mistake 4: Too Many useState Calls

```typescript
// ❌ WRONG - Too many related states
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Complex logic managing all these states...
}

// ✅ CORRECT - Use useReducer
type FormState = {
  name: string;
  email: string;
  status: 'idle' | 'submitting' | 'success' | 'error';
  error: string | null;
};

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  // Simpler logic with actions
}
```

---

## 📝 Checklist

### Before Choosing a Hook

- [ ] Counted number of related state variables (1-2 → useState, 5+ → useReducer)
- [ ] Identified if state is derived from props/other state (use useMemo)
- [ ] Checked if effect depends on callbacks (consider useEffectEvent)
- [ ] Determined if calculation is expensive (profile first)
- [ ] Verified if callback is passed to memoized children (use useCallback)

### When Refactoring

- [ ] Identified the problem (too many re-renders, complex state logic, etc.)
- [ ] Chosen appropriate hook based on decision tree
- [ ] Tested before and after performance (use React DevTools Profiler)
- [ ] Verified no regressions in functionality
- [ ] Updated tests if necessary

### Performance Optimization

- [ ] Profiled before optimizing (don't guess)
- [ ] Used React DevTools Profiler to identify bottlenecks
- [ ] Measured impact of optimization
- [ ] Avoided premature optimization

## � Pro Tips

### Tip 1: Profile Before Optimizing

Don't guess about performance. Use React DevTools Profiler:
```typescript
// 1. Open React DevTools → Profiler
// 2. Click "Record"
// 3. Interact with your app
// 4. Stop recording
// 5. Analyze which components re-render unnecessarily
```

### Tip 2: useReducer for Complex State Logic

If you find yourself writing complex state update logic, it's time for useReducer:
```typescript
// 🟡 SIGNAL - Complex state updates
setIsLoading(true);
setError(null);
try {
  const data = await fetch();
  setData(data);
  setIsLoading(false);
} catch (err) {
  setError(err.message);
  setIsLoading(false);
}

// ✅ BETTER - Single dispatch
dispatch({ type: 'FETCH_START' });
try {
  const data = await fetch();
  dispatch({ type: 'FETCH_SUCCESS', payload: data });
} catch (err) {
  dispatch({ type: 'FETCH_ERROR', payload: err.message });
}
```

### Tip 3: useEffectEvent for Stable Event Handlers

When you need the latest values but don't want to re-run the effect:
```typescript
const logVisit = useEffectEvent((url: string) => {
  analytics.log(url, user);  // Always uses latest user
});

useEffect(() => {
  logVisit(window.location.href);
}, []);  // ✅ Runs once, but uses latest user
```

### Tip 4: Combine Hooks Wisely

```typescript
// ✅ GOOD - Combining useReducer + useEffectEvent
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const handleServerEvent = useEffectEvent((data) => {
    dispatch({ type: 'SERVER_UPDATE', payload: data });
  });
  
  useEffect(() => {
    socket.on('update', handleServerEvent);
    return () => socket.off('update', handleServerEvent);
  }, []);
}
```

## �🔗 Related Rules

- `.agent/rules/react-stable-api.md`
- `.cursor/rules/react-stable-api.mdc`
- `GEMINI.md` - React Stable API Policy section
- `CLAUDE.md` - React Stable API Policy section

---

## 🔍 Deep Check Checklist

### Quick Reference for Component Review

When reviewing React components, use this checklist to ensure you perform **deep checks**, not just basic checks.

#### 1. Props → State Synchronization
```typescript
// 🔍 Search Pattern
useEffect(() => {
  setState(props.xxx);
}, [props.xxx]);

// ✅ Should be
const value = useMemo(() => props.xxx, [props.xxx]);
// or use props.xxx directly
```

#### 2. External State Subscription
```typescript
// 🔍 Search Pattern
useEffect(() => {
  window.addEventListener('event', handler);
  return () => window.removeEventListener('event', handler);
}, []);

// ✅ Should be
useSyncExternalStore(subscribe, getSnapshot);
// or use existing hooks like useWindowSize
```

#### 3. Multiple Related States
```typescript
// 🔍 Search Pattern: 5+ useState in same component
const [state1, setState1] = useState(...);
const [state2, setState2] = useState(...);
const [state3, setState3] = useState(...);
const [state4, setState4] = useState(...);
const [state5, setState5] = useState(...);

// ✅ Should be
const [state, dispatch] = useReducer(reducer, initialState);
```

#### 4. Uncached Calculations
```typescript
// 🔍 Search Pattern: calculations in render
const result = array.filter(...).map(...);
const isActive = pathname.startsWith('/xxx');

// ✅ Should be
const result = useMemo(() => array.filter(...).map(...), [array]);
const isActive = useMemo(() => pathname.startsWith('/xxx'), [pathname]);
```

#### 5. Effect with Callback Dependencies
```typescript
// 🔍 Search Pattern
const callbackRef = useRef(callback);
useEffect(() => {
  callbackRef.current = callback;
}, [callback]);

// ✅ Should be (React 19)
const onEvent = useEffectEvent(() => {
  callback();
});
```

#### 6. Visual Synchronization
```typescript
// 🔍 Search Pattern: syncing visual state
useEffect(() => {
  setInternalValue(externalValue);
}, [externalValue]);

// ✅ Should be
useLayoutEffect(() => {
  setInternalValue(externalValue);
}, [externalValue]);
```

#### 7. Callback to Memoized Children
```typescript
// 🔍 Search Pattern: inline functions to memo components
const MemoChild = memo(Child);
<MemoChild onClick={() => doSomething()} />

// ✅ Should be
const handleClick = useCallback(() => doSomething(), []);
<MemoChild onClick={handleClick} />
```

#### 8. Non-Render Values
```typescript
// 🔍 Search Pattern: state that doesn't trigger re-render
const [timerId, setTimerId] = useState<number | null>(null);

// ✅ Should be
const timerIdRef = useRef<number | null>(null);
```

### Automated Search Commands

Use these grep patterns to find potential issues:

```bash
# Find useEffect syncing props to state
grep -n "useEffect.*setState" components/**/*.tsx

# Find addEventListener in useEffect
grep -n "addEventListener" components/**/*.tsx

# Find components with many useState
grep -c "useState" components/**/*.tsx | grep ":[5-9]"

# Find uncached startsWith/includes
grep -n "\.startsWith\|\.includes" components/**/*.tsx
```

### Deep Check Workflow

1. **Read the component** - Understand overall structure
2. **Count useState calls** - 5+ → consider useReducer
3. **Check useEffect** - Look for props → state sync
4. **Check calculations** - Look for uncached operations
5. **Check callbacks** - Verify useCallback for memoized children
6. **Document findings** - List all optimization opportunities

### When to Skip Deep Checks

- Simple presentational components (< 50 lines)
- Components with only 1-2 useState
- Components with no useEffect
- Demo/test components

For all other components, **deep checks are mandatory**.
