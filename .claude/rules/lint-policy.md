
# Lint Disable Policy (CRITICAL)

## Rule

**NEVER** add any lint suppression comments without **explicit user instruction**.

This includes but is not limited to:
- `// eslint-disable-next-line`
- `// eslint-disable`
- `// @ts-ignore`
- `// @ts-expect-error`
- `// @ts-nocheck`
- Any similar suppression mechanisms

## Required Workflow

When encountering lint warnings or errors:

1. **Report** the warning/error to the user
2. **Wait** for user's explicit instruction to add a disable comment
3. **Only then** add the disable comment with proper justification

## Rationale

- Lint warnings often indicate real issues that should be addressed
- Suppressing lints without user awareness can hide bugs
- Users should make informed decisions about what to suppress
- This ensures code quality and prevents silent failures

## Example

```tsx
// ❌ WRONG: Adding disable without asking
// eslint-disable-next-line
someProblematicCode();

// ✅ CORRECT: Report to user first, then add with justification after explicit approval
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Approved by user: required for API compatibility
const _unusedParam = value;
```
