# Slash Command: /doc <tên_hệ>

Đồng bộ tài liệu sống của một phân hệ (`Docs/SourceOfTruth/<Domain>/`) về đúng với mã nguồn C# thực tế.

## Hướng dẫn thực thi cho Claude Code:
1. Đọc code hiện hành của phân hệ trong `Assets/_Project/Scripts/<Domain>/`.
2. Đọc file spec tương ứng trong `Docs/SourceOfTruth/<Domain>/spec.txt`.
3. So sánh độ lệch (Drift) giữa code và tài liệu.
4. Cập nhật lại tài liệu spec, bảng public API, event flow và danh sách lưu ý runtime.
