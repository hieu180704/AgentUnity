# Recipe: Save Data & State Persistence

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Lưu trữ trạng thái game của người chơi (tiền tệ, tiến trình level, cài đặt âm thanh, mở khóa nhân vật...) xuống đĩa hoặc PlayerPrefs/JSON/EasySave.
- **Khi nào KHÔNG áp dụng:** Dữ liệu cấu hình tĩnh không đổi của Game Designer (dùng ScriptableObject).

---

# 2. Standard Code Pattern

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

namespace MyGame.Save {
    [Serializable]
    public class PlayerSaveData {
        [Header("Version & Metadata")]
        public int schemaVersion = 1;
        public long lastSavedTimestamp;

        [Header("Economy")]
        public int coins = 0;
        public int gems = 0;

        [Header("Progression")]
        public int currentLevel = 1;
        public List<string> unlockedItems = new List<string>();

        // Phương thức tạo dữ liệu mặc định ban đầu
        public static PlayerSaveData CreateDefault() {
            return new PlayerSaveData {
                schemaVersion = 1,
                lastSavedTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                coins = 100, // Tiền khởi đầu
                gems = 0,
                currentLevel = 1,
                unlockedItems = new List<string> { "starter_sword" }
            };
        }

        // Hook xử lý nâng cấp version khi cập nhật game
        public void MigrateIfNeeded() {
            if (schemaVersion < 2) {
                // Xử lý migrate từ v1 -> v2 (VD: thêm trường mới)
                schemaVersion = 2;
            }
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Schema Versioning:** LUÔN có trường `schemaVersion` kiểu `int` trong mọi Save Data class để sau này cập nhật game mới không làm hỏng dữ liệu người chơi cũ.
- **Khởi tạo danh sách mặc định:** Mọi field dạng `List<>` hoặc `Dictionary<>` phải được khởi tạo sẵn (`= new List<...>()`), tránh bị `NullReferenceException` khi deserialize file save mới.
- **Timestamp ghi nhận:** Lưu thời gian UTC (`DateTimeOffset.UtcNow.ToUnixTimeSeconds()`) để phục vụ kiểm tra save mới/cũ hoặc tính toán phần thưởng offline.

---

# 4. Implementation Steps
1. Khai báo class có attribute `[Serializable]`.
2. Tạo hàm `CreateDefault()` trả về cấu hình chơi lần đầu.
3. Tạo phương thức `MigrateIfNeeded()` để xử lý nâng cấp schema version.
4. Tích hợp vào SaveManager / JsonUtility / EasySave.

---

# 5. Runtime Gotchas
- **Xóa / Đổi tên trường dữ liệu:** Nếu đổi tên biến trong class SaveData mà không viết logic migrate, dữ liệu cũ của trường đó trong file save của người chơi sẽ bị mất trắng.
- **Lưu đồng thời (Race Condition):** Tránh ghi file save liên tục trên mỗi frame. Chỉ lưu khi có sự kiện quan trọng (hoàn thành level, mua đồ) hoặc khi app pause/quit.

---

# 6. Verification
- Chạy `/convention-check`.
- Thử nghiệm: Xóa file save -> kiểm tra tạo file mới có đủ data default -> sửa file save với `schemaVersion = 0` -> kiểm tra logic migrate có chạy đúng không.
