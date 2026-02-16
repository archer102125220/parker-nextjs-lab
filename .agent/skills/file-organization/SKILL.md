---
name: File Organization & Style Reuse
description: Guidelines for organizing files and reusing styles with placeholders vs components
---

# File Organization & Style Reuse

## 🎯 When to Use This Skill

Use this skill when:
- Deciding between placeholder and component for style reuse
- Organizing project file structure
- Choosing between single-page and multi-page style reuse strategies
- **Creating shared styles across pages**
- Refactoring duplicate styles
- Setting up new components or pages

## 📋 Decision Tree: Placeholder vs Component

### Question 1: Where will this style be reused?

#### Single Page Only → Placeholder

Define `%placeholder_name` at the top of the SCSS file and use `@extend`.

```scss
// ✅ Use placeholder at top of SCSS file
// app/[locale]/dashboard/page.module.scss

%button_base {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s;
}

.dashboard_page {
  &-primary_button {
    @extend %button_base;
    background: #1976d2;
    color: white;
  }
  
  &-secondary_button {
    @extend %button_base;
    background: #e0e0e0;
    color: #333;
  }
}
```

**When to use**:
- ✅ Styles only used within one page
- ✅ Simple style reuse (2-3 variations)
- ✅ No logic needed

---

#### Multiple Pages → Component or Global Placeholder

**Question 2: Does it need logic or props?**

##### YES → Component (Recommended)

```tsx
// ✅ Component with logic
// components/Button/index.tsx
import style from './index.module.scss';

interface Props {
  variant: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, children, onClick }: Props) {
  return (
    <button 
      className={style.button} 
      css-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```scss
// components/Button/index.module.scss
.button {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s;
  
  &[css-variant='primary'] {
    background: #1976d2;
    color: white;
  }
  
  &[css-variant='secondary'] {
    background: #e0e0e0;
    color: #333;
  }
  
  &[css-variant='danger'] {
    background: #d32f2f;
    color: white;
  }
}
```

**When to use**:
- ✅ Needs props or logic
- ✅ Used across multiple pages
- ✅ Complex variations (3+ variants)

---

##### NO → Global Placeholder

```scss
// ✅ Global placeholder for simple styles
// styles/placeholders/_buttons.scss
%button_base {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s;
}

// app/[locale]/page1/page.module.scss
@use '@/styles/placeholders/buttons';

.page1 {
  &-submit_button {
    @extend %button_base;
    background: #1976d2;
  }
}

// app/[locale]/page2/page.module.scss
@use '@/styles/placeholders/buttons';

.page2 {
  &-action_button {
    @extend %button_base;
    background: #4caf50;
  }
}
```

**When to use**:
- ✅ Simple styles without logic
- ✅ Used across multiple pages
- ✅ Each page needs unique class names

---

## 📁 Directory Structure

### Recommended Structure

```
project/
├── app/                          # Next.js App Router
│   └── [locale]/
│       ├── dashboard/
│       │   ├── page.tsx          # Server Component
│       │   └── page.module.scss  # Page-specific styles
│       └── users/
│           ├── page.tsx
│           └── page.module.scss
│
├── components/                   # Reusable components
│   ├── Button/
│   │   ├── index.tsx
│   │   └── index.module.scss
│   ├── Card/
│   │   ├── index.tsx
│   │   └── index.module.scss
│   └── Demo/                     # Full-page demo components
│       ├── BannerDemo.tsx
│       └── LazyLoadTest.tsx
│
├── styles/                       # Global styles
│   ├── globals.scss              # Global CSS
│   ├── variables.scss            # CSS variables
│   ├── mixins.scss               # SCSS mixins
│   └── placeholders/             # Global placeholders
│       ├── _buttons.scss
│       ├── _cards.scss
│       └── _forms.scss
│
└── lib/                          # Utilities
    └── api.ts
```

### ❌ Forbidden Patterns

```
app/
└── [locale]/
    ├── dashboard/
    │   └── page.tsx
    ├── users/
    │   └── page.tsx
    └── _shared/                  # ❌ NEVER create _shared in app/
        └── styles.scss           # ❌ FORBIDDEN
```

**Why forbidden**:
- ❌ Violates Next.js App Router conventions
- ❌ Makes it hard to track which pages use which styles
- ❌ Use `styles/placeholders/` or components instead

---

## ✅ Correct Examples

### Example 1: Single-Page Reuse (Placeholder)

```scss
// ✅ CORRECT - Placeholder at top of file
// app/[locale]/dashboard/page.module.scss

%card_base {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
}

.dashboard_page {
  &-stats_card {
    @extend %card_base;
    border-left: 4px solid #1976d2;
  }
  
  &-activity_card {
    @extend %card_base;
    border-left: 4px solid #4caf50;
  }
  
  &-alerts_card {
    @extend %card_base;
    border-left: 4px solid #f57c00;
  }
}
```

**Benefits**:
- ✅ All styles in one file
- ✅ Easy to maintain
- ✅ No extra files needed

---

### Example 2: Multi-Page Reuse (Component)

```tsx
// ✅ CORRECT - Component for complex reuse
// components/Card/index.tsx
import style from './index.module.scss';

