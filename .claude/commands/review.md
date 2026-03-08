# Code Review

Perform comprehensive code review following project standards.

## Usage

Use this command when you need to:
- Review pull requests
- Check code quality
- Identify potential issues
- Ensure coding standards compliance
- Suggest improvements

## Template

Please review the following code:

**Target**: [Specify file(s), PR, or commit]

**Review Focus**:
- [ ] Code quality and readability
- [ ] TypeScript type safety (no `any`)
- [ ] Performance optimization
- [ ] Security vulnerabilities
- [ ] Accessibility (a11y)
- [ ] Coding standards compliance
- [ ] Test coverage
- [ ] Documentation

**Project Standards Checklist**:
- [ ] TypeScript: No `any`, use precise types
- [ ] CSS/SCSS: Modified BEM naming (hyphen vs underscore)
- [ ] React: Server Components by default
- [ ] i18n: `setRequestLocale` before `getTranslations`
- [ ] Build: Using Webpack (not Turbopack)
- [ ] Lint: No disable comments without justification
- [ ] Database: Proper migration workflow

**Output Format**:
- List issues by severity (Critical, High, Medium, Low)
- Provide specific line numbers
- Suggest concrete improvements
- Include code examples for fixes

## Example

```
Please review the following code:

**Target**: components/Dashboard/index.tsx

**Review Focus**:
- [x] TypeScript type safety
- [x] Performance (useMemo, useCallback)
- [x] Accessibility
- [x] Coding standards

**Specific Concerns**:
- Check if Server Component is appropriate
- Verify SCSS naming follows Modified BEM
- Ensure proper error handling
```

## Review Output Format

```markdown
## Code Review Summary

### Critical Issues (Must Fix)
1. **[Line X]** Issue description
   - **Problem**: Detailed explanation
   - **Fix**: Suggested solution with code example

### High Priority
2. **[Line Y]** Issue description
   - **Problem**: Detailed explanation
   - **Fix**: Suggested solution

### Medium Priority
3. **[Line Z]** Issue description
   - **Suggestion**: Improvement recommendation

### Low Priority / Nice to Have
4. **[Line W]** Issue description
   - **Suggestion**: Optional enhancement

### Positive Observations
- Well-structured code
- Good test coverage
- Clear documentation
```

## Common Review Points

### TypeScript
- ❌ Using `any` type
- ❌ Missing type annotations
- ❌ Unsafe type assertions (`as any`)
- ✅ Using precise types
- ✅ Proper generics usage

### React
- ❌ Client Component when Server would work
- ❌ Missing `useCallback` for memoized children
- ❌ Expensive calculations without `useMemo`
- ✅ Proper hook selection
- ✅ Correct component type

### CSS/SCSS
- ❌ Double underscore `__` or double hyphen `--`
- ❌ Multiple classNames on element
- ❌ Incorrect hyphen/underscore usage
- ✅ Modified BEM naming
- ✅ Unique class names

### Performance
- ❌ Unnecessary re-renders
- ❌ Missing memoization
- ❌ Large bundle size
- ✅ Optimized rendering
- ✅ Code splitting

### Security
- ❌ Hardcoded secrets
- ❌ XSS vulnerabilities
- ❌ Unsafe user input handling
- ✅ Proper sanitization
- ✅ Secure API calls

## Related Skills

- [Lint Policy](.agent/skills/lint-policy/SKILL.md)
- [Code Refactoring Safety](.agent/skills/code-refactoring-safety/SKILL.md)
- [Coding Standards](docs/guides/coding-standards.md)
