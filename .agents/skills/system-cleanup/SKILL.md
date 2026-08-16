---
name: system-cleanup
description: Rà soát và dọn dẹp các thành phần mồ côi (file .meta mồ côi, file tạm, code comment cũ, biến không dùng) trong dự án Unity. Dùng khi gõ "/system-cleanup", "dọn dẹp dự án", "clean orphan files".
---

# /system-cleanup — Dọn Dẹp Dự Án & File Mồ Côi

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Các Hạng Mục Dọn Dẹp](#2-các-hạng-mục-dọn-dẹp)
3. [Quy Trình 3 Bước Dọn Dẹp An Toàn](#3-quy-trình-3-bước-dọn-dẹp-an-toàn)

---

# 1. Mục Đích
Rà soát toàn bộ dự án để loại bỏ các file thừa, file `.meta` bị bỏ lại sau khi xóa asset, các đoạn code comment rác hoặc hàm debug tạm thời nhằm giữ cho repository luôn sạch sẽ và gọn gàng.

---

# 2. Các Hạng Mục Dọn Dẹp
1. **File `.meta` Mồ Côi (Orphan Meta):** File `.meta` còn tồn tại trong khi file asset gốc đã bị xóa hoặc đổi tên.
2. **Code Comment & TODO Cũ:** Các đoạn code bị comment vô thời hạn hoặc TODO đã giải quyết xong.
3. **File Tạm / Scratch Files:** Các file test tạm thời (`test_*.cs`, `temp_*.json`) còn sót lại trong thư mục làm việc.
4. **Hàm Lifecycle Rỗng:** Các hàm `void Start() {}`, `void Update() {}` không chứa logic.

---

# 3. Quy Trình 3 Bước Dọn Dẹp An Toàn

### Bước 1: Khảo Sát & Lập Bảng Thống Kê (Dry-Run)
- Quét toàn bộ thư mục `Assets/`, `.agents/`, `Docs/`.
- Liệt kê chi tiết các file/dòng code cần dọn dẹp kèm lý do.

### Bước 2: Xác Nhận Từ Dev (Confirm)
- Trình bày danh sách cho Dev review. DỪNG lại chờ Dev xác nhận, không tự ý xóa bỏ.

### Bước 3: Thực Thi & Kiểm Tra (Execute & Verify)
- Tiến hành xóa file hoặc dọn dẹp theo đúng danh sách đã duyệt.
- Chạy `/convention-check` và kiểm tra trạng thái Git sạch sẽ.
