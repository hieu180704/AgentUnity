---
name: newsession
description: Đóng session gọn — sync doc + tạo worklog fragment Docs/Done/, ghi nhận handoff chéo và sinh prompt bàn giao cho phiên kế tiếp (Gemini <-> Claude). Dùng khi user gõ "/newsession", "chốt session", "bàn giao session".
---

# /newsession — Đóng Session & Bàn Giao Nhanh (Cross-Agent Ready)

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Quy Trình 3 Bước Thực Hiện](#2-quy-trình-3-bước-thực-hiện)
3. [Mẫu Cấu Trúc Worklog Fragment](#3-mẫu-cấu-trúc-worklog-fragment)
4. [Bàn Giao Chéo Cross-Agent (Gemini <--> Claude)](#4-bàn-giao-chéo-cross-agent-gemini---claude)
5. [Mẫu Prompt Bàn Giao Cho Phiên Mới](#5-mẫu-prompt-bàn-giao-cho-phiên-mới)

---

# 1. Mục Đích
Đóng gói phiên làm việc hiện tại một cách gọn gàng, lưu vết tài liệu sống vào `Docs/Done/` mà không gây phình Context Window, đồng thời đồng bộ trạng thái vào `Docs/Handoffs/handoff.txt` để hỗ trợ bàn giao chéo mượt mà giữa bất kỳ AI Agent nào (Gemini Antigravity hoặc Claude Code).

---

# 2. Quy Trình 3 Bước Thực Hiện

### Bước 1: Quét Thay Đổi Code & Trạng Thái Git
- Kiểm tra `git status` để lấy danh sách các file C#, Asset, và Docs đã được tạo mới hoặc chỉnh sửa trong session.

### Bước 2: Tạo Worklog Fragment & Cập Nhật Handoff
- Tạo file mới tại: `Docs/Done/<YYYY-MM-DD>__<ten-task-ngan-gon>.txt`.
- Cập nhật bản tóm tắt mới nhất vào `Docs/Handoffs/handoff.txt`.

### Bước 3: Xuất Báo Cáo & Prompt Bàn Giao
- Trình bày tóm tắt công việc đã hoàn thành.
- Đưa ra một khối mã Prompt ngắn gọn để Dev copy sang phiên chat mới (dùng được cho cả Gemini lẫn Claude).

---

# 3. Mẫu Cấu Trúc Worklog Fragment

```text
# Task: [Tên Tính Năng / Bug Fix]
# Ngày: YYYY-MM-DD
# Agent Thực Hiện: [Gemini / Claude Code]
# Mục tiêu: [Một dòng mô tả ngắn gọn mục tiêu đã giải quyết]

# Các công việc đã thực hiện:
- [Gạch đầu dòng 1: Thay đổi cốt lõi]
- [Gạch đầu dòng 2: Hệ thống liên quan]
- [Gạch đầu dòng 3: Kết quả kiểm thử]

# Danh sách file thay đổi:
- Assets/.../Player.cs
- Docs/...

# Lưu ý bàn giao:
- [Điểm cần tiếp tục làm hoặc lưu ý cho phiên sau]
```

---

# 4. Bàn Giao Chéo Cross-Agent (Gemini <--> Claude)
- Mọi Agent khi kết thúc phiên đều ghi nhận trạng thái vào `Docs/Handoffs/handoff.txt`.
- Agent của phiên tiếp theo (dù là Claude hay Gemini) chỉ cần đọc `Docs/Handoffs/handoff.txt` là có thể tiếp tục công việc ngay lập tức mà không cần Dev phải giải thích lại toàn bộ lịch sử!

---

# 5. Mẫu Prompt Bàn Giao Cho Phiên Mới
Khi kết thúc, skill sẽ sinh ra đoạn prompt mẫu:

```text
🎯 Bắt đầu phiên tiếp theo:
"Đọc Docs/Handoffs/handoff.txt và worklog gần nhất trong Docs/Done/. 
Mục tiêu phiên này: [Tên task tiếp theo]. Hãy kiểm tra mã nguồn hiện tại và đề xuất giải pháp theo quy trình 4 pha."
```
