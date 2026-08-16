# Slash Command: /test-run

Chạy bộ kiểm thử tự động NUnit trong Unity và báo cáo kết quả.

## Hướng dẫn thực thi cho Claude Code:
1. Nếu Unity MCP khả dụng: Gọi lệnh chạy test qua MCP tool `run_tests`.
2. Nếu chạy qua Unity CLI:
   ```bash
   <Unity_Path> -batchmode -runTests -testPlatform EditMode -projectPath . -testResults Logs/editmode-results.xml -logFile Logs/test.log
   ```
3. Đọc file kết quả XML và thống kê:
   - Số test Passed / Failed / Ignored.
   - Chi tiết StackTrace các test bị lỗi.
4. Đưa ra chẩn đoán nguyên nhân gốc rễ và đề xuất giải pháp sửa code.
