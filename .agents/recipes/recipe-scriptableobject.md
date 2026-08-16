# Recipe: ScriptableObject Configuration & Catalog

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Lưu trữ dữ liệu cấu hình tĩnh (Game Configs, Chỉ số vũ khí, Bảng giá shop, Danh mục âm thanh SoundCatalog) do Game Designer chỉnh sửa trong Unity Editor.
- **Khi nào KHÔNG áp dụng:** Dữ liệu runtime thay đổi theo người chơi (điểm số, vàng, vị trí) -> Dùng Save Data hoặc Plain Class.

---

# 2. Standard Code Pattern

```csharp
using System.Collections.Generic;
using UnityEngine;

namespace MyGame.Config {
    [CreateAssetMenu(fileName = "GameConfig", menuName = "MyGame/Configs/GameConfig", order = 1)]
    public class GameConfig : ScriptableObject {
        [Header("Player Balance")]
        [Tooltip("Tốc độ di chuyển cơ bản của người chơi")]
        [SerializeField] private float moveSpeed = 5f;

        [Tooltip("Lượng máu tối đa ban đầu")]
        [SerializeField] private int maxHealth = 100;

        [Header("Level Settings")]
        [SerializeField] private List<int> levelTargetScores = new List<int>();

        // Properties chỉ đọc (Read-only) bảo vệ dữ liệu không bị ghi đè lúc runtime
        public float MoveSpeed => moveSpeed;
        public int MaxHealth => maxHealth;
        public IReadOnlyList<int> LevelTargetScores => levelTargetScores;

#if UNITY_EDITOR
        private void OnValidate() {
            if (moveSpeed < 0f) moveSpeed = 0f;
            if (maxHealth <= 0) maxHealth = 1;
        }
#endif
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Bảo vệ Immutability lúc Runtime:** Các field cài đặt phải là `[SerializeField] private` kèm Public Property `get` (hoặc `IReadOnlyList`). KHÔNG cho phép code runtime sửa trực tiếp giá trị của ScriptableObject để tránh làm bẩn Asset (.asset dirty) trong Unity Editor.
- **`CreateAssetMenu` Attribute:** Luôn khai báo `fileName` và `menuName` có phân cấp rõ ràng (VD: `MyGame/Configs/...`).
- **Validation trong Editor:** Sử dụng `#if UNITY_EDITOR` và `OnValidate()` để kiểm tra chặn các giá trị âm hoặc null ngay trong Inspector.

---

# 4. Implementation Steps
1. Khai báo class kế thừa `ScriptableObject` với `[CreateAssetMenu]`.
2. Đặt các field trong namespace phân hệ (VD: `MyGame.Config`, `MyGame.Items`).
3. Trong Unity Editor: Chuột phải trong Project window -> `Create > MyGame > Configs > ...`.
4. Điền các chỉ số trong Inspector.

---

# 5. Runtime Gotchas
- **Ghi đè giá trị trong Play Mode:** Nếu code runtime gán giá trị vào ScriptableObject (`config.moveSpeed = 10`), giá trị này sẽ bị lưu lại vĩnh viễn trên Asset trong Unity Editor (nhưng không lưu trên bản Build độc lập). Luôn tuân thủ nguyên tắc read-only!
- **Sửa file .asset bằng Text Tool:** CẤM tuyệt đối dùng text editor sửa trực tiếp nội dung file `.asset` vì rất dễ làm hỏng YAML GUID/fileID.

---

# 6. Verification
- Chạy `/convention-check`.
- Tạo asset trong Unity Editor, gán giá trị, chạy Play Mode xem các hệ thống đọc dữ liệu có chính xác không.
