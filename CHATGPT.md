# AgentUnity — Universal Unity AI Agent Framework & Starter Kit for ChatGPT & OpenAI

# Mục lục
1. [Tổng quan bộ khung](#1-tổng-quan-bộ-khung)
2. [Bản đồ cấu trúc hệ thống](#2-bản-đồ-cấu-trúc-hệ-thống)
3. [Quy chuẩn Pair-Programming cho ChatGPT / OpenAI](#3-quy-chuẩn-pair-programming-cho-chatgpt--openai)
4. [Quy tắc An toàn Unity (Unity Safety Rules)](#4-quy-tắc-an-toàn-unity-unity-safety-rules)
5. [Quy chuẩn Lập trình C# Unity (Zero-GC & High Performance)](#5-quy-chuẩn-lập-trình-c-unity-zero-gc--high-performance)
6. [Hệ thống Architecture Recipes (Mẫu thiết kế C#)](#6-hệ-thống-architecture-recipes-mẫu-thiết-kế-c)
7. [Cấu trúc Quản trị Living Docs (Docs/)](#7-cấu-trúc-quản-trị-living-docs-docs)
8. [Cơ chế Bàn giao Đa Agent (Gemini <-> Claude <-> ChatGPT)](#8-cơ-chế-bàn-giao-đa-agent-gemini---claude---chatgpt)
9. [Quy trình Onboarding Dự án Unity Mới](#9-quy-trình-onboarding-dự-án-unity-mới)

---

# 1. Tổng quan bộ khung
- **Tên dự án:** AgentUnity
- **Bản chất:** Bộ khung cấu hình, quy tắc an toàn, mẫu kiến trúc và kịch bản tự động hóa dành cho **ChatGPT / OpenAI Ecosystem (GPT-4o, o1, o3-mini, ChatGPT Projects, Copilot, Cursor, OpenAI Assistants)** khi lập trình cặp (Pair-Programming) trên các dự án Unity Engine.
- **Mục tiêu cốt lõi:**
  - **Bảo vệ tuyệt đối Asset & Serialized Data:** Chặn việc sửa hỏng GUID/FileID của `.prefab`, `.unity`, `.asset`, `.meta`.
  - **Chuẩn hóa C# High-Performance:** Zero-GC Allocations trong GameLoop (`Update`, `LateUpdate`, Coroutines, Events).
  - **Kiến trúc Modularity:** Phân rã theo Assembly Definitions (`.asmdef`), Compile Time < 1s.
  - **Tích hợp sâu Unity MCP Server:** Điều khiển Unity Editor an toàn, tránh 8 bẫy ngầm khi tương tác qua MCP.
  - **Đồng bộ Đa Agent:** Dùng chung tài liệu sống (`Docs/`) và Recipes với Google Gemini (`.agents/`) và Claude Code (`.claude/`).

---

# 2. Bản đồ cấu trúc hệ thống
```text
AgentUnity/
├── CHATGPT.md                     # Tài liệu chỉ dẫn cốt lõi cho ChatGPT & OpenAI
├── CHATGPT_TEMPLATE.md            # Template mẫu sạch để copy sang dự án Game cụ thể
├── CLAUDE.md                      # Entry point cho Claude Code
├── .agents/AGENTS.md              # Entry point cho Gemini / Antigravity
├── .cursorrules                   # Quy tắc tích hợp cho Cursor IDE (OpenAI / Claude models)
├── .github/
│   └── copilot-instructions.md    # Hướng dẫn quy chuẩn cho GitHub Copilot
├── .editorconfig                  # Cưỡng chế quy chuẩn C# Unity cấp IDE & Root
├── .gitattributes                 # Cấu hình Git LFS cho Asset & Media
├── .gitignore                     # Ignore chuẩn Unity Engine & AI temporary artifacts
├── install.ps1                    # 1-Command Installer cho Windows (PowerShell)
├── install.sh                     # 1-Command Installer cho macOS / Linux (Bash)
├── README.md                      # Tài liệu tổng quan & hướng dẫn sử dụng
├── scripts/
│   └── sync-agents.js             # Tự động đồng bộ 3 chiều (Gemini <-> Claude <-> ChatGPT)
├── .openai/                       # Thư mục cấu hình chuyên biệt cho OpenAI / ChatGPT
│   ├── rules/                     # Hệ thống quy tắc nạp động (Modular Rules)
│   │   ├── unity-safety.md        # An toàn Asset Serialized & 8 bẫy ngầm MCP
│   │   ├── knowledge-graph.md     # Dispatcher điều hướng domain 2 tầng (Node-0)
│   │   ├── code-conventions.md    # Chuẩn viết code C# Unity (Zero GC, Naming, ASMDEF)
│   │   └── doc-policy.md          # Quy định tổ chức Living Docs (.txt format)
│   └── recipes/                   # 11 Mẫu kiến trúc C# Unity chuẩn
│       ├── 00-recipe-index.md     # Bảng tra cứu Recipes
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
├── .agents/                       # Cấu hình cho Antigravity / Gemini
├── .claude/                       # Cấu hình cho Claude Code
└── Docs/                          # Living Docs dùng chung cho cả 3 Agent
    ├── SourceOfTruth/             # Thiết kế game (GDD) & Spec kỹ thuật chuẩn
    ├── Decisions/                 # Nhật ký quyết định kiến trúc (ADR)
    ├── Handoffs/                  # Handoff giữa các phiên chat & bài học kinh nghiệm
    ├── QC/                        # Checklist kiểm thử tính năng
    ├── Done/                      # Worklog fragments ghi nhận các task đã đóng
    └── prompts/                   # Kịch bản prompt nhanh & mẫu lệnh MCP
```

---

# 3. Quy chuẩn Pair-Programming cho ChatGPT / OpenAI
1. **Quy trình 4 pha bắt buộc:** `explore -> propose -> confirm -> execute`. Dừng lại ở mỗi pha để tóm tắt và chờ người dùng xác nhận (`confirm`), không tự ý nhảy cóc.
2. **Tiêu chuẩn chất lượng:** *Correct, minimal, verifiable* — giải quyết triệt để nguyên nhân gốc rễ (Root Cause), không vá tạm triệu chứng.
3. **Đọc trước khi làm:** Trích dẫn dòng cụ thể (`filename:Lxx-Lyy`) để có thể verify. "Đọc lại" nghĩa là đọc từ đầu file, không dựa trên trí nhớ.
4. **Không Over-Scope:** Làm đúng phạm vi yêu cầu, không tự tiện refactor hay dọn dẹp các file ngoài phạm vi.
5. **Trung thực & Thẳng thắn:** Phát hiện sai sót giữa chừng → báo ngay cho người dùng, không âm thầm patch.
6. **Ngôn ngữ:** Tiếng Việt ~90%, English cho các thuật ngữ kỹ thuật.

---

# 4. Quy tắc An toàn Unity (Unity Safety Rules)
- **CẤM TUYỆT ĐỐI sửa trực tiếp:** `.prefab`, `.unity`, `.asset`, `.meta` qua text tool. Phải thao tác qua Unity MCP hoặc hướng dẫn dev thao tác qua Unity Inspector.
- **8 Bẫy ngầm khi tương tác qua Unity MCP:**
  1. *Lệch tên Property:* `Graphic`/`Image`/`Button` dùng field serialized (`m_Color`, `m_Sprite`); `RectTransform` dùng public API (`sizeDelta`, `anchoredPosition`).
  2. *UI Child rỗng:* Tạo GameObject rỗng trong Canvas không tự thêm `RectTransform`.
  3. *Wire Reference:* Luôn read-back verify sau khi set serialized property.
  4. *Kiểm tra GUID Script:* Dùng `AssetDatabase.GUIDToAssetPath`, không grep path trong `Assets/`.
  5. *Lưu Asset có chọn lọc:* Dùng `SaveAssetIfDirty`, không gọi `SaveAssets` toàn bộ khi scene đang dirty.
  6. *Timeout MCP:* Timeout không có nghĩa là thất bại; check `git diff` trước khi thử lại.
  7. *Git Revert:* Revert asset qua Git không flush RAM Unity Editor -> Phải gọi `Refresh`/`ImportAsset`.
  8. *Snippet Code:* Chạy dưới dạng method body -> Dùng Fully-Qualified Types, không đặt `using` ở đầu.
- **Prefab Zero-Override:** Mọi component và field mặc định phải được wire hoàn chỉnh trong Prefab Mode, không phụ thuộc vào Scene Instance Override.

---

# 5. Quy chuẩn Lập trình C# Unity (Zero-GC & High Performance)
1. **Zero Allocations trong GameLoop (`Update`, `LateUpdate`, `FixedUpdate`):**
   - Không `new` class, closure, LINQ, boxing.
   - Không `GameObject.Find`, `GetComponent` liên tục -> Cache tại `Awake`/`Initialize`.
   - Dùng NonAlloc physics API (`Physics.RaycastNonAlloc`, `OverlapSphereNonAlloc`).
2. **Naming Conventions:**
   - Class, Struct, Method, Property, Public Field, Enum: `PascalCase`.
   - Private / Protected Field: `_camelCase` hoặc `m_camelCase`.
   - Interface: `I` prefix (`IDamageable`).
   - Constant: `UPPER_SNAKE_CASE` hoặc `PascalCase`.
3. **Assembly Definitions (`.asmdef`):**
   - Mọi domain phải có `.asmdef` độc lập (`Game.Core`, `Game.UI`, `Game.Audio`, `Game.Gameplay`).
   - Biên dịch từng module, compile time < 1s.

---

# 6. Hệ thống Architecture Recipes (Mẫu thiết kế C#)
Tra cứu toàn bộ tại `.openai/recipes/` hoặc `.agents/recipes/`:
- `recipe-manager.md`: Khởi tạo Manager / System an toàn.
- `recipe-ui-panel.md`: UI Panel với `CanvasGroup` và anti-blocking navigation.
- `recipe-event.md`: Type-safe Event Bus với payload `readonly struct`.
- `recipe-save-data.md`: Save Data serialization, versioning và auto-migration.
- `recipe-scriptableobject.md`: Data Config bất biến (immutable runtime).
- `recipe-statemachine.md`: Finite State Machine enum-driven.
- `recipe-tween.md`: DOTween chuẩn hóa (DOKill, clean state, unscaled time).
- `recipe-pool.md`: Object Pooling không cấp phát bộ nhớ.
- `recipe-constants.md`: Quản lý hằng số tập trung (Tags, Layers, Scenes).
- `recipe-unit-test.md`: NUnit Test EditMode & PlayMode.
- `recipe-asmdef.md`: Thiết lập Assembly Definitions chuẩn.

---

# 7. Cấu trúc Quản trị Living Docs (Docs/)
- **`Docs/SourceOfTruth/`**: Game Design Document (GDD) và Spec kỹ thuật gốc.
- **`Docs/Decisions/`**: Architecture Decision Records (ADR) ghi nhận lý do chọn phương án.
- **`Docs/Handoffs/`**: Nhật ký bàn giao phiên làm việc & bài học kinh nghiệm.
- **`Docs/QC/`**: Checklist kiểm thử tính năng (Pre-commit / Feature test).
- **`Docs/Done/`**: Worklog fragments định dạng `YYYY-MM-DD__task-name.txt`.
- **Quy tắc:** Ưu tiên file `.txt` cho living docs; luôn có Mục lục ở đầu file.

---

# 8. Cơ chế Bàn giao Đa Agent (Gemini <-> Claude <-> ChatGPT)
Khi kết thúc phiên làm việc trên ChatGPT:
1. Ghi nhận tóm tắt công việc vào file fragment `Docs/Done/YYYY-MM-DD__<ten-task>.txt`.
2. Cập nhật trạng thái vào `Docs/Handoffs/latest.txt`.
3. Khi chuyển sang Gemini hoặc Claude Code: Agent kế tiếp chỉ cần đọc `Docs/Handoffs/latest.txt` và `Docs/SourceOfTruth/` là có đầy đủ ngữ cảnh để làm tiếp.

---

# 9. Quy trình Onboarding Dự án Unity Mới
Khi khởi tạo trên một dự án Unity mới:
1. Hỏi thông tin dự án: **Tên Game, Unity Version, Render Pipeline (URP/HDRP/Built-in), Thư mục mã nguồn gốc**.
2. Cập nhật thông tin vào `CHATGPT.md` (hoặc `.agents/AGENTS.md` / `CLAUDE.md`).
3. Chạy `node scripts/sync-agents.js` để đảm bảo cả 3 agent đồng nhất 100%.
