---
name: explain
description: Tổng hợp vấn đề kỹ thuật phức tạp thành một bản Decision Memo 7 phần để Dev chốt hướng giải quyết — hiện trạng, hướng đã loại, đề xuất theo tầng, bẫy runtime, cách verify. Dùng khi gõ "/explain", "chốt hướng đi", "giải thích phương án".
---

# /explain — Bản Giải Thích & Quyết Định Kỹ Thuật (Decision Memo)

# Mục lục
1. [Mục Đích](#1-mục-đích)
2. [Khung 7 Phần của Decision Memo](#2-khung-7-phần-của-decision-memo)
3. [Quy Chuẩn Trình Bày](#3-quy-chuẩn-trình-bày)
4. [Ràng Buộc](#4-ràng-buộc)

---

# 1. Mục Đích
Gom toàn bộ kết quả khảo sát và phân tích kỹ thuật thành **MỘT bản tổng hợp ngắn gọn, có bằng chứng**, giúp Dev đưa ra quyết định kiến trúc chính xác mà không cần đọc lại toàn bộ log điều tra.

---

# 2. Khung 7 Phần của Decision Memo

1. **Yêu Cầu Cốt Lõi:** 1-2 câu định nghĩa rõ mục tiêu và tiêu chí "hoàn thành" đo bằng gì.
2. **Nền Tảng Đang Có:** Liệt kê các class/hệ thống sẵn có có thể tái sử dụng (cite rõ `Folder/` hoặc `Symbol`).
3. **Các Hướng Đã Loại Bỏ:** Mỗi hướng bị loại PHẢI có lý do kỹ thuật rõ ràng (dẫn tới NRE, tốn GC, gãy liên kết serializing), không loại bằng cảm tính.
4. **Phương Án Đề Xuất (Theo Tầng):**
   - Tầng Dữ liệu / Config (ScriptableObject, SaveData)
   - Tầng Logic / Service (Manager, StateMachine)
   - Tầng Trình diễn / UI (Panel, Tween)
5. **Bẫy Ngầm Runtime (Runtime Gotchas):** Cảnh báo các rủi ro compile không bắt được (bẫy MCP, thiếu null-check khi Init, mất binding Enum).
6. **Kế Hoạch Kiểm Thử (Verification):** Mô phỏng đường chạy thật trong Unity (Assert điều kiện gì, test scene nào).
7. **Các Câu Hỏi Để Dev Chốt:** 2-3 câu hỏi cụ thể, đi thẳng vào trọng tâm quyết định của Dev.

---

# 3. Quy Chuẩn Trình Bày
- Văn phong thẳng thắn, trực diện, không nịnh, không rào đón.
- Đi kèm dẫn chứng cụ thể từ codebase.
- Phần nào không áp dụng thì bỏ qua, không để tiêu đề rỗng.

---

# 4. Ràng Buộc
- **Chỉ xuất ra màn hình Chat, KHÔNG tự tạo file rác** (trừ khi Dev yêu cầu ghi vào `Docs/Decisions/`).
- Thao tác là **Read-only**: Dùng để chốt phương án, CHƯA sửa code ở lượt này.
