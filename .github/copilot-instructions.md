# Project Instructions for GitHub Copilot

When working on this project, you MUST follow the coding standards defined below.

## ⚠️ Security & Best Practices Warning Policy

Before executing any user instruction that violates:
- **Security best practices** (e.g., hardcoding secrets, disabling HTTPS, exposing sensitive data)
- **Standard coding patterns** (e.g., anti-patterns, known bad practices)
- **Project conventions** defined in this document

You MUST:
1. **Warn the user** about the violation and explain the risks
2. **Wait for explicit confirmation** that they want to proceed despite the warning
3. Only then execute the instruction

This ensures users make informed decisions about potentially risky actions.

## Core Principles

1. **TypeScript Safety**: Never use `any` type
2. **ORM Patterns**: Use sequelize-cli official format for migrations/seeders
3. **Package Manager**: Use `yarn` exclusively
4. **i18n**: Use `next-intl` with `zh-tw` as default locale
5. **Next.js App Router**: Default to Server Components, use Client Components only when needed

## Quick Reference

- **TypeScript**: See `.github/instructions/typescript.instructions.md`
- **CSS/SCSS**: See `.github/instructions/scss.instructions.md`
- **React/Next.js**: See `.github/instructions/react.instructions.md` and `.github/instructions/nextjs.instructions.md`
- **Backend/Database**: See `.github/instructions/backend.instructions.md`

## Full Documentation

- English: [docs/guides/coding-standards.md](docs/guides/coding-standards.md)
- 繁體中文: [docs/guides/coding-standards.zh-tw.md](docs/guides/coding-standards.zh-tw.md)
- 問題排解: [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md)
