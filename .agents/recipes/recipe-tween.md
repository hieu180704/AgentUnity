# Recipe: Tween Animation (DOTween / Coroutine)

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Tạo các hiệu ứng chuyển động mượt mà (Juicy UI Button punch/scale, Popup Show/Hide in-out, Floating damage text, HUD fade).
- **Khi nào KHÔNG áp dụng:** Animation nhân vật phức tạp nhiều xương/layer (dùng Unity Animator) hoặc logic delay không liên quan đến biến đổi giá trị (dùng UniTask/Async).

---

# 2. Standard Code Pattern (DOTween)

```csharp
using System;
using UnityEngine;
using DG.Tweening; // Cần cài đặt DOTween package

namespace MyGame.UI {
    public class ButtonJuicyAnim : MonoBehaviour {
        [Header("Settings")]
        [SerializeField] private float punchScale = 0.15f;
        [SerializeField] private float duration = 0.2f;
        [SerializeField] private Ease easeType = Ease.OutQuad;
        [SerializeField] private bool ignoreTimeScale = true;

        private Vector3 initialScale;
        private Tween activeTween;

        private void Awake() {
            initialScale = transform.localScale;
        }

        private void OnDisable() {
            KillTween();
        }

        public void PlayPunch() {
            KillTween();

            activeTween = transform.DOPunchScale(Vector3.one * punchScale, duration, vibrato: 5, elasticity: 0.5f)
                .SetEase(easeType)
                .SetUpdate(ignoreTimeScale)
                .OnComplete(() => {
                    transform.localScale = initialScale;
                });
        }

        public void KillTween() {
            if (activeTween != null && activeTween.IsActive()) {
                activeTween.Kill();
            }
            transform.localScale = initialScale;
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **`DOKill()` trong `OnDisable()` / `OnDestroy()`:** BẮT BUỘC kill toàn bộ tween đang chạy khi đối tượng bị ẩn hoặc hủy để tránh Tween sống lâu hơn GameObject gây `NullReferenceException`.
- **Dọn dẹp trước khi Re-tween:** Luôn kill tween cũ và reset giá trị về ban đầu TRƯỚC KHI kích hoạt tween mới trên cùng một Transform/CanvasGroup (tránh hiện tượng 2 tween đánh nhau gây giật lag).
- **`SetUpdate(true)` cho UI:** Các hiệu ứng UI của Popup/Pause Menu phải bật `ignoreTimeScale` (hoặc `.SetUpdate(true)`) để tween vẫn chạy mượt mà ngay cả khi game đang tạm dừng (`Time.timeScale = 0`).

---

# 4. Implementation Steps
1. Gắn script Tween lên GameObject cần tạo animation.
2. Khai báo các tham số điều chỉnh (`duration`, `easeType`, `scale`) với `[SerializeField] private`.
3. Viết method `Play...()` và hàm dọn dẹp `KillTween()`.
4. Gọi `KillTween()` trong `OnDisable()`.

---

# 5. Runtime Gotchas
- **Ghost State trong Object Pooling:** Khi GameObject từ Pool được tái sử dụng (SetActive), nếu tween trước đó chưa kịp kill thì đối tượng sẽ xuất hiện ở vị trí/kích thước méo mó bất thường.
- **Closure Leak trong OnComplete:** Tránh tạo lambda expression phức tạp giữ tham chiếu đến các object ngoài trong `.OnComplete()` mà không có điều kiện dừng.

---

# 6. Verification
- Chạy `/convention-check`.
- Spam click liên tục vào nút/popup để kiểm tra xem animation có bị nhảy frame, kẹt kích thước hoặc văng exception ở Console không.
