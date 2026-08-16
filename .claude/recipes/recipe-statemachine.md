# Recipe: Finite State Machine (FSM)

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Đối tượng hoặc hệ thống có $N$ trạng thái rời rạc chuyển qua lại (Gameplay Phase: Intro -> Playing -> Paused -> GameOver; Character AI: Idle -> Patrol -> Chase -> Attack; UI Tab switching).
- **Khi nào KHÔNG áp dụng:** Cờ logic nhị phân đơn giản (VD: `isMuted`, `isVibrating`) -> Dùng bool flag thông thường.

---

# 2. Standard Code Pattern

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

namespace MyGame.StateMachine {
    // 1. Interface cho từng State cụ thể
    public interface IState {
        void Enter();
        void Update();
        void Exit();
    }

    // 2. State Machine Controller
    public class SimpleStateMachine {
        public IState CurrentState { get; private set; }
        public IState PreviousState { get; private set; }

        public event Action<IState, IState> OnStateChanged;

        public void ChangeState(IState newState) {
            if (CurrentState == newState) return;

            CurrentState?.Exit();
            PreviousState = CurrentState;

            CurrentState = newState;
            CurrentState?.Enter();

            OnStateChanged?.Invoke(PreviousState, CurrentState);
        }

        public void Update() {
            CurrentState?.Update();
        }
    }

    // 3. Ví dụ một State cụ thể
    public class PlayerIdleState : IState {
        private readonly MonoBehaviour owner;

        public PlayerIdleState(MonoBehaviour owner) {
            this.owner = owner;
        }

        public void Enter() {
            // Setup animation Idle, reset velocity
        }

        public void Update() {
            // Check điều kiện chuyển sang Run/Jump
        }

        public void Exit() {
            // Dọn dẹp trước khi rời state
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Tách biệt Logic Enter / Exit:** Mọi logic đăng ký listener, trigger animation hay reset tốc độ phải nằm trong `Enter()` và được dọn sạch trong `Exit()`.
- **Tránh Chuyển State Vô Tận (Infinite State Loop):** CẤM gọi `ChangeState()` sang một State khác ngay bên trong hàm `Enter()` của State hiện tại mà không có điều kiện bảo vệ (dẫn đến StackOverflowException).
- **Null Safety:** Luôn kiểm tra `CurrentState != null` trước khi gọi `Update()` hoặc `Exit()`.

---

# 4. Implementation Steps
1. Định nghĩa enum các trạng thái hoặc các class implement interface `IState`.
2. Khởi tạo instance `SimpleStateMachine` trong class điều khiển (VD: `PlayerController`).
3. Tạo các instance của từng State và truyền tham chiếu Context cần thiết.
4. Gọi `sm.ChangeState(initialState)` trong `Start()` hoặc `Initialize()`.
5. Chuyển tiếp hàm `sm.Update()` từ `Update()` của MonoBehaviour.

---

# 5. Runtime Gotchas
- **Quên gọi Exit():** Bỏ qua bước gọi `Exit()` của State cũ khiến trạng thái trước đó không được giải phóng (VD: Particle effect vẫn tiếp tục chạy).
- **Trạng thái Destroyed:** Nếu State giữ tham chiếu đến GameObject/Transform đã bị Destroy, khi State kích hoạt lại sẽ gây `MissingReferenceException`.

---

# 6. Verification
- Chạy `/convention-check`.
- Chuyển đổi qua lại giữa tất cả các trạng thái nhiều lần, kiểm tra Log và Console không xuất hiện NRE.
