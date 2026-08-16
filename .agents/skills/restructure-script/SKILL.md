---
name: restructure-script
description: Hướng dẫn quy trình tái cấu trúc tách nhỏ các file C# MonoBehaviour quá lớn (God Classes > 400 dòng) thành các sub-component và plain classes theo Single Responsibility. Dùng khi gõ "/restructure-script", "tách file c#", "refactor god class".
---

# /restructure-script — Tái Cấu Trúc Script C# Unity

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Dấu Hiệu Cần Tách (Code Smells)](#2-dấu-hiệu-cần-tách-code-smells)
3. [Quy Trình Tách An Toàn 4 Pha](#3-quy-trình-tách-an-toàn-4-pha)
4. [Các Chiến Lược Tách Thành Phần (Decomposition Patterns)](#4-các-chiến-lược-tách-thành-phần-decomposition-patterns)

---

# 1. Mục Đích
Hướng dẫn phân rã các class C# quá phức tạp ("God Class" ôm đồm quá nhiều trách nhiệm) thành các component nhỏ gọn, độc lập, dễ bảo trì và dễ unit test mà **không làm mất serialized data hay broken references trong Unity Inspector**.

---

# 2. Dấu Hiệu Cần Tách (Code Smells)
- File `.cs` dài vượt quá **400-500 dòng**.
- Một class vừa xử lý Input, vừa tính toán Vật lý, vừa cập nhật UI, vừa phát Âm thanh.
- Có quá nhiều field `[SerializeField]` không cùng nhóm tính năng.

---

# 3. Quy Trình Tách An Toàn 4 Pha

### Pha 1: Khảo Sát & Lập Bản Đồ Trách Nhiệm (Explore)
- Đọc kỹ toàn bộ file hiện tại, gom các biến và hàm thành các cụm trách nhiệm:
  - Cụm Input Handling
  - Cụm Movement / Physics
  - Cụm Animation & VFX
  - Cụm Audio & Feedback

### Pha 2: Đề Xuất Cấu Trúc Mới (Propose)
- Đề xuất danh sách các class con sẽ sinh ra (VD: `PlayerInputHandler`, `PlayerMovement`, `PlayerAudioFeedback`).
- Trình bày cho Dev duyệt trước khi can thiệp vào code.

### Pha 3: Triển Khai Không Gãy Đột Ngột (Execute via Composition)
- Tạo các sub-component mới.
- Trong class chính: Thay vì xóa sạch code cũ ngay lập tức, chuyển tiếp lời gọi hàm (Delegate) sang sub-component mới để đảm bảo các hệ thống bên ngoài gọi vào không bị compile error.
- Sử dụng `[RequireComponent]` nếu các sub-component cần đi liền nhau.

### Pha 4: Kiểm Thử & Chạy Convention Check (Verify)
- Chạy `/convention-check` trên các file mới tạo.
- Hướng dẫn Dev mở Unity Editor để kéo thả lại các component mới vào Prefab (hoặc dùng Unity MCP).

---

# 4. Các Chiến Lược Tách Thành Phần (Decomposition Patterns)
1. **MonoBehaviour Component:** Tách thành component độc lập gắn trên cùng GameObject (VD: `AudioSource` controller, `Collider` trigger listener).
2. **Plain C# Class (Non-MonoBehaviour):** Tách logic tính toán công thức, giải thuật thành plain class thuần không cần kế thừa `MonoBehaviour` (giảm overhead và dễ viết Unit Test).
3. **ScriptableObject Config:** Tách toàn bộ số liệu tinh chỉnh (tốc độ, máu, thời gian hồi chiêu) ra file `ScriptableObject`.
