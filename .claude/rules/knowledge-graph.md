---
trigger: always_on
description: Khung tra cứu Knowledge Graph 2 tầng cho codebase Unity — Dispatcher điều hướng theo Domain
---

# Knowledge Graph Dispatcher (Node-0)

# Mục lục
1. [Nguyên Tắc Điều Hướng 2 Tầng](#1-nguyên-tắc-điều-hướng-2-tầng)
2. [Danh Mục Domain Kiến Trúc Mẫu](#2-danh-mục-domain-kiến-trúc-mẫu)
3. [Định Dạng Lưu Trỏ Code (Code Pointer Contract)](#3-định-dạng-lưu-trỏ-code-code-pointer-contract)
4. [Quy Trình Mở Rộng Khi Thêm Domain Mới](#4-quy-trình-mở-rộng-khi-thêm-domain-mới)

---

# 1. Nguyên Tắc Điều Hướng 2 Tầng
- **Tầng 1 (Dispatcher Node-0 - File này):** Bản đồ tổng quan phân chia các domain lớn trong dự án. Khi cần tìm hiểu một phân hệ, AI sẽ tra cứu bảng domain ở Tầng 1 để xác định đúng tài liệu hoặc thư mục chứa mã nguồn.
- **Tầng 2 (Leaf Nodes / Domain Docs):** Nằm tại `Docs/SourceOfTruth/<Domain>/` hoặc `.claude/rules/kg-<domain>.md`, chứa sơ đồ chi tiết, luồng gọi hàm (Call flow) và danh sách class cốt lõi của riêng phân hệ đó.
- **Mục tiêu:** Tránh việc chạy lệnh grep/scan toàn bộ repo gây tốn hàng chục ngàn token và dễ bị nhiễu thông tin.

---

# 2. Danh Mục Domain Kiến Trúc Mẫu

| Phân hệ (Domain) | Trách nhiệm chính | Vị trí Code mẫu | Vị trí Doc Tầng 2 |
| :--- | :--- | :--- | :--- |
| **Core / GameLoop** | Vòng lặp game, State Machine chính, Bootstrapper | `Assets/_Project/Scripts/Core/` | `Docs/SourceOfTruth/Core/` |
| **UI / HUD** | Màn hình, Popup, Navigation, Canvas Manager | `Assets/_Project/Scripts/UI/` | `Docs/SourceOfTruth/UI/` |
| **Audio** | Sound FX, BGM Player, Audio Settings | `Assets/_Project/Scripts/Audio/` | `Docs/SourceOfTruth/Audio/` |
| **Save & Persistence** | Lưu trữ dữ liệu người chơi, Versioning, EasySave | `Assets/_Project/Scripts/Save/` | `Docs/SourceOfTruth/Save/` |
| **Gameplay & Combat** | Logic nhân vật, vũ khí, va chạm, tính điểm | `Assets/_Project/Scripts/Gameplay/` | `Docs/SourceOfTruth/Gameplay/` |
| **Configs & Data** | ScriptableObjects, Bảng chỉ số, Catalog | `Assets/_Project/Scripts/Config/` | `Docs/SourceOfTruth/Config/` |
| **Object Pool / VFX** | Tái sử dụng đạn, hiệu ứng hạt, floating text | `Assets/_Project/Scripts/Pool/` | `Docs/SourceOfTruth/Pool/` |

---

# 3. Định Dạng Lưu Trỏ Code (Code Pointer Contract)
Tất cả các tham chiếu code trong Knowledge Graph phải tuân thủ dạng **THƯ MỤC + SYMBOL**:
- **ĐÚNG (Bền vững):** `Assets/_Project/Scripts/Audio/` → `AudioManager`, `SoundConfigSO`
- **SAI (Dễ bị lệch):** `Assets/_Project/Scripts/Audio/AudioManager.cs:L45-L80` *(Vì số dòng sẽ bị thay đổi sau mỗi lần commit sửa code)*.

---

# 4. Quy Trình Mở Rộng Khi Thêm Domain Mới
1. Khi dự án phát triển thêm một phân hệ lớn (VD: `Inventory`, `Quest`, `Network`):
2. Thêm 1 dòng vào Bảng Domain ở Tầng 1 (File này).
3. Tạo file mô tả spec chi tiết tại `Docs/SourceOfTruth/<Domain>/spec.txt`.
