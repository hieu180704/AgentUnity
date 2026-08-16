---
name: unity-mcp-guide
description: Cẩm nang vận hành Unity Editor thông qua Unity MCP Server — Quản lý GameObject, Component, Prefab, Scene, Console Logs và Camera Screenshot. Dùng khi gõ "/unity-mcp", "hướng dẫn mcp", "thao tác unity qua mcp".
---

# /unity-mcp-guide — Cẩm Nang Vận Hành Unity MCP

# Mục lục
1. [Tổng Quan & Quy Trình Resource-First](#1-tổng-quan--quy-trình-resource-first)
2. [Các Công Cụ MCP Cốt Lõi (Tool Categories)](#2-các-công-cụ-mcp-cốt-lõi-tool-categories)
3. [Quy Chuẩn Thao Tác An Toàn (Best Practices)](#3-quy-chuẩn-thao-tác-an-toàn-best-practices)
4. [Xử Lý Lỗi Phổ Biến (Error Recovery)](#4-xử-lý-lỗi-phổ-biến-error-recovery)

---

# 1. Tổng Quan & Quy Trình Resource-First
Khi kết nối với **Unity MCP Server**, AI có thể điều khiển trực tiếp Unity Editor theo chu trình 5 bước:

1. **Kiểm tra trạng thái Editor:** `mcpforunity://editor/state` (Đảm bảo `is_compiling == false`).
2. **Khảo sát Scene / Hierarchy:** `find_gameobjects` hoặc `get_hierarchy`.
3. **Thực thi thay đổi:** `manage_gameobject`, `manage_components`, `manage_prefabs`.
4. **Read-back xác thực:** Đọc lại component vừa sửa để chắc chắn Unity SerializedObject đã lưu giá trị.
5. **Kiểm tra kết quả & Console:** `read_console` (kiểm tra lỗi đỏ/error) hoặc `manage_camera` (chụp screenshot trực quan).

---

# 2. Các Công Cụ MCP Cốt Lõi (Tool Categories)

| Nhóm chức năng | MCP Tools | Công dụng chính |
| :--- | :--- | :--- |
| **Hierarchy & Scene** | `find_gameobjects`, `manage_scene` | Tìm kiếm GameObject theo tên/tag/component, chuyển scene, lấy cây đối tượng |
| **GameObjects** | `manage_gameobject` | Tạo mới GameObject, gán cha con (parenting), thay đổi Transform (vị trí/xoay/scale) |
| **Components** | `manage_components` | Thêm/Xóa Component, gán giá trị Property (Set Property), Wire References |
| **Prefabs** | `manage_prefabs` | Mở Prefab Mode, Apply overrides, lưu Prefab Asset |
| **Diagnostics & Console**| `read_console` | Đọc danh sách log, cảnh báo (warning) và lỗi runtime/compile (error) |
| **Visual Verification** | `manage_camera` | Chụp ảnh màn hình Scene View / Game View để AI quan sát trực quan |
| **Bulk Execution** | `batch_execute` | Gom nhiều lệnh MCP chạy cùng lúc (tăng tốc độ 10-50x) |

---

# 3. Quy Chuẩn Thao Tác An Toàn (Best Practices)

### A. Sau khi sửa Code C#: Chờ Compile trước khi gắn Component
- Khi vừa tạo/sửa file `.cs`, Unity Engine cần 1-3 giây để biên dịch code.
- Đọc `mcpforunity://editor/state` cho đến khi `is_compiling == false`, sau đó chạy `read_console(types=["error"])` để kiểm tra có lỗi cú pháp không trước khi gọi `manage_components`.

### B. Wire Reference luôn cần Read-back Verify
- Khi gán tham chiếu (VD: gán `AudioClip` vào `AudioSource`), import trễ có thể nuốt giá trị gán.
- Luôn gọi kiểm tra lại (`read resource`) để assert field không bị `null`.

### C. Sử dụng Screenshot để kiểm tra trực quan
- Khi dựng layout UI hoặc xếp vị trí đối tượng 3D/2D:
  - Gọi `manage_camera(action="screenshot", capture_source="scene_view", include_image=true)` để AI quan sát giao diện thực tế.

---

# 4. Xử Lý Lỗi Phổ Biến (Error Recovery)
- **Editor báo "Busy / Compiling":** Chờ vài giây để Unity hoàn thành biên dịch domain reload.
- **MCP Timeout:** Kiểm tra `git diff` trước khi gửi lại lệnh để tránh bị append dữ liệu trùng lặp.
- **Không tìm thấy Property:** Kiểm tra xem Component dùng tên Serialized nội bộ (`m_Color`, `m_Sprite`) hay tên API công khai (`sizeDelta`, `anchoredPosition`).
