---
trigger: model_decision
description: Quy chuẩn viết mã nguồn C# Unity - Naming, Styling, Performance, Memory & Serialization
---

# Unity C# Code Conventions

# Mục lục
1. [Cú pháp & Định dạng Code Style](#1-cú-pháp--định-dạng-code-style)
2. [Serialization & Field Access](#2-serialization--field-access)
3. [Inspector Layout (Native & Attributes)](#3-inspector-layout-native--attributes)
4. [Tối ưu Hiệu năng & Vòng lặp Update](#4-tối-ưu-hiệu-năng--vòng-lặp-update)
5. [Quy chuẩn Đặt tên (Naming Conventions)](#5-quy-chuẩn-đặt-tên-naming-conventions)
6. [Quản lý Logging & Debugging](#6-quản-lý-logging--debugging)
7. [Quản lý Namespace](#7-quản-lý-namespace)

---

# 1. Cú pháp & Định dạng Code Style
- **Curly Brace cùng dòng:** Dấu mở ngoặc nhọn `{` BẮT BUỘC đặt cùng dòng với câu lệnh (K&R style).
  ```csharp
  // Đúng
  public class PlayerController : MonoBehaviour {
      public void Move() {
          if (isGrounded) {
              Jump();
          }
      }
  }
  ```
- **Access Modifiers:** Luôn ghi rõ ràng mức độ truy cập (`private`, `public`, `protected`), kể cả với các hàm Unity Lifecycle:
  ```csharp
  private void Awake() { }
  private void Start() { }
  ```
- **Từ khóa `var`:** Chỉ dùng cho biến cục bộ (Local variables) khi kiểu dữ liệu bên vế phải đã rõ ràng (VD: `var player = new PlayerData();`). Khi kiểu trả về không hiển thị rõ, phải ghi rõ kiểu dữ liệu.

---

# 2. Serialization & Field Access
- **Encapsulation:** CẤM dùng public field trần để expose biến ra Unity Inspector.
- **Quy chuẩn Serialize:** Luôn dùng `[SerializeField] private`:
  ```csharp
  // Đúng
  [SerializeField] private float moveSpeed = 10f;
  public float MoveSpeed => moveSpeed;

  // Sai
  public float moveSpeed = 10f;
  [SerializeField] public float jumpForce = 5f;
  ```
- **Biến Private:** Đặt tên dạng `camelCase` hoặc `_camelCase`. Không dùng tiền tố lỗi thời `m_`.

---

# 3. Inspector Layout (Native & Attributes)
- **Gom nhóm & Chú thích:** Sử dụng các attribute có sẵn của `UnityEngine` để tổ chức Inspector gọn gàng:
  ```csharp
  [Header("Movement Settings")]
  [Tooltip("Tốc độ chạy tối đa tính theo m/s")]
  [SerializeField] private float maxRunSpeed = 8f;

  [Header("Audio References")]
  [SerializeField] private AudioClip jumpSound;
  ```

---

# 4. Tối ưu Hiệu năng & Vòng lặp Update
- **CẤM gọi các lệnh tìm kiếm nặng trong `Update` / `FixedUpdate` / `LateUpdate`:**
  - `GameObject.Find()`
  - `FindObjectOfType<T>()` / `FindAnyObjectByType<T>()`
  - `GetComponent<T>()` liên tục mà không lưu vào biến cache.
  - `Camera.main` trong Update (gọi `Camera.main` thực chất là tìm kiếm Tag `MainCamera`).
  - *Khắc phục:* Cache toàn bộ Component và Camera vào `Awake()` hoặc `Start()`.
- **Hàm Lifecycle rỗng:** Xóa ngay các hàm `void Update() {}`, `void Start() {}` nếu không có logic để tránh tiêu tốn overhead gọi hàm mỗi frame của Unity C++ Engine.
- **Tránh sinh rác GC (Garbage Collection):**
  - Tránh `string` concatenation (`"Score: " + score`) liên tục trong Update -> Dùng `StringBuilder` hoặc chỉ cập nhật Text khi điểm số thực sự thay đổi.
  - Sử dụng `NonAlloc` API cho Physics (VD: `Physics.RaycastNonAlloc`, `Physics.OverlapSphereNonAlloc`).

---

# 5. Quy chuẩn Đặt tên (Naming Conventions)
- **Class, Struct, Enum, Method, Property:** `PascalCase` (VD: `PlayerManager`, `TakeDamage`, `CurrentHealth`).
- **Interface:** BẮT BUỘC bắt đầu bằng tiền tố `I` (VD: `IDamageable`, `IInteractable`).
- **Abstract Base Class:** Khuyến khích bắt đầu bằng tiền tố `A` hoặc hậu tố `Base` (VD: `APanel`, `WeaponBase`).
- **Enum Members:** `PascalCase`. Nếu Enum có liên quan đến Save Data, phải gán giá trị số rõ ràng:
  ```csharp
  public enum ItemType {
      None = 0,
      Consumable = 1,
      Weapon = 2,
      Armor = 3
  }
  ```

---

# 6. Quản lý Logging & Debugging
- Hạn chế để lại các lệnh `Debug.Log` rải rác trong code production.
- Khi cần ghi log phục vụ chẩn đoán lỗi, nên bọc trong điều kiện:
  ```csharp
  #if UNITY_EDITOR || DEVELOPMENT_BUILD
  Debug.Log($"[Player] Khởi tạo hoàn tất: {name}");
  #endif
  ```

---

# 7. Quản lý Namespace
- Toàn bộ script phải nằm trong một `namespace` rõ ràng theo cấu trúc phân hệ của dự án (VD: `MyGame.Core`, `MyGame.UI`, `MyGame.Audio`, `MyGame.Gameplay`).
- Chỉ các script đặc thù của Third-party hoặc Root Assembly mới không có namespace.