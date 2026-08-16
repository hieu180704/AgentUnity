# Recipe: Assembly Definitions (.asmdef) Architecture

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Sơ Đồ Phân Tầng Phụ Thuộc 1 Chiều](#2-sơ-đồ-phân-tầng-phụ-thuộc-1-chiều)
3. [Mẫu File .asmdef Chuẩn Cho Từng Tầng](#3-mẫu-file-asmdef-chuẩn-cho-từng-tầng)
4. [Mandatory Rules](#4-mandatory-rules)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Chia nhỏ dự án Unity thành các module độc lập để **giảm thời gian biên dịch (Compile time) xuống < 1 giây**, ngăn chặn phụ thuộc vòng (Circular Dependencies), và tăng tốc tối đa vòng lặp phản hồi của AI Agent.
- **Khi nào KHÔNG áp dụng:** Dự án siêu nhỏ prototype 1-2 script (không đáng chia).

---

# 2. Sơ Đồ Phân Tầng Phụ Thuộc 1 Chiều

```text
       ┌──────────────────────────────────────────────┐
       │                 MyGame.Tests                 │
       └──────────────────────┬───────────────────────┘
                              │ (Tham chiếu tất cả để test)
       ┌──────────────────────▼───────────────────────┐
       │                  MyGame.UI                   │
       └──────────────────────┬───────────────────────┘
                              │
       ┌──────────────────────▼───────────────────────┐
       │               MyGame.Gameplay                │
       └──────────────────────┬───────────────────────┘
                              │
       ┌──────────────────────▼───────────────────────┐
       │               MyGame.Managers                │
       └──────────────────────┬───────────────────────┘
                              │
       ┌──────────────────────▼───────────────────────┐
       │                 MyGame.Core                  │
       │ (Interfaces, Enums, Base Types, Math Helpers)│
       └──────────────────────────────────────────────┘
```
*(Mũi tên chỉ hướng tham chiếu: Tầng trên tham chiếu tầng dưới, tầng dưới TUYỆT ĐỐI không tham chiếu ngược lại).*

---

# 3. Mẫu File .asmdef Chuẩn Cho Từng Tầng

### A. `MyGame.Core.asmdef` (Tại `Assets/_Project/Scripts/Core/`)
```json
{
    "name": "MyGame.Core",
    "rootNamespace": "MyGame.Core",
    "references": [],
    "includePlatforms": [],
    "excludePlatforms": [],
    "allowUnsafeCode": false,
    "overrideReferences": false,
    "precompiledReferences": [],
    "autoReferenced": true,
    "defineConstraints": [],
    "versionDefines": [],
    "noEngineReferences": false
}
```

### B. `MyGame.Managers.asmdef` (Tại `Assets/_Project/Scripts/Managers/`)
```json
{
    "name": "MyGame.Managers",
    "rootNamespace": "MyGame.Managers",
    "references": [
        "MyGame.Core"
    ],
    "autoReferenced": true
}
```

### C. `MyGame.Gameplay.asmdef` (Tại `Assets/_Project/Scripts/Gameplay/`)
```json
{
    "name": "MyGame.Gameplay",
    "rootNamespace": "MyGame.Gameplay",
    "references": [
        "MyGame.Core",
        "MyGame.Managers"
    ],
    "autoReferenced": true
}
```

### D. `MyGame.UI.asmdef` (Tại `Assets/_Project/Scripts/UI/`)
```json
{
    "name": "MyGame.UI",
    "rootNamespace": "MyGame.UI",
    "references": [
        "MyGame.Core",
        "MyGame.Managers",
        "Unity.TextMeshPro"
    ],
    "autoReferenced": true
}
```

### E. `MyGame.Tests.asmdef` (Tại `Assets/_Project/Tests/`)
```json
{
    "name": "MyGame.Tests",
    "rootNamespace": "MyGame.Tests",
    "references": [
        "UnityEngine.TestRunner",
        "UnityEditor.TestRunner",
        "MyGame.Core",
        "MyGame.Managers",
        "MyGame.Gameplay"
    ],
    "includePlatforms": [
        "Editor"
    ],
    "overrideReferences": true,
    "precompiledReferences": [
        "nunit.framework.dll"
    ],
    "autoReferenced": false,
    "defineConstraints": [
        "UNITY_INCLUDE_TESTS"
    ]
}
```

---

# 4. Mandatory Rules (MUST)
- **Quy tắc 1 chiều:** `MyGame.Core` KHÔNG BAO GIỜ được thêm reference đến `MyGame.Gameplay` hay `MyGame.UI`. Nếu cần gọi lên tầng trên, phải dùng **Event Bus** hoặc **Interface Callback**.
- **Root Namespace:** Luôn khai báo trường `"rootNamespace"` trong file `.asmdef` để IDE tự động điền namespace đúng khi tạo file `.cs` mới.

---

# 5. Runtime Gotchas
- **Phụ thuộc vòng (Circular Dependency):** Nếu Assembly A trỏ vào B, và B trỏ ngược vào A -> Unity sẽ báo lỗi đỏ compile không thể giải quyết cho đến khi gỡ liên kết vòng.
- **Missing References trong Inspector:** Khi vừa tạo file `.asmdef`, các ScriptableObject hoặc Prefab cũ có thể cần 1 lần Unity Reimport để ánh xạ lại tên Assembly mới.

---

# 6. Verification
- Chạy thử sửa 1 file trong `Assets/_Project/Scripts/Gameplay/` -> Đo thời gian Unity Compile: Phải < 1 giây.
