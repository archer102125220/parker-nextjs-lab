# Project Instructions

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

## Full Documentation
- English: [docs/guides/coding-standards.md](docs/guides/coding-standards.md)
- 繁體中文: [docs/guides/coding-standards.zh-tw.md](docs/guides/coding-standards.zh-tw.md)
- 問題排解: [docs/guides/troubleshooting.md](docs/guides/troubleshooting.md)

## 🛠️ Build & Dev Tooling (Webpack Required)
Due to SCSS `:export` syntax incompatibility with Turbopack, you MUST use the following scripts:
- **Dev**: `yarn dev:webpack` (HTTP) or `yarn dev-https:webpack` (HTTPS)
- **Build**: `yarn build:webpack`

**Do NOT use `yarn dev` or `yarn build` as they may attempt to use Turbopack or lack necessary configurations.**

**Environment Check**: When starting the development server, ALWAYS check if `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_DOMAIN` in `.env` match the port/domain settings in `package.json` scripts. If there is a mismatch (e.g., .env port 3000 vs script port 3001), you MUST wait for user confirmation before proceeding.
