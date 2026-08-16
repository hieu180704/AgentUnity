# Recipe: Object Pooling Pattern

# Mục lục
1. [When to Use](#1-when-to-use)
2. [Standard Code Pattern](#2-standard-code-pattern)
3. [Mandatory Rules](#3-mandatory-rules)
4. [Implementation Steps](#4-implementation-steps)
5. [Runtime Gotchas](#5-runtime-gotchas)
6. [Verification](#6-verification)

---

# 1. When to Use
- **Khi nào áp dụng:** Tái sử dụng các GameObject được sinh ra và phá huỷ liên tục với tần suất cao (Đạn viên đạn Projectile, Hiệu ứng nổ VFX, Floating Damage Numbers, Phần tử danh sách Scroll View Item) nhằm loại bỏ rác bộ nhớ (GC Alloc) và giật FPS do `Instantiate` / `Destroy`.
- **Khi nào KHÔNG áp dụng:** Đối tượng duy nhất sinh ra 1 lần trong suốt màn chơi (Player, Main Camera, Boss chính).

---

# 2. Standard Code Pattern (Dùng UnityEngine.Pool có sẵn từ Unity 2021+)

```csharp
using UnityEngine;
using UnityEngine.Pool;

namespace MyGame.Core {
    public class SimpleObjectPool : MonoBehaviour {
        [Header("Prefab & Settings")]
        [SerializeField] private GameObject prefab;
        [SerializeField] private int defaultCapacity = 20;
        [SerializeField] private int maxCapacity = 100;

        private IObjectPool<GameObject> pool;

        private void Awake() {
            pool = new ObjectPool<GameObject>(
                createFunc: OnCreatePooledItem,
                actionOnGet: OnTakeFromPool,
                actionOnRelease: OnReturnedToPool,
                actionOnDestroy: OnDestroyPoolObject,
                collectionCheck: true,
                defaultCapacity: defaultCapacity,
                maxSize: maxCapacity
            );
        }

        private GameObject OnCreatePooledItem() {
            GameObject instance = Instantiate(prefab, transform);
            return instance;
        }

        private void OnTakeFromPool(GameObject obj) {
            obj.SetActive(true);
        }

        private void OnReturnedToPool(GameObject obj) {
            obj.SetActive(false);
            obj.transform.SetParent(transform); // Đưa về root pool để giữ Hierarchy gọn gàng
        }

        private void OnDestroyPoolObject(GameObject obj) {
            Destroy(obj);
        }

        public GameObject Get() {
            return pool.Get();
        }

        public void Release(GameObject obj) {
            pool.Release(obj);
        }
    }
}
```

---

# 3. Mandatory Rules (MUST)
- **Reset Trạng Thái khi Tái Sử Dụng:** Khi một object được lấy ra từ Pool (`actionOnGet`), BẮT BUỘC phải reset vị trí, vận tốc Rigidbody, lượng máu, và dừng mọi Tween/Coroutine đang chạy dở.
- **Không Gọi `Destroy()` Trực Tiếp:** Thay vì gọi `Destroy(gameObject)`, luôn chuyển hướng gọi `pool.Release(gameObject)`.
- **Collection Check:** Bật `collectionCheck: true` trong môi trường phát triển để bắt lỗi nghiêm trọng: trả cùng một object vào pool 2 lần.

---

# 4. Implementation Steps
1. Khai báo `IObjectPool<T>` (sử dụng `UnityEngine.Pool.ObjectPool`).
2. Định nghĩa 4 callback bắt buộc: `Create`, `Get`, `Release`, `Destroy`.
3. Cung cấp API công khai `Get()` và `Release(item)`.
4. Trên đối tượng được pool: Cài đặt interface `IPoolable` hoặc xử lý trong `OnEnable()`/`OnDisable()`.

---

# 5. Runtime Gotchas
- **Ghost Velocity / State:** Một viên đạn bay chưa hết quãng đường bị trả về pool, lần sau lấy ra vẫn giữ nguyên vector lực cũ -> Luôn gán `rb.velocity = Vector3.zero;` khi `Get()`.
- **Pool Max Size quá nhỏ:** Nếu spawn đạn quá nhiều vượt quá `maxSize`, các item dư thừa sẽ bị gọi `Destroy()`, làm mất đi tác dụng tối ưu hiệu năng của Pool.

---

# 6. Verification
- Chạy `/convention-check`.
- Spawn liên tục 1000 object trong Game và mở Unity Profiler -> Kiểm tra biểu đồ GC Alloc = 0 KB.
