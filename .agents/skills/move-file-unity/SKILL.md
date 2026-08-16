---
name: move-file-unity
description: Di chuyển file/asset Unity an toàn mức filesystem luôn kèm file .meta (giữ GUID); kiểm tra chặn các file path-ref (Resources/, Scene, Addressables). Dùng khi gõ "/move-file-unity" hoặc "di chuyển asset an toàn".
---

# /move-file-unity — Di Chuyển Asset Unity An Toàn

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Bộ Quy Tắc Chặn (Block-Set)](#2-bộ-quy-tắc-chặn-block-set)
3. [Quy Trình 4 Bước Di Chuyển](#3-quy-trình-4-bước-di-chuyển)
4. [Lưu Ý & Ràng Buộc](#4-lưu-ý--ràng-buộc)

---

# 1. Mục Đích
Di chuyển file C# (`.cs`), Prefab (`.prefab`), ScriptableObject (`.asset`), Material, Texture, Audio trong Unity mà **luôn giữ đi liền với file `.meta` tương ứng**, bảo toàn GUID và không làm đứt kết nối (Missing References / Broken GUIDs) trong Unity Editor.

---

# 2. Bộ Quy Tắc Chặn (Block-Set)
Trước khi di chuyển, AI phải kiểm tra nếu asset thuộc 3 nhóm sau thì **TỪ CHỐI di chuyển tự động bằng script** và hướng dẫn Dev thao tác trong Unity Editor:
1. **File nằm trong thư mục `Resources/`:** Do `Resources.Load("path")` dựa vào đường dẫn string, đổi chỗ sẽ làm code runtime không load được asset.
2. **Scene `.unity`:** Scene gắn liền với Build Settings (`EditorBuildSettings`) và `SceneManager.LoadScene()`. Nên đổi vị trí trong Unity Editor.
3. **Asset đánh dấu Addressables:** Asset được gắn Address/Label theo đường dẫn -> Cần cập nhật lại trong Addressables Groups window.

---

# 3. Quy Trình 4 Bước Di Chuyển

### Bước 1: Phân Loại & Dry-Run
- Quét danh sách file nguồn (`src`) và thư mục đích (`dest`).
- In bảng dự kiến (Dry-run): File nào sẽ di chuyển (có/không kèm `.meta`), file nào bị chặn (kèm lý do).
- Đợi Dev xác nhận trước khi thực hiện.

### Bước 2: Thực Thi Di Chuyển (Cặp File)
- Di chuyển đồng thời file gốc và file `.meta` đi liền nhau:
  ```powershell
  git mv "Assets/.../Item.prefab" "Assets/.../NewFolder/Item.prefab"
  git mv "Assets/.../Item.prefab.meta" "Assets/.../NewFolder/Item.prefab.meta"
  ```
- Nếu file chưa vào Git tracking: Sử dụng lệnh filesystem (`Move-Item`) để di chuyển cả cặp.

### Bước 3: Kiểm Tra Tính Toàn Vẹn (Verify)
- Kiểm tra tại `dest`: Cả 2 file `<dest>` và `<dest>.meta` đều đã tồn tại.
- Kiểm tra tại `src`: Không còn file `.meta` mồ côi bị bỏ lại ở thư mục cũ.

### Bước 4: Báo Cáo Hoàn Thành
- Xuất bảng kết quả: `Đã di chuyển thành công (Đủ cặp .meta)` / `Cảnh báo nếu thiếu`.
- Nhắc Dev focus vào Unity Editor để Editor tự động Refresh và Reimport dữ liệu sạch sẽ.

---

# 4. Lưu Ý & Ràng Buộc
- **Unity đang mở vẫn an toàn:** Vì GUID trong `.meta` không đổi, Unity sẽ tự nhận diện đúng vị trí mới khi bạn quay lại cửa sổ Editor.
- CẤM tự ý sửa text bên trong file `.meta` khi di chuyển.
