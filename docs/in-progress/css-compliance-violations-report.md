# CSS 規範違規檢查報告

**檢查時間**: 2025-12-25 00:26  
**檢查範圍**: Client Component 重構相關的 SCSS 文件

---

## 🔴 發現的違規問題

### 1. ripple-test/page.module.scss

**違規類型**: CSS 屬性順序錯誤

**位置**: 第 9-23 行 `.ripple_test_page-demo` 和 `.ripple_test_page-demo-box`

**問題**:
```scss
&-demo {
    padding: 16px;           // ❌ Display & Box Model
    border: 1px solid #eee;  // ❌ Visual
    border-radius: 8px;      // ❌ Visual
    
    &-box {
        display: flex;            // ✅ Display & Box Model
        align-items: center;      // ✅ Display & Box Model
        justify-content: center;  // ✅ Display & Box Model
        padding: 32px 16px;       // ✅ Display & Box Model
        font-weight: 500;         // ❌ Typography (應在 Display 後)
        color: #333;              // ❌ Visual (應在 Typography 後)
        background-color: #f5f5f5;// ❌ Visual
        border-radius: 8px;       // ❌ Visual
        cursor: pointer;          // ❌ Misc (應在最後)
        user-select: none;        // ❌ Misc (應在最後)
    }
}
```

**正確順序應為**:
1. Display & Box Model (display, position, padding, margin, etc.)
2. Typography (font-*, line-height, text-*, etc.)
3. Visual (color, background-*, border-*, etc.)
4. Animation (transition, animation, etc.)
5. Misc (cursor, user-select, etc.)

---

### 2. lazyload-test/page.module.scss

**違規類型**: CSS 屬性順序錯誤

**位置**: 第 4-26 行

**問題**:
```scss
&-section {
    margin-bottom: 48px;  // ✅ Display & Box Model
    padding: 16px;        // ✅ Display & Box Model
    border: 1px solid #eee;     // ❌ 應在 Visual 區塊
    border-radius: 8px;         // ❌ 應在 Visual 區塊
}

&-image {
    display: block;         // ✅ Display & Box Model
    width: 100%;            // ✅ Display & Box Model
    max-width: 600px;       // ✅ Display & Box Model
    height: auto;           // ✅ Display & Box Model
    min-height: 200px;      // ✅ Display & Box Model
    background-color: #f5f5f5;  // ❌ Visual (應分組)
    border: 1px solid #ddd;     // ❌ Visual (應分組)
    border-radius: 4px;         // ❌ Visual (應分組)
    object-fit: contain;        // ❌ Visual (應分組)
    transition: opacity 0.3s;   // ❌ Animation (應在 Visual 後)
}
```

---

## ✅ 符合規範的文件

1. **banner-demo/page.module.scss** - ✅ 使用 placeholders，無違規
2. **go-top/page.module.scss** - ✅ 使用 placeholders，無違規

---

## 📝 修正建議

### ripple-test/page.module.scss 修正:

```scss
.ripple_test_page {
    &-demos {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    &-demo {
        /* Display & Box Model */
        padding: 16px;

        /* Visual */
        border: 1px solid #eee;
        border-radius: 8px;

        &-box {
            /* Display & Box Model */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;

            /* Typography */
            font-weight: 500;

            /* Visual */
            color: #333;
            background-color: #f5f5f5;
            border-radius: 8px;

            /* Misc */
            cursor: pointer;
            user-select: none;

            &--red {
                /* Visual */
                color: #fff;
                background-color: #ffcdd2;
            }

            &--blue {
                /* Visual */
                color: #fff;
                background-color: #bbdefb;
            }

            &--green {
                /* Visual */
                color: #fff;
                background-color: #c8e6c9;
            }

            &--disabled {
                /* Visual */
                color: #999;
                background-color: #eee;

                /* Misc */
                cursor: not-allowed;
            }
        }
    }
}
```

### lazyload-test/page.module.scss 修正:

```scss
&-section {
    /* Display & Box Model */
    margin-bottom: 48px;
    padding: 16px;

    /* Visual */
    border: 1px solid #eee;
    border-radius: 8px;
}

&-image {
    /* Display & Box Model */
    display: block;
    width: 100%;
    max-width: 600px;
    height: auto;
    min-height: 200px;

    /* Visual */
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    object-fit: contain;

    /* Animation */
    transition: opacity 0.3s ease-in-out;

    &--gif {
        /* Display & Box Model */
        max-height: 300px;
    }
}
```

---

## 📊 總結

- **檢查文件數**: 4
- **符合規範**: 2 (50%)
- **需要修正**: 2 (50%)
- **違規類型**: CSS 屬性順序錯誤

**建議**: 立即修正這兩個文件以符合專案的 CSS 規範。
