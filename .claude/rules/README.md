# Claude Rules

This directory contains rules for Claude AI to ensure consistent code generation following project standards.

## Purpose

These rules are designed to work with:
- **Claude Desktop** - Via `.claude/rules/` directory
- **VS Code Claude Extension** - Automatically detects rules in this directory
- **Claude Code** - Agentic coding assistant

## Synchronization with Cursor Rules

The rules in this directory are synchronized with `.cursor/rules/*.mdc` to ensure consistency across different AI assistants.

### Current Status

✅ **Synchronized**: Rules are kept in sync with Cursor rules
📍 **Source of Truth**: `.cursor/rules/*.mdc`
🔄 **Sync Method**: Manual synchronization (see below)

## Available Rules

All rules from `.cursor/rules/` are available here in Markdown format:

1. `backend-orm.md` - Backend ORM best practices (Sequelize)
2. `build-tools.md` - Build tools configuration (Webpack)
3. `coding-standards.md` - General coding standards
4. `css-naming.md` - CSS/SCSS naming convention (Modified BEM)
5. `css-property-order.md` - CSS property ordering
6. `file-organization.md` - File organization and style reuse
7. `i18n.md` - Internationalization (next-intl 4.x)
8. `inline-styles.md` - Inline styles policy
9. `lint-policy.md` - Lint error handling
10. `next-dynamic-import.md` - Next.js dynamic import
11. `no-scripts.md` - Code refactoring safety
12. `react-hooks.md` - React hooks selection
13. `react-stable-api.md` - React stable API policy
14. `runtime-data-validation.md` - Runtime data validation
15. `security-policy.md` - Security best practices
16. `server-client-components.md` - Server vs Client components
17. `typescript.md` - TypeScript standards

## How to Use

### For Claude Desktop / Claude Code

Rules in this directory are automatically loaded by Claude when working on this project.

### For VS Code

The VS Code Claude extension automatically detects and uses rules from `.claude/rules/`.

## Synchronization Guide

When updating rules, follow this process:

### 1. Update Source (Cursor Rules)

Edit the rule in `.cursor/rules/*.mdc`:

```markdown
---
description: Rule description
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Rule Content
```

### 2. Sync to Claude Rules

Convert the `.mdc` file to `.md` format by:
1. Removing the frontmatter (YAML section)
2. Keeping the Markdown content
3. Saving to `.claude/rules/[same-name].md`

### 3. Automated Sync (Future)

We plan to create a script to automate this synchronization:

```bash
# Future command
yarn sync-rules
```

## Rule Format

### Cursor Format (.mdc)
```markdown
---
description: Brief description
globs: ["file patterns"]
alwaysApply: true/false
---

# Rule Content (Markdown)
```

### Claude Format (.md)
```markdown
# Rule Content (Markdown)

Same content as Cursor, without frontmatter
```

## Related Documentation

- **Skills System**: `.agent/skills/*/SKILL.md` - Detailed task-specific guides
- **Coding Standards**: `docs/guides/coding-standards.md` - Complete coding standards
- **Cursor Rules**: `.cursor/rules/*.mdc` - Source of truth for rules
- **GitHub Copilot**: `.github/copilot-instructions.md` - Copilot instructions

## Notes

- **Keep in Sync**: Always update both `.cursor/rules/` and `.claude/rules/` when making changes
- **Source of Truth**: `.cursor/rules/*.mdc` is the primary source
- **Format Difference**: Only difference is the YAML frontmatter
- **Content Identical**: Rule content should be identical across both directories
