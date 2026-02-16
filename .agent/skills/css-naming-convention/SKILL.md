---
name: CSS/SCSS Naming Convention
description: Modified BEM naming system with hyphen/underscore rules and HTML attribute states
---

# CSS/SCSS Naming Convention

## 🎯 When to Use This Skill

Use this skill when:
- Creating new components or pages
- Reviewing CSS/SCSS code
- Refactoring existing styles
- **Confused about hyphen vs underscore** (most common scenario)
- Deciding between class names and HTML attributes
- Setting up page root classes

## 📋 Decision Tree: Hyphen vs Underscore

### The Core Question

**Is this a generic container word OR a specific concept?**

### Hyphen `-` (Hierarchy/Structure)

Use when adding a **structural level** or **generic container**:

**Generic container words**:
- `group`, `wrapper`, `container`, `inner`, `outer`
- `header`, `body`, `footer`, `content`
- `section`, `area`, `zone`, `region`

**Examples**:
```scss
.controls-group      // "group" is generic
.card-header         // "header" is generic
.modal-content       // "content" is generic
.sidebar-inner       // "inner" is generic
```

### Underscore `_` (Multi-word Concept)

Use when the name describes a **single specific concept** that needs two words:

**Specific concepts**:
- `scroll_area` (a scrollable area - one specific thing)
- `image_upload` (image upload component - one specific thing)
- `debug_info` (debugging information - one specific thing)
- `lazy_load` (lazy loading feature - one specific thing)

**Examples**:
```scss
.scroll_area         // One specific concept
.image_upload        // One specific concept
.debug_info          // One specific concept
.content_box         // One specific concept
```

### Quick Decision Test

Ask yourself:
1. **Is this word generic?** (group, wrapper, header, etc.)
   - YES → Use hyphen `-`
   - NO → Continue to step 2

2. **Does this describe ONE specific thing that needs two words?**
   - YES → Use underscore `_`
   - NO → Rethink the name

## ✅ Correct Examples

### Example 1: Component Structure

```scss
// ✅ CORRECT
.image_upload {                    // Multi-word concept (underscore)
  &-preview {                      // Sub-element (hyphen)
    &-img { }                      // Sub-sub-element (hyphen)
    &-delete { }                   // Sub-sub-element (hyphen)
  }
  &-dropzone { }                   // Sub-element (hyphen)
  &-button {                       // Sub-element (hyphen)
    &-icon { }                     // Sub-sub-element (hyphen)
  }
  
  // States using HTML attributes
  &[css-is-dragging='true'] {
    border-color: blue;
  }
  &[css-size='large'] {
    width: 400px;
  }
}
```

**TSX Usage**:
```tsx
<div 
  className={style.image_upload} 
  css-is-dragging={isDragging ? 'true' : undefined}
  css-size="large"
>
  <div className={style['image_upload-preview']}>
    <img className={style['image_upload-preview-img']} />
    <button className={style['image_upload-preview-delete']} />
  </div>
  <div className={style['image_upload-dropzone']} />
</div>
```

### Example 2: Page Structure

```scss
// ✅ CORRECT
.hooks_test_page {                 // Page root (underscore for multi-word)
  &-description { }                // Sub-element (hyphen)
  &-section {                      // Sub-element (hyphen)
    &-title { }                    // Sub-sub-element (hyphen)
    &-content { }                  // Sub-sub-element (hyphen)
  }
  &-demo_area {                    // Sub-element with multi-word (hyphen + underscore)
    &-controls { }
  }
}
```

### Example 3: Complex Component

```scss
// ✅ CORRECT
.scroll_area {                     // Multi-word concept (underscore)
  &-container {                    // Generic container (hyphen)
    &-inner { }                    // Generic inner (hyphen)
  }
  &-scrollbar {                    // Sub-element (hyphen)
    &-thumb { }                    // Sub-sub-element (hyphen)
    &-track { }                    // Sub-sub-element (hyphen)
  }
  
  &[css-is-scrolling='true'] { }   // State
  &[css-direction='horizontal'] { } // Variant
}
```

## ❌ Common Mistakes

### Mistake 1: Using Double Underscore (BEM Classic)

```scss
// ❌ WRONG - Classic BEM (not used in this project)
.image__upload { }
.image-upload__preview { }

// ✅ CORRECT - Modified BEM
.image_upload { }
.image_upload-preview { }
```