interface Props {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Card({ title, children, variant = 'default' }: Props) {
  return (
    <div className={style.card} css-variant={variant}>
      <h3 className={style.card-title}>{title}</h3>
      <div className={style.card-content}>{children}</div>
    </div>
  );
}
```

```scss
// components/Card/index.module.scss
.card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
  
  &[css-variant='success'] {
    border-left: 4px solid #4caf50;
  }
  
  &[css-variant='warning'] {
    border-left: 4px solid #f57c00;
  }
  
  &[css-variant='error'] {
    border-left: 4px solid #d32f2f;
  }
  
  &-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  &-content {
    color: #666;
  }
}
```

**Usage**:
```tsx
// Multiple pages can use it
<Card title="Statistics" variant="success">
  {content}
</Card>
```

---

### Example 3: Multi-Page Reuse (Global Placeholder)

```scss
// ✅ CORRECT - Global placeholder
// styles/placeholders/_cards.scss
%card_base {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
}

// app/[locale]/dashboard/page.module.scss
@use '@/styles/placeholders/cards';

.dashboard_page {
  &-stats_card {
    @extend %card_base;
    border-left: 4px solid #1976d2;
  }
}

// app/[locale]/analytics/page.module.scss
@use '@/styles/placeholders/cards';

.analytics_page {
  &-metrics_card {
    @extend %card_base;
    border-left: 4px solid #4caf50;
  }
}
```

**Benefits**:
- ✅ Each page has unique class names
- ✅ Easy to find in DevTools
- ✅ Shared base styles

---

## ❌ Common Mistakes

### Mistake 1: Creating `_shared` in `app/`

```
// ❌ WRONG
app/
└── [locale]/
    ├── dashboard/
    ├── users/
    └── _shared/              # ❌ FORBIDDEN
        └── card-styles.scss

// ✅ CORRECT
styles/
└── placeholders/
    └── _cards.scss           # ✅ Use global placeholders

// OR
components/
└── Card/                     # ✅ Use component
    └── index.tsx
```

---

### Mistake 2: Sharing CSS Files Between Pages

```tsx
// ❌ WRONG - Importing same SCSS in multiple pages
// app/[locale]/page1/page.tsx
import sharedStyles from '@/app/_shared/styles.module.scss';  // ❌

// app/[locale]/page2/page.tsx
import sharedStyles from '@/app/_shared/styles.module.scss';  // ❌

// ✅ CORRECT - Use component
import { Card } from '@/components/Card';
<Card>Content</Card>
```

---

### Mistake 3: Not Using Unique Page Root Classes

```scss
// ❌ WRONG - Generic class names
.container { }    // ❌ Can't identify which page
.header { }       // ❌ Too generic

// ✅ CORRECT - Unique page root class
.dashboard_page {
  &-container { }  // ✅ .dashboard_page-container
  &-header { }     // ✅ .dashboard_page-header
}
```

---

## 📝 Checklist

### Before Creating Styles

- [ ] Determined reuse scope (single page vs multiple pages)
- [ ] Chosen appropriate strategy (placeholder vs component vs global placeholder)
- [ ] Verified no `_shared` directories in `app/`
- [ ] Ensured each page has unique root class

### When Refactoring

- [ ] Identified duplicate styles across pages
- [ ] Decided if component or placeholder is better
- [ ] Moved shared styles to appropriate location
- [ ] Updated all usages
- [ ] Verified unique class names in DevTools

### Directory Structure

- [ ] Components in `components/` directory
- [ ] Global placeholders in `styles/placeholders/`
- [ ] Page styles in `app/[locale]/*/page.module.scss`
- [ ] No `_shared` directories in `app/`

## 💡 Pro Tips

### Tip 1: Start with Placeholder, Refactor to Component

When in doubt, start with a placeholder. If you need props or logic later, refactor to a component.

```scss
// Start simple
%button_base {
  padding: 12px 24px;
}

// Later, if you need variants, refactor to component
<Button variant="primary">Click me</Button>
```

---

### Tip 2: Use DevTools to Verify Unique Classes

Open DevTools and inspect elements. You should be able to identify which page an element belongs to by its class name.

```scss
// ✅ GOOD - Clear which page this belongs to
.dashboard_page-stats_card { }

// ❌ BAD - Can't identify page
.stats_card { }
```

---

### Tip 3: Placeholder vs Component Decision Matrix

| Criteria | Placeholder | Component |
|----------|-------------|-----------|
| **Reuse scope** | Single page or simple multi-page | Multi-page with logic |
| **Complexity** | Simple styles | Complex with props |
| **Logic needed** | No | Yes |
| **Variants** | 1-2 | 3+ |
| **DevTools** | Unique class per page | Same component class |

---

### Tip 4: Global Placeholder Organization

Organize global placeholders by category:

```
styles/placeholders/
├── _buttons.scss      # Button styles
├── _cards.scss        # Card styles
├── _forms.scss        # Form styles
├── _typography.scss   # Text styles
└── _layout.scss       # Layout helpers
```

Then import only what you need:

```scss
@use '@/styles/placeholders/buttons';
@use '@/styles/placeholders/cards';
```

---

## 🔗 Related Rules

- `.agent/rules/file-organization.md`
- `.agent/rules/css-naming.md`
- `GEMINI.md` - File Organization section
- `CLAUDE.md` - File Organization section
