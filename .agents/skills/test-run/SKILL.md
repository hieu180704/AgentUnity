---
name: test-run
description: Chạy kiểm thử tự động (Unit Test / NUnit) qua Unity MCP hoặc Unity CLI — Đọc kết quả PASS/FAIL, hỗ trợ vòng lặp TDD. Dùng khi gõ "/test-run", "chạy unit test", "test code".
---

# /test-run — Chạy Kiểm Thử Tự Động Unity (TDD Runner)

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Quy Trình Chạy Test Qua Unity MCP](#2-quy-trình-chạy-test-qua-unity-mcp)
3. [Quy Trình Chạy Test Qua Unity CLI (Headless Batchmode)](#3-quy-trình-chạy-test-qua-unity-cli-headless-batchmode)
4. [Vòng Lặp Sửa Lỗi TDD (Red-Green-Refactor)](#4-vòng-lặp-sửa-lỗi-tdd-red-green-refactor)

---

# 1. Mục Đích
Kích hoạt hệ thống Unity Test Framework (EditMode / PlayMode) để kiểm tra tính đúng đắn của logic C# mà **không cần mở game bấm tay**. Giúp AI xác thực code theo phương pháp kiểm thử hướng hành vi (Test-Driven Development).

---

# 2. Quy Trình Chạy Test Qua Unity MCP

Khi Unity Editor đang mở và kết nối Unity MCP:

### Bước 1: Kích Hoạt Test Job
- Gọi MCP tool `run_tests`:
  ```json
  {
    "mode": "EditMode",
    "test_names": ["MyGame.Tests.EditMode.PlayerHealthTests"]
  }
  ```
- Nhận về `job_id`.

### Bước 2: Đọc Kết Quả Test
- Gọi MCP tool `get_test_job` với `job_id`:
  ```json
  {
    "job_id": "<job_id>",
    "wait_timeout": 30,
    "include_failed_tests": true
  }
  ```

### Bước 3: Xuất Báo Cáo
- In bảng kết quả: `Tổng số Test` | `Passed ✅` | `Failed ❌` | `Chi tiết lỗi (Assert Error)`.

---

# 3. Quy Trình Chạy Test Qua Unity CLI (Headless Batchmode)
Khi không có giao diện Editor hoặc chạy trên CI:
```powershell
& "<Đường_dẫn_Unity.exe>" -batchmode -runTests -projectPath "." -testPlatform editmode -testResults "Docs/QC/Results/TestResults.xml"
```

---

# 4. Vòng Lặp Sửa Lỗi TDD (Red-Green-Refactor)
1. **Red (Fail):** Viết test case trước cho tính năng mới -> Chạy `/test-run` -> Test fail vì chưa có code xử lý.
2. **Green (Pass):** Viết lượng code tối thiểu để test case chuyển sang màu xanh (Pass).
3. **Refactor:** Tối ưu hóa code theo `code-conventions.md` -> Chạy lại `/test-run` để đảm bảo không làm gãy logic cũ.
