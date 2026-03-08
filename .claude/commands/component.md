# Generate Component

Generate a new React component following project standards.

## Usage

Use this command when you need to:
- Create new UI components
- Generate page components
- Create demo components
- Build reusable components

## Template

Please generate a component:

**Component Name**: [ComponentName]

**Component Type**:
- [ ] Server Component (default)
- [ ] Client Component (needs interactivity)
- [ ] Demo Component (full-page demo)

**Location**:
- [ ] `components/` (reusable component)
- [ ] `components/Demo/` (demo component)
- [ ] `app/[locale]/[path]/` (page component)

**Features**:
- [ ] Props interface
- [ ] TypeScript types
- [ ] SCSS module (Modified BEM)
- [ ] Internationalization (i18n)
- [ ] Accessibility (a11y)
- [ ] Unit tests

**Props** (if applicable):
```typescript
interface Props {
  // Define props here
}
```

**Requirements**:
- ✅ Use TypeScript (no `any`)
- ✅ Follow Modified BEM for CSS
- ✅ Server Component by default
- ✅ Add `'use client'` only if needed
- ✅ Include proper types
- ✅ Add JSDoc comments

## Example

```
Please generate a component:

**Component Name**: UserCard

**Component Type**:
- [x] Client Component (needs onClick handler)

**Location**:
- [x] components/UserCard/

**Features**:
- [x] Props interface (user data, onSelect callback)
- [x] SCSS module with Modified BEM
- [x] Accessibility (proper ARIA labels)
- [x] Unit tests

**Props**:
```typescript
interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onSelect?: (userId: string) => void;
}
```
```

## Component Template

### Server Component (Default)
```typescript
import type { ReactNode } from 'react';
import styles from './ComponentName.module.scss';

interface Props {
  children?: ReactNode;
}

export default function ComponentName({ children }: Props) {
  return (
    <div className={styles.component_name}>
      {children}
    </div>
  );
}
```

### Client Component
```typescript
'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './ComponentName.module.scss';

interface Props {
  children?: ReactNode;
  onClick?: () => void;
}

export default function ComponentName({ children, onClick }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className={styles.component_name}
      css-is-active={isActive.toString()}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

### SCSS Module (Modified BEM)
```scss
.component_name {
  // Positioning
  position: relative;
  
  // Display & Box Model
  display: flex;
  padding: 16px;
  
  // Typography
  font-size: 14px;
  
  // Visual
  background: #fff;
  
  // Sub-elements
  &-header {
    font-weight: bold;
  }
  
  &-content {
    margin-top: 8px;
  }
  
  // States
  &[css-is-active='true'] {
    background: #f0f0f0;
  }
}
```

## File Structure

```
components/ComponentName/
├── index.tsx              # Component logic
├── ComponentName.module.scss  # Styles
├── types.ts               # TypeScript types (if complex)
└── __tests__/
    └── ComponentName.test.tsx  # Unit tests
```

## Decision Tree

**Should it be a Client Component?**
- Needs event handlers? → Yes
- Uses React hooks? → Yes
- Uses browser APIs? → Yes
- Just displays data? → No (use Server)

**Where should it live?**
- Reusable across pages? → `components/`
- Full-page demo? → `components/Demo/`
- Page-specific? → `app/[locale]/[path]/`

## Related Skills

- [Server vs Client Components](.agent/skills/server-client-components/SKILL.md)
- [CSS/SCSS Naming Convention](.agent/skills/css-naming-convention/SKILL.md)
- [File Organization](.agent/skills/file-organization/SKILL.md)
- [i18n Implementation](.agent/skills/i18n-implementation/SKILL.md)
