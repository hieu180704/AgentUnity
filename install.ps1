# ==============================================================================
# GeminiUnity — 1-Command Automated Installer for Windows (PowerShell)
# Cách dùng: Chạy lệnh sau tại thư mục gốc của dự án Unity:
# irm https://raw.githubusercontent.com/hieu180704/GeminiUnity/main/install.ps1 | iex
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  🚀 Cài đặt Bộ khung GeminiUnity AI Agent cho Unity Project" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$repoUrl = "https://github.com/hieu180704/GeminiUnity.git"
$tempZipUrl = "https://github.com/hieu180704/GeminiUnity/archive/refs/heads/main.zip"
$tempDir = Join-Path $env:TEMP ("GeminiUnity_" + [System.Guid]::NewGuid().ToString())
$tempZip = Join-Path $env:TEMP "GeminiUnity.zip"

try {
    # 1. Tải bộ khung từ GitHub
    Write-Host "`n[1/4] 📦 Đang tải bộ khung từ GitHub..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $tempZipUrl -OutFile $tempZip -UseBasicParsing
    
    # 2. Giải nén vào thư mục tạm
    Write-Host "[2/4] 📂 Đang giải nén tài nguyên..." -ForegroundColor Yellow
    Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force
    $sourceDir = Join-Path $tempDir "GeminiUnity-main"

    # 3. Sao chép các thư mục và file cốt lõi vào project hiện tại
    Write-Host "[3/4] 📋 Đang sao chép các thành phần vào dự án..." -ForegroundColor Yellow
    
    # Copy .agents
    if (Test-Path (Join-Path $sourceDir ".agents")) {
        Copy-Item -Path (Join-Path $sourceDir ".agents") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt .agents/ (Hooks, Recipes, Rules, Skills)" -ForegroundColor Green
    }

    # Copy Docs
    if (Test-Path (Join-Path $sourceDir "Docs")) {
        Copy-Item -Path (Join-Path $sourceDir "Docs") -Destination "." -Recurse -Force
        Write-Host "  + Đã cài đặt Docs/ (SourceOfTruth, Decisions, Handoffs, QC, Done)" -ForegroundColor Green
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

    # 4. Tự động khởi tạo AGENTS.md từ template
    Write-Host "[4/4] ⚙️ Đang kích hoạt AGENTS.md cho dự án..." -ForegroundColor Yellow
    $templatePath = Join-Path ".agents" "AGENTS_TEMPLATE.md"
    $agentsPath = Join-Path ".agents" "AGENTS.md"
    
    if (Test-Path $templatePath) {
        Copy-Item -Path $templatePath -Destination $agentsPath -Force
        Write-Host "  + Đã tạo .agents/AGENTS.md sẵn sàng cho Onboarding" -ForegroundColor Green
    }

    # Dọn dẹp file tạm
    Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "  ✅ Cài Đặt Hoàn Tất! GeminiUnity Đã Sẵn Sàng!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "👉 BƯỚC TIẾP THEO:" -ForegroundColor Yellow
    Write-Host "1. Mở dự án trong Antigravity IDE / VS Code." -ForegroundColor White
    Write-Host "2. Nhắn tin bất kỳ cho AI (hoặc 'Bắt đầu setup'):" -ForegroundColor White
    Write-Host "   -> AI sẽ tự động đọc AGENTS.md và hỏi bạn các câu hỏi để setup thông tin game!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "`n❌ Có lỗi xảy ra trong quá trình cài đặt: $_" -ForegroundColor Red
}
