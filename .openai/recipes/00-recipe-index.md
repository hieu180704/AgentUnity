# Recipe Index — Bảng Điều Hướng Code Templates

# Mục lục
1. [Tổng quan](#1-tổng-quan)
2. [Bảng tra cứu nhanh Recipes](#2-bảng-tra-cứu-nhanh-recipes)
3. [Quy chuẩn nạp Recipe (Progressive Disclosure)](#3-quy-chuẩn-nạp-recipe-progressive-disclosure)

---

# 1. Tổng quan
Hệ thống Recipes cung cấp các mẫu code chuẩn C# (Production-ready templates) cho các thành phần kiến trúc cốt lõi trong Unity.
- Mỗi recipe chứa: Mục đích sử dụng, Code mẫu chuẩn, Các quy tắc bắt buộc (MUST), Quy trình từng bước (STEPS) và Các bẫy runtime thường gặp (GOTCHA).

---

# 2. Bảng tra cứu nhanh Recipes

| Ý định viết code mới... | Đọc Recipe tương ứng |
| :--- | :--- |
| Tạo Manager, Service, System Controller | [.openai/recipes/recipe-manager.md](./recipe-manager.md) |
| Tạo UI Panel, Popup, Screen, Dialog | [.openai/recipes/recipe-ui-panel.md](./recipe-ui-panel.md) |
| Tạo Event Bus, C# Event, ScriptableObject Event | [.openai/recipes/recipe-event.md](./recipe-event.md) |
| Tạo cấu trúc Save Data, Persist State, Versioning | [.openai/recipes/recipe-save-data.md](./recipe-save-data.md) |
| Tạo ScriptableObject Data, Game Config, Catalog | [.openai/recipes/recipe-scriptableobject.md](./recipe-scriptableobject.md) |
| Tạo State Machine, FSM chuyển trạng thái (2-state / N-state) | [.openai/recipes/recipe-statemachine.md](./recipe-statemachine.md) |
| Viết Tween Animation (DOTween), Popup In/Out, Button feedback | [.openai/recipes/recipe-tween.md](./recipe-tween.md) |
| Tạo Object Pool tái sử dụng GameObject (VFX, Bullet, UI Item) | [.openai/recipes/recipe-pool.md](./recipe-pool.md) |
| Quản lý Hằng số tập trung (Constants, Scene Names, Tags, Layers) | [.openai/recipes/recipe-constants.md](./recipe-constants.md) |
| Viết Unit Test tự động (NUnit, EditMode, TDD Loop) | [.openai/recipes/recipe-unit-test.md](./recipe-unit-test.md) |
| Thiết lập Assembly Definitions (.asmdef) tối ưu Compile time | [.openai/recipes/recipe-asmdef.md](./recipe-asmdef.md) |

---

# 3. Quy chuẩn nạp Recipe (Progressive Disclosure)
- Các file Recipe nằm ngoài `.openai/rules/` để **không bị tự động nạp vào context window** gây tốn token.
- Chỉ khi AI bắt đầu viết một module/class cụ thể thì mới thực hiện **Targeted Read** vào file Recipe tương ứng.
- Sau khi viết code theo recipe, luôn chạy `/convention-check` để đảm bảo không vi phạm convention của dự án.
