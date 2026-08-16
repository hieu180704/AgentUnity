---
name: convention-check
description: Kiểm tra code C# đối chiếu với quy chuẩn Unity trong rules/code-conventions.md. Chạy linter tự động, trả về báo cáo PASS/FAIL. Dùng khi gõ "/convention-check" hoặc "kiểm tra quy chuẩn code".
---

# /convention-check — Kiểm Tra Quy Chuẩn Code C#

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Cách Thức Thực Hiện (2 Lớp Kiểm Tra)](#2-cách-thức-thực-hiện-2-lớp-kiểm-tra)
3. [Danh Sách Hạng Mục Quy Chuẩn](#3-danh-sách-hạng-mục-quy-chuẩn)
4. [Định Dạng Báo Cáo Kết Quả](#4-định-dạng-báo-cáo-kết-quả)

---

# 1. Mục Đích
Rà soát các file C# đang chỉnh sửa hoặc trong một thư mục chỉ định xem có tuân thủ đúng các quy chuẩn đã đề ra tại `.agents/rules/code-conventions.md` hay không.

---

# 2. Cách Thức Thực Hiện (2 Lớp Kiểm Tra)

### Lớp A: Chạy Linter Cơ Học Tự Động (Zero-dependency)
- Chạy script linter tích hợp sẵn trên file/thư mục cần kiểm tra:
  ```bash
  node .agents/hooks/scripts/lint-conventions.js <đường_dẫn_file.cs>
  ```
- Tự động bắt các lỗi:
  - `GameObject.Find` / `GetComponent` / `FindObjectOfType` trong vòng lặp `Update`/`FixedUpdate`.
  - Hàm lifecycle rỗng (`void Start() {}`, `void Update() {}`).
  - `[SerializeField] public` thừa thãi.
  - Interface thiếu tiền tố `I...`.
  - File C# thiếu `namespace`.

### Lớp B: Rà Soát Ngữ Nghĩa (Semantic Review)
- Đối chiếu thủ công các tiêu chuẩn kiến trúc:
  - Encapsulation (`[SerializeField] private` thay vì public field trần).
  - Khởi tạo danh sách mặc định (`= new List<...>()`) tránh NullReferenceException.
  - Cặp đăng ký/hủy sự kiện (`OnEnable`/`OnDisable`).

---

# 3. Danh Sách Hạng Mục Quy Chuẩn
1. **Code Style & Formatting:** Dấu `{` cùng dòng (K&R style), access modifiers tường minh.
2. **Field & Serialization:** `[SerializeField] private`, biến `camelCase` hoặc `_camelCase` (cấm `m_`).
3. **Inspector Layout:** Gom nhóm bằng `[Header]` và có `[Tooltip]`.
4. **Hiệu năng & Memory:** Tránh `Camera.main` trong Update, dùng `NonAlloc` physics API, không string concat liên tục trong Update.
5. **Naming Conventions:** Class/Method/Property `PascalCase`, Interface `I...`, Abstract `A...` hoặc `...Base`.

---

# 4. Định Dạng Báo Cáo Kết Quả
Xuất bảng báo cáo rõ ràng (Read-only, không tự ý sửa code khi chưa có yêu cầu):

| Vị trí (File:Dòng) | Loại vi phạm | Mức độ | Cách khắc phục đề xuất |
| :--- | :--- | :--- | :--- |
| `PlayerController.cs:45` | `GameObject.Find` trong `Update` | 🔴 Cao | Cache instance vào biến thành viên trong `Awake()` |
| `EnemyData.cs:12` | Public field trần `public int hp` | 🟡 Trung bình | Chuyển thành `[SerializeField] private int hp; public int Hp => hp;` |
