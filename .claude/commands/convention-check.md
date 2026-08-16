# Slash Command: /convention-check

Kiểm tra toàn diện mã nguồn C# Unity đối chiếu với quy chuẩn tại `.claude/rules/code-conventions.md`.

## Hướng dẫn thực thi cho Claude Code:
1. Xác định file C# cần kiểm tra (hoặc toàn bộ file vừa chỉnh sửa trong `git diff`).
2. Chạy linter tự động nếu có môi trường Node:
   ```bash
   node .claude/hooks/scripts/lint-conventions.js <đường_dẫn_file>
   ```
3. Rà soát thủ công các tiêu chuẩn nâng cao:
   - Zero-GC trong `Update()` / `LateUpdate()` / `FixedUpdate()`.
   - Naming conventions: PascalCase, camelCase, `_camelCase`.
   - Thứ tự khai báo trường và phương thức lifecycle.
   - Event struct payload và hủy đăng ký tại `OnDisable`.
4. Trả về báo cáo PASS/FAIL rõ ràng kèm đề xuất sửa chi tiết.
