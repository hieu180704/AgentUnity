#!/usr/bin/env bash
# ==============================================================================
# AgentUnity — 1-Command Universal Installer for macOS / Linux (Bash)
# Cách dùng: Chạy lệnh sau tại thư mục gốc của dự án Unity:
# curl -fsSL https://raw.githubusercontent.com/hieu180704/AgentUnity/main/install.sh | bash
# ==============================================================================

set -e

echo "============================================================"
echo "  🚀 Cài đặt Bộ khung AgentUnity (Universal Tri-Agent) cho Unity"
echo "============================================================"

TEMP_ZIP="/tmp/AgentUnity.zip"
TEMP_DIR="/tmp/AgentUnity_$(date +%s)"
ZIP_URL="https://github.com/hieu180704/AgentUnity/archive/refs/heads/main.zip"

echo -e "\n[1/4] 📦 Đang tải bộ khung từ GitHub..."
curl -fsSL "$ZIP_URL" -o "$TEMP_ZIP"

echo "[2/4] 📂 Đang giải nén tài nguyên..."
mkdir -p "$TEMP_DIR"
unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
SOURCE_DIR="$TEMP_DIR/AgentUnity-main"

echo "[3/4] 📋 Đang sao chép các thành phần vào dự án..."

if [ -d "$SOURCE_DIR/.agents" ]; then
    cp -R "$SOURCE_DIR/.agents" .
    echo "  + Đã cài đặt .agents/ (Gemini AI: Hooks, Recipes, Rules, Skills)"
fi

if [ -d "$SOURCE_DIR/.claude" ]; then
    cp -R "$SOURCE_DIR/.claude" .
    echo "  + Đã cài đặt .claude/ (Claude Code: Settings, Rules, Commands, Agents)"
fi

if [ -d "$SOURCE_DIR/.openai" ]; then
    cp -R "$SOURCE_DIR/.openai" .
    echo "  + Đã cài đặt .openai/ (ChatGPT / OpenAI: Rules, Recipes, Prompts)"
fi

if [ -d "$SOURCE_DIR/.github" ]; then
    cp -R "$SOURCE_DIR/.github" .
    echo "  + Đã cài đặt .github/ (GitHub Copilot Instructions)"
fi

if [ -d "$SOURCE_DIR/scripts" ]; then
    cp -R "$SOURCE_DIR/scripts" .
    echo "  + Đã cài đặt scripts/ (Công cụ sync-agents.js 3 chiều)"
fi

if [ -d "$SOURCE_DIR/Docs" ]; then
    cp -R "$SOURCE_DIR/Docs" .
    echo "  + Đã cài đặt Docs/ (Shared Living Docs: SourceOfTruth, Decisions, Handoffs, QC, Done)"
fi

if [ -f "$SOURCE_DIR/.cursorrules" ]; then
    cp "$SOURCE_DIR/.cursorrules" .
    echo "  + Đã cài đặt .cursorrules (Cursor IDE Rules)"
fi

cp "$SOURCE_DIR/.editorconfig" .
echo "  + Đã cài đặt .editorconfig (Cưỡng chế style C# Unity)"

cp "$SOURCE_DIR/.gitattributes" .
echo "  + Đã cài đặt .gitattributes (Git LFS cho Assets)"

if [ ! -f ".gitignore" ]; then
    cp "$SOURCE_DIR/.gitignore" .
    echo "  + Đã tạo file .gitignore mới"
else
    echo "  + Đã phát hiện .gitignore sẵn có (Giữ nguyên file hiện tại)"
fi

echo "[4/4] ⚙️ Đang kích hoạt AGENTS.md, CLAUDE.md & CHATGPT.md cho dự án..."
if [ -f "$SOURCE_DIR/.agents/AGENTS_TEMPLATE.md" ]; then
    cp "$SOURCE_DIR/.agents/AGENTS_TEMPLATE.md" ".agents/AGENTS.md"
    echo "  + Đã tạo .agents/AGENTS.md sẵn sàng cho Gemini Onboarding"
fi

if [ -f "$SOURCE_DIR/CLAUDE_TEMPLATE.md" ]; then
    cp "$SOURCE_DIR/CLAUDE_TEMPLATE.md" "./CLAUDE.md"
    echo "  + Đã tạo CLAUDE.md sẵn sàng cho Claude Code Onboarding"
fi

if [ -f "$SOURCE_DIR/CHATGPT_TEMPLATE.md" ]; then
    cp "$SOURCE_DIR/CHATGPT_TEMPLATE.md" "./CHATGPT.md"
    echo "  + Đã tạo CHATGPT.md sẵn sàng cho ChatGPT / OpenAI Onboarding"
fi

rm -rf "$TEMP_ZIP" "$TEMP_DIR"

echo "============================================================"
echo "  ✅ Cài Đặt Hoàn Tất! AgentUnity Đã Sẵn Sàng!"
echo "============================================================"
echo "👉 BƯỚC TIẾP THEO:"
echo "1. Dùng Gemini: Mở Antigravity IDE -> Chat để setup dự án."
echo "2. Dùng Claude: Mở Terminal gõ 'claude' -> Chat để setup dự án."
echo "3. Dùng ChatGPT / OpenAI: Nạp CHATGPT.md vào ChatGPT Project / System Prompt."
echo "4. Dùng Cursor / Copilot: Tự động nhận .cursorrules & .github/copilot-instructions.md."
echo "5. Đồng bộ 3 bên khi sửa Rules/Recipes: node scripts/sync-agents.js"
echo ""
