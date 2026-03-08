# AI Agents Configuration Guide

This guide explains how AI assistants are configured in this project to ensure consistent code generation across different tools.

---

## Overview

This project provides comprehensive configuration for four major AI assistants:

| AI Assistant | Configuration Type | Files | Status |
|--------------|-------------------|-------|--------|
| **Cursor** | Rules | `.cursor/rules/*.mdc` (17 files) | ✅ Complete |
| **GitHub Copilot** | Rules + Skills | `.github/copilot-instructions.md`<br>`.github/instructions/*.instructions.md` (5 files) | ✅ Complete |
| **Claude** | Rules + Commands | `.claude/rules/*.md` (18 files)<br>`.claude/commands/*.md` (6 files) | ✅ Complete |
| **Gemini** | Skills | `.agent/skills/*/SKILL.md` (9 files) | ✅ Complete |

---

## Configuration Architecture

### Rules vs Skills

**Rules** (Global Standards):
- Concise, project-wide coding standards
- Applied to all files or specific file types
- Quick reference for common patterns

**Skills** (Task-Specific Guides):
- Detailed guides for complex scenarios
- Include decision trees, examples, and checklists
- Step-by-step workflows

---

## 1. Cursor AI

### Configuration Files

**Location**: `.cursor/rules/`

**Format**: `.mdc` (Markdown Configuration)

**Structure**:
```markdown
---
description: Brief description
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Rule Content (Markdown)
```

### Available Rules (17 files)

1. `typescript.mdc` - TypeScript type safety
2. `css-naming.mdc` - Modified BEM naming convention
3. `react-hooks.mdc` - React hooks selection
4. `server-client-components.mdc` - Component type decisions
5. `i18n.mdc` - Internationalization (next-intl 4.x)
6. `build-tools.mdc` - Webpack configuration
7. `lint-policy.mdc` - Lint error handling
8. `no-scripts.mdc` - Code refactoring safety
9. `file-organization.mdc` - File organization and style reuse
10. `css-property-order.mdc` - CSS property ordering
11. `inline-styles.mdc` - Inline styles policy
12. `runtime-data-validation.mdc` - Runtime data validation
13. `security-policy.mdc` - Security best practices
14. `backend-orm.mdc` - Backend ORM (Sequelize)
15. `next-dynamic-import.mdc` - Next.js dynamic import
16. `react-stable-api.mdc` - React stable API policy
17. `coding-standards.mdc` - General coding standards

### Usage

Rules are automatically applied by Cursor based on:
- File glob patterns (`globs` in frontmatter)
- `alwaysApply` flag
- AI's relevance detection

---

## 2. GitHub Copilot

### Configuration Files

#### Repository-wide Instructions
**File**: `.github/copilot-instructions.md`

**Purpose**: Global rules applied to all files

**Content** (300+ lines):
- Project overview and tech stack
- TypeScript standards
- CSS/SCSS Modified BEM naming
- React best practices
- Internationalization patterns
- Build tools requirements
- Architecture patterns
- Database migration workflow
- Security requirements
- Skills system reference

#### Path-Specific Instructions
**Directory**: `.github/instructions/`

**Format**: `NAME.instructions.md` with `applyTo` frontmatter

**Available Files** (5 files):

1. **typescript.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{ts,tsx,js,jsx}"
   ---
   ```
   - TypeScript type safety rules
   - Runtime data validation
   - Lint disable policy

2. **react.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{tsx,jsx}"
   ---
   ```
   - React 19 stable hooks
   - Hook selection guidelines
   - Anti-patterns to avoid
   - RTK vs useContext

3. **scss.instructions.md**
   ```markdown
   ---
   applyTo: "**/*.{scss,css}"
   ---
   ```
   - Modified BEM naming convention
   - CSS property order
   - File organization
   - Style reuse strategy

4. **nextjs.instructions.md**
   - Next.js App Router patterns
   - Server vs Client components
   - i18n implementation

5. **backend.instructions.md**
   - Database migration workflow
   - Sequelize ORM patterns
   - API best practices

### Usage

- **Global rules**: Automatically applied to all Copilot requests
- **Path-specific rules**: Applied when working on matching file types
- **Combination**: Both global and path-specific rules are combined

---

## 3. Claude AI

### Configuration Files

#### Main Instructions
**File**: `CLAUDE.md`

**Purpose**: Project-level instructions for Claude

#### Custom Commands
**Directory**: `.claude/commands/`

**Purpose**: Reusable slash commands for common tasks

**Available Commands** (6 files):

1. **refactor.md** - Code refactoring
   - Improve code structure
   - Apply coding standards
   - Optimize performance

2. **test.md** - Test generation
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

3. **docs.md** - Documentation generation
   - JSDoc/TSDoc comments
   - README files
   - API documentation

4. **review.md** - Code review
   - Quality checks
   - Standards compliance
   - Security review

5. **migrate.md** - Database migration
   - Create migrations
   - Production vs development workflow
   - Rollback planning

6. **component.md** - Component generation
   - Server/Client component selection
   - SCSS modules
   - TypeScript types

**Usage**:
```
/refactor components/UserCard/index.tsx
/test hooks/useLocalStorage.ts
/docs components/ImageUpload/
```

#### Rules
**Directory**: `.claude/rules/`

**Purpose**: Synchronized with Cursor rules for consistency

**Files** (18 files):
- `README.md` - Synchronization guide
- 17 rule files (converted from `.cursor/rules/*.mdc`)

**Synchronization**:
- Source of truth: `.cursor/rules/*.mdc`
- Conversion: Remove YAML frontmatter, keep Markdown content
- Sync script: `/tmp/convert-rules.sh`

