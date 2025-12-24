# CSS Class Name 不匹配問題報告

**發現時間**: 2025-12-25 00:28  
**報告者**: 用戶

---

## 🔴 問題描述

**文件**: `components/Demo/RippleTest.tsx` 和 `app/[locale]/directive-effects/ripple-test/page.module.scss`

### TSX 中使用的 className (錯誤)
```tsx
<Box className={style.ripple_test_page_demos}>      // ❌ 使用底線 _
<Box className={style.ripple_test_page_demo}>       // ❌ 使用底線 _
<Box className={style.ripple_test_page_demo_box}>   // ❌ 使用底線 _
```

### SCSS 中定義的 class (正確)
```scss
.ripple_test_page {
    &-demos {        // ✅ 編譯為 .ripple_test_page-demos (使用連字號 -)
    &-demo {         // ✅ 編譯為 .ripple_test_page-demo
        &-box {      // ✅ 編譯為 .ripple_test_page-demo-box
```

---

## 🎯 根本原因

**BEM 命名規範不一致**:
- SCSS 使用 `&-element` (正確) → 編譯為 `block-element`
- TSX 使用 `block_element` (錯誤) → 應該使用 `block-element`

根據專案的 BEM 規範：
- **Block 內部語義詞**: 使用底線 `_` (例如: `ripple_test_page`)
- **Block 與 Element**: 使用連字號 `-` (例如: `ripple_test_page-demos`)
- **Element 與 Modifier**: 使用雙連字號 `--` (例如: `demo-box--red`)

---

## ✅ 修正方案

### 修正 TSX 文件

將所有 className 從底線改為連字號（使用方括號語法）:

```tsx
// ❌ 錯誤
<Box className={style.ripple_test_page_demos}>
<Box className={style.ripple_test_page_demo}>
<Box className={style.ripple_test_page_demo_box}>

// ✅ 正確
<Box className={style['ripple_test_page-demos']}>
<Box className={style['ripple_test_page-demo']}>
<Box className={style['ripple_test_page-demo-box']}>
```

---

## 📝 為什麼之前沒檢查到？

**檢查疏漏**:
1. 只檢查了 SCSS 文件的屬性順序
2. 沒有交叉比對 TSX 中使用的 className 與 SCSS 中定義的 class
3. 應該建立自動化檢查機制

**改進建議**:
1. 創建 lint 規則檢查 className 是否存在於對應的 SCSS 文件
2. 在 code review 時特別注意 BEM 命名一致性
3. 使用 TypeScript 的 CSS Modules 類型檢查

---

## 🔍 完整檢查清單

為避免類似問題，應檢查：

- [ ] TSX 中的 className 是否在 SCSS 中定義
- [ ] BEM 命名是否一致（`-` vs `_`）
- [ ] CSS 屬性順序是否符合規範
- [ ] 是否有未使用的 CSS class
- [ ] 是否有重複定義的 class

---

**修正狀態**: ✅ 已修正  
**修正時間**: 2025-12-25 00:28
