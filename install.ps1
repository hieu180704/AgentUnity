# ==============================================================================
# AgentUnity — 1-Command Universal Installer for Windows (PowerShell)
# Cách dùng: Chạy lệnh sau tại thư mục gốc của dự án Unity:
# irm https://raw.githubusercontent.com/hieu180704/AgentUnity/main/install.ps1 | iex
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  🚀 Cài đặt Bộ khung AgentUnity (Universal Dual-Agent) cho Unity" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$tempZipUrl = "https://github.com/hieu180704/AgentUnity/archive/refs/heads/main.zip"
$tempDir = Join-Path $env:TEMP ("AgentUnity_" + [System.Guid]::NewGuid().ToString())
$tempZip = Join-Path $env:TEMP "AgentUnity.zip"

try {
    # 1. Tải bộ khung từ GitHub
    Write-Host "`n[1/4] 📦 Đang tải bộ khung từ GitHub..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $tempZipUrl -OutFile $tempZip -UseBasicParsing
    
    # 2. Giải nén vào thư mục tạm
    Write-Host "[2/4] 📂 Đang giải nén tài nguyên..." -ForegroundColor Yellow
    Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force
    $sourceDir = Join-Path $tempDir "AgentUnity-main"

    # 3. Sao chép các thư mục và file cốt lõi vào project hiện tại
    Write-Host "[3/4] 📋 Đang sao chép các thành phần vào dự án..." -ForegroundColor Yellow
    
    # Copy .agents
    if (Test-Path (Join-Path $sourceDir ".agents")) {
        Copy-Item -Path (Join-Path $sourceDir ".agents") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt .agents/ (Gemini AI: Hooks, Recipes, Rules, Skills)" -ForegroundColor Green
    }

    # Copy .claude
    if (Test-Path (Join-Path $sourceDir ".claude")) {
        Copy-Item -Path (Join-Path $sourceDir ".claude") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt .claude/ (Claude Code: Settings, Rules, Commands, Agents)" -ForegroundColor Green
    }

    # Copy scripts
    if (Test-Path (Join-Path $sourceDir "scripts")) {
        Copy-Item -Path (Join-Path $sourceDir "scripts") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt scripts/ (Công cụ sync-agents.js 2 chiều)" -ForegroundColor Green
    }

    # Copy Docs
    if (Test-Path (Join-Path $sourceDir "Docs")) {
        Copy-Item -Path (Join-Path $sourceDir "Docs") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt Docs/ (Shared Living Docs: SourceOfTruth, Decisions, Handoffs, QC, Done)" -ForegroundColor Green
    }

    # Copy .editorconfig
    Copy-Item -Path (Join-Path $sourceDir ".editorconfig") -Destination "." -Force
    Write-Host "  + Đã cài đặt .editorconfig (Cưỡng chế style C# Unity)" -ForegroundColor Green

    # Copy .gitattributes
    Copy-Item -Path (Join-Path $sourceDir ".gitattributes") -Destination "." -Force
    Write-Host "  + Đã cài đặt .gitattributes (Git LFS cho Assets)" -ForegroundColor Green

    # Copy / Merge .gitignore
    if (-not (Test-Path ".gitignore")) {
        Copy-Item -Path (Join-Path $sourceDir ".gitignore") -Destination "." -Force
        Write-Host "  + Đã tạo file .gitignore mới" -ForegroundColor Green
    } else {
        Write-Host "  + Đã phát hiện .gitignore sẵn có (Giữ nguyên file hiện tại)" -ForegroundColor Yellow
    }

    # 4. Tự động khởi tạo AGENTS.md & CLAUDE.md từ template
    Write-Host "[4/4] ⚙️ Đang kích hoạt AGENTS.md & CLAUDE.md cho dự án..." -ForegroundColor Yellow
    $agentsTemplate = Join-Path ".agents" "AGENTS_TEMPLATE.md"
    $agentsPath = Join-Path ".agents" "AGENTS.md"
    if (Test-Path $agentsTemplate) {
        Copy-Item -Path $agentsTemplate -Destination $agentsPath -Force
        Write-Host "  + Đã tạo .agents/AGENTS.md sẵn sàng cho Gemini Onboarding" -ForegroundColor Green
    }

    $claudeTemplate = "CLAUDE_TEMPLATE.md"
    if (-not (Test-Path $claudeTemplate)) {
        $claudeTemplate = Join-Path $sourceDir "CLAUDE_TEMPLATE.md"
    }
    if (Test-Path $claudeTemplate) {
        Copy-Item -Path $claudeTemplate -Destination "CLAUDE.md" -Force
        Write-Host "  + Đã tạo CLAUDE.md sẵn sàng cho Claude Code Onboarding" -ForegroundColor Green
    }

    # Dọn dẹp file tạm
    Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "  ✅ Cài Đặt Hoàn Tất! AgentUnity Đã Sẵn Sàng!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "👉 BƯỚC TIẾP THEO:" -ForegroundColor Yellow
    Write-Host "1. Dùng Gemini: Mở Antigravity IDE -> Chat để setup dự án." -ForegroundColor White
    Write-Host "2. Dùng Claude: Mở Terminal gõ 'claude' -> Chat để setup dự án." -ForegroundColor White
    Write-Host "3. Đồng bộ 2 bên khi sửa Rules/Recipes: node scripts/sync-agents.js" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "`n❌ Có lỗi xảy ra trong quá trình cài đặt: $_" -ForegroundColor Red
}
