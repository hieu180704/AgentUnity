---
name: newsession
description: Đóng session gọn — sync doc + tạo worklog fragment Docs/Done/, sinh prompt bàn giao cho phiên kế tiếp. Dùng khi user gõ "/newsession", "chốt session", "bàn giao session".
---

# /newsession — Đóng Session & Bàn Giao Nhanh

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Quy Trình 3 Bước Thực Hiện](#2-quy-trình-3-bước-thực-hiện)
3. [Mẫu Cấu Trúc Worklog Fragment](#3-mẫu-cấu-trúc-worklog-fragment)
4. [Mẫu Prompt Bàn Giao Cho Phiên Mới](#4-mẫu-prompt-bàn-giao-cho-phiên-mới)

---

# 1. Mục Đích
Đóng gói phiên làm việc hiện tại một cách gọn gàng, lưu vết tài liệu sống vào `Docs/Done/` mà không gây phình Context Window, đồng thời chuẩn bị một đoạn prompt ngắn gọn để mở đầu phiên làm việc tiếp theo mượt mà.

---

# 2. Quy Trình 3 Bước Thực Hiện

### Bước 1: Quét Thay Đổi Code & Trạng Thái Git
- Kiểm tra `git status` để lấy danh sách các file C#, Asset, và Docs đã được tạo mới hoặc chỉnh sửa trong session.

### Bước 2: Tạo Worklog Fragment
- Tạo file mới tại: `Docs/Done/<YYYYMMDD>__<ten-task-ngan-gon>.txt`.
- Định dạng `.txt` thuần, không cần cập nhật file index chung (tránh xung đột Git).

### Bước 3: Xuất Báo Cáo & Prompt Bàn Giao
- Trình bày tóm tắt công việc đã hoàn thành.
- Đưa ra một khối mã Prompt ngắn gọn để Dev copy sang phiên chat mới.

---

# 3. Mẫu Cấu Trúc Worklog Fragment

```text
# Task: [Tên Tính Năng / Bug Fix]
# Ngày: YYYY-MM-DD
# Mục tiêu: [Một dòng mô tả ngắn gọn mục tiêu đã giải quyết]

# Các công việc đã thực hiện:
- [Gạch đầu dòng 1: Thay đổi cốt lõi]
- [Gạch đầu dòng 2: Hệ thống liên quan]
- [Gạch đầu dòng 3: Kết quả kiểm thử]

# Danh sách file thay đổi:
- Assets/.../Player.cs
- .agents/recipes/...

# Lưu ý bàn giao:
- [Điểm cần tiếp tục làm hoặc lưu ý cho phiên sau]
```

---

# 4. Mẫu Prompt Bàn Giao Cho Phiên Mới
Khi kết thúc, skill sẽ sinh ra đoạn prompt mẫu:

```text
🎯 Bắt đầu phiên tiếp theo:
"Tiếp tục dự án từ worklog Docs/Done/<date>__<slug>.txt. 
Mục tiêu phiên này: [Tên task tiếp theo]. Hãy kiểm tra mã nguồn hiện tại và đề xuất giải pháp."
```
