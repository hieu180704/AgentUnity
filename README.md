# GeminiUnity — Unity AI Agent Framework & Starter Kit

Bộ khung cấu hình, quy tắc an toàn, kịch bản tự động hoá và mẫu kiến trúc C# chuẩn hoá dành cho **AI Agent (Google Antigravity / Gemini)** khi lập trình cặp (Pair-Programming) trên các dự án Unity Engine.

---

# Mục lục
1. [Tổng Quan Tính Năng](#1-tổng-quan-tính-năng)
2. [Bản Đồ Cấu Trúc Hệ Thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Hệ Thống Trụ Cột (Core Modules)](#3-hệ-thống-trụ-cột-core-modules)
   - [3.1. Lifecycle Hooks (Tự Động Hóa & Bảo Vệ)](#31-lifecycle-hooks-tự-động-hóa--bảo-vệ)
   - [3.2. Architecture Recipes (Mẫu Code C#)](#32-architecture-recipes-mẫu-code-c)
   - [3.3. Rules & Guardrails (Quy Chuẩn)](#33-rules--guardrails-quy-chuẩn)
   - [3.4. Skills Mở Rộng (Slash Commands)](#34-skills-mở-rộng-slash-commands)
   - [3.5. Living Docs & QC Checklists](#35-living-docs--qc-checklists)
4. [Cài Đặt Tự Động 1 Lệnh (1-Command Quick Install)](#4-cài-đặt-tự-động-1-lệnh-1-command-quick-install)
5. [Quy Trình Tự Động Onboarding Của AI](#5-quy-trình-tự-động-onboarding-của-ai)
6. [Quy Chuẩn Pair-Programming](#6-quy-chuẩn-pair-programming)

---

# 1. Tổng Quan Tính Năng
- 🛡️ **Bảo Vệ Toàn Vẹn Asset Unity:** Chặn cứng AI sửa trực tiếp `.prefab`, `.unity`, `.asset`, `.meta` qua text tool, ngăn ngừa triệt để lỗi mất GUID / broken references.
- ⚡ **Tối Ưu Vòng Lặp Phản Hồi:** Hỗ trợ kiến trúc Assembly Definitions (`.asmdef`) đưa thời gian compile C# xuống **< 1 giây**.
- 🧠 **Tiết Kiệm Context Window (Token Conservation):** Cơ chế điều hướng Knowledge Graph 2 tầng và Targeted Read giúp AI chỉ đọc đúng phạm vi cần thiết.
- 🔗 **Tích Hợp Sâu Unity MCP Server:** Hướng dẫn và bảo vệ 8 bẫy ngầm khi AI điều khiển Unity Editor trực tiếp.
- ⚙️ **Đồng Bộ Phong Cách Viết Code:** Cưỡng chế quy chuẩn C# Unity K&R qua `.editorconfig` và linter zero-dependency tích hợp sẵn.
- 🚀 **1-Command Quick Setup & Auto Onboarding:** Cài đặt toàn bộ bộ khung chỉ với 1 câu lệnh, AI tự động hỏi và thiết lập cấu hình dự án.

---

# 2. Bản Đồ Cấu Trúc Hệ Thống

```text
GeminiUnity/
├── install.ps1                    # Script cài đặt tự động 1 lệnh cho Windows (PowerShell)
├── install.sh                     # Script cài đặt tự động 1 lệnh cho macOS & Linux (Bash)
├── .editorconfig                  # Cưỡng chế quy chuẩn định dạng C# Unity cấp IDE & Root
├── .gitattributes                 # Cấu hình Git LFS cho Binary Assets & Text Diff cho C#/YAML
├── .gitignore                     # Chặn file rác Library/, Temp/, Logs/ của Unity 6 & LTS
├── .agents/
│   ├── AGENTS.md                  # Tài liệu định hướng tổng quan cho Framework
│   ├── AGENTS_TEMPLATE.md         # Template mẫu sạch để copy sang dự án Game cụ thể
│   ├── hooks.json                 # Cấu hình 5 Lifecycle Hooks của Antigravity
│   ├── hooks/                     # Scripts bảo vệ an toàn, linter C#, context guards
│   ├── rules/                     # 4 Rules chuẩn hóa (Always-on & Model-decision)
│   ├── recipes/                   # 11 Recipes mẫu C# Unity + Bảng index điều hướng
│   └── skills/                    # 10 Kỹ năng mở rộng (/convention-check, /test-run, /worktree...)
└── Docs/
    ├── SourceOfTruth/             # Spec kỹ thuật phân hệ 4 phần chuẩn (_TEMPLATE.txt)
    ├── Decisions/                 # Nhật ký quyết định kiến trúc ADR (D000__decision-template.txt)
    ├── Handoffs/                  # Mẫu bàn giao công việc & Prompt 4-field (handoff.template.txt)
    ├── QC/                        # Bộ checklist kiểm thử chất lượng (QC01, QC02)
    ├── Done/                      # Thư mục lưu trữ Worklog Fragments (<date>__<slug>.txt)
    └── prompts/                   # Kịch bản prompt nhanh & mẫu câu lệnh MCP
```

---

# 3. Hệ Thống Trụ Cột (Core Modules)

### 3.1. Lifecycle Hooks (Tự Động Hóa & Bảo Vệ)
Nằm tại `.agents/hooks.json` và `.agents/hooks/`:
- **`asset-write-guard.js`** *(PreToolUse)*: Chặn đứng hành vi ghi đè file serialized Unity bằng text tool.
- **`unity-safety-inject.js`** *(PreInvocation)*: Tự động tiêm 8 bẫy ngầm khi tương tác qua Unity MCP.
- **`convention-lint-guard.js`** *(PostToolUse)*: Tự động chạy linter C# bắt `GameObject.Find` trong Update, lifecycle rỗng, serialize sai.
- **`read-guard.js`** *(PreToolUse)*: Nhắc nhở đọc file lớn có giới hạn dòng (`StartLine`/`EndLine`).
- **`closeout-trigger.js`** *(PreToolUse)*: Nhắc nhở tạo Worklog Fragment khi chạy `git commit`.

### 3.2. Architecture Recipes (Mẫu Code C#)
Nằm tại `.agents/recipes/` (Tra cứu tại `00-recipe-index.md`):
- `recipe-manager.md`: System Manager & Service Controller (`Initialize`, `Shutdown`).
- `recipe-ui-panel.md`: UI Panel & Popup (`CanvasGroup`, `Open`/`Close`, ngăn nuốt click).
- `recipe-event.md`: Event Bus & C# Events type-safe (Struct payload, OnEnable/OnDisable).
- `recipe-save-data.md`: Save Data persistence (`schemaVersion`, `CreateDefault`, `MigrateIfNeeded`).
- `recipe-scriptableobject.md`: Game Configs & Catalog tĩnh (Read-only properties, `OnValidate`).
- `recipe-statemachine.md`: Finite State Machine FSM (`Enter`, `Update`, `Exit`).
- `recipe-tween.md`: Tween Animation DOTween (DOKill, Unscaled time cho UI).
- `recipe-pool.md`: Object Pooling tối ưu GC Alloc (`UnityEngine.Pool.ObjectPool`).
- `recipe-constants.md`: Centralized Constants (`Scenes`, `Tags`, `Layers`, `StringToHash`).
- `recipe-unit-test.md`: Unit Testing NUnit (EditMode, TDD Loop).
- `recipe-asmdef.md`: Assembly Definitions phân tầng 1 chiều.

### 3.3. Rules & Guardrails (Quy Chuẩn)
Nằm tại `.agents/rules/`:
- **`unity-safety.md`** *(always_on)*: Quy tắc an toàn tối thượng cho Unity & MCP.
- **`knowledge-graph.md`** *(always_on)*: Dispatcher điều hướng tra cứu domain 2 tầng.
- **`code-conventions.md`** *(model_decision)*: Quy chuẩn viết code C# Unity.
- **`doc-policy.md`** *(model_decision)*: Quy định tài liệu sống và worklog fragment.

### 3.4. Skills Mở Rộng (Slash Commands)
Nằm tại `.agents/skills/`:
- `/convention-check`: Quét lỗi convention C# tự động kết hợp semantic review.
- `/test-run`: Kích hoạt Unit Test Runner tự động qua Unity MCP hoặc CLI.
- `/worktree`: Quản lý nhánh thử nghiệm song song qua Git Worktree.
- `/move-file-unity`: Di chuyển file và `.meta` an toàn, bảo vệ GUID Unity.
- `/newsession`: Đóng session và sinh prompt bàn giao sang phiên mới.
- `/explain`: Bản giải thích & Decision Memo 7 phần để chốt giải pháp kiến trúc.
- `/unity-mcp-guide`: Cẩm nang vận hành Unity Editor qua MCP Server.
- `/doc`: Đồng bộ tài liệu sống với mã nguồn thực tế.
- `/restructure-script`: Quy trình tái cấu trúc phân rã God Class.
- `/system-cleanup`: Dọn dẹp file `.meta` mồ côi và rác dự án.

---

# 4. Cài Đặt Tự Động 1 Lệnh (1-Command Quick Install)

Mở Terminal tại **thư mục gốc của bất kỳ dự án Unity nào** và chạy 1 lệnh duy nhất:

### Cho Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.ps1 | iex
```

### Cho macOS / Linux (Bash):
```bash
curl -fsSL https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.sh | bash
```

> **Lệnh trên sẽ tự động:**
> 1. Tải và giải nén toàn bộ `.agents/`, `Docs/`, `.editorconfig`, `.gitattributes`, `.gitignore`.
> 2. Kích hoạt file `.agents/AGENTS.md` ở chế độ **Auto-Onboarding**.

---

# 5. Quy Trình Tự Động Onboarding Của AI
Sau khi chạy lệnh cài đặt:
1. Mở dự án trong **Antigravity IDE** hoặc **VS Code**.
2. Khi bạn bắt đầu trò chuyện với AI (hoặc gõ `"Bắt đầu"`):
   - AI đọc `.agents/AGENTS.md`, nhận diện cờ Onboarding và **tự động chủ động hỏi bạn 4 câu hỏi**:
     - *Tên dự án game?*
     - *Thể loại & Core Gameplay loop?*
     - *Unity Version & Render Pipeline (URP/Built-in/HDRP)?*
     - *Các Third-party Packages/Plugins đang sử dụng?*
   - Sau khi bạn trả lời, AI sẽ **tự động điền hoàn thiện file `AGENTS.md`** cho dự án của bạn và sẵn sàng pair-programming ngay lập tức!

---

# 6. Quy Chuẩn Pair-Programming
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để nguyên nhân gốc rễ (Root Cause), không vá tạm triệu chứng.
