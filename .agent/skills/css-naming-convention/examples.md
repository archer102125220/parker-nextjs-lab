# CSS/SCSS Naming Convention - Examples

This document provides real-world examples from the parker-nextjs-lab project.

## Example 1: Image Upload Component

### Component Structure

```tsx
// components/ImageUpload/index.tsx
export function ImageUpload() {
  return (
    <div className={style.image_upload} css-is-dragging={isDragging ? 'true' : undefined}>
      <div className={style['image_upload-preview']}>
        <img className={style['image_upload-preview-img']} src={preview} />
        <button className={style['image_upload-preview-delete']} onClick={handleDelete}>
          <Icon className={style['image_upload-preview-delete-icon']} />
        </button>
      </div>
      <div className={style['image_upload-dropzone']}>
        Drop files here
      </div>
    </div>
  );
}
```

### SCSS

```scss
// components/ImageUpload/index.module.scss
.image_upload {
  // Root: multi-word concept (underscore)
  border: 2px dashed #ccc;
  
  &-preview {
    // Sub-element: structural (hyphen)
    position: relative;
    
    &-img {
      // Sub-sub-element (hyphen)
      width: 100%;
      height: auto;
    }
    
    &-delete {
      // Sub-sub-element (hyphen)
      position: absolute;
      top: 8px;
      right: 8px;
      
      &-icon {
        // Sub-sub-sub-element (hyphen)
        width: 16px;
        height: 16px;
      }
    }
  }
  
  &-dropzone {
    // Sub-element (hyphen)
    padding: 40px;
    text-align: center;
  }
  
  // State: dragging
  &[css-is-dragging='true'] {
    border-color: blue;
    background: rgba(0, 0, 255, 0.1);
  }
}
```

---

## Example 2: Hooks Test Page

### Page Structure

```tsx
// app/[locale]/hooks-test/page.tsx
export default function HooksTestPage() {
  return (
    <div className={style.hooks_test_page}>
      <p className={style['hooks_test_page-description']}>
        This page demonstrates custom hooks
      </p>
      <section className={style['hooks_test_page-section']}>
        <h2 className={style['hooks_test_page-section-title']}>useDebounce</h2>
        <div className={style['hooks_test_page-section-content']}>
          {/* Content */}
        </div>
      </section>
    </div>
  );
}
```

### SCSS

```scss
// app/[locale]/hooks-test/page.module.scss
.hooks_test_page {
  // Page root: multi-word (underscore) + _page suffix
  padding: 20px;
  
  &-description {
    // Sub-element (hyphen)
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  &-section {
    // Sub-element (hyphen)
    margin-bottom: 40px;
    
    &-title {
      // Sub-sub-element (hyphen)
      font-size: 24px;
      font-weight: bold;
    }
    
    &-content {
      // Sub-sub-element (hyphen)
      padding: 20px;
      background: #f5f5f5;
    }
  }
}
```

---

## Example 3: Scroll Area Component

### Component with Multi-word Sub-elements

```tsx
// components/ScrollArea/index.tsx
export function ScrollArea({ children }: Props) {
  return (
    <div className={style.scroll_area} css-direction="vertical">
      <div className={style['scroll_area-container']}>
        <div className={style['scroll_area-container-inner']}>
          {children}
        </div>
      </div>
      <div className={style['scroll_area-scrollbar']}>
        <div className={style['scroll_area-scrollbar-thumb']} />
        <div className={style['scroll_area-scrollbar-track']} />
      </div>
    </div>
  );
}
```

### SCSS

```scss
.scroll_area {
  // Root: multi-word concept (underscore)
  position: relative;
  overflow: hidden;
  
  &-container {
    // Sub-element: generic container (hyphen)
    height: 100%;
    overflow: auto;
    
    &-inner {
      // Sub-sub-element: generic inner (hyphen)
      padding: 16px;
    }
  }
  
  &-scrollbar {
    // Sub-element (hyphen)
    position: absolute;
    right: 0;
    top: 0;
    width: 8px;
    height: 100%;
    
    &-thumb {
      // Sub-sub-element (hyphen)
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    
    &-track {
      // Sub-sub-element (hyphen)
      background: rgba(0, 0, 0, 0.1);
    }
  }
  
  // Variant: direction
  &[css-direction='horizontal'] {
    .scroll_area-scrollbar {
      width: 100%;
      height: 8px;
      top: auto;
      bottom: 0;
    }
  }
}
```

