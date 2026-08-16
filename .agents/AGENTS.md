# AgentUnity — Universal Unity AI Agent Framework & Starter Kit

# Mục lục
1. [Tổng quan bộ khung](#1-tổng-quan-bộ-khung)
2. [Bản đồ cấu trúc hệ thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Hệ thống Rules & Guardrails](#3-hệ-thống-rules--guardrails)
4. [Hệ thống Lifecycle Hooks](#4-hệ-thống-lifecycle-hooks)
5. [Hệ thống Recipes (Code Templates)](#5-hệ-thống-recipes-code-templates)
6. [Hệ thống Skills & Quản trị Docs](#6-hệ-thống-skills--quản-trị-docs)
7. [Quy trình áp dụng vào Dự án Unity mới](#7-quy-trình-áp-dụng-vào-dự-án-unity-mới)
8. [Quy chuẩn Pair-Programming (Conventions)](#8-quy-chuẩn-pair-programming-conventions)

---

# 1. Tổng quan bộ khung
- **Tên dự án:** AgentUnity
- **Bản chất:** Bộ khung cấu hình, quy tắc, kịch bản tự động hoá và mẫu kiến trúc chuẩn hoá dành cho AI Agent (Antigravity/Gemini) khi lập trình cặp (Pair-Programming) trên các dự án Unity.
- **Mục tiêu:**
  - Đảm bảo an toàn tuyệt đối cho Asset & Serialized Data của Unity.
  - Chuẩn hoá kiến trúc C# (Clean, Modularity, High-Performance).
  - Tối ưu hoá Context Window (Token Conservation) và quản lý tài liệu sống (Living Docs).
  - Tích hợp sâu với Unity Editor thông qua **Unity MCP Server**.

---

# 2. Bản đồ cấu trúc hệ thống
```text
GeminiUnity/
├── .editorconfig                  # Cưỡng chế quy chuẩn định dạng C# Unity cấp IDE & Root
├── .agents/
│   ├── AGENTS.md                  # Tài liệu định hướng cốt lõi cho Framework
│   ├── AGENTS_TEMPLATE.md         # Template mẫu sạch để copy sang dự án Game cụ thể
│   ├── hooks.json                 # Cấu hình Lifecycle Hooks của Antigravity
│   ├── hooks/                     # Scripts bảo vệ, linter và automation (Node.js)
│   ├── rules/                     # Hệ thống quy tắc nạp động (Always-on & Model-decision)
│   ├── recipes/                   # Bộ mẫu code chuẩn cho các pattern Unity phổ biến
│   └── skills/                    # Kỹ năng mở rộng (/convention-check, /test-run...)
└── Docs/
    ├── SourceOfTruth/             # Thiết kế game (GDD) & Spec kỹ thuật chuẩn
    ├── Decisions/                 # Nhật ký quyết định kiến trúc (ADR)
    ├── Handoffs/                  # Handoff giữa các phiên chat & bài học kinh nghiệm
    ├── QC/                        # Checklist kiểm thử tính năng
    ├── Done/                      # Worklog fragments ghi nhận các task đã đóng
    └── prompts/                   # Kịch bản prompt nhanh & mẫu lệnh MCP
```

---

# 3. Hệ thống Rules & Guardrails
Nằm tại `.agents/rules/`, tự động áp dụng theo Activation Mode:
- **`unity-safety.md`** *(always_on)*: Quy chuẩn an toàn hàng đầu — cấm sửa file serialized bằng text tool, 8 bẫy ngầm khi thao tác qua Unity MCP.
- **`knowledge-graph.md`** *(always_on)*: Dispatcher điều hướng tra cứu domain kiến trúc 2 tầng nhằm giảm thiểu việc scan/grep toàn bộ repo.
- **`code-conventions.md`** *(model_decision)*: Chuẩn viết code C# trong Unity (Naming, Architecture, Performance, Memory Allocations, Serialization).
- **`doc-policy.md`** *(model_decision)*: Quy định tổ chức tài liệu, định dạng file (`.txt`), cấu trúc worklog fragment.

---

# 4. Hệ thống Lifecycle Hooks
Nằm tại `.agents/hooks.json` và `.agents/hooks/`:
- **`asset-write-guard.js`** *(PreToolUse)*: Chặn cứng việc sửa trực tiếp `.prefab`, `.unity`, `.asset`, `.meta` qua text tool.
- **`unity-safety-inject.js`** *(PreInvocation)*: Tự động tiêm 8 bẫy ngầm và lưu ý an toàn khi tương tác với Unity Editor.
- **`convention-lint-guard.js`** *(PostToolUse)*: Quét nhanh vi phạm convention C# ngay sau khi sửa code.
- **`read-guard.js`** *(PreToolUse)*: Nhắc nhở đọc file có mục tiêu (targeted read) để tiết kiệm Context Window.
- **`closeout-trigger.js`** *(PreToolUse)*: Nhắc nhở tạo worklog fragment khi commit task đã hoàn thành.

---

# 5. Hệ thống Recipes (Code Templates)
Nằm tại `.agents/recipes/` (Tra cứu tại `00-recipe-index.md`):
- `recipe-manager.md`: Mẫu khởi tạo System/Manager chuẩn (Lifecycle, Init, Shutdown).
- `recipe-ui-panel.md`: Mẫu xây dựng UI Panel (CanvasGroup, Open/Close, Anti-blocking).
- `recipe-event.md`: Mẫu Event Bus / C# Events type-safe (Struct payload, OnEnable/OnDisable).
- `recipe-save-data.md`: Mẫu cấu trúc dữ liệu lưu trữ (Serialization, Versioning, Migrate).
- `recipe-scriptableobject.md`: Mẫu ScriptableObject Data/Config (CreateAssetMenu, Immutability).
- `recipe-statemachine.md`: Mẫu Finite State Machine (Enum-driven, Enter/Exit transitions).
- `recipe-tween.md`: Mẫu Tween Animation DOTween (DOKill, Unscaled time, Anti-ghost state).
- `recipe-pool.md`: Mẫu Object Pooling (Get/Release, Reset state, Zero GC Alloc).
- `recipe-constants.md`: Mẫu Quản lý Hằng số tập trung (Scenes, Tags, Layers, AnimParams).
- `recipe-unit-test.md`: Mẫu Viết Unit Test tự động (NUnit, EditMode, TDD Loop).
- `recipe-asmdef.md`: Mẫu Thiết lập Assembly Definitions (.asmdef) tối ưu Compile time < 1s.

---

# 6. Hệ thống Skills & Quản trị Docs
- **Skills (`.agents/skills/`)**:
  - `/convention-check`: Kiểm tra toàn diện file code theo quy chuẩn (kết hợp linter tự động).
  - `/test-run`: Kích hoạt Unit Test Runner tự động qua Unity MCP hoặc CLI.
  - `/worktree`: Tạo không gian làm việc song song qua Git Worktree để thử nghiệm độc lập.
  - `/move-file-unity`: Di chuyển file và `.meta` an toàn, bảo vệ GUID Unity.
  - `/newsession`: Tự động đồng bộ docs, tạo fragment và chuẩn bị prompt bàn giao.
  - `/explain`: Bản giải thích & Decision Memo 7 phần để chốt giải pháp kiến trúc.
  - `/unity-mcp-guide`: Cẩm nang vận hành và điều khiển Unity Editor qua MCP Server.
  - `/doc`: Đồng bộ tài liệu sống theo mã nguồn thực tế.
  - `/restructure-script`: Quy trình tái cấu trúc phân rã God Class MonoBehaviour.
  - `/system-cleanup`: Rà soát và dọn dẹp file `.meta` mồ côi và code rác.
- **Docs Policy**:
  - Ưu tiên định dạng `.txt` cho tài liệu sống và worklog fragment.
  - Mọi file tài liệu đều phải có **Mục lục** ở đầu.

---

# 7. Quy trình áp dụng vào Dự án Unity mới
1. Sao chép toàn bộ thư mục `.agents/`, `Docs/`, và `.editorconfig` vào thư mục gốc của dự án Unity.
2. Sao chép file `.agents/AGENTS_TEMPLATE.md` thành `.agents/AGENTS.md` tại dự án mới.
3. Cập nhật thông tin thực tế của game vào `.agents/AGENTS.md` (Tên game, Engine version, Render Pipeline, Cấu trúc thư mục).

---

# 8. Quy chuẩn Pair-Programming (Conventions)
- **Quy trình 4 bước:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi bước để xác nhận, không tự ý nhảy bước khi chưa được duyệt.
- **Tiêu chuẩn cốt lõi:** *Correct, minimal, verifiable* — giải quyết triệt để nguyên nhân gốc rễ (Root Cause), không vá tạm triệu chứng.
- **Kỷ luật sửa đổi:** Đọc lại file hiện hành trước khi sửa; không tự ý refactor ngoài phạm vi yêu cầu.
