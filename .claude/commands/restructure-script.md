# Slash Command: /restructure-script <file.cs>

Hướng dẫn và thực hiện quy trình tái cấu trúc phân rã MonoBehaviour quá lớn (>400 dòng).

## Hướng dẫn thực thi cho Claude Code:
1. Đọc toàn bộ file C# mục tiêu, phân tích các cụm trách nhiệm.
2. Trích xuất logic nghiệp vụ sang các plain C# classes (POCO).
3. Tách các cụm hành vi độc lập thành các sub-components MonoBehaviour.
4. Thiết lập Coordinator Pattern và chuyển giao dữ liệu an toàn.
5. Đảm bảo không làm mất liên kết Serialized Data trên Scene/Prefab.