---

## Example 4: Banner Component with States

### Component with Multiple States

```tsx
// components/Banner/index.tsx
export function Banner() {
  return (
    <div 
      className={style.banner}
      css-is-autoplay={isAutoplay ? 'true' : undefined}
      css-is-dragging={isDragging ? 'true' : undefined}
      css-effect="3d"
    >
      <div className={style['banner-container']}>
        <div className={style['banner-container-slide']}>
          {/* Slide content */}
        </div>
      </div>
      <div className={style['banner-indicators']}>
        <button className={style['banner-indicators-dot']} css-is-active="true" />
        <button className={style['banner-indicators-dot']} />
      </div>
    </div>
  );
}
```

### SCSS

```scss
.banner {
  position: relative;
  
  &-container {
    // Generic container (hyphen)
    overflow: hidden;
    
    &-slide {
      // Sub-sub-element (hyphen)
      display: flex;
      transition: transform 0.3s;
    }
  }
  
  &-indicators {
    // Sub-element (hyphen)
    display: flex;
    justify-content: center;
    gap: 8px;
    
    &-dot {
      // Sub-sub-element (hyphen)
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      
      &[css-is-active='true'] {
        background: white;
      }
    }
  }
  
  // State: autoplay
  &[css-is-autoplay='true'] {
    .banner-container-slide {
      animation: slide 3s infinite;
    }
  }
  
  // State: dragging
  &[css-is-dragging='true'] {
    cursor: grabbing;
    user-select: none;
  }
  
  // Variant: 3D effect
  &[css-effect='3d'] {
    perspective: 1000px;
    
    .banner-container-slide {
      transform-style: preserve-3d;
    }
  }
}
```

---

## Example 5: Common Mistakes from Real Code

### Before (Incorrect)

```scss
// ❌ WRONG - Classic BEM style
.image__upload {
  &__preview {
    &__img { }
  }
}

// ❌ WRONG - Multiple classNames
<div className={`${style.box} ${style.red}`}>
```

### After (Correct)

```scss
// ✅ CORRECT - Modified BEM
.image_upload {
  &-preview {
    &-img { }
  }
}

// ✅ CORRECT - HTML attribute
<div className={style.box} css-color="red">
```

---

## Example 6: Complex Real-World Component (Tabs)

### From components/Tabs/Bar.tsx

```scss
.tabs {
  // Root component
  position: relative;
  
  &-nav {
    // Navigation container (hyphen)
    display: flex;
    overflow-x: auto;
    
    &-item {
      // Navigation item (hyphen)
      padding: 12px 24px;
      cursor: pointer;
      
      &[css-is-active='true'] {
        color: blue;
        font-weight: bold;
      }
      
      &[css-is-disabled='true'] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  &-indicator {
    // Indicator element (hyphen)
    position: absolute;
    bottom: 0;
    height: 2px;
    background: blue;
    transition: all 0.3s;
  }
  
  &-content {
    // Content container (hyphen)
    padding: 20px;
  }
}
```

---

## Key Takeaways from Real Examples

1. **Root names**: Use underscore for multi-word concepts
   - `image_upload`, `scroll_area`, `hooks_test_page`

2. **Sub-elements**: Use hyphen for structural hierarchy
   - `banner-container`, `tabs-nav-item`

3. **States**: Always use HTML attributes with `css-` prefix
   - `css-is-active`, `css-is-dragging`, `css-is-disabled`

4. **Variants**: Use HTML attributes
   - `css-color`, `css-size`, `css-effect`, `css-direction`

5. **One className per element**: Never combine classNames
   - ✅ `className={style.box} css-color="red"`
   - ❌ `className={`${style.box} ${style.red}`}`
