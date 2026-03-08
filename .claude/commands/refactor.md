# Refactor Code

Refactor existing code to improve quality, maintainability, and follow project standards.

## Usage

Use this command when you need to:
- Improve code structure without changing functionality
- Apply project coding standards
- Optimize performance
- Remove code smells

## Template

Please refactor the following code:

**Target**: [Specify file, function, or component]

**Goals**:
- [ ] Improve readability
- [ ] Follow TypeScript best practices (no `any`, use precise types)
- [ ] Apply Modified BEM naming (if CSS/SCSS)
- [ ] Optimize performance (use `useMemo`, `useCallback` if needed)
- [ ] Add proper error handling
- [ ] Improve type safety

**Constraints**:
- ✅ Maintain existing functionality
- ✅ Keep backward compatibility
- ✅ Follow project coding standards
- ❌ Do NOT use automated scripts (`sed`, `awk`)
- ❌ Do NOT add lint disable comments without permission

**Context**:
[Provide any additional context about the code]

## Example

```
Please refactor the following code:

**Target**: components/UserProfile/index.tsx

**Goals**:
- [x] Convert from any types to precise types
- [x] Extract complex logic into custom hooks
- [x] Apply useCallback for event handlers
- [x] Improve error handling

**Constraints**:
- Keep existing props interface
- Maintain current UI behavior
```

## Related Skills

- [Code Refactoring Safety](.agent/skills/code-refactoring-safety/SKILL.md)
- [React Hooks Selection](.agent/skills/react-hooks-selection/SKILL.md)
- [TypeScript Standards](docs/guides/coding-standards.md#typescript-standards)
