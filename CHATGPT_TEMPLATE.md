# [Project Name] — Project Map & Conventions for ChatGPT & OpenAI

> ⚠️ **HƯỚNG DẪN DÀNH CHO CHATGPT / OPENAI (ONBOARDING MODE):**
> Nếu file này còn chứa các placeholder dạng `[Project Name]` hoặc `[Mô tả ...]`, AI BẮT BUỘC phải chủ động chào Dev và hỏi các câu hỏi sau để hoàn thiện file `CHATGPT.md` này trước khi bắt đầu thực hiện task:
> 1. **Tên dự án game:**
> 2. **Thể loại & Gameplay chính:** (2D/3D, core loop, góc nhìn...)
> 3. **Unity Version & Render Pipeline:** (Unity 6 / 2022 LTS, URP / Built-in / HDRP)
> 4. **Third-party Packages / Plugins:** (UniTask, DOTween, Odin Inspector, Zenject, v.v.)
> *Sau khi Dev trả lời, AI cập nhật đè thông tin thực tế vào file này và xóa khối hướng dẫn này.*

# Mục lục
1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Bản đồ cấu trúc thư mục](#3-bản-đồ-cấu-trúc-thư-mục)
4. [Quản lý tài liệu (Docs)](#4-quản-lý-tài-liệu-docs)
5. [Quy tắc phát triển (Conventions)](#5-quy-tắc-phát-triển-conventions)

---

# 1. Tổng quan dự án
- **Tên dự án:** [Project Name]
- **Mô tả:** [Mô tả ngắn gọn thể loại game, gameplay chính]

# 2. Tech Stack & Dependencies
- **Engine:** Unity 6 (hoặc bản Unity tương ứng)
- **Render Pipeline:** URP / Built-in / HDRP
- **Input:** Unity Input System
- **IDE Tooling:** Unity MCP Server (Connected 🟢)

# 3. Bản đồ cấu trúc thư mục
- `Assets/_Project/Scripts/Core/`: Core logic, Enums, Interfaces, GameLoop (`MyGame.Core.asmdef`).
- `Assets/_Project/Scripts/Managers/`: System Managers (`MyGame.Managers.asmdef`).
- `Assets/_Project/Scripts/Gameplay/`: Combat, Mechanics, Nhân vật (`MyGame.Gameplay.asmdef`).
- `Assets/_Project/Scripts/UI/`: UI Panels, Popups, HUD, Widgets (`MyGame.UI.asmdef`).
- `Assets/_Project/Tests/`: EditMode & PlayMode Unit Tests (`MyGame.Tests.asmdef`).
- `Assets/_Project/Prefabs/`: Prefabs gốc của game.
- `Assets/Scenes/`: Các Scene chính (Bootstrap, MainMenu, Gameplay).

# 4. Quản lý tài liệu (Docs)
- Mô tả chi tiết & Spec game: `Docs/SourceOfTruth/`
- Quyết định kiến trúc lớn (ADR): `Docs/Decisions/`
- Nhật ký bàn giao giữa các phiên chat: `Docs/Handoffs/`
- Danh mục kiểm thử Quality Control: `Docs/QC/`
- Worklog fragments đã đóng: `Docs/Done/`
- Prompt nhanh & hướng dẫn MCP: `Docs/prompts/`

# 5. Quy tắc phát triển (Conventions)
- **Quy trình 4 pha:** `explore -> propose -> confirm -> execute`.
- **Hệ thống Modular Rules (.openai/rules/ hoặc .agents/rules/)**:
  - An toàn Unity: `unity-safety.md`
  - Tra cứu Domain 2 tầng: `knowledge-graph.md`
  - Quy chuẩn C#: `code-conventions.md`
  - Quản lý Doc & Worklog: `doc-policy.md`
- **Bộ Template Code Mẫu (Recipes)**: Tra cứu tại `.openai/recipes/00-recipe-index.md` hoặc `.agents/recipes/00-recipe-index.md`.
- **Cơ chế Bàn giao Đa Agent**: Đồng bộ tiến độ qua `Docs/Handoffs/latest.txt` và `Docs/Done/`.
