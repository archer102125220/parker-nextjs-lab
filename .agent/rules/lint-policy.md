# Lint Disable Comments (⚠️ CRITICAL)

- **NEVER** add `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or similar comments without **explicit user instruction**
- When encountering lint warnings/errors:
  1. Report the warning to the user
  2. Wait for user's explicit instruction to add a disable comment
  3. Only then add the disable comment with proper justification
- This applies to ALL lint suppression mechanisms
