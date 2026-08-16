---
trigger: always_on
description: Quy tắc an toàn tối cao cho Unity - Bảo vệ Asset Serialized, 8 bẫy ngầm MCP, Kỷ luật Data-Entry & Prefab Override
---

# Unity Safety Rules

# Mục lục
1. [Bảo vệ Asset Serialized & File YAML](#1-bảo-vệ-asset-serialized--file-yaml)
2. [8 Bẫy ngầm khi thao tác qua Unity MCP](#2-8-bẫy-ngầm-khi-thao-tác-qua-unity-mcp)
3. [Kỷ luật Xác thực Data-Entry](#3-kỷ-luật-xác-thực-data-entry)
4. [Kỷ luật Prefab Zero-Override](#4-kỷ-luật-prefab-zero-override)
5. [Các thao tác Bất khả đảo nghịch (Irreversible)](#5-các-thao-tác-bất-khả-đảo-nghịch-irreversible)

---

# 1. Bảo vệ Asset Serialized & File YAML
- **CẤM TUYỆT ĐỐI dùng text tool để sửa/ghi đè:** `.prefab`, `.unity` (Scene), `.asset` (ScriptableObject), `.meta`.
- **Lý do:** Các file này do Unity Engine quản lý trực tiếp bằng định dạng YAML/Binary Serialized. Việc sửa tay qua text editor rất dễ làm hỏng GUID, FileID, gây gãy liên kết (Broken References) âm thầm lúc runtime.
- **Cách xử lý đúng:**
  - Nếu kết nối **Unity MCP**: Thực hiện thay đổi trực tiếp qua các tool của MCP (`manage_gameobject`, `manage_components`, `manage_prefabs`).
  - Nếu không có MCP: Mô tả rõ ràng từng bước để Dev thao tác trực tiếp trên Unity Editor / Inspector.
- **Quản lý file `.meta`:**
  - Không tự tạo `.meta` bằng tay. Để Unity tự sinh khi import file.
  - Khi xóa hoặc đổi tên file `.cs`, phải xử lý đồng thời cả file `.meta` đi kèm.

---

# 2. 8 Bẫy ngầm khi thao tác qua Unity MCP
*(Compile không bắt được, chỉ phát hiện khi chạy game)*

1. **Lệch tên Property theo Component:**
   - Component đồ họa (`Image`, `Graphic`, `Button`) nhận tên trường Serialized nội bộ (VD: `m_Color`, `m_Sprite`).
   - `RectTransform` nhận tên API công khai (VD: `sizeDelta`, `anchoredPosition`).
2. **UI Child rỗng:** GameObject con rỗng tạo trong Canvas không tự thêm `RectTransform` -> Phải add tay hoặc tạo kèm một component `Image`.
3. **Wire Reference qua SerializedObject:** Luôn đọc ngược lại (read-back verify) để chắc chắn giá trị gán đã được Unity lưu thành công.
4. **Kiểm tra GUID Script:** Dùng `AssetDatabase.GUIDToAssetPath`, KHÔNG grep chuỗi trong `Assets/` (vì script thuộc Unity Package nằm tại thư mục `Packages/`).
5. **Lưu Asset có chọn lọc:** Tránh gọi `SaveAssets` toàn bộ dự án khi đang có scene dirty; chỉ lưu đúng asset vừa chỉnh sửa (`SaveAssetIfDirty`).
6. **Xử lý Timeout / Lỗi MCP:** Lỗi timeout không đồng nghĩa lệnh ghi thất bại (bridge có thể rớt sau khi Unity đã lưu). Luôn kiểm tra `git diff` trước khi thử lại để tránh bị append trùng lặp dữ liệu.
7. **Git Checkout Asset:** Lệnh revert file của Git không tự flush RAM của Unity Editor -> Phải gọi `Refresh` / `ImportAsset` để Editor nạp lại dữ liệu sạch.
8. **Thực thi Snippet Code (`execute_code`):** Đoạn code chạy như thân hàm (Method-Body) -> Không đặt từ khóa `using` ở đầu snippet; các kiểu dữ liệu bên ngoài phải viết dạng Fully-Qualified (VD: `System.Collections.Generic.List`).

---

# 3. Kỷ luật Xác thực Data-Entry
Khi thêm một Entry dữ liệu mới vào hệ thống (Catalog, Config List, Database SO):
- **Nguyên tắc:** Các hệ thống tiêu thụ (Consumer code) thường mặc định data luôn chuẩn nên rất hay **thiếu null-check** trên luồng khởi tạo (`Initialize`/`Awake`). Chỉ 1 item bị null có thể làm **vỡ toàn bộ hệ thống**.
- **Cách verify:** Đọc code của hàm tiêu thụ dữ liệu để kiểm tra điều kiện lọc, mô phỏng đúng luồng chạy và assert không có item nào bị hỏng.

---

# 4. Kỷ luật Prefab Zero-Override
- **Mục tiêu:** Prefab sinh ra để "kéo-thả là dùng được ngay", hạn chế tối đa việc chỉnh sửa đè (Override) trực tiếp trên Scene Instance.
- **Quy trình chuẩn:**
  1. Chỉnh sửa trên file Asset gốc trong **Prefab Editing Mode**.
  2. Wire các tham chiếu cần thiết và kiểm tra hoàn tất.
  3. Lưu Prefab rồi mới Instantiate vào Scene.
- Dữ liệu động thay đổi lúc runtime (text tên người chơi, số lượng coin, avatar) phải được truyền qua hàm khởi tạo `Init(data)` bằng code, không set cứng trên Inspector của Scene Instance.

---

# 5. Các thao tác Bất khả đảo nghịch (Irreversible)
Các thao tác sau có thể ảnh hưởng nặng đến dữ liệu người chơi hoặc cấu trúc dự án, cần báo trước:
- **Đổi thứ tự Enum đã Serialize:** Thay đổi thứ tự hoặc chèn giá trị `int` vào giữa Enum đã được lưu trong Prefab/SaveData sẽ làm sai lệch toàn bộ mapping dữ liệu cũ.
- **Sửa Save Schema:** Đổi tên trường trong SaveData mà không viết hàm Migrate sẽ làm mất dữ liệu của người chơi cũ.
- **Xóa / Di chuyển Asset diện rộng:** Luôn dùng `AssetDatabase.GetDependencies` để kiểm tra các đối tượng đang tham chiếu tới trước khi xóa.
