#!/usr/bin/env bash
# ==============================================================================
# GeminiUnity — 1-Command Automated Installer for macOS & Linux (Bash)
# Cách dùng: Chạy lệnh sau tại thư mục gốc của dự án Unity:
# curl -fsSL https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.sh | bash
# ==============================================================================

set -e

echo "============================================================"
echo "  🚀 Cài đặt Bộ khung GeminiUnity AI Agent cho Unity Project"
echo "============================================================"

TEMP_ZIP="/tmp/GeminiUnity.zip"
TEMP_DIR="/tmp/GeminiUnity_$(date +%s)"

echo ""
echo "[1/4] 📦 Đang tải bộ khung từ GitHub..."
curl -fsSL "https://github.com/hieu180704/GeminiUnity/archive/refs/heads/main.zip" -o "$TEMP_ZIP"

echo "[2/4] 📂 Đang giải nén tài nguyên..."
mkdir -p "$TEMP_DIR"
unzip -q "$TEMP_ZIP" -d "$TEMP_DIR"
SOURCE_DIR="$TEMP_DIR/GeminiUnity-main"

echo "[3/4] 📋 Đang sao chép các thành phần vào dự án..."
cp -rf "$SOURCE_DIR/.agents" ./
echo "  + Đã cài đặt .agents/ (Hooks, Recipes, Rules, Skills)"

cp -rf "$SOURCE_DIR/Docs" ./
echo "  + Đã cài đặt Docs/ (SourceOfTruth, Decisions, Handoffs, QC, Done)"

cp -f "$SOURCE_DIR/.editorconfig" ./
echo "  + Đã cài đặt .editorconfig (Cưỡng chế style C# Unity)"

cp -f "$SOURCE_DIR/.gitattributes" ./
echo "  + Đã cài đặt .gitattributes (Git LFS cho Assets)"

if [ ! -f ".gitignore" ]; then
    cp -f "$SOURCE_DIR/.gitignore" ./
    echo "  + Đã tạo file .gitignore mới"
else
    echo "  + Đã phát hiện .gitignore sẵn có (Giữ nguyên file hiện tại)"
fi

echo "[4/4] ⚙️ Đang kích hoạt AGENTS.md cho dự án..."
if [ -f ".agents/AGENTS_TEMPLATE.md" ]; then
    cp -f ".agents/AGENTS_TEMPLATE.md" ".agents/AGENTS.md"
    echo "  + Đã tạo .agents/AGENTS.md sẵn sàng cho Onboarding"
fi

rm -rf "$TEMP_ZIP" "$TEMP_DIR"

echo ""
echo "============================================================"
echo "  ✅ Cài Đặt Hoàn Tất! GeminiUnity Đã Sẵn Sàng!"
echo "============================================================"
echo "👉 BƯỚC TIẾP THEO:"
echo "1. Mở dự án trong Antigravity IDE / VS Code."
echo "2. Nhắn tin bất kỳ cho AI (hoặc 'Bắt đầu setup'):"
echo "   -> AI sẽ tự động đọc AGENTS.md và hỏi bạn các câu hỏi để setup thông tin game!"
echo ""
