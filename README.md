# GeminiUnity — Universal AI Agent Framework for Unity (Gemini & Claude Code)

<p align="center">
  <img src="https://img.shields.io/badge/Engine-Unity%206%20%7C%202022%20LTS-black?style=for-the-badge&logo=unity" />
  <img src="https://img.shields.io/badge/AI%20Agents-Gemini%20Antigravity%20%7C%20Claude%20Code-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MCP-Unity%20Server%20Ready-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20%26%20Zero--GC-blue?style=for-the-badge" />
</p>

Bộ khung cấu hình, quy tắc an toàn, automation scripts, subagents và mẫu kiến trúc chuẩn hoá dành cho **Đa AI Agent (Google Antigravity / Gemini & Anthropic Claude Code)** khi lập trình cặp (Pair-Programming) trên các dự án Unity Engine.

---

# Mục lục
1. [Tổng Quan Tính Năng](#1-tổng-quan-tính-năng)
2. [Bản Đồ Cấu Trúc Hệ Thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Cơ Chế Dual-Agent & Cross-Agent Handoff](#3-cơ-chế-dual-agent--cross-agent-handoff)
4. [Hệ Thống Trụ Cột (Core Modules)](#4-hệ-thống-trụ-cột-core-modules)
   - [4.1. Lifecycle Hooks & Safety Guards](#41-lifecycle-hooks--safety-guards)
   - [4.2. Architecture Recipes (11 Mẫu Code C#)](#42-architecture-recipes-11-mẫu-code-c)
   - [4.3. Rules & Guardrails](#43-rules--guardrails)
   - [4.4. Slash Commands & Subagents](#44-slash-commands--subagents)
   - [4.5. Living Docs & QC Checklists](#45-living-docs--qc-checklists)
5. [Cài Đặt Tự Động 1 Lệnh (1-Command Quick Install)](#5-cài-đặt-tự-động-1-lệnh-1-command-quick-install)
6. [Quy Trình Tự Động Onboarding Của AI](#6-quy-trình-tự-động-onboarding-của-ai)
7. [Quy Chuẩn Pair-Programming](#7-quy-chuẩn-pair-programming)

---

# 1. Tổng Quan Tính Năng
- 🛡️ **Bảo Vệ Toàn Vẹn Asset Unity:** Chặn cứng AI sửa trực tiếp `.prefab`, `.unity`, `.asset`, `.meta` qua text tool, ngăn ngừa triệt để lỗi mất GUID / broken references.
- ⚡ **Zero-GC & High Performance:** Kiểm soát triệt để cấp phát bộ nhớ trong GameLoop (`Update`, `LateUpdate`, Coroutine, Events).
- 🔄 **Universal Dual-Agent Ready:** Hỗ trợ song song cả **Antigravity (Gemini)** và **Claude Code (Claude)** trên cùng một dự án Unity.
- 🤝 **Bàn Giao Chéo (Cross-Agent Handoff):** Đóng session ở Gemini -> Mở Claude Code tiếp tục ngay lập tức mà không mất ngữ cảnh.
- ⚡ **Tối Ưu Vòng Lặp Phản Hồi:** Hỗ trợ kiến trúc Assembly Definitions (`.asmdef`) đưa thời gian compile C# xuống **< 1 giây**.
- 🔗 **Tích Hợp Sâu Unity MCP Server:** Hướng dẫn và bảo vệ 8 bẫy ngầm khi AI điều khiển Unity Editor trực tiếp qua MCP.
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
├── CLAUDE.md & CLAUDE_TEMPLATE.md # Entry points tối ưu cho Claude Code
├── scripts/
│   └── sync-agents.js             # Công cụ tự động đồng bộ 2 chiều Rules & Recipes
├── .agents/                       # Cấu hình tối ưu cho Antigravity (Gemini)
│   ├── AGENTS.md                  # Tài liệu định hướng tổng quan cho Framework
│   ├── AGENTS_TEMPLATE.md         # Template mẫu sạch để copy sang dự án Game cụ thể
│   ├── hooks.json                 # Cấu hình 5 Lifecycle Hooks của Antigravity
│   ├── hooks/                     # Scripts bảo vệ an toàn, linter C#, context guards
│   ├── rules/                     # 4 Rules chuẩn hóa (Always-on & Model-decision)
│   ├── recipes/                   # 11 Recipes mẫu C# Unity + Bảng index điều hướng
│   └── skills/                    # 10 Kỹ năng mở rộng (/convention-check, /test-run...)
├── .claude/                       # Cấu hình tối ưu cho Claude Code
│   ├── settings.json              # Permissions chặn YAML & Hooks
│   ├── rules/ & recipes/ & hooks/ # Rules & Templates đồng bộ
│   ├── commands/                  # 10 Slash Commands (.md)
│   └── agents/                    # 4 Subagents chuyên trách
└── Docs/                          # 🌟 SHARED SOURCE OF TRUTH (100% Chung)
    ├── SourceOfTruth/             # Spec kỹ thuật phân hệ 4 phần chuẩn (_TEMPLATE.txt)
    ├── Decisions/                 # Nhật ký quyết định kiến trúc ADR (D000__decision-template.txt)
    ├── Handoffs/                  # Mẫu bàn giao công việc & Prompt 4-field (handoff.txt)
    ├── QC/                        # Bộ checklist kiểm thử chất lượng (QC01, QC02)
    ├── Done/                      # Thư mục lưu trữ Worklog Fragments (<date>__<slug>.txt)
    └── prompts/                   # Kịch bản prompt nhanh & mẫu câu lệnh MCP
```

---

# 3. Cơ Chế Dual-Agent & Cross-Agent Handoff

Dự án cho phép bạn linh hoạt chuyển đổi giữa **Gemini** và **Claude Code**:
1. **Làm việc với Gemini (Antigravity IDE):** Khi kết thúc phiên làm việc, gõ `/newsession` -> Gemini tự động ghi tóm tắt vào `Docs/Handoffs/handoff.txt` và lưu fragment tại `Docs/Done/`.
2. **Tiếp tục với Claude Code:** Mở Terminal gõ `claude` -> Ra lệnh: *"Đọc `Docs/Handoffs/handoff.txt` và tiếp tục task tiếp theo"*. Claude nạp ngay bối cảnh mà không cần giải thích lại.
3. **Đồng bộ tự động:** Khi bạn cập nhật bất kỳ Rule hoặc Recipe nào ở một bên, chỉ cần chạy:
   ```bash
   node scripts/sync-agents.js
   ```

---

# 4. Hệ Thống Trụ Cột (Core Modules)

### 4.1. Lifecycle Hooks & Safety Guards
Nằm tại `.agents/hooks/` và `.claude/hooks/`:
- **`asset-write-guard.js`**: Chặn đứng hành vi ghi đè file serialized Unity bằng text tool.
- **`unity-safety-inject.js`**: Tự động tiêm 8 bẫy ngầm khi tương tác qua Unity MCP.
- **`convention-lint-guard.js`**: Tự động chạy linter C# bắt lỗi cú pháp, GC allocation và lifecycle rỗng.
- **`read-guard.js`**: Nhắc nhở đọc file lớn có giới hạn dòng (`StartLine`/`EndLine`).
- **`closeout-trigger.js`**: Nhắc nhở tạo Worklog Fragment khi chạy `git commit`.

### 4.2. Architecture Recipes (11 Mẫu Code C#)
Nằm tại `recipes/` (Tra cứu tại `00-recipe-index.md`):
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

### 4.3. Rules & Guardrails
Nằm tại `rules/`:
- **`unity-safety.md`**: Quy tắc an toàn tối thượng cho Unity & MCP.
- **`knowledge-graph.md`**: Dispatcher điều hướng tra cứu domain 2 tầng.
- **`code-conventions.md`**: Quy chuẩn viết code C# Unity.
- **`doc-policy.md`**: Quy định tài liệu sống và worklog fragment.

### 4.4. Slash Commands & Subagents
- **Commands:** `/convention-check`, `/test-run`, `/worktree`, `/move-file-unity`, `/newsession`, `/explain`, `/unity-mcp-guide`, `/doc`, `/restructure-script`, `/system-cleanup`.
- **Subagents (Claude Code):** `unity-auditor`, `code-reviewer`, `refactor-expert`, `qa-tester`.

---

# 5. Cài Đặt Tự Động 1 Lệnh (1-Command Quick Install)

Mở Terminal tại **thư mục gốc của bất kỳ dự án Unity nào** và chạy 1 lệnh duy nhất:

### Cho Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.ps1 | iex
```

### Cho macOS / Linux (Bash):
```bash
curl -fsSL https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.sh | bash
```

---

# 6. Quy Trình Tự Động Onboarding Của AI
Sau khi chạy lệnh cài đặt:
1. Mở dự án trong **Antigravity IDE** (Gemini) hoặc **Claude Code**.
2. Khi bạn bắt đầu trò chuyện với AI (hoặc gõ `"Bắt đầu"`):
   - AI đọc `AGENTS.md` / `CLAUDE.md`, nhận diện cờ Onboarding và **tự động chủ động hỏi bạn 4 câu hỏi**:
     - *Tên dự án game?*
     - *Thể loại & Core Gameplay loop?*
     - *Unity Version & Render Pipeline (URP/Built-in/HDRP)?*
     - *Các Third-party Packages/Plugins đang sử dụng?*
   - Sau khi bạn trả lời, AI sẽ **tự động điền hoàn thiện file cấu hình** cho dự án của bạn và sẵn sàng pair-programming ngay lập tức!

---

# 7. Quy Chuẩn Pair-Programming
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để nguyên nhân gốc rễ (Root Cause), không vá tạm triệu chứng.
