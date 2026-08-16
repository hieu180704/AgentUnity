#!/usr/bin/env bash
# ==============================================================================
# GeminiUnity — 1-Command Universal Installer for macOS / Linux (Bash)
# Cách dùng: Chạy lệnh sau tại thư mục gốc của dự án Unity:
# curl -fsSL https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.sh | bash
# ==============================================================================

set -e

echo "============================================================"
echo "  🚀 Cài đặt Bộ khung GeminiUnity (Dual-Agent Ready) cho Unity"
echo "============================================================"

TEMP_ZIP="/tmp/GeminiUnity.zip"
TEMP_DIR="/tmp/GeminiUnity_$(date +%s)"
ZIP_URL="https://github.com/hieu180704/GeminiUnity/archive/refs/heads/main.zip"

echo -e "\n[1/4] 📦 Đang tải bộ khung từ GitHub..."
curl -fsSL "$ZIP_URL" -o "$TEMP_ZIP"

echo "[2/4] 📂 Đang giải nén tài nguyên..."
mkdir -p "$TEMP_DIR"
unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
SOURCE_DIR="$TEMP_DIR/GeminiUnity-main"

echo "[3/4] 📋 Đang sao chép các thành phần vào dự án..."

if [ -d "$SOURCE_DIR/.agents" ]; then
    cp -R "$SOURCE_DIR/.agents" .
    echo "  + Đã cài đặt .agents/ (Gemini AI: Hooks, Recipes, Rules, Skills)"
fi

if [ -d "$SOURCE_DIR/.claude" ]; then
    cp -R "$SOURCE_DIR/.claude" .
    echo "  + Đã cài đặt .claude/ (Claude Code: Settings, Rules, Commands, Agents)"
fi

if [ -d "$SOURCE_DIR/scripts" ]; then
    cp -R "$SOURCE_DIR/scripts" .
    echo "  + Đã cài đặt scripts/ (Công cụ sync-agents.js 2 chiều)"
fi

if [ -d "$SOURCE_DIR/Docs" ]; then
    cp -R "$SOURCE_DIR/Docs" .
    echo "  + Đã cài đặt Docs/ (Shared Living Docs: SourceOfTruth, Decisions, Handoffs, QC, Done)"
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

echo "[4/4] ⚙️ Đang kích hoạt AGENTS.md & CLAUDE.md cho dự án..."
if [ -f "$SOURCE_DIR/.agents/AGENTS_TEMPLATE.md" ]; then
    cp "$SOURCE_DIR/.agents/AGENTS_TEMPLATE.md" ".agents/AGENTS.md"
    echo "  + Đã tạo .agents/AGENTS.md sẵn sàng cho Gemini Onboarding"
fi

if [ -f "$SOURCE_DIR/CLAUDE_TEMPLATE.md" ]; then
    cp "$SOURCE_DIR/CLAUDE_TEMPLATE.md" "./CLAUDE.md"
    echo "  + Đã tạo CLAUDE.md sẵn sàng cho Claude Code Onboarding"
fi

rm -rf "$TEMP_ZIP" "$TEMP_DIR"

echo "============================================================"
echo "  ✅ Cài Đặt Hoàn Tất! Dự Án Đã Sẵn Sàng Cho Cả 2 AI Agent!"
echo "============================================================"
echo "👉 BƯỚC TIẾP THEO:"
echo "1. Dùng Gemini: Mở Antigravity IDE -> Chat để setup dự án."
echo "2. Dùng Claude: Mở Terminal gõ 'claude' -> Chat để setup dự án."
echo "3. Đồng bộ 2 bên khi sửa Rules/Recipes: node scripts/sync-agents.js"
echo ""
