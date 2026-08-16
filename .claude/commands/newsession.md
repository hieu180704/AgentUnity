# Slash Command: /newsession

Quy trình đóng phiên làm việc gọn gàng, đồng bộ tài liệu sống, tạo worklog fragment và sinh prompt bàn giao chéo (Cross-Agent Handoff giữa Claude Code <--> Gemini).

## Hướng dẫn thực thi cho Claude Code:
1. Rà soát lại tất cả các file đã thay đổi trong phiên làm việc (`git status`, `git diff`).
2. Đồng bộ các thay đổi vào tài liệu living docs (`Docs/SourceOfTruth/`, `Docs/Decisions/`).
3. Tạo file worklog fragment tại `Docs/Done/YYYY-MM-DD__<tên-task>.txt` ghi rõ Agent thực hiện và các đầu việc đã hoàn thành.
4. Cập nhật bản tóm tắt Handoff tại `Docs/Handoffs/handoff.txt`.
5. In ra kịch bản prompt bàn giao chuẩn sẵn sàng để copy cho phiên tiếp theo (tương thích cho cả Claude lẫn Gemini).
