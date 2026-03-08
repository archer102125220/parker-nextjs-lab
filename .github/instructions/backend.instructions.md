---
applyTo: "db/**/*"
---

# Backend ORM Best Practices (MANDATORY)

When implementing database operations, **always prioritize**:
1. **Official ORM patterns** - Use sequelize-cli official approach
2. **Community best practices** - Well-established community patterns
3. **Custom implementation** - Only if no official pattern exists

## ⚠️ Database Modification Confirmation (CRITICAL)

**Before ANY database schema change** (migrations, model changes, table alterations), you MUST:

1. **Ask the human developer**: "Is this project deployed to production?"
2. **Based on the answer**:
   - **Not deployed**: May modify existing migrations, then use `yarn initDB` or `yarn migrate:undo` + `yarn migrate`
   - **Deployed**: NEVER modify existing migrations; always create NEW migration files

This applies to:
- Creating new tables
- Adding/removing columns
- Changing column types or constraints
- Adding/removing indexes
- Any schema modifications

## Migrations & Seeders

- Use `sequelize-cli` via `yarn sequelize` or `yarn sequelize:ts`
- **IMPORTANT**: sequelize-cli generates `.js` files by default. Convert to `.ts` with proper type annotations
- Location: `db/migrations/`, `db/seeders/`
- Commands: `yarn migrate`, `yarn seed`, `yarn initDB`
- **Migration Modification Policy:**
  - **Early Development (Pre-production)**: 
    - Modify original migrations directly instead of creating new `addColumn` migrations
    - Add new columns to the original `createTable` migration
    - Run `yarn initDB` (or equivalent reset sequence) to apply changes
  - **Post-production**: Never modify executed migrations; create new migration files

## No Scripts for Code Refactoring (⚠️ CRITICAL)

**ABSOLUTELY FORBIDDEN: Using automated scripts (sed, awk, powershell, batch scripts) to modify code files.**

### Why
- Scripts only change text, they don't understand context or imports
- 2026-01-23 incident: `sed` changed `React.FormEvent` → `FormEvent` but forgot imports → compilation errors

### ✅ Allowed
- Use AI tools: `replace_file_content`, `multi_replace_file_content`
- MUST verify imports are correct after every change

### ❌ Forbidden
- `sed`, `awk`, `perl`, `powershell -Command`, `find ... -exec`
- Any batch text processing

### Exception
If absolutely necessary:
1. Get explicit human approval FIRST
2. Show complete script for review
3. Explain why manual tools can't do it

### Remember
**Scripts are blind. AI should be intelligent.**
