# Demo Components (`components/Demo/`)

- Full-page Client Components for feature demonstrations
- Naming: PascalCase (e.g., `BannerDemo.tsx`, `LazyLoadTest.tsx`)
- Rules:
  - Full-page content → `components/Demo/[PageName].tsx`
  - Multiple sub-components → `components/[PageName]/` folder

## Inline Styles
- ALLOWED: MUI `sx`, CSS variable passing
- FORBIDDEN: static values, dynamic calculations
