# BEM 命名修復 - 詳細執行計劃

**建立日期**: 2025-12-22  
**狀態**: 📋 計劃階段  
**預估總時間**: 2-3 小時

---

## 🎯 修復目標

將所有 Phase 2 CSS 模組文件中的 BEM 命名從錯誤的 `&_element` 修正為正確的 `&-element`，並同步更新對應的 TSX 文件。

---

## 📊 優先級分類

### 高優先級（常用頁面）⭐⭐⭐

這些是用戶最常訪問的頁面，應優先修復：

1. **首頁相關**
   - `app/[locale]/route/page.module.scss` - 路由導航頁

2. **功能展示頁**
   - `app/[locale]/face-swap/page.module.scss` - Face Swap 首頁
   - `app/[locale]/face-swap/frontend/page.module.scss` - Face Swap 前端
   - `app/[locale]/face-swap/backend/page.module.scss` - Face Swap 後端
   - `app/[locale]/web-cam/page.module.scss` - 相機功能
   - `app/[locale]/web-authn/page.module.scss` - WebAuthn 認證

3. **組件展示**
   - `app/[locale]/components/drawer/page.module.scss` - Drawer 組件
   - `app/[locale]/components/scroll-fetch/page.module.scss` - ScrollFetch 組件

**小計**: 8 個文件，預估時間 60-80 分鐘

---

### 中優先級（測試/展示頁）⭐⭐

4. **測試頁面**
   - `app/[locale]/hooks-test/page.module.scss` - Hooks 測試
   - `app/[locale]/frontend-api-cache-test/page.module.scss` - API Cache 測試
   - `app/[locale]/socket-test/socket-io/page.module.scss` - Socket.IO 測試
   - `app/[locale]/socket-test/websocket/page.module.scss` - WebSocket 測試

5. **CSS 展示**
   - `app/[locale]/css-animejs/page.module.scss` - Anime.js 動畫
   - `app/[locale]/css-drawing/page.module.scss` - CSS 繪圖

6. **Firebase**
   - `app/[locale]/firebase/cloud-messaging/page.module.scss` - FCM

**小計**: 7 個文件，預估時間 50-70 分鐘

---

### 低優先級（資訊頁面）⭐

7. **資訊頁面**
   - `app/[locale]/about/page.module.scss` - 關於頁面
   - `app/[locale]/swagger-doc/page.module.scss` - Swagger 文檔
   - `app/[locale]/offline/page.module.scss` - 離線頁面

8. **共享模組**
   - `app/[locale]/web-rtc/_shared/room.module.scss` - WebRTC 共享樣式

**小計**: 4 個文件，預估時間 30-40 分鐘

---

## 📝 詳細修復步驟（每個文件）

### 步驟 1: 分析文件
```bash
# 查看文件中所有需要修復的 &_ 模式
grep "&_" <file>.scss
```

### 步驟 2: 修復 SCSS
1. 打開 SCSS 文件
2. 將所有 `&_element` 改為 `&-element`
3. **注意保留**：
   - 頁面根類別：`&_page` 保持不變
   - Element 內部語義詞：如 `&-upload_section` 中的 `_` 保持不變

### 步驟 3: 同步 TSX
1. 找到對應的 TSX 文件
2. 搜索所有使用舊類別名稱的地方
3. 更新 className 引用：
   ```tsx
   // 舊
   className={styles.page_name_element}
   // 新
   className={styles['page_name-element']}
   ```

### 步驟 4: 瀏覽器驗證
1. 啟動開發服務器（如果未運行）
2. 訪問修復的頁面
3. 檢查：
   - ✅ 頁面正常載入
   - ✅ 樣式正確應用
   - ✅ 無控制台錯誤
4. 截圖記錄（可選）

### 步驟 5: 更新進度
1. 在 `bem-naming-fix-progress.md` 中標記為完成
2. 記錄修復的類別數量
3. 更新統計數據

### 步驟 6: 提交
```bash
git add <files>
git commit -m "fix: BEM naming - <page-name> (X classes fixed)"
```

---

## 🗂️ 分批執行建議

### 批次 1: 高優先級核心頁面（第 1 天）
**時間**: 1.5 小時

1. route/page.module.scss
2. face-swap/page.module.scss
3. face-swap/frontend/page.module.scss
4. face-swap/backend/page.module.scss

