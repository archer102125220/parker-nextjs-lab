# Generate Tests

Generate comprehensive test cases for components, functions, or modules.

## Usage

Use this command when you need to:
- Create unit tests for new code
- Add missing test coverage
- Generate integration tests
- Create E2E tests with Playwright

## Template

Please generate tests for:

**Target**: [Specify file, function, or component]

**Test Type**:
- [ ] Unit tests (Jest)
- [ ] Integration tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)

**Coverage Goals**:
- [ ] Happy path scenarios
- [ ] Edge cases
- [ ] Error handling
- [ ] Accessibility (a11y)
- [ ] Internationalization (i18n)

**Test Framework**:
- Jest + React Testing Library (for components)
- Jest (for utilities/hooks)
- Playwright (for E2E)

**Requirements**:
- ✅ Use TypeScript
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Include descriptive test names
- ✅ Mock external dependencies
- ✅ Test error states
- ✅ Aim for 80%+ coverage

## Example

```
Please generate tests for:

**Target**: hooks/useLocalStorage.ts

**Test Type**:
- [x] Unit tests (Jest)

**Coverage Goals**:
- [x] Happy path (get, set, remove)
- [x] Edge cases (invalid JSON, quota exceeded)
- [x] Error handling (localStorage unavailable)

**Requirements**:
- Test SSR compatibility (window undefined)
- Mock localStorage API
- Test TypeScript types
```

## Test Structure

```typescript
describe('ComponentName', () => {
  // Arrange
  beforeEach(() => {
    // Setup
  });

  // Act & Assert
  it('should handle happy path', () => {
    // Test implementation
  });

  it('should handle edge case', () => {
    // Test implementation
  });

  it('should handle errors gracefully', () => {
    // Test implementation
  });
});
```

## Related Skills

- [React Hooks Selection](.agent/skills/react-hooks-selection/SKILL.md)
- [Server vs Client Components](.agent/skills/server-client-components/SKILL.md)