**Why wrong**: This project uses Modified BEM, not classic BEM.

### Mistake 2: Multiple ClassNames

```tsx
// ❌ WRONG
<div className={`${style.box} ${style['box--red']}`}>

// ✅ CORRECT
<div className={style.box} css-color="red">
```

**Why wrong**: Violates the "one className per element" rule. Use HTML attributes for variants.

### Mistake 3: Using Tag Selectors

```scss
// ❌ WRONG
.footer-links {
  a {                              // Tag selector - hard to debug
    color: blue;
  }
}

// ✅ CORRECT
.footer-link {                     // Unique class for each element
  color: blue;
}
```

**Why wrong**: Tag selectors make it hard to locate elements in DevTools. Each element should have a unique class.

**Exceptions** (when tag selectors are acceptable):
```scss
// ✅ Exception 1: Dynamic content areas
.content {
  p { }                            // User-generated content
  ul { }
  li { }
}

// ✅ Exception 2: Third-party content
.wang_editor {
  :global a { }                    // WangEditor internal HTML
  :global img { }
}
```

### Mistake 4: Confusing Hierarchy with Multi-word

```scss
// ❌ WRONG - Treating "scroll area" as hierarchy
.scroll-area { }                   // Should be scroll_area

// ❌ WRONG - Treating "group" as multi-word
.controls_group { }                // Should be controls-group

// ✅ CORRECT
.scroll_area { }                   // Multi-word concept
.controls-group { }                // Generic container
```

### Mistake 5: Inconsistent State Attributes

```tsx
// ❌ WRONG - Not using css- prefix
<div is-active="true">

// ❌ WRONG - Using className for state
<div className={isActive ? style.active : ''}>

// ✅ CORRECT
<div css-is-active={isActive ? 'true' : undefined}>
```

## 📝 Checklist

### Before Creating New Styles

- [ ] Determined if root name is hierarchy (hyphen) or multi-word (underscore)
- [ ] Checked that each element has unique class name
- [ ] Planned HTML attributes for states/variants (not classNames)
- [ ] Verified no double underscore `__` or double hyphen `--`
- [ ] Ensured page has unique root class (`[name]_page`)
- [ ] Confirmed class names reflect DOM hierarchy

### During Code Review

- [ ] All elements have unique classes (no tag selectors except exceptions)
- [ ] States use HTML attributes with `css-` prefix
- [ ] Variants use HTML attributes (e.g., `css-color`, `css-size`)
- [ ] Class names reflect DOM hierarchy
- [ ] No multiple classNames on single element
- [ ] CSS variables use underscore (`--editor_height`)
- [ ] Page root class follows `[name]_page` pattern

### Common Review Questions

**Q: Should this be hyphen or underscore?**
- Is it a generic container word? → Hyphen
- Is it a specific multi-word concept? → Underscore

**Q: Should this be a class or HTML attribute?**
- Is it a state (active, disabled, loading)? → HTML attribute
- Is it a variant (color, size, theme)? → HTML attribute
- Is it structural? → Class

**Q: Can I use tag selectors here?**
- Is it dynamic/user-generated content? → Yes
- Is it third-party content? → Yes (with `:global`)
- Otherwise → No, use unique classes

## 🔗 Related Rules

- `.agent/rules/css-naming.md`
- `.cursor/rules/css-naming.mdc`
- `GEMINI.md` - CSS/SCSS Naming (Modified BEM) section
- `CLAUDE.md` - CSS/SCSS Naming section

## 💡 Pro Tips

### Tip 1: When in Doubt, Ask

If you're unsure whether to use hyphen or underscore:
1. Check if the word is in the "generic container" list
2. If not, ask: "Is this ONE specific thing?"
3. Still unsure? Use underscore (safer for multi-word concepts)

### Tip 2: Consistency is Key

Once you choose a naming pattern for a component, stick with it throughout the entire component tree.

### Tip 3: DevTools-First Mindset

Always think: "Will I be able to quickly find this element in Chrome DevTools?"
- Unique classes → Easy to find
- Tag selectors → Hard to find

### Tip 4: HTML Attributes for Everything Dynamic

If it changes based on state or props, use HTML attributes:
```tsx
<Component
  css-is-loading={isLoading ? 'true' : undefined}
  css-theme={theme}
  css-size={size}
/>
```

This keeps your className clean and makes states/variants explicit.