---

## 4. Gemini (Antigravity Agent)

### Configuration Files

#### Main Instructions
**File**: `GEMINI.md`

**Purpose**: Project-level instructions for Gemini

#### Skills System
**Directory**: `.agent/skills/`

**Purpose**: Detailed task-specific guides

**Available Skills** (9 files, 3,601 lines):

1. **CSS/SCSS Naming Convention** (308 lines)
   - Hyphen vs underscore decision tree
   - Modified BEM naming
   - 20+ real-world examples

2. **Database Migration Workflow** (350 lines)
   - Production vs development workflows
   - Critical decision tree
   - Rollback strategies

3. **Code Refactoring Safety** (183 lines)
   - Prohibition of automated scripts
   - AI-assisted refactoring workflow
   - 2026-01-23 incident analysis

4. **React Hooks Selection** (655 lines)
   - Complete hook selection decision tree
   - useState → useReducer refactoring
   - React 19 new hooks
   - Performance optimization

5. **Server vs Client Components** (625 lines)
   - Component type decision tree
   - Children pattern examples
   - Bundle size optimization

6. **File Organization & Style Reuse** (519 lines)
   - Placeholder vs component decision
   - Directory structure
   - Style reuse strategies

7. **Lint Policy & Error Handling** (323 lines)
   - Fix vs suppress decision tree
   - Common lint errors
   - Temporary vs permanent suppression

8. **i18n Implementation** (345 lines)
   - next-intl 4.x patterns
   - setRequestLocale requirement
   - Multiple namespaces

9. **Build Tools & Environment Check** (293 lines)
   - Webpack vs Turbopack
   - Environment check workflow
   - Port configuration

**Skill Structure**:
```markdown
---
name: Skill Name
description: One-line description
---

# Skill Name

## 🎯 When to Use This Skill
## 📋 Decision Tree / Workflow
## ✅ Correct Examples
## ❌ Common Mistakes
## 📝 Checklist
## 💡 Pro Tips
## 🔗 Related Rules
```

---

## Synchronization Strategy

### Current Approach

**Source of Truth**: `.cursor/rules/*.mdc`

**Synchronization Targets**:
1. `.claude/rules/*.md` - Automated conversion
2. `.github/copilot-instructions.md` - Manual sync
3. `GEMINI.md` - Manual sync
4. `CLAUDE.md` - Manual sync

### Synchronization Workflow

1. **Update Source**: Edit `.cursor/rules/*.mdc`
2. **Sync Claude Rules**: Run conversion script
   ```bash
   /tmp/convert-rules.sh
   ```
3. **Update Global Instructions**: Manually sync changes to:
   - `.github/copilot-instructions.md`
   - `GEMINI.md`
   - `CLAUDE.md`
4. **Verify**: Test with each AI assistant

### Future Automation

Planned: `yarn sync-rules` command to automate synchronization

---

## Usage Guidelines

### For Developers

**When to use each AI**:
- **Cursor**: General coding with inline suggestions
- **GitHub Copilot**: Code completion and chat
- **Claude**: Complex refactoring, reviews, migrations
- **Gemini**: Task planning, architecture decisions

**Consistency**: All AIs follow the same coding standards

### For AI Agents

**Priority Order**:
1. Check relevant Skills for detailed guidance
2. Follow Rules for general standards
3. Refer to main instructions (GEMINI.md, CLAUDE.md)
4. Ask user if uncertain

---

## Maintenance

### Adding New Rules

1. Create rule in `.cursor/rules/[name].mdc`
2. Run sync script for Claude
3. Update global instructions if needed
4. Document in this guide

### Adding New Skills

1. Create skill in `.agent/skills/[name]/SKILL.md`
2. Follow skill template structure
3. Add to Skills Guide
4. Reference in relevant rules

### Updating Existing Rules

1. Update source file (`.cursor/rules/*.mdc`)
2. Sync to other AI configurations
3. Test with all AI assistants
4. Update documentation

---

## Quick Reference

### File Locations

```
parker-nextjs-lab/
├── .agent/
│   └── skills/              # Gemini Skills (9 files)
├── .cursor/
│   └── rules/               # Cursor Rules (17 files)
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/        # Copilot path-specific (5 files)
├── .claude/
│   ├── commands/            # Claude commands (6 files)
│   └── rules/               # Claude rules (18 files)
├── GEMINI.md                # Gemini main instructions
└── CLAUDE.md                # Claude main instructions
```

### Total Configuration

- **Files**: 60+ configuration files
- **Lines**: ~10,000+ lines of documentation
- **Coverage**: 100% for all major AI assistants

---

## Related Documentation

- [Skills Guide](./skills-guide.md) - Detailed Skills documentation
- [Coding Standards](./coding-standards.md) - Complete coding standards
- [AI Agents Walkthrough](../../.gemini/antigravity/brain/.../ai-agents-walkthrough.md) - Implementation details

---

## Troubleshooting

### AI not following rules

1. Check if rule file exists
2. Verify glob patterns (for Cursor)
3. Check `applyTo` frontmatter (for Copilot)
4. Restart AI assistant
5. Clear AI cache if available

### Rules conflict

1. Check priority order
2. Verify synchronization
3. Update conflicting rules
4. Document resolution

### Missing configuration

1. Check this guide for file locations
2. Verify files exist
3. Run sync script if needed
4. Create missing files following templates

---

## Contributing

When adding or updating AI configurations:

1. Follow existing file structure
2. Maintain consistency across all AIs
3. Update this guide
4. Test with all AI assistants
5. Document changes in commit message
