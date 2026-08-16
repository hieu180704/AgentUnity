# Recipe: UI Panel / Popup / Screen

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Tạo các cửa sổ giao diện người dùng như màn hình chính (HomeScreen), bảng cài đặt (SettingsPopup), bảng kết thúc màn chơi (GameOverPanel), hoặc hộp thoại xác nhận (ConfirmDialog).
- **Khi nào KHÔNG áp dụng:** Widget nhỏ lặp lại (VD: Item slot, HP Bar, Button) -> Dùng sub-component UI.

---

# 2. Standard Code Pattern

```csharp
using System;
using UnityEngine;
using UnityEngine.UI;

namespace MyGame.UI {
    [RequireComponent(typeof(CanvasGroup))]
    public class SettingsPanel : MonoBehaviour {
        [Header("Components")]
        [SerializeField] private CanvasGroup canvasGroup;
        [SerializeField] private Button closeButton;
        [SerializeField] private Slider volumeSlider;

        public bool IsOpen { get; private set; }

        private void Awake() {
            if (canvasGroup == null) {
                canvasGroup = GetComponent<CanvasGroup>();
            }

            if (closeButton != null) {
                closeButton.onClick.AddListener(Close);
            }
        }

        private void OnDestroy() {
            if (closeButton != null) {
                closeButton.onClick.RemoveListener(Close);
            }
        }

        public virtual void Open() {
            if (IsOpen) return;

            gameObject.SetActive(true);
            SetVisibility(true);
            IsOpen = true;

            OnPanelOpened();
        }

        public virtual void Close() {
            if (!IsOpen) return;

            SetVisibility(false);
            gameObject.SetActive(false);
            IsOpen = false;

            OnPanelClosed();
        }

        protected virtual void SetVisibility(bool visible) {
            canvasGroup.alpha = visible ? 1f : 0f;
            canvasGroup.interactable = visible;
            canvasGroup.blocksRaycasts = visible;
        }

        protected virtual void OnPanelOpened() { }
        protected virtual void OnPanelClosed() { }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **CanvasGroup Interaction:** Khi ẩn UI Panel, luôn set `canvasGroup.blocksRaycasts = false` và `interactable = false` để tránh việc UI ẩn vẫn chặn thao tác click của người chơi vào game.
- **Cleanup Event Listeners:** Mọi `Button.onClick.AddListener` viết trong code phải có cặp `RemoveListener` trong `OnDestroy` hoặc `OnDisable`.
- **Zero-Override UI:** Sửa prefab trong Prefab Editing Mode, tránh set các property đặc thù trực tiếp lên Scene Instance.

---

# 4. Implementation Steps
1. Gắn component `CanvasGroup` lên Root GameObject của Panel.
2. Tạo script kế thừa template UI Panel chuẩn trong namespace `MyGame.UI`.
3. Kéo thả các Component UI (Button, Slider, Text...) vào Inspector.
4. Cài đặt các hàm `Open()` và `Close()`.

---

# 5. Runtime Gotchas
- **UI Child rỗng:** GameObject con rỗng trong Canvas không tự có `RectTransform` nếu tạo bằng code MCP -> Luôn đảm bảo component con có `RectTransform`.
- **Bấm đè nút Close liên tục:** Nếu có animation đóng/mở (DOTween), hãy disable tương tác (`blocksRaycasts = false`) ngay khi bắt đầu animation đóng để tránh người chơi bấm 2 lần.

---

# 6. Verification
- Mở panel, đóng panel, click xuyên qua vị trí panel khi đã đóng xem có bị nuốt click không.
- Chạy `/convention-check`.
