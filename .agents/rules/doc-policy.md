---
trigger: model_decision
description: Quy định quản lý tài liệu sống (Living Docs), cấu trúc thư mục Docs/ và Worklog Fragments
---

# Documentation Policy (Doc-Policy)

# Mục lục
1. [Triết lý Tài liệu Sống (Living Docs)](#1-triết-lý-tài-liệu-sống-living-docs)
2. [Định dạng File & Cấu trúc Header](#2-định-dạng-file--cấu-trúc-header)
3. [Bản đồ Thư mục Tài liệu (Docs Map)](#3-bản-đồ-thư-mục-tài-liệu-docs-map)
4. [Quy chuẩn Worklog Fragment (Docs/Done/)](#4-quy-chuẩn-worklog-fragment-docsdone)
5. [Kỷ luật Cập nhật & Kiểm soát Độ phình Context](#5-kỷ-luật-cập-nhật--kiểm-soát-độ-phình-context)

---

# 1. Triết lý Tài liệu Sống (Living Docs)
- Tài liệu là sản phẩm đồng hành sống cùng codebase, không phải bản kế hoạch viết một lần rồi bỏ xó.
- Tài liệu mô tả **SỰ THẬT HIỆN TẠI** của hệ thống (Current Source of Truth), không suy đoán tương lai.
- Khi code thay đổi kiến trúc hoặc spec -> Cập nhật tài liệu tương ứng ngay trong phiên làm việc.

---

# 2. Định dạng File & Cấu trúc Header
- **Ưu tiên định dạng `.txt`:**
  - Định dạng `.txt` giúp giảm bớt token định dạng markdown rườm rà và tăng tốc độ đọc của AI.
  - Trường hợp bắt buộc dùng `.md`, chỉ áp dụng cho tài liệu README hoặc file cấu hình Agent.
- **Mục lục bắt buộc:**
  - **MỌI file tài liệu đều phải có phần `# Mục lục` (Table of Contents)** ở đầu file (30 dòng đầu) để phục vụ cơ chế *Targeted Read* tiết kiệm Context Window.

---

# 3. Bản đồ Thư mục Tài liệu (Docs Map)

```text
Docs/
├── SourceOfTruth/   # Đặc tả thiết kế game (GDD), Cơ chế gameplay, Spec hệ thống
├── Decisions/       # Nhật ký ghi nhận quyết định kiến trúc quan trọng (ADR)
├── Handoffs/        # Bàn giao giữa các phiên chat & bài học kinh nghiệm
├── QC/              # Checklist kiểm thử tính năng và kịch bản Test
├── Done/            # Worklog fragments ghi nhận các task đã hoàn thành
└── prompts/         # Kịch bản prompt nhanh & mẫu câu lệnh MCP hữu ích
```

---

# 4. Quy chuẩn Worklog Fragment (Docs/Done/)
- Khi hoàn thành một task/tính năng quan trọng và chuẩn bị commit Git:
  - Tạo một file fragment mới: `Docs/Done/<YYYYMMDD>__<ten-task-ngan-gon>.txt`.
  - **Cấu trúc chuẩn của 1 fragment:**
    1. Tiêu đề task & Ngày hoàn thành.
    2. Một dòng tóm tắt mục tiêu đã giải quyết.
    3. 3-5 gạch đầu dòng liệt kê những thay đổi cốt lõi.
    4. Danh sách các file chính đã tạo/sửa đổi.
    5. Lưu ý bàn giao cho phiên tiếp theo (nếu có).
- **Không duy trì file Index cồng kềnh:** Mỗi session là một file độc lập, không cần sửa đổi hay sinh lại file mục lục `00_index` để tránh xung đột Git (Merge conflicts).

---

# 5. Kỷ luật Cập nhật & Kiểm soát Độ phình Context
- Không viết tài liệu dài dòng, lan man. Mỗi file tài liệu tập trung vào đúng một chủ đề duy nhất.
- Khi đọc tài liệu dài: Đọc mục lục trước (`StartLine: 1, EndLine: 40`), sau đó chỉ đọc đúng phần cần tra cứu.