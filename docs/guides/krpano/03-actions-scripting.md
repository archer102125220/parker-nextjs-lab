# 3. Action 腳本編程

Krpano 主要透過 Action Scripting 語言來撰寫邏輯。這是一種簡單的程序式語言，語法結構類似於 C 或 JavaScript，但有其獨特的規則。

## 定義與呼叫

### 定義
Action 必須寫在 XML 的 `<action>` 標籤內。

```xml
<action name="greet_user">
    trace('Hello, ', %1);
</action>
```

### 呼叫
你可以從任何事件屬性 (如 `onclick`) 或其他 Action 中呼叫它。

```xml
<!-- XML 屬性 -->
<layer ... onclick="greet_user(Parker);" />

<!-- 其他 Action -->
<action name="init">
    greet_user(Parker);
</action>
```

---

## 語法核心

### 1. 參數 (Args)
Krpano 不使用傳統的變數宣告傳參，而是使用 `%1` 到 `%99` 的佔位符。
- `%0`: Action 自己的名稱
- `%1`: 第一個參數
- `%2`: 第二個參數 ...以此類推

### 2. 變數與賦值 (`set` / `get`)
Krpano 主要使用 `set()` 來賦值，`get()` 來取值（但在表達式中常省略 `get`）。

```xml
set(my_var, 100);             // my_var = 100
set(view.fov, 90);            // 修改視角 FOV
set(layer[logo].visible, false); // 隱藏圖層
```

### 3. 計算 (`calc`)
**重要**：Krpano 的 `set` 預設是處理字串或直接數值。如果要進行數學運算，**必須**使用 `calc()`。

```xml
set(w, 100);
set(h, 200);

// 錯誤：area 會變成字串 "w * h" 或報錯
set(area, w * h); 

// 正確：使用 calc
set(area, calc(w * h));
```

---

## 控制流程

### IF 判斷式
`if(條件, 成立執行, 不成立執行)`
注意：三個區塊是用逗號 `,` 分隔的。

```xml
if(layer[btn].visible == true,
    trace('按鈕可見');
    set(layer[btn].visible, false);
,
    trace('按鈕隱藏');
    set(layer[btn].visible, true);
);
```
*提示：如果是多行程式碼，建議換行保持可讀性，但要注意逗號位置。*

### 迴圈
Krpano 1.19+ 支援 `for` 迴圈。

```xml
for(set(i,0), i LT 10, inc(i),
    trace('Index: ', i);
);
```
- `LT` = Less Than (<)
- `GT` = Greater Than (>)
- `LE` = Less Equal (<=)
- `GE` = Greater Equal (>=)
- `EQ` = Equal (==)
- `NE` = Not Equal (!=)

---

## JS 動態注入 (JS Injection)

這是 Krpano 最強大的功能之一，允許你在 JavaScript 中動態生成 Krpano Action。這在 React 開發中非常有用，因為你可以根據複雜的 JS 邏輯來編寫 Action。

使用 `addaction(name, code)`：

```javascript
// 在 React 組件或 JS 檔案中
const hotspotName = "spot_" + id;

krpano.call(`
    addaction(dynamic_click_${id},
        trace('你點擊了動態產生的熱點: ${id}');
        loadscene(scene_${id}, null, MERGE);
    );
`);

// 將其綁定到熱點
krpano.set(`hotspot[${hotspotName}].onclick`, `dynamic_click_${id}();`);
```

---

## 常用指令速查表

| 指令 | 描述 | 範例 |
|------|------|------|
| `trace(msg)` | 輸出 Log | `trace('Val:', x);` |
| `copy(dst, src)` | 複製變數值 | `copy(v, view.hlookat);` |
| `delete(var)` | 刪除變數 | `delete(my_var);` |
| `tween(var, val, time)` | 動畫過渡 | `tween(view.fov, 120, 1.0);` |
| `lookto(h, v, fov)` | 視角移動 | `lookto(0, 0, 90);` |
| `loadscene(name)` | 載入場景 | `loadscene(scene1);` |
| `openurl(url, target)` | 開啟連結 | `openurl('http://...', _blank);` |
| `js(func)` | 執行 JS 函式 | `js( alert('Hi') );` |

> 更多指令請查閱 [官方 Action 文件](https://krpano.com/docu/actions/)。
