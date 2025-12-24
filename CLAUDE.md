# Project Instructions for Claude

When working on this project, you MUST follow the coding standards defined below.

## Quick Rules

### TypeScript
- NEVER use `any` - use generics, `unknown`, or precise types
- Use `as unknown as Type` for assertions, NEVER `as any`

### CSS/SCSS Naming (Modified BEM)
- Block: `.countdown`
- Element: `.countdown-title` (hyphen `-`)
- Multi-word: `.image_upload` (underscore `_`)
- State: `[css-is-active='true']` (HTML attr with `css-` prefix)
- CSS variables: `--editor_height` (underscore `_`)
- NEVER use `__` (double underscore)

### Page Root Class
- Page: `[name]_page` (e.g., `.hooks_test_page`)
- Component: `[name]` (e.g., `.image_upload`)
- Each page MUST have unique root class

### CSS Property Order
1. Positioning (position, top, z-index)
2. Display & Box Model (display, flex, width, margin, padding)
3. Typography (font, color)
4. Visual (background, box-shadow)
5. Animation (transition)
6. Misc (cursor)

### File Organization
- Placeholders: `styles/placeholders/`
- NEVER create `_shared` in `app/`
- NEVER share CSS class names between pages
- For shared DOM: create component with `pageClassName` prop
- **Each element MUST have its own unique class**
  - ❌ Bad: `.footer-links a { ... }` (targeting tag)
  - ✅ Good: `.footer-link { ... }` (unique class)
  - ✅ Exception: Dynamic content areas (e.g., `.content p { ... }`)
  - ✅ Exception: Third-party content (e.g., `:global a { ... }` in WangEditor)

### Inline Styles
- ALLOWED: MUI `sx`, CSS variable passing
- FORBIDDEN: static values, dynamic calculations

## Full Documentation
- English: [docs/coding-standards.md](docs/coding-standards.md)
- 繁體中文: [docs/coding-standards.zh-tw.md](docs/coding-standards.zh-tw.md)
