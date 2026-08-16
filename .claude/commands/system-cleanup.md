# Slash Command: /system-cleanup

Rà soát và dọn dẹp các thành phần mồ côi trong dự án Unity.

## Hướng dẫn thực thi cho Claude Code:
1. Quét tìm các file `.meta` mồ côi (không có asset tương ứng) và xóa chúng.
2. Quét tìm các asset bị thiếu file `.meta`.
3. Rà soát các file C# có code bị comment cũ hoặc biến không sử dụng.
4. Kiểm tra các thư mục rỗng và báo cáo danh sách cần dọn dẹp để Dev xác nhận.
