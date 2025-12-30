# File Organization

- Placeholders: `styles/placeholders/`
- NEVER create `_shared` in `app/`
- NEVER share CSS class names between pages
- For shared DOM: create component with `pageClassName` prop
- **Each element MUST have its own unique class**
  - ❌ Bad: `.footer-links a { ... }` (targeting tag)
  - ✅ Good: `.footer-link { ... }` (unique class)
  - ✅ Exception: Dynamic content areas (e.g., `.content p { ... }`)
  - ✅ Exception: Third-party content (e.g., `:global a { ... }` in WangEditor)
