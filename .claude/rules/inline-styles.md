
# Inline Styles Rules

## Allowed Inline Styles

✅ **MUI `sx` prop** - Official Material-UI styling
```tsx
<Box sx={{ padding: 2, marginBottom: 3 }}>
```

✅ **CSS Variable passing**
```tsx
<div style={{ '--editor_height': `${height}px` }}>
```

✅ **Third-party requirements** (e.g., GTM)
```tsx
<noscript style={{ display: 'none', visibility: 'hidden' }}>
```

## Forbidden Inline Styles

❌ **Static values** - Use CSS classes
```tsx
// ❌ WRONG
<div style={{ padding: '20px', marginBottom: '16px' }}>

// ✅ CORRECT
<div className={style.my_element}>
```

❌ **Dynamic calculations** - Use CSS variable passing
```tsx
// ❌ WRONG
<div style={{ height: `${containerHeight}px` }}>

// ✅ CORRECT
<div style={{ '--container_height': `${containerHeight}px` }}>
// Then in CSS: height: var(--container_height);
```

❌ **Conditional styles** - Use CSS attribute selectors
```tsx
// ❌ WRONG
<div style={{ color: isActive ? 'red' : 'gray' }}>

// ✅ CORRECT
<div css-is-active={isActive ? 'true' : 'false'}>
// Then in CSS: &[css-is-active='true'] { color: red; }
```

❌ **Repeated patterns** - Extract as placeholders
