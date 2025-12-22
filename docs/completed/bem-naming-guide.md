# CSS BEM 命名規範詳解

**更新日期**: 2025-12-22  
**範例頁面**: `app/[locale]/hooks-test/page.tsx`

---

## 📋 核心規則

### 0. 根元素命名（Root Element Naming）

為了在瀏覽器開發工具中快速定位問題元素，專案採用以下根元素命名規範：

**頁面根元素**: 使用 `[頁面名稱]_page` 格式
- `.hooks_test_page` (app/[locale]/hooks-test/page.tsx)
- `.socket_io_page` (app/[locale]/socket-test/socket-io/page.tsx)
- `.websocket_page` (app/[locale]/socket-test/websocket/page.tsx)

**組件根元素**: 使用 `[組件名]` 格式
- `.scroll_fetch` (components/ScrollFetch/index.tsx)
- `.image_upload` (components/ImageUpload/index.tsx)
- `.countdown` (components/Countdown/index.tsx)

**好處**：
- ✅ 在瀏覽器 DevTools 中一眼就能識別元素來源
- ✅ 快速定位問題所在的文件
- ✅ 便於調試和維護

---

### 1. Block（區塊）
使用單一名稱或底線分隔的多個語義詞。

**範例**：
- `.section`
- `.button`
- `.image_upload` (多個語義詞用底線分隔)
- `.scroll_test`

---

### 2. Element（元素）
使用**單個連字符 `-`** 連接 Block 與 Element。

**規則**：
- 如果頁面中該 Element 類型唯一，可以簡化命名
- 如果 Element 名稱本身有多個語義詞，用底線 `_` 分隔

**範例**：

#### 簡化命名（推薦）
```scss
.section {
  &-title { }        // .section-title (該頁面只有 section 有 title)
  &-description { }  // .section-description
}
```

#### 完整命名
```scss
.section {
  &-section_title { }       // .section-section_title (Element 名稱有多個語義詞)
  &-section_description { } // .section-section_description
}
```

---

### 3. Sub-Element（子元素）
再用**單個連字符 `-`** 連接父元素與子元素。

**範例**：
```scss
.dropdown {
  &-menu { }      // .dropdown-menu
  &-menu-item { } // .dropdown-menu-item (Sub-Element)
}
```

或使用 SCSS 巢狀：
```scss
.dropdown {
  &-menu {        // .dropdown-menu
    &-item { }    // .dropdown-menu-item
  }
}
```

---

### 4. 多個語義詞的分隔
Element 或 Sub-Element 名稱內部使用**底線 `_`** 分隔。

**範例**：
```scss
.scroll_test {           // Block (多個語義詞)
  &-content { }          // .scroll_test-content
}

.message_list {          // Block
  &-item { }             // .message_list-item
  &-item-content { }     // .message_list-item-content
}

.value_display { }       // Block (多個語義詞)
```

---

### 5. 狀態修飾
使用 HTML 屬性選擇器，不使用 modifier 類別。

**範例**：
```scss
.key_status {
  &[data-pressed='true'] {
    color: white;
  }
  
  &[data-key='escape'][data-pressed='true'] {
    background-color: #f44336;
  }
}
```

---

## 🎯 hooks-test 頁面範例

### 當前結構分析

#### ❌ 錯誤的命名
```scss
.section {
  &_title { }        // 錯誤：應該用連字符 -
  &_description { }  // 錯誤：應該用連字符 -
}
```

#### ✅ 正確的命名
```scss
.section {
  &-title { }        // 正確：.section-title
  &-description { }  // 正確：.section-description
}
```

---

### 完整範例

```scss
// Block
.page { }
.grid { }
.section { }

// Element (用連字符連接)
.section {
  &-title { }        // .section-title
  &-description { }  // .section-description
}

// Block (多個語義詞用底線)
.content_box { }
.value_display { }
.value_meta { }

// Element with variants
.button { }
.button_success { }   // 變體：底線分隔
.button_danger { }
.button_neutral { }

// Block with Element
.dropdown {
  &-menu { }          // .dropdown-menu
  &-menu-item { }     // .dropdown-menu-item (Sub-Element)
}

// 或使用巢狀
.dropdown {
  &-menu {            // .dropdown-menu
    &-item { }        // .dropdown-menu-item
  }
}

// Block (多個語義詞)
.scroll_test {
  &-content { }       // .scroll_test-content
}

.flex_row { }         // Block (多個語義詞)
.flex_column { }

.media_badge {
  &[data-active='true'] { }
  &[data-type='mobile'] { }
}
```

---

## 📝 命名決策樹

### 我要命名一個類別，應該用連字符還是底線？

1. **這是 Block 嗎？**
   - 是 → 如果名稱有多個語義詞，用**底線** (`image_upload`, `scroll_test`)
   - 否 → 繼續下一步

2. **這是 Element（連接 Block）嗎？**
   - 是 → 用**連字符**連接 Block (`section-title`, `dropdown-menu`)
   - 否 → 繼續下一步

3. **這是 Sub-Element（連接 Element）嗎？**
   - 是 → 用**連字符**連接 (`dropdown-menu-item`)
   - 否 → 繼續下一步

4. **這是 Element 名稱內部的多個語義詞嗎？**
   - 是 → 用**底線**分隔 (`section-section_title`)

---

## 🔍 實際應用

### 範例 1: Section 區塊
```tsx
<div className={styles.section}>
  <h2 className={styles['section-title']}>標題</h2>
  <p className={styles['section-description']}>描述</p>
</div>
```

```scss
.section {
  padding: 20px;
  
  &-title {
    margin-top: 0;
  }
  
  &-description {
    color: #666;
  }
}
```

### 範例 2: Dropdown 下拉選單
```tsx
<div className={styles.dropdown}>
  <div className={styles['dropdown-menu']}>
    <div className={styles['dropdown-menu-item']}>選項 1</div>
  </div>
</div>
```

```scss
.dropdown {
  position: relative;
  
  &-menu {
    position: absolute;
    
    &-item {
      padding: 8px;
      cursor: pointer;
    }
  }
}
```

### 範例 3: 多個語義詞
```tsx
<div className={styles.scroll_test}>
  <div className={styles['scroll_test-content']}>
    內容
  </div>
</div>
```

```scss
.scroll_test {
  height: 150px;
  overflow: auto;
  
  &-content {
    height: 400px;
  }
}
```

---

## ✅ 檢查清單

在命名 CSS 類別時，確認：

- [ ] Block 使用單一名稱或底線分隔的語義詞
- [ ] Element 使用**單個連字符 `-`** 連接 Block
- [ ] Sub-Element 使用**單個連字符 `-`** 連接 Element
- [ ] Element 名稱內部的多個語義詞使用**底線 `_`** 分隔
- [ ] 狀態使用 HTML 屬性選擇器
- [ ] 每個 HTML 元素只使用一個 className
- [ ] 遵循 CSS 屬性順序規範

---

## 🚫 常見錯誤

### 錯誤 1: Element 使用底線
```scss
// ❌ 錯誤
.section {
  &_title { }  // 應該用連字符
}

// ✅ 正確
.section {
  &-title { }
}
```

### 錯誤 2: 組合多個 className
```tsx
// ❌ 錯誤
<button className={`${styles.button} ${styles.button_success}`}>

// ✅ 正確
<button className={styles.button_success}>
```

### 錯誤 3: Block 使用連字符
```scss
// ❌ 錯誤
.scroll-test { }  // Block 的多個語義詞應該用底線

// ✅ 正確
.scroll_test { }
```

---

**參考文檔**: [README.zh-tw.md](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/README.zh-tw.md)
