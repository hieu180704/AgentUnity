# Recipe: Event System & Decoupling

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Cần truyền thông điệp hoặc tín hiệu giữa các hệ thống không phụ thuộc trực tiếp vào nhau (Decoupled architecture), ví dụ: Player chết -> thông báo cho `UIManager`, `AudioManager`, `AnalyticsManager`.
- **Khi nào KHÔNG áp dụng:** Gọi hàm trực tiếp trong cùng một Component hoặc giữa các component con chặt chẽ trong cùng một Prefab.

---

# 2. Standard Code Pattern

### A. Static C# Event Pattern (Gọn nhẹ, Type-safe)

```csharp
using System;

namespace MyGame.Events {
    // 1. Định nghĩa dữ liệu sự kiện dạng struct (tránh cấp phát GC)
    public struct PlayerDiedEvent {
        public readonly int PlayerId;
        public readonly string CauseOfDeath;

        public PlayerDiedEvent(int playerId, string causeOfDeath) {
            PlayerId = playerId;
            CauseOfDeath = causeOfDeath;
        }
    }

    // 2. Bus tĩnh trung gian
    public static class GameEvents {
        public static event Action<PlayerDiedEvent> OnPlayerDied;

        public static void RaisePlayerDied(PlayerDiedEvent evt) {
            OnPlayerDied?.Invoke(evt);
        }
    }
}
```

### B. Cách Subscribe & Unsubscribe an toàn

```csharp
using UnityEngine;
using MyGame.Events;

namespace MyGame.UI {
    public class GameOverUI : MonoBehaviour {
        private void OnEnable() {
            GameEvents.OnPlayerDied += HandlePlayerDied;
        }

        private void OnDisable() {
            GameEvents.OnPlayerDied -= HandlePlayerDied;
        }

        private void HandlePlayerDied(PlayerDiedEvent evt) {
            Debug.Log($"Hiển thị UI GameOver cho Player {evt.PlayerId}");
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Cặp OnEnable / OnDisable:** Luôn subscribe trong `OnEnable` và unsubscribe trong `OnDisable` (hoặc `Awake` và `OnDestroy`). BỎ QUÊN unsubscribe là nguyên nhân số 1 gây Memory Leak trong Unity!
- **Data Payload dạng Struct:** Sử dụng `readonly struct` cho event payload để tránh sinh rác GC (Garbage Collection) khi phát sự kiện thường xuyên.
- **Null Safety:** Khi kích hoạt event, luôn dùng toán tử null-conditional `?.Invoke()`.

---

# 4. Implementation Steps
1. Định nghĩa struct event payload trong namespace `MyGame.Events`.
2. Tạo static event hoặc ScriptableObject GameEvent.
3. Bên phát sự kiện: Gọi `Raise...()`.
4. Bên nhận sự kiện: Đăng ký tại `OnEnable` và huỷ tại `OnDisable`.

---

# 5. Runtime Gotchas
- **Phát event khi đối tượng chưa kịp Init:** Nếu Event được bắn trong `Awake()` của script A, trong khi script B đăng ký ở `Start()`, script B sẽ bỏ lỡ sự kiện. Khuyến nghị chỉ bắn gameplay event sau khi toàn bộ hệ thống đã hoàn tất khởi tạo.
- **Lỗi Exception trong 1 Listener:** Nếu 1 listener ném ngoại lệ (Exception), toàn bộ các listener đăng ký phía sau trong danh sách sẽ bị ngừng thực thi.

---

# 6. Verification
- Chạy `/convention-check`.
- Thử tắt bật GameObject chứa Listener nhiều lần, đảm bảo không nhận duplicate event hoặc NRE khi đổi scene.
