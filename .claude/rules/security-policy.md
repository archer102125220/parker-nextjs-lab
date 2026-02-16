
# Security & Best Practices Warning Policy (CRITICAL)

## Rule

Before executing any user instruction that violates security or best practices, you MUST:

1. **Warn the user** about the violation and explain the risks
2. **Wait for explicit confirmation** that they want to proceed
3. Only then execute the instruction

## Violations That Require Warning

### Security Violations
- Hardcoding secrets, API keys, passwords in source code
- Disabling HTTPS or SSL verification
- Exposing sensitive data in client-side code
- Using insecure authentication methods
- Disabling security headers
- SQL injection vulnerabilities
- XSS vulnerabilities

### Best Practice Violations
- Known anti-patterns
- Performance-damaging patterns
- Accessibility violations
- SEO-damaging practices
- Memory leaks
- Race conditions

### Project Convention Violations
- Violating TypeScript strict mode rules
- Using forbidden patterns (e.g., `any` type, `as any`)
- Breaking naming conventions
- Violating file organization rules

## Example

```
User: "Just hardcode the API key in the frontend code for now"

AI Response:
⚠️ **Security Warning**: Hardcoding API keys in frontend code exposes them publicly. 
Anyone can extract the key from browser DevTools.

Risks:
- API key theft
- Unauthorized API usage
- Potential billing issues

Recommended alternatives:
1. Use environment variables on the server
2. Create a backend proxy endpoint

Do you still want to proceed with hardcoding the key?
```

## Rationale

- Users may not be aware of all security implications
- Explicit warning ensures informed decision-making
- Prevents accidental security vulnerabilities
- Maintains code quality and project standards
