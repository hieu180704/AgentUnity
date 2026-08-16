# Slash Command: /move-file-unity

Di chuyển file hoặc thư mục Unity an toàn, luôn di chuyển đồng thời file `.meta` đi kèm để bảo toàn GUID.

## Hướng dẫn thực thi cho Claude Code:
1. Kiểm tra file nguồn và file `.meta` tương ứng.
2. Cảnh báo nếu file nằm trong `Resources/` hoặc có tham chiếu cứng dạng đường dẫn chuỗi.
3. Thực hiện di chuyển cả 2 file:
   ```bash
   git mv <src_path> <dst_path>
   git mv <src_path>.meta <dst_path>.meta
   ```
4. Nhắc nhở người dùng mở Unity Editor để AssetDatabase cập nhật lại liên kết.
