# Frontend Testing Design Guide

This document explains how to design meaningful frontend tests and avoid the trap of "testing for the sake of testing".

## Testing Pyramid

```
      /\
     /  \  E2E Tests (few, high value)
    /────\  - Complete user flows
   /      \ - Browser interaction
  /────────\ Integration Tests (medium quantity)
 /          \ - Component interaction
/────────────\ - API integration
  Unit Tests (many, fast)
  - Pure functions
  - Utility functions
```

---

## What's Worth Testing?

### ✅ Worth Unit Testing

| Type | Reason | Example |
|------|--------|---------|
| **Pure functions** | Input→Output predictable | `formatAmount(1000)` → `'1,000'` |
| **Utility functions** | Core logic, used in many places | `checkPhone('0912345678')` → `true` |
| **Data transformations** | Error-prone conversion logic | Date formatting, amount calculations |
| **Validation logic** | Business rules | Form validation, permission checks |

### ⚠️ Test Cautiously (E2E might be better)

| Type | Reason |
|------|--------|
| **Component rendering** | Hard to simulate complete environment |
| **User interaction** | Requires browser environment |
| **DOM operations** | E2E is more accurate |

### ❌ Not Worth Unit Testing

| Type | Reason |
|------|--------|
| **Props existence** | Just documenting code |
| **Default values are correct** | Not verifying behavior |
| **CSS styles** | Should use visual regression testing |

---

## Good Tests vs Bad Tests

### ❌ Bad Test (testing for the sake of testing)

```typescript
// Just checking props exist, meaningless
it('should accept loading prop', () => {
  render(<LoadingBar loading={true} />);
  // No behavior verification
});
```

### ✅ Good Test (verifying behavior)

```typescript
// Verifying behavior: should show loading state when loading
it('should show loading animation when loading=true', () => {
  render(<LoadingBar loading={true} />);
  expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
});

it('should not show loading animation when loading=false', () => {
  render(<LoadingBar loading={false} />);
  expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();
});
```

---

## Pure Function Test Template

Pure functions are most suitable for unit testing because they:
- Same input → Same output
- No side effects
- Easy to understand and maintain

```typescript
// utils/amount-format.ts
export function formatAmount(value: number): string {
  return value.toLocaleString();
}

// __tests__/utils/amount-format.test.ts
describe('formatAmount', () => {
  // Normal cases
  it('should format integers', () => {
    expect(formatAmount(1000)).toBe('1,000');
    expect(formatAmount(1000000)).toBe('1,000,000');
  });

  // Edge cases
  it('should handle 0', () => {
    expect(formatAmount(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatAmount(-1000)).toBe('-1,000');
  });
});
```

---

## Component Behavior Test Template

Only test **observable behavior**, not internal implementation.

```typescript
describe('LoadingBar behavior tests', () => {
  // Test conditional rendering (this is behavior)
  describe('conditional display', () => {
    it('renders loading bar when loading=true', () => {
      render(<LoadingBar loading={true} />);
      expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
    });

    it('does not render when loading=false', () => {
      render(<LoadingBar loading={false} />);
      expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();
    });
  });

  // Test responsive updates (this is behavior)
  describe('dynamic updates', () => {
    it('should update display when loading changes', () => {
      const { rerender } = render(<LoadingBar loading={false} />);
      expect(screen.queryByTestId('loading-bar')).not.toBeInTheDocument();

      rerender(<LoadingBar loading={true} />);
      expect(screen.getByTestId('loading-bar')).toBeInTheDocument();
    });
  });
});
```

---

## E2E Test Template

For tests requiring a complete browser environment:

```typescript
// tests/e2e-go-top.spec.ts
import { test, expect } from '@playwright/test';

test.describe('GoTop button', () => {
  test('should show button after scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to page bottom
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Wait for button to appear
    await expect(page.locator('.go_top')).toBeVisible();
  });

  test('clicking button should scroll to top', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));
    
    await page.click('.go_top');
    
    // Verify scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});
```

---

## Test Design Checklist

Ask yourself before writing a test:

1. **What behavior does this test verify?**
   - If you can't answer, it might not be worth testing

2. **If the code has a bug, will this test fail?**
   - If not, the test has no value

3. **Will this test fail due to refactoring?**
   - If yes (but behavior hasn't changed), the test is too brittle

4. **Is there a better way to test this?**
   - Unit test vs Integration test vs E2E

---

## Summary

| Test Type | Use Case | Tools |
|-----------|----------|-------|
| **Unit Test** | Pure functions, utility functions | Jest |
| **Component Test** | Simple rendering logic | React Testing Library |
| **E2E Test** | User flows, interactions | Playwright |

**Remember: The purpose of testing is to catch bugs, not to achieve coverage metrics.**
