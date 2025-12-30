# CSS/SCSS Naming (Modified BEM)

- Block: `.countdown`
- Element: `.countdown-title` (hyphen `-`)
- Multi-word: `.image_upload` (underscore `_`)
- State: `[css-is-active='true']` (HTML attr with `css-` prefix)
- CSS variables: `--editor_height` (underscore `_`)
- NEVER use `__` (double underscore) or `--` (double hyphen)
- Use HTML attributes for states/variants: `[css-color='red']`, `[css-is-disabled='true']`
- Each element MUST have only ONE className

## Page Root Class
- Page: `[name]_page` (e.g., `.hooks_test_page`)
- Component: `[name]` (e.g., `.image_upload`)
- Each page MUST have unique root class
