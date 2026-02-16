---
description: Standardized workflow for React Hooks deep check
---

# React Hooks Deep Check Workflow

This workflow provides a step-by-step process for performing comprehensive React Hooks checks on components.

---

## 🎯 When to Use

Use this workflow when:
- User asks to "check" or "review" React components
- Performing React Hooks refactoring
- Conducting code quality audits
- User explicitly mentions "React Hooks"

---

## 📋 Workflow Steps

### Step 1: Identify Target Components

**Action**: Determine which components to check

**Commands**:
```bash
# List all component files
find components -name "*.tsx" -type f

# Or use specific directory
find components/Layout -name "*.tsx" -type f
```

**Output**: List of component file paths

---

### Step 2: Read Component Structure

**Action**: Read each component to understand structure

**Tools**: `view_file` or `view_file_outline`

**What to look for**:
- Number of useState calls
- Number of useEffect calls
- Component complexity (lines of code)
- Presence of useMemo/useCallback

---

### Step 3: Perform Basic Check

**Action**: Check basic hook usage

**Checklist**:
- [ ] Import type syntax correct (`import { useState, type ReactNode }`)
- [ ] useCallback used for callbacks to memoized children
- [ ] useMemo used for expensive calculations

**Tools**: `grep_search` for import statements

```typescript
grep_search({
  SearchPath: "components/[ComponentName].tsx",
  Query: "import.*from 'react'",
  MatchPerLine: true
});
```

---

### Step 4: Perform Deep Check

**Action**: Check for 8 common anti-patterns

#### 4.1 Props → State Sync
```typescript
grep_search({
  SearchPath: "components",
  Query: "useEffect.*setState",
  IsRegex: true,
  MatchPerLine: true
});
```

#### 4.2 External Subscription
```typescript
grep_search({
  SearchPath: "components",
  Query: "addEventListener",
  MatchPerLine: true
});
```

#### 4.3 Multiple Related States
**Manual check**: Count useState calls in each component

#### 4.4 Uncached Calculations
```typescript
grep_search({
  SearchPath: "components",
  Query: "\\.startsWith\\|\\.includes\\|\\.filter\\|\\.map",
  IsRegex: true,
  MatchPerLine: true
});
```

#### 4.5 Callback Dependencies
```typescript
grep_search({
  SearchPath: "components",
  Query: "callbackRef\\.current",
  MatchPerLine: true
});
```

#### 4.6 Visual Sync
**Manual check**: Look for useEffect syncing visual state

#### 4.7 Memoized Children
**Manual check**: Look for inline functions to memo components

#### 4.8 Non-Render Values
**Manual check**: Look for useState with timer IDs or previous values

---

### Step 5: Document Findings

**Action**: Create structured report

**Template**:
```markdown
# React Hooks Check Report

**Date**: [YYYY-MM-DD]
**Components Checked**: [N]

## Summary

- Total issues: [N]
- High priority: [N]
- Medium priority: [N]

## Detailed Findings

### [Component Name]

**File**: [path]

#### Issues:
1. **Props → State Sync** (🔴 High)
   - Line [N]: useEffect syncing nonce prop
   - Recommendation: Use useMemo

2. **Uncached Calculations** (🟡 Medium)
   - Line [N]: pathname.startsWith recalculated every render
   - Recommendation: Use useMemo

#### Recommendations:
- [Specific code changes]
```

---

### Step 6: Update Tracking Documents

**Action**: Update refactoring task and simplified implementations docs

**Files to update**:
- `docs/in-progress/react-hooks-refactoring-task.md`
- `docs/in-progress/simplified-implementations.md`

---

## 🚀 Quick Commands

### Check Single Component
```bash
# 1. Read component
view_file components/[ComponentName].tsx

# 2. Search for anti-patterns
grep_search components/[ComponentName].tsx "useEffect.*setState"
grep_search components/[ComponentName].tsx "addEventListener"
grep_search components/[ComponentName].tsx "\\.startsWith"

# 3. Document findings
```

### Check Multiple Components
```bash
# 1. List all components
find_by_name components "*.tsx"

# 2. For each component, run checks
# 3. Aggregate findings
```

---

## ⚠️ Critical Reminders

1. **Always perform BOTH rounds** (Basic + Deep)
2. **Document ALL findings**, even if no issues
3. **Prioritize issues** (🔴 High, 🟡 Medium)
4. **Provide code examples** for each recommendation
5. **Update tracking documents** after check

---

## 📊 Success Criteria

A successful check includes:
- ✅ Both rounds completed
- ✅ All 8 anti-patterns checked
- ✅ Findings documented with examples
- ✅ Tracking documents updated
- ✅ Clear recommendations provided

---

## 🔗 Related Resources

- `GEMINI.md` - React Hooks Deep Check Policy
- `.agent/skills/react-hooks-selection/SKILL.md` - Hook selection guide
- `.agent/skills/react-hooks-deep-check/SKILL.md` - Deep check procedures
