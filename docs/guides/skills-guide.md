# Skills Guide

## What are Skills?

**Skills** are detailed, task-specific guides that complement the coding standards. While **Rules** provide concise core standards, **Skills** offer comprehensive guidance with decision trees, extensive examples, and practical checklists for complex scenarios.

### Skills vs Rules

| Aspect | Rules | Skills |
|--------|-------|--------|
| **Purpose** | Core standards and principles | Detailed task-specific guidance |
| **Length** | Concise (1-2 pages) | Comprehensive (3-10 pages) |
| **Examples** | Minimal | Extensive with real-world cases |
| **When to use** | Always (foundational) | Specific complex scenarios |
| **Format** | Quick reference | Step-by-step workflows |

---

## Available Skills

### 🔴 High Priority Skills

These skills address the most common and critical scenarios:

#### 1. [CSS/SCSS Naming Convention](.agent/skills/css-naming-convention/SKILL.md)

**When to use**: Creating components, reviewing CSS, confused about hyphen vs underscore

**Key features**:
- Decision tree for hyphen `-` vs underscore `_`
- HTML attribute state management
- 20+ real-world examples
- Common mistakes and fixes

**Quick reference**:
- Hierarchy (sub-element) → Hyphen: `.card-header`
- Multi-word concept → Underscore: `.scroll_area`
- States → HTML attributes: `css-is-active="true"`

---

#### 2. [Database Migration Workflow](.agent/skills/database-migration-workflow/SKILL.md)

**When to use**: Before ANY database schema change

**Key features**:
- Critical decision tree (production vs development)
- Step-by-step migration workflows
- Breaking change strategies
- Rollback planning

**Critical rule**: Always ask "Is this project deployed to production?" before modifying migrations.

---

#### 3. [Code Refactoring Safety](.agent/skills/code-refactoring-safety/SKILL.md)

**When to use**: Batch code modifications, refactoring tasks

**Key features**:
- Prohibition of automated scripts (sed, awk, etc.)
- AI-powered tool workflows
- Import verification strategies
- Real incident examples

**Critical rule**: NEVER use scripts for code refactoring. Use AI tools (`replace_file_content`, `multi_replace_file_content`).

---

### 🟡 Medium Priority Skills

These skills help with architectural and optimization decisions:

#### 4. [React Hooks Selection Guide](.agent/skills/react-hooks-selection/SKILL.md)

**When to use**: Choosing hooks, refactoring components, optimizing performance

**Key features**:
- Hook selection decision tree
- useState → useReducer refactoring
- useEffect → useEffectEvent patterns
- Performance optimization guidelines

**Quick reference**:
- 5+ related states → `useReducer`
- Expensive calculation → `useMemo`
- Callback to memoized children → `useCallback`

---

#### 5. [Server vs Client Components](.agent/skills/server-client-components/SKILL.md)

**When to use**: Creating pages, deciding on `'use client'`, optimizing bundle size

**Key features**:
- Server vs Client decision tree
- Children pattern examples
- Common mistakes (entire page as client)
- Performance implications

**Quick reference**: Default to Server Components. Use Client only for interactivity, hooks, or browser APIs.

---

#### 6. [File Organization & Style Reuse](.agent/skills/file-organization/SKILL.md)

**When to use**: Deciding between placeholder and component, organizing project structure

**Key features**:
- Placeholder vs Component decision tree
- Single-page vs multi-page reuse strategies
- Directory structure best practices

**Quick reference**:
- Single page reuse → Placeholder (`%name`)
- Multi-page reuse → Component or global placeholder

---

### 🟢 Low Priority Skills

These skills address specific technical requirements:

#### 7. [Lint Policy & Error Handling](.agent/skills/lint-policy/SKILL.md)

**When to use**: Encountering lint errors, deciding on disable comments

**Critical rule**: NEVER add `eslint-disable` comments without explicit user instruction.

---

#### 8. [i18n Implementation Pattern](.agent/skills/i18n-implementation/SKILL.md)

**When to use**: Creating pages with i18n, fixing i18n errors

**Critical pattern**: Always call `setRequestLocale(locale)` before `getTranslations` in Server Components.

---

#### 9. [Build Tools & Environment Check](.agent/skills/build-tools/SKILL.md)

**When to use**: Starting dev server, building for production

**Critical rule**: Always use Webpack (`yarn dev:webpack`, `yarn build:webpack`). Turbopack is incompatible with SCSS `:export`.

---

## How to Use Skills

### For AI Agents

1. **Skills are automatically loaded** at conversation start
2. **Reference skills** when encountering complex scenarios mentioned in skill descriptions
3. **Use decision trees** for systematic decision-making
4. **Follow checklists** to ensure nothing is missed

**Example workflow**:
```
User: "Add a new field to the users table"
AI: [Checks Database Migration Workflow Skill]
AI: "Is this project deployed to production?"
User: "Yes"
AI: [Follows production workflow - creates NEW migration]
```

### For Developers

1. **Read skills before starting complex tasks**
2. **Use checklists during code review**
3. **Reference examples when unsure**
4. **Share skills with team members**

**Example workflow**:
- Before creating a new component → Read CSS Naming Convention Skill
- Before database changes → Read Database Migration Workflow Skill
- Before refactoring → Read Code Refactoring Safety Skill

---

## Skill Structure

Each skill follows this structure:

### 🎯 When to Use This Skill
Clear scenarios when the skill applies

### 📋 Decision Tree / Workflow
Step-by-step decision-making process

### ✅ Correct Examples
Real-world examples from the project

### ❌ Common Mistakes
Anti-patterns with explanations

### 📝 Checklist
Before/during/after task checklist

### 🔗 Related Rules
Links to related rule files

---

## Quick Reference: When to Use Which Skill

| Scenario | Skill |
|----------|-------|
| Creating new component styles | CSS/SCSS Naming Convention |
| Database schema changes | Database Migration Workflow |
| Batch code refactoring | Code Refactoring Safety |
| Choosing React hooks | React Hooks Selection Guide |
| Deciding on 'use client' | Server vs Client Components |
| Reusing styles | File Organization & Style Reuse |
| Lint errors | Lint Policy & Error Handling |
| i18n implementation | i18n Implementation Pattern |
| Starting dev server | Build Tools & Environment Check |

---

## Contributing to Skills

### When to Create a New Skill

Create a new skill when:
1. **Complex decision-making** is required
2. **Multiple steps** are involved
3. **Common mistakes** are frequently made
4. **Real-world examples** would be helpful

### Skill Format

```markdown
---
name: [Skill Name]
description: [One-line description]
---

# [Skill Name]

## 🎯 When to Use This Skill
[Specific scenarios]

## 📋 Decision Tree / Workflow
[Step-by-step guide]

## ✅ Correct Examples
[Multiple examples]

## ❌ Common Mistakes
[Anti-patterns with explanations]

## 📝 Checklist
[Before/during/after checklist]

## 🔗 Related Rules
[Links to rule files]
```

---

## Related Documentation

- [Coding Standards](./coding-standards.md) - Core coding standards and rules
- [Coding Standards (繁體中文)](./coding-standards.zh-tw.md) - 核心編碼標準與規則
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