**檢查點**: 提交並測試這 4 個頁面

---

### 批次 2: 高優先級功能頁面（第 1 天）
**時間**: 1 小時

5. web-cam/page.module.scss
6. web-authn/page.module.scss
7. components/drawer/page.module.scss
8. components/scroll-fetch/page.module.scss

**檢查點**: 提交並測試

---

### 批次 3: 中優先級測試頁面（第 2 天）
**時間**: 1 小時

9. hooks-test/page.module.scss
10. frontend-api-cache-test/page.module.scss
11. socket-test/socket-io/page.module.scss
12. socket-test/websocket/page.module.scss

**檢查點**: 提交並測試

---

### 批次 4: 中優先級展示頁面（第 2 天）
**時間**: 45 分鐘

13. css-animejs/page.module.scss
14. css-drawing/page.module.scss
15. firebase/cloud-messaging/page.module.scss

**檢查點**: 提交並測試

---

### 批次 5: 低優先級頁面（第 2 天）
**時間**: 30 分鐘

16. about/page.module.scss
17. swagger-doc/page.module.scss
18. offline/page.module.scss
19. web-rtc/_shared/room.module.scss

**最終檢查點**: 完整測試並提交

---

## ⚠️ 注意事項

### 1. 命名規則確認
- **Block-Element**: 使用 `-`
  ```scss
  .page_name {
    &-element { }  // ✅ 正確
    &_element { }  // ❌ 錯誤
  }
  ```

- **Element 內部語義詞**: 使用 `_`
  ```scss
  .page_name {
    &-upload_section { }     // ✅ 正確（upload_section 是一個 element 名稱）
    &-upload-section { }     // ❌ 錯誤
  }
  ```

- **Sub-Element**: 繼續使用 `-`
  ```scss
  .page_name {
    &-element {
      &-subelement { }       // ✅ 正確
    }
  }
  ```

### 2. 特殊情況處理

**頁面根類別**：保持不變
```scss
// 這些不需要修改
.hooks_test_page { }
.face_swap_page { }
```

**Modifier（修飾符）**：使用 `--`
```scss
.page_name {
  &-element {
    &--modifier { }          // ✅ 正確
  }
}
```

### 3. TSX 同步檢查清單

- [ ] 檢查所有 `className={styles.xxx}` 
- [ ] 檢查所有 `className={styles['xxx']}`
- [ ] 檢查動態類別組合
- [ ] 檢查條件渲染的類別

### 4. 測試檢查清單

每個頁面修復後必須檢查：
- [ ] 頁面可以正常訪問
- [ ] 所有樣式正確顯示
- [ ] 響應式布局正常
- [ ] 無控制台錯誤
- [ ] 無 404 樣式文件錯誤

---

## 📈 進度追蹤

使用 `bem-naming-fix-progress.md` 追蹤每個文件的狀態：
- ⏳ 待處理
- 🔄 進行中
- ✅ 已完成
- ❌ 發現問題

---

## 🔧 快速參考命令

### 查找需要修復的文件
```bash
grep -r "&_" app/[locale] --include="*.scss" | grep -v "&_page" | cut -d: -f1 | sort -u
```

### 查看單個文件需要修復的數量
```bash
grep -c "&_" <file>.scss
```

### 查找 TSX 中使用的類別
```bash
grep "className.*styles" <file>.tsx
```

### 測試頁面
```bash
# 啟動開發服務器
yarn dev-https:webpack

# 訪問頁面
https://localhost:3000/zh-tw/<page-path>
```

---

## 📚 參考文檔

- [README.zh-tw.md](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/README.zh-tw.md) - CSS 命名規範
- [bem-naming-fix-progress.md](file:///c:/Users/User/Desktop/code/parker-nextjs-lab/docs/in-progress/bem-naming-fix-progress.md) - 進度追蹤

---

## ✅ 完成標準

所有文件修復完成後：
1. ✅ 所有 SCSS 文件中沒有錯誤的 `&_element` 模式
2. ✅ 所有 TSX 文件中的 className 已同步
3. ✅ 所有頁面瀏覽器測試通過
4. ✅ 進度文件已更新為 100% 完成
5. ✅ 所有修改已提交到 git

---

**建立者**: AI Agent  
**最後更新**: 2025-12-22 19:02  
**狀態**: 📋 等待執行
