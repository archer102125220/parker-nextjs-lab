# Code Refactoring Safety - Examples

## Example 1: Refactoring Import Types

### ❌ WRONG Approach (Using Scripts)

```bash
# NEVER DO THIS - This is FORBIDDEN
find components -name "*.tsx" -exec sed -i 's/import { \(.*\), ReactNode }/import { \1, type ReactNode }/g' {} \;
```

**Problems**:
- Blind text replacement
- Might break multi-line imports
- Doesn't verify syntax
- Can't handle edge cases

### ✅ CORRECT Approach (Using AI Tools)

```typescript
// Step 1: Find all component files
const files = await find_by_name({
  SearchDirectory: "/path/to/components",
  Pattern: "*.tsx",
  Extensions: ["tsx"]
});

// Step 2: Search for import patterns
const imports = await grep_search({
  SearchPath: "/path/to/components",
  Query: "import.*ReactNode.*from 'react'",
  IsRegex: true,
  MatchPerLine: true
});

// Step 3: Review each file individually
for (const file of imports) {
  const content = await view_file({
    AbsolutePath: file.path
  });
  
  // Step 4: Make informed replacement
  await replace_file_content({
    TargetFile: file.path,
    TargetContent: "import { useState, ReactNode } from 'react';",
    ReplacementContent: "import { useState, type ReactNode } from 'react';",
    StartLine: file.lineNumber,
    EndLine: file.lineNumber,
    AllowMultiple: false
  });
}
```

---

## Example 2: Batch Component Refactoring

### Task: Convert multiple useState to useReducer

### ❌ WRONG Approach

```bash
# FORBIDDEN - Scripts cannot understand component logic
awk '/useState/ { ... }' components/*.tsx
```

### ✅ CORRECT Approach

1. **Analyze each component individually**
   ```typescript
   view_file({ AbsolutePath: "/path/to/Component.tsx" })
   ```

2. **Understand the state relationships**
   - Identify related state variables
   - Plan reducer structure

3. **Refactor with context awareness**
   ```typescript
   multi_replace_file_content({
     TargetFile: "/path/to/Component.tsx",
     ReplacementChunks: [
       {
         TargetContent: "const [state1, setState1] = useState(...);\nconst [state2, setState2] = useState(...);",
         ReplacementContent: "const [state, dispatch] = useReducer(reducer, initialState);",
         StartLine: 10,
         EndLine: 11
       },
       // ... more chunks
     ]
   })
   ```

---

## Example 3: Fixing Linting Issues Across Files

### ❌ WRONG Approach

```bash
# FORBIDDEN
find . -name "*.ts" -exec sed -i 's/any/unknown/g' {} \;
```

### ✅ CORRECT Approach

1. **Identify specific lint errors**
   ```bash
   yarn lint
   ```

2. **Use grep to find occurrences**
   ```typescript
   grep_search({
     SearchPath: "./src",
     Query: ": any",
     MatchPerLine: true
   })
   ```

3. **Fix each occurrence with proper type**
   ```typescript
   replace_file_content({
     TargetFile: "/path/to/file.ts",
     TargetContent: "function foo(param: any)",
     ReplacementContent: "function foo(param: unknown)",
     // Verify the change makes sense in context
   })
   ```

---

## Key Principles

1. **Always understand context before changing**
2. **Verify imports after modifications**
3. **Run tests after each batch**
4. **Document changes in commit messages**
5. **Never use scripts for code refactoring**
