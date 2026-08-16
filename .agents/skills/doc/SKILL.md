---
name: doc
description: Đồng bộ tài liệu của một phân hệ (Docs/SourceOfTruth/<domain>/) về đúng với code C# thực tế (doc-as-living) — so sánh drift giữa code và doc, cập nhật spec và gotchas. Dùng khi gõ "/doc <tên_hệ>", "sync doc", "đồng bộ tài liệu".
---

# /doc — Đồng Bộ Tài Liệu Sống Theo Mã Nguồn

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Quy Trình 4 Bước Đồng Bộ](#2-quy-trình-4-bước-đồng-bộ)
3. [Cấu Trúc Tài Liệu Phân Hệ Chuẩn (4 Phần)](#3-cấu-trúc-tài-liệu-phân-hệ-chuẩn-4-phần)
4. [Nguyên Tắc Bất Di Bất Dịch](#4-nguyên-tắc-bất-di-bất-dịch)

---

# 1. Mục Đích
Đảm bảo tài liệu trong `Docs/SourceOfTruth/` luôn phản ánh **chính xác 100% hiện trạng mã nguồn C# thực tế**, loại bỏ tình trạng code đã đổi nhưng tài liệu vẫn mô tả logic cũ.

---

# 2. Quy Trình 4 Bước Đồng Bộ

### Bước 1: Xác Định Domain Cần Đồng Bộ
- Nhận tên phân hệ từ yêu cầu (VD: `Audio`, `Save`, `UI`, `Gameplay`).
- Định vị file tài liệu tương ứng tại `Docs/SourceOfTruth/<Domain>/spec.txt` và thư mục code `Assets/.../<Domain>/`.

### Bước 2: Đọc Mã Nguồn Thực Tế (Read Logic)
- Đọc các class, interface, enum và ScriptableObject cốt lõi của phân hệ đó.
- Phân tích: Các class compose với nhau thế nào, các event nào được phát và lắng nghe.

### Bước 3: So Sánh Lệch (Drift Detection)
- Phát hiện các symbol đã bị xóa/đổi tên trong code nhưng vẫn còn trong doc.
- Phát hiện các logic/event mới trong code nhưng doc chưa ghi nhận.
- Trình bày tóm tắt danh sách điểm lệch trước khi sửa.

### Bước 4: Cập Nhật Tài Liệu
- Cập nhật nội dung trong `Docs/SourceOfTruth/<Domain>/spec.txt`.
- Ghi ngày cập nhật xác thực vào cuối file: `# verify: YYYY-MM-DD`.

---

# 3. Cấu Trúc Tài Liệu Phân Hệ Chuẩn (4 Phần)
1. **Overview:** Trách nhiệm chính của phân hệ, ranh giới với các hệ lân cận.
2. **Architecture Map:** Danh sách các class/struct, quan hệ sở hữu (ai new/cầm ai).
3. **Key Logic & Events:** Luồng khởi tạo (Boot/Init), luồng sự kiện (ai raise -> ai nghe).
4. **Runtime Gotchas & Seam:** Các bẫy ngầm cần lưu ý khi mở rộng.

---

# 4. Nguyên Tắc Bất Di Bất Dịch
- **Nguồn sự thật tối cao là CODE:** Khi doc lệch code -> Sửa DOC cho khớp code, không tự ý sửa code.
- Giữ tài liệu ngắn gọn, súc tích (≤150 dòng cho mỗi domain), sử dụng định dạng `.txt` để tiết kiệm token.
