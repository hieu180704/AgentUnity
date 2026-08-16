# AgentUnity — Universal Unity AI Agent Framework & Starter Kit for Claude Code

# Mục lục
1. [Tổng quan bộ khung](#1-tổng-quan-bộ-khung)
2. [Bản đồ cấu trúc hệ thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Quy chuẩn Pair-Programming cho Claude Code](#3-quy-chuẩn-pair-programming-cho-claude-code)
4. [Hệ thống Modular Rules (.claude/rules/)](#4-hệ-thống-modular-rules-clauderules)
5. [Hệ thống Subagents (.claude/agents/)](#5-hệ-thống-subagents-claudeagents)
6. [Hệ thống Slash Commands (.claude/commands/)](#6-hệ-thống-slash-commands-claudecommands)
7. [Hệ thống Architecture Recipes (.claude/recipes/)](#7-hệ-thống-architecture-recipes-clauderecipes)
8. [Hệ thống Hooks & Bảo mật An toàn (.claude/hooks/)](#8-hệ-thống-hooks--bảo-mật-an-toàn-claudehooks)
9. [Cấu trúc Quản trị Living Docs (Docs/)](#9-cấu-trúc-quản-trị-living-docs-docs)
10. [Quy trình Onboarding Dự án Unity Mới](#10-quy-trình-onboarding-dự-án-unity-mới)

---

# 1. Tổng quan bộ khung
- **Tên dự án:** AgentUnity
- **Bản chất:** Bộ khung cấu hình, quy tắc an toàn, automation scripts, subagents và mẫu kiến trúc chuẩn hóa dành riêng cho **Claude Code** (Anthropic Claude AI) khi lập trình cặp (Pair-Programming) trên các dự án Unity Engine.
- **Mục tiêu cốt lõi:**
  - **Bảo vệ tuyệt đối Asset & Serialized YAML:** Chặn việc sửa hỏng GUID/FileID của `.prefab`, `.unity`, `.asset`, `.meta`.
  - **Chuẩn hóa C# High-Performance:** Zero-GC Allocations trong GameLoop, tuân thủ Clean Architecture & Modularity.
  - **Hệ thống Subagents & Automation:** Phân quyền kiểm toán an toàn, review code, testing và refactoring cho các subagents chuyên biệt.
  - **Tích hợp sâu Unity MCP Server:** Điều khiển Unity Editor trực tiếp qua MCP (GameObject, Component, Scene, Console, Screenshot).

---

# 2. Bản đồ cấu trúc hệ thống
```text
ClaudeUnity/
├── CLAUDE.md                      # Tài liệu định hướng cốt lõi cho Framework
├── CLAUDE_TEMPLATE.md             # Template mẫu sạch để copy sang dự án Game cụ thể
├── .editorconfig                  # Cưỡng chế quy chuẩn C# Unity cấp IDE & Root
├── .gitattributes                 # Cấu hình Git LFS cho Asset & Media
├── .gitignore                     # Ignore chuẩn Unity Engine & Claude artifacts
├── install.ps1                    # 1-Command Installer cho Windows (PowerShell)
├── install.sh                     # 1-Command Installer cho macOS / Linux (Bash)
├── README.md                      # Tài liệu tổng quan & hướng dẫn sử dụng
├── .claude/
│   ├── settings.json              # Cấu hình Claude Code: permissions, hooks, mcpServers
│   ├── rules/                     # Hệ thống quy tắc nạp động (Modular Rules)
│   │   ├── unity-safety.md        # An toàn Asset Serialized & 8 bẫy ngầm MCP
│   │   ├── knowledge-graph.md     # Dispatcher điều hướng domain 2 tầng (Node-0)
│   │   ├── code-conventions.md    # Chuẩn viết code C# Unity (Zero GC, Naming, ASMDEF)
│   │   └── doc-policy.md          # Quy định tổ chức Living Docs (.txt format)
│   ├── commands/                  # 10 Slash Commands tùy biến chuẩn Claude Code (.md)
│   │   ├── convention-check.md    # /convention-check - Linter kiểm tra convention C#
│   │   ├── test-run.md            # /test-run - Chạy NUnit Test qua Unity MCP / CLI
│   │   ├── worktree.md            # /worktree - Tạo Git Worktree độc lập
│   │   ├── move-file-unity.md     # /move-file-unity - Di chuyển asset kèm .meta an toàn
│   │   ├── newsession.md          # /newsession - Đóng session & sinh prompt bàn giao
│   │   ├── explain.md             # /explain - Decision Memo 7 phần chốt kiến trúc
│   │   ├── unity-mcp-guide.md     # /unity-mcp-guide - Cẩm nang vận hành Unity MCP
│   │   ├── doc.md                 # /doc - Đồng bộ tài liệu theo code thực tế
│   │   ├── restructure-script.md  # /restructure-script - Tách God Class MonoBehaviour
│   │   └── system-cleanup.md      # /system-cleanup - Rà soát file .meta mồ côi & code rác
│   ├── agents/                    # 4 Subagents chuyên trách
│   │   ├── unity-auditor.md       # Kiểm toán an toàn Asset YAML & GUID
│   │   ├── code-reviewer.md       # Review C# Conventions & GC Allocations
│   │   ├── refactor-expert.md     # Tái cấu trúc Single Responsibility
│   │   └── qa-tester.md           # Điều phối chạy & phân tích Unit Test
│   ├── hooks/                     # Scripts bảo vệ & linter (Node.js)
│   │   ├── asset-write-guard.js   # PreToolUse: Chặn sửa file YAML/Serialized
│   │   ├── unity-safety-inject.js # PreInvocation: Tiêm 8 bẫy ngầm Unity MCP
│   │   ├── convention-lint-guard.js # PostToolUse: Linter quét vi phạm code C#
│   │   ├── read-guard.js          # PreToolUse: Nhắc nhở đọc file có mục tiêu
│   │   ├── closeout-trigger.js    # PreToolUse: Nhắc nhở tạo worklog fragment khi commit
│   │   └── scripts/
│   │       └── lint-conventions.js
│   └── recipes/                   # 11 Mẫu kiến trúc C# Unity chuẩn
│       ├── 00-recipe-index.md     # Mục lục tra cứu Recipes
│       ├── recipe-manager.md      # Khởi tạo System / Manager chuẩn
│       ├── recipe-ui-panel.md     # UI Panel (CanvasGroup, Open/Close)
│       ├── recipe-event.md        # Event Bus / C# Events type-safe (Struct payload)
│       ├── recipe-save-data.md    # Dữ liệu lưu trữ (Serialization, Versioning, Migrate)
│       ├── recipe-scriptableobject.md # ScriptableObject Data / Config
│       ├── recipe-statemachine.md # Finite State Machine (Enum-driven)
│       ├── recipe-tween.md        # Tween Animation DOTween (DOKill, Anti-ghost)
│       ├── recipe-pool.md         # Object Pooling (Get/Release, Zero GC)
│       ├── recipe-constants.md    # Hằng số tập trung (Scenes, Tags, Layers)
│       ├── recipe-unit-test.md    # Viết Unit Test NUnit (EditMode / PlayMode)
│       └── recipe-asmdef.md       # Assembly Definitions (.asmdef) Compile < 1s
└── Docs/                          # Living Docs Framework
    ├── SourceOfTruth/             # Thiết kế game (GDD) & Spec kỹ thuật chuẩn
    ├── Decisions/                 # Nhật ký quyết định kiến trúc (ADR)
    ├── Handoffs/                  # Handoff giữa các phiên chat & bài học kinh nghiệm
    ├── QC/                        # Checklist kiểm thử tính năng
    ├── Done/                      # Worklog fragments ghi nhận các task đã đóng
    └── prompts/                   # Kịch bản prompt nhanh & mẫu lệnh MCP
```

---

# 3. Quy chuẩn Pair-Programming cho Claude Code
1. **Quy trình 4 pha bắt buộc:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi pha để tóm tắt và chờ người dùng xác nhận (`confirm`), không tự ý nhảy cóc.
2. **Tiêu chuẩn chất lượng:** *Correct, minimal, verifiable* — giải quyết triệt để nguyên nhân gốc rễ (Root Cause), không vá tạm triệu chứng.
3. **Đọc trước khi làm:** Trích dẫn dòng cụ thể (`filename:Lxx-Lyy`) để có thể verify. "Đọc lại" nghĩa là đọc từ đầu file, không dựa trên trí nhớ.
4. **Không Over-Scope:** Làm đúng phạm vi yêu cầu, không tự tiện refactor hay dọn dẹp các file ngoài phạm vi.
5. **Trung thực & Thẳng thắn:** Phát hiện lỗi hoặc rủi ro kiến trúc → báo ngay, không âm thầm sửa lụi.
6. **Ngôn ngữ:** Tiếng Việt ~90%, English cho các thuật ngữ kỹ thuật.

---

# 4. Hệ thống Modular Rules (.claude/rules/)
Tự động nạp vào ngữ cảnh của Claude Code:
- **`unity-safety.md`:** Cấm sửa file YAML/Serialized bằng text tool; 8 bẫy ngầm khi thao tác qua Unity MCP; kỷ luật Prefab Zero-Override.
- **`knowledge-graph.md`:** Dispatcher 2 tầng định tuyến domain mã nguồn để tránh grep/scan toàn bộ repo.
- **`code-conventions.md`:** Quy chuẩn C# Unity (Zero GC trong `Update`, PascalCase/camelCase/_camelCase, SerializedField, Custom Yield Instruction).
- **`doc-policy.md`:** Quản lý Living Docs định dạng `.txt`, cấu trúc đặt tên worklog fragment và lưu trữ quyết định kỹ thuật.

---

# 5. Hệ thống Subagents (.claude/agents/)
Claude Code có thể ủy quyền (delegate) task cho các subagents chuyên biệt:
- **`unity-auditor`:** Rà soát tính toàn vẹn của GUID, Asset Database, dependencies và bảo vệ file YAML.
- **`code-reviewer`:** Chuyên môn hóa review hiệu năng C#, phát hiện boxing, string concatenation trong loop, kiểm tra naming convention.
- **`refactor-expert`:** Hướng dẫn và thực thi phân rã các lớp MonoBehaviour cồng kềnh (>400 dòng) thành các Component con & POCO.
- **`qa-tester`:** Chạy và phân tích kết quả Unit Test NUnit, kiểm tra coverage và hỗ trợ chu trình TDD.

---

# 6. Hệ thống Slash Commands (.claude/commands/)
Kích hoạt nhanh các kịch bản tương tác bằng cách gõ lệnh trong Claude Code:
- `/convention-check`: Kiểm tra toàn diện file code đối chiếu với quy chuẩn.
- `/test-run`: Kích hoạt Unit Test Runner tự động qua Unity MCP hoặc CLI.
- `/worktree`: Tạo và quản lý Git Worktree độc lập để spike/thử nghiệm an toàn.
- `/move-file-unity`: Di chuyển file và `.meta` an toàn, giữ nguyên GUID.
- `/newsession`: Đóng session, sync docs, tạo worklog fragment và prompt bàn giao.
- `/explain`: Xuất bản Decision Memo 7 phần để chốt giải pháp kiến trúc lớn.
- `/unity-mcp-guide`: Cẩm nang tra cứu và vận hành Unity MCP Server.
- `/doc`: Đồng bộ tài liệu living docs theo mã nguồn C# thực tế.
- `/restructure-script`: Tách nhỏ God Class MonoBehaviour.
- `/system-cleanup`: Dọn dẹp `.meta` mồ côi và rà soát code thừa.

---

# 7. Hệ thống Architecture Recipes (.claude/recipes/)
Bộ 11 mẫu kiến trúc chuẩn hóa C# Unity được lưu tại `.claude/recipes/00-recipe-index.md`:
- Đảm bảo tính nhất quán giữa các lập trình viên và AI.
- Code mẫu có sẵn logic Lifecycle (`Initialize`, `Shutdown`), Event Subscription an toàn (`OnEnable`/`OnDisable`), Zero GC Object Pooling, và Assembly Definition (`.asmdef`).

---

# 8. Hệ thống Hooks & Bảo mật An toàn (.claude/hooks/)
- **Cấu hình `settings.json`:** Khai báo quyền hạn (Permissions) chặn chỉnh sửa file serialized (`*.prefab`, `*.unity`, `*.asset`, `*.meta`) qua text tools.
- **Hook Scripts (Node.js):**
  - `asset-write-guard.js`: Chặn cứng thao tác ghi vào file asset Unity.
  - `unity-safety-inject.js`: Tự động chèn lưu ý 8 bẫy ngầm khi tương tác với Unity Editor.
  - `convention-lint-guard.js`: Tự động quét vi phạm convention sau khi chỉnh sửa file `.cs`.
  - `read-guard.js`: Nhắc nhở đọc file có mục tiêu (targeted reads).
  - `closeout-trigger.js`: Nhắc tạo worklog fragment khi commit git.

---

# 9. Cấu trúc Quản trị Living Docs (Docs/)
- Ưu tiên định dạng `.txt` cho tài liệu sống để tránh markdown bloat.
- Mọi tài liệu đều phải có **Mục lục** ở đầu.
- Ghi nhận worklog fragment tại `Docs/Done/YYYY-MM-DD__tên-task.txt` mỗi khi hoàn thành tính năng.

---

# 10. Quy trình Onboarding Dự án Unity Mới
1. Chạy 1 lệnh cài đặt duy nhất:
   - **Windows:** `irm https://raw.githubusercontent.com/hieu180704/ClaudeUnity/main/install.ps1 | iex`
   - **macOS/Linux:** `curl -fsSL https://raw.githubusercontent.com/hieu180704/ClaudeUnity/main/install.sh | bash`
2. Mở Claude Code tại thư mục dự án Unity.
3. Claude Code sẽ tự động đọc `CLAUDE.md` (khởi tạo từ `CLAUDE_TEMPLATE.md`) và phỏng vấn Dev các thông tin cốt lõi (Engine version, Render Pipeline, Packages) để đồng bộ cấu hình dự án.
