---
name: Code Refactoring Safety
description: Enforces safe code refactoring practices by prohibiting automated scripts and requiring AI-powered tools for all code modifications
---

# Code Refactoring Safety Skill

## 🚨 CRITICAL RULE: NO SCRIPTS FOR CODE REFACTORING

**ABSOLUTELY FORBIDDEN**: Using automated scripts (sed, awk, perl, powershell, batch scripts, find...exec) to modify code files.

### Why Scripts Are Prohibited

Scripts only perform blind text replacement without understanding:
- **Context**: They don't understand code structure or semantics
- **Imports**: They can't verify or update import statements
- **Types**: They can't validate TypeScript types
- **Dependencies**: They can't track cross-file dependencies

### Historical Incident (2026-01-23)

A `sed` command changed `React.FormEvent` → `FormEvent` but forgot to add the import statement, causing compilation errors. This demonstrates why scripts are dangerous for code refactoring.

---

## ✅ ALLOWED: AI-Powered Tools

### For Code Modifications

Use ONLY these AI tools for modifying code:

1. **`replace_file_content`** - Single contiguous block replacement
   - Validates syntax
   - Understands context
   - Can update imports

2. **`multi_replace_file_content`** - Multiple non-contiguous replacements
   - Handles multiple changes in one file
   - Maintains code integrity

3. **`write_to_file`** - Create new files
   - For new components/modules
   - With proper structure

### For Code Analysis

Use these tools to understand code before modifying:

1. **`grep_search`** - Search for patterns
   - Find all occurrences
   - Understand usage patterns

2. **`find_by_name`** - Locate files
   - List all relevant files
   - Plan modifications

3. **`view_file`** - Read file contents
   - Understand context
   - Verify changes

4. **`view_code_item`** - View specific functions/classes
   - Focused analysis
   - Understand dependencies

---

## 🔄 Correct Workflow for Batch Refactoring

### ❌ WRONG: Using Scripts

```bash
# NEVER DO THIS
find . -name "*.tsx" -exec sed -i 's/ReactNode/type ReactNode/g' {} \;
```

### ✅ CORRECT: Using AI Tools

```typescript
// Step 1: Find all files
find_by_name({
  SearchDirectory: "/path/to/components",
  Pattern: "*.tsx",
  Extensions: ["tsx"]
})

// Step 2: Search for specific patterns
grep_search({
  SearchPath: "/path/to/components",
  Query: "import.*ReactNode.*from 'react'",
  IsRegex: true,
  MatchPerLine: true
})

// Step 3: Review each file
view_file({
  AbsolutePath: "/path/to/component.tsx"
})

// Step 4: Make informed changes
replace_file_content({
  TargetFile: "/path/to/component.tsx",
  TargetContent: "import { useState, ReactNode } from 'react';",
  ReplacementContent: "import { useState, type ReactNode } from 'react';",
  // ... other parameters
})
```

---

## 📋 Checklist Before Any Batch Refactoring

Before performing any batch code refactoring, verify:

- [ ] I am NOT using sed, awk, perl, or any text processing scripts
- [ ] I am NOT using find...exec to modify files
- [ ] I am NOT using powershell -Command for text replacement
- [ ] I AM using `grep_search` to find patterns
- [ ] I AM using `find_by_name` to locate files
- [ ] I AM using `replace_file_content` or `multi_replace_file_content` for changes
- [ ] I WILL verify imports are correct after each change
- [ ] I WILL run tests after modifications

---

## 🎯 When This Skill Applies

Use this skill whenever you need to:

1. **Refactor multiple files** with similar changes
2. **Update import statements** across the codebase
3. **Rename variables/functions** in multiple locations
4. **Convert code patterns** (e.g., useState → useReducer)
5. **Fix linting issues** across multiple files
6. **Update TypeScript types** in multiple components

---

## 🛡️ Exception Handling

### When Scripts Might Seem Necessary

If you think a script is necessary because:
- "There are too many files to change manually"
  → Use AI tools in a loop, they're still safer
- "The pattern is simple and repetitive"
  → Simple patterns can still break imports/types
- "It will save time"
  → Fixing broken code takes more time

### Absolutely No Exceptions

There are **NO valid exceptions** to this rule. If you believe a script is absolutely necessary:

1. **Stop immediately**
2. **Get explicit human approval FIRST**
3. **Show the complete script for review**
4. **Explain why AI tools cannot do it**
5. **Wait for confirmation before proceeding**

---

## 📝 Reporting Violations

If you accidentally use a script or are tempted to:

1. **Acknowledge the mistake immediately**
2. **Explain what happened**
3. **Propose the correct AI-tool approach**
4. **Document in `docs/in-progress/simplified-implementations.md`**

---

## 🎓 Remember

**Scripts are blind. AI should be intelligent.**

Every code modification should be:
- **Context-aware**: Understanding the code structure
- **Type-safe**: Validating TypeScript types
- **Import-aware**: Updating imports as needed
- **Testable**: Verifiable through automated tests

Use your AI capabilities to make smart, informed changes, not blind text replacements.
