# Recipe: Manager / System Service

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Cần tạo một Manager / Service điều phối một phân hệ logic độc lập trong game (VD: `AudioManager`, `InventoryManager`, `GameFlowManager`, `SaveManager`).
- **Khi nào KHÔNG áp dụng:**
  - Logic gắn liền với một thực thể cụ thể (VD: Player, Enemy, Weapon) -> Viết Component thông thường.
  - Xử lý dữ liệu thuần không cần MonoBehaviour -> Dùng plain C# class hoặc ScriptableObject.

---

# 2. Standard Code Pattern

```csharp
using UnityEngine;

namespace MyGame.Core {
    public class GameManager : MonoBehaviour {
        [Header("Configuration")]
        [Tooltip("Tự động khởi tạo khi Awake nếu không có Bootstrapper")]
        [SerializeField] private bool autoInitialize = true;

        public bool IsInitialized { get; private set; }

        private void Awake() {
            if (autoInitialize && !IsInitialized) {
                Initialize();
            }
        }

        public virtual void Initialize() {
            if (IsInitialized) return;

            SubscribeEvents();
            SetupInitialState();

            IsInitialized = true;
        }

        public virtual void Shutdown() {
            if (!IsInitialized) return;

            UnsubscribeEvents();
            CleanupState();

            IsInitialized = false;
        }

        private void OnDestroy() {
            Shutdown();
        }

        protected virtual void SubscribeEvents() {
            // Subscribe C# Events / Event Bus tại đây
        }

        protected virtual void UnsubscribeEvents() {
            // Hủy đăng ký tất cả events để tránh memory leak
        }

        private void SetupInitialState() { }
        private void CleanupState() { }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Kiểm soát Lifecycle:** Luôn có cặp `Initialize()` và `Shutdown()` để cho phép reset hoặc khởi động lại mà không phụ thuộc tuyệt đối vào `Awake()`/`Start()`.
- **Hủy Event:** BẮT BUỘC hủy đăng ký toàn bộ event trong `UnsubscribeEvents()` / `OnDestroy()` để tránh Memory Leak và NullReferenceException khi đổi Scene.
- **Inspector Layout:** Gom nhóm các field serialize bằng `[Header("...")]` và có `[Tooltip("...")]` rõ ràng.

---

# 4. Implementation Steps
1. Khai báo namespace chuẩn phân hệ (VD: `MyGame.Core`, `MyGame.Audio`).
2. Định nghĩa các field cài đặt với `[SerializeField] private`.
3. Cài đặt logic trong `Initialize()` và `Shutdown()`.
4. Đăng ký/Hủy đăng ký các sự kiện tương ứng.

---

# 5. Runtime Gotchas
- **Gọi method trước khi Initialize:** Nếu các hệ thống khác gọi method của Manager khi `IsInitialized == false`, có thể gây lỗi trạng thái chưa sẵn sàng. Hãy kiểm tra `if (!IsInitialized) Initialize();` hoặc log cảnh báo.
- **Đổi Scene (Scene Reload):** Nếu Manager đặt `DontDestroyOnLoad`, chú ý các tham chiếu đến GameObject trong Scene cũ sẽ bị `MissingReferenceException`.

---

# 6. Verification
- Chạy `/convention-check`.
- Thử nghiệm load Scene 2 lần liên tiếp: Đảm bảo không bị duplicate Manager và không có event bắn vào object đã bị destroy.
