# Recipe: Game Constants & String Keys

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Gom nhóm các hằng số chuỗi (String Magic Numbers), Scene Names, Animator Parameter Hashes, PlayerPrefs Keys, Audio Sound IDs, Tag & Layer Names vào một nơi tập trung.
- **Khi nào KHÔNG áp dụng:** Dữ liệu có thể thay đổi lúc runtime hoặc cần designer tinh chỉnh thường xuyên (dùng ScriptableObject).

---

# 2. Standard Code Pattern

```csharp
using UnityEngine;

namespace MyGame.Core {
    public static class GameConstants {
        // 1. Tên Scene
        public static class Scenes {
            public const string Bootstrap = "Bootstrap";
            public const string MainMenu = "MainMenu";
            public const string Gameplay = "Gameplay";
        }

        // 2. Tags & Layers
        public static class Tags {
            public const string Player = "Player";
            public const string Enemy = "Enemy";
            public const string Bullet = "Bullet";
        }

        public static class Layers {
            public const string Default = "Default";
            public const string UI = "UI";
            public static readonly int ObstacleMask = LayerMask.GetMask("Obstacle");
        }

        // 3. Animator Hashes (Tối ưu hiệu năng thay vì truyền string vào Animator)
        public static class AnimParams {
            public static readonly int Speed = Animator.StringToHash("Speed");
            public static readonly int IsGrounded = Animator.StringToHash("IsGrounded");
            public static readonly int AttackTrigger = Animator.StringToHash("Attack");
        }

        // 4. PlayerPrefs / Storage Keys
        public static class PrefKeys {
            public const string SoundVolume = "sound_volume";
            public const string MusicVolume = "music_volume";
            public const string HighScore = "high_score";
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **`Animator.StringToHash`:** CẤM gọi `animator.SetBool("IsGrounded", true)` bằng chuỗi string trực tiếp mỗi frame trong Update. LUÔN cache chuỗi thành `int` hash tĩnh (`Animator.StringToHash`) để tiết kiệm CPU.
- **Tập trung hóa (Centralization):** Tuyệt đối KHÔNG viết "magic string" rải rác trong code (VD: `SceneManager.LoadScene("Game")`).
- **Đặt trong `public static class`:** Toàn bộ hằng số gom nhóm dạng static class lồng nhau (`GameConstants.Scenes.MainMenu`).

---

# 4. Implementation Steps
1. Mở file constants chung của dự án trong `MyGame.Core`.
2. Tạo các static subclass theo từng phân hệ chức năng (`Scenes`, `Tags`, `Layers`, `AnimParams`).
3. Dùng `const string` cho hằng số chuỗi và `static readonly int` cho hash / layermask.

---

# 5. Runtime Gotchas
- **Đổi tên Scene trong Build Settings mà quên sửa Constants:** Nếu đổi tên Scene trong Unity mà không cập nhật constant, code sẽ load scene thất bại.
- **LayerMask.GetMask lúc static init:** `LayerMask.GetMask` chỉ hoạt động chính xác sau khi Unity Engine đã khởi tạo các Layer trong Project Settings.

---

# 6. Verification
- Chạy `/convention-check`.
- Kiểm tra toàn bộ code trong dự án xem còn sót "magic string" nào chưa được gom về constants không.
