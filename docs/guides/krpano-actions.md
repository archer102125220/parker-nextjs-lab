# Krpano Action Scripting 指南

Krpano Action Scripting 是 Krpano 的核心腳本語言，用來控制查看器的行為、動畫、邏輯判斷以及與使用者互動。本文檔提供全面性的語法與使用說明。

## 1. Action 基礎

Action 類似於程式語言中的「函式 (Function)」。它們定義在 XML 中，可以被從 XML 事件（如 `onclick`）或 JavaScript 中呼叫。

### 定義 Action
在 XML 中使用 `<action>` 標籤定義：

```xml
<action name="hello_world">
    trace('Hello Krpano!');
    showlog();
</action>
```

### 呼叫 Action
- **XML 屬性中**：`onclick="hello_world();"`
- **其他 Action 中**：`hello_world();`
- **JavaScript 中**：`krpano.call("hello_world();");`

---

## 2. 語法與參數

### 參數傳遞
呼叫 Action 時可以傳遞參數，在 Action 內部使用 `%1`, `%2`, `%3` ... 來接收。

```xml
<action name="move_hotspot">
    <!-- %1 = hotspot name, %2 = new x position -->
    set(hotspot[%1].ath, %2);
</action>
```
呼叫：`move_hotspot(spot1, 45);`

- `%0`：代表 Action 自己的名稱。
- `%1` ~ `%99`：傳入的參數。
- 參數可以用引號包起，也可以不用（視內容是否有特殊字元而定）。

### 變數與表達式
- **變數存取**：通常直接寫變數名稱，如 `view.hlookat`。
- **陣列/物件存取**：`hotspot[name].visible`。
- **計算 (Calc)**：Krpano 語法中，賦值通常需要明確指定計算，否則會被視為字串。

```xml
set(dst, 100);          <!-- dst 變成字串 "100" 或數值 100 -->
set(dst, get(src));     <!-- 將 src 的變數值賦予 dst -->
set(dst, calc(src * 2)); <!-- 進行數學運算 -->
```

---

## 3. 控制結構 (Control Flow)

### 若 (If)
```xml
if(condition, true_actions, false_actions);
```
範例：
```xml
if(hotspot[spot1].visible,
    set(hotspot[spot1].visible, false);
    trace('Hidden');
,
    set(hotspot[spot1].visible, true);
    trace('Shown');
);
```
> **注意**：Krpano 的 `if` 語法中，`true` 和 `false` 區塊是直接寫在參數位置，用逗號分隔。

### 迴圈 (Loop/For)
Krpano 主要使用 `loop` 或 `for` 來迭代。

```xml
<!-- loop(condition, loop_actions) -->
set(i, 0);
loop(i LT 10,
    trace('Index:', i);
    inc(i);
);
```

```xml
<!-- for(start_actions, condition, next_actions, loop_actions) -->
for(set(i,0), i LT count, inc(i),
    trace('Hotspot:', hotspot[get(i)].name);
);
```

---

## 4. 常用內建指令

| 指令 | 說明 | 範例 |
|------|------|------|
| `set(var, val)` | 設定變數值 | `set(view.fov, 90);` |
| `get(var)` | 取得變數值 | `set(val, get(view.fov));` |
| `calc(expr)` | 計算數學表達式 | `set(res, calc(w * h));` |
| `trace(msg)` | 輸出到除錯控制台 | `trace('Val:', val);` |
| `call(action)` | 呼叫另一個 Action | `call(init_scene);` 或直接 `init_scene();` |
| `tween(var, dest, time)` | 建立補間動畫 | `tween(view.hlookat, 180, 2.0);` |
| `delayedcall(time, code)` | 延遲執行 | `delayedcall(1.0, lookto(0,0));` |
| `addhotspot(name)` | 動態新增熱點 | `addhotspot(new_spot);` |
| `removehotspot(name)` | 移除熱點 | `removehotspot(new_spot);` |

---

## 5. JavaScript 整合

### JS 呼叫 Krpano Action
```javascript
// 基本呼叫
krpano.call("loadscene(scene2);");

// 設定變數
krpano.set("view.fov", 100);

// 取得變數 (回傳值可能是字串或數值)
const fov = krpano.get("view.fov");
```

### JS 動態注入 Action (`addaction`)
您可以在執行時期透過 JS 定義新的 Action：

```javascript
/* 
    addaction(name, code)
    - name: action名稱
    - code: action 的內容字串
*/
krpano.call(`
    addaction(js_dynamic_action,
        trace('Action created from JS!');
        tween(view.fov, 120);
    );
`);
```

### Action 呼叫 JS (`js()`)
在 Krpano Action 中執行 JavaScript 函式：

```xml
<action name="call_js_func">
    <!-- 呼叫 window 下的全域函式 -->
    js( myGlobalFunction(get(view.hlookat)) );
</action>
```

---

## 6. 最佳實踐

1.  **邏輯分離**：將主要的邏輯保留在 XML (`custom_actions.xml`) 中，React/JS 僅負責觸發狀態改變。
2.  **避免複雜計算**：雖然 Krpano 支援計算，但極度複雜的數學運算在 JS 中做會更乾淨，算出結果後再 `set` 回 Krpano。
3.  **命名慣例**：Action 名稱建議使用 ` snake_case`，並具備描述性（如 `toggle_menu`, `load_intro_scene`）。
4.  **除錯**：善用 `trace()` 與 `showlog()` 來檢查變數狀態。按 `O` 鍵通常可以開啟 Krpano 的 Log 視窗。

## 參考資源
- [Krpano XML Reference](https://krpano.com/docu/xml/)
- [Krpano Actions / Scripting](https://krpano.com/docu/actions/)
