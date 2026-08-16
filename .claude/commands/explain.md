# Slash Command: /explain

Xuất bản bản Decision Memo 7 phần toàn diện để thảo luận và chốt phương án kiến trúc kỹ thuật lớn.

## Hướng dẫn thực thi cho Claude Code:
Tạo bản Decision Memo gồm 7 mục:
1. **Hiện trạng & Vấn đề gốc rễ:** Phân tích kỹ thuật có dẫn chứng dòng code.
2. **Các phương án đã bị loại bỏ:** Giải thích vì sao không chọn (nhược điểm, rủi ro).
3. **Giải pháp đề xuất (3 tầng):** Data Contract -> Core Logic -> Presentation/UI.
4. **Bẫy ngầm Runtime & An toàn Unity:** 8 bẫy ngầm, GC allocation, Serialized data.
5. **Kế hoạch Rollback & Rủi ro:** Phương án hoàn tác nếu phát sinh sự cố.
6. **Kế hoạch kiểm thử & Verification:** Unit test, manual QC checklist.
7. **Next Steps:** Thứ tự các bước thực thi sau khi Dev xác nhận.
