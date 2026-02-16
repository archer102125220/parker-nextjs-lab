---
name: Build Tools & Environment Check
description: Guidelines for using Webpack and checking environment configuration
---

# Build Tools & Environment Check

## 🎯 When to Use This Skill

Use this skill when:
- Starting development server
- Building for production
- Encountering SCSS `:export` errors
- **Getting Turbopack compatibility errors**
- Setting up new development environment

## 📋 Correct Commands

### Development

```bash
# ✅ CORRECT - Use Webpack
yarn dev:webpack        # HTTP on port 3000
yarn dev-https:webpack  # HTTPS on port 3443

# ❌ WRONG - Turbopack (incompatible with SCSS :export)
yarn dev                # Will fail with :export syntax
```

### Production

```bash
# ✅ CORRECT - Use Webpack
yarn build:webpack

# ❌ WRONG - Turbopack
yarn build              # Incompatible with :export
```

---

## 📋 Environment Check Workflow

### Before Starting Dev Server (MANDATORY)

**MUST check these 3 things**:

1. **`.env` file exists and is readable**
   - If `.env` is gitignored and unreadable → Ask user
   - If `.env` doesn't exist → Ask user

2. **`NEXT_PUBLIC_API_BASE` matches port in `package.json` script**
   - Example: `.env` has `http://localhost:3000` but script uses port `3001` → Mismatch

3. **`NEXT_PUBLIC_DOMAIN` matches domain in `package.json` script**
   - Example: `.env` has `localhost:3000` but script uses `localhost:3001` → Mismatch

**If mismatch OR .env is gitignored**:
```
AI: "I noticed a mismatch between .env and package.json:
     - .env: NEXT_PUBLIC_API_BASE=http://localhost:3000
     - package.json: yarn dev:webpack uses port 3001
     
     Should I proceed with the package.json configuration (port 3001)?"
```

**Wait for user confirmation before proceeding.**

---

## ✅ Correct Examples

### Example 1: Starting Dev Server (Full Workflow)

```bash
# Step 1: Check .env
cat .env | grep NEXT_PUBLIC_API_BASE
# Output: NEXT_PUBLIC_API_BASE=http://localhost:3000

# Step 2: Check package.json script
cat package.json | grep "dev:webpack"
# Output: "dev:webpack": "next dev --port 3000 --experimental-webpack"

# Step 3: Verify match
# ✅ Port 3000 matches → Proceed

# Step 4: Start server
yarn dev:webpack
```

---

### Example 2: Mismatch Detected

```bash
# Step 1: Check .env
cat .env | grep NEXT_PUBLIC_API_BASE
# Output: NEXT_PUBLIC_API_BASE=http://localhost:3000

# Step 2: Check package.json script
cat package.json | grep "dev:webpack"
# Output: "dev:webpack": "next dev --port 3001 --experimental-webpack"

# Step 3: Mismatch detected
# ❌ Port 3000 vs 3001 → Ask user

AI: "Mismatch detected:
     - .env: port 3000
     - package.json: port 3001
     
     Should I proceed with port 3001?"
```

---

### Example 3: .env is Gitignored

```bash
# Step 1: Try to read .env
cat .env
# Output: Permission denied OR File not found

# Step 2: Ask user
AI: ".env file is not readable (gitignored or missing).
     
     Should I proceed with the configuration in package.json?"
```

---

## ❌ Common Mistakes

### Mistake 1: Using Turbopack

```bash
# ❌ WRONG - Will fail with SCSS :export syntax
yarn dev

# Error:
# SyntaxError: Unexpected token ':export'
# This project uses SCSS :export which is incompatible with Turbopack

# ✅ CORRECT
yarn dev:webpack
```

---

### Mistake 2: Not Checking Environment

```bash
# ❌ WRONG - Starting server without checking .env
yarn dev:webpack
# Server starts on port 3001, but .env expects port 3000
# API calls will fail

# ✅ CORRECT - Check first
cat .env | grep NEXT_PUBLIC_API_BASE
cat package.json | grep "dev:webpack"
# Verify match, then start
yarn dev:webpack
```

---

### Mistake 3: Ignoring Port Mismatch

```bash
# ❌ WRONG - Proceeding despite mismatch
# .env: port 3000
# package.json: port 3001
yarn dev:webpack  # ❌ Will cause API errors

# ✅ CORRECT - Ask user first
AI: "Port mismatch detected. Should I proceed?"
```

---

## 📝 Checklist

### Before Starting Dev Server

- [ ] Using `yarn dev:webpack` or `yarn dev-https:webpack`
- [ ] Checked `.env` file exists and is readable
- [ ] Verified `NEXT_PUBLIC_API_BASE` matches port in `package.json`
- [ ] Verified `NEXT_PUBLIC_DOMAIN` matches domain in `package.json`
- [ ] Asked user for confirmation if mismatch detected

### Before Building for Production

- [ ] Using `yarn build:webpack`
- [ ] Verified environment variables are set
- [ ] Checked build configuration

---

## 💡 Pro Tips

### Tip 1: Why Webpack is Required

This project uses SCSS `:export` syntax to share variables between SCSS and TypeScript:

```scss
// styles/variables.scss
$primary-color: #1976d2;

:export {
  primaryColor: $primary-color;  // ✅ Webpack supports this
}
```

```typescript
// TypeScript
import variables from '@/styles/variables.scss';
console.log(variables.primaryColor);  // '#1976d2'
```

**Turbopack does NOT support `:export` syntax** → Must use Webpack.

---

### Tip 2: Environment Variable Naming

Next.js environment variables:
- `NEXT_PUBLIC_*` → Available in browser
- Other variables → Server-side only

```bash
# ✅ CORRECT - Browser-accessible
NEXT_PUBLIC_API_BASE=http://localhost:3000

# ✅ CORRECT - Server-only
DATABASE_URL=postgresql://...
```

---

### Tip 3: Port Configuration

Common ports used in this project:

| Command | Port | Protocol |
|---------|------|----------|
| `yarn dev:webpack` | 3000 | HTTP |
| `yarn dev-https:webpack` | 3443 | HTTPS |

Make sure `.env` matches:

```bash
# For HTTP (port 3000)
NEXT_PUBLIC_API_BASE=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000

# For HTTPS (port 3443)
NEXT_PUBLIC_API_BASE=https://localhost:3443
NEXT_PUBLIC_DOMAIN=localhost:3443
```

---

### Tip 4: Checking Environment Variables

```bash
# Check all NEXT_PUBLIC_ variables
cat .env | grep NEXT_PUBLIC_

# Check specific variable
cat .env | grep NEXT_PUBLIC_API_BASE

# Check package.json scripts
cat package.json | grep "dev:webpack"
cat package.json | grep "dev-https:webpack"
```

---

### Tip 5: Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Unexpected token ':export'` | Using Turbopack | Use `yarn dev:webpack` |
| `API call failed` | Port mismatch | Check `.env` vs `package.json` |
| `Cannot find module` | Missing dependencies | Run `yarn install` |
| `EADDRINUSE` | Port already in use | Kill process or use different port |

---

## 🔗 Related Rules

- `.agent/rules/build-tools.md`
- `GEMINI.md` - Build & Dev Tooling section
- `CLAUDE.md` - Build Tools section
